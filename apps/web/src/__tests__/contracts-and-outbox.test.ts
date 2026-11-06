import { describe, it, expect, vi } from "vitest";
import { randomUUID } from "crypto";
import {
  EventMetadataSchema,
  AccountCreatedEventSchema,
  ProfileCreatedEventSchema,
  MediaReplacedEventSchema,
  RelationRequestedEventSchema,
  RelationApprovedEventSchema,
  VerificationDecidedEventSchema,
  RequestMediaUploadSignatureSchema,
  DOMAIN_EVENT_CATALOG,
  OPENAPI_V1_SPEC,
} from "@esport-sumbar/contracts";
import {
  createOutboxEvent,
  processOutboxBatch,
  generateDeterministicIdempotencyKey,
  withIdempotency,
  getOrGenerateCorrelationId,
  CORRELATION_HEADER,
  logger,
} from "@esport-sumbar/lib";

describe("Sub-langkah 7.0: Kontrak Paket & Transactional Outbox Engine", () => {
  describe("1. Validasi Skema Zod & Katalog Peristiwa (Domain Event Catalog)", () => {
    it("EventMetadataSchema harus memvalidasi metadata standar V3 secara lengkap", () => {
      const validMeta = {
        eventId: randomUUID(),
        eventName: "ProfileCreated",
        aggregateType: "profile",
        aggregateId: randomUUID(),
        timestamp: new Date().toISOString(),
        version: 1 as const,
        correlationId: "req-12345-abc",
        idempotencyKey: "profile-create-12345",
      };

      const parsed = EventMetadataSchema.parse(validMeta);
      expect(parsed.version).toBe(1);
      expect(parsed.correlationId).toBe("req-12345-abc");
      expect(parsed.idempotencyKey).toBe("profile-create-12345");
    });

    it("DOMAIN_EVENT_CATALOG harus mendaftarkan seluruh 13 peristiwa domain inti", () => {
      const requiredEvents = [
        "AccountCreated",
        "ProfileCreated",
        "ProfileUpdated",
        "ProfileDeleted",
        "ProfileSuspended",
        "MediaReplaced",
        "MediaDeleted",
        "RelationRequested",
        "RelationApproved",
        "RelationEnded",
        "VerificationSubmitted",
        "VerificationDecided",
        "GameChanged",
      ];

      requiredEvents.forEach((eventName) => {
        const entry = DOMAIN_EVENT_CATALOG[eventName];
        expect(entry).toBeDefined();
        expect(entry.eventName).toBe(eventName);
        expect(entry.producers.length).toBeGreaterThan(0);
        expect(entry.consumers.length).toBeGreaterThan(0);
      });
    });

    it("OPENAPI_V1_SPEC harus memuat metadata OpenAPI 3.0.3 yang valid", () => {
      expect(OPENAPI_V1_SPEC.openapi).toBe("3.0.3");
      expect(OPENAPI_V1_SPEC.info.title).toContain("ESPORT SUMBAR");
      expect(OPENAPI_V1_SPEC.paths["/profiles"]).toBeDefined();
      expect(OPENAPI_V1_SPEC.paths["/ecosystem"]).toBeDefined();
      expect(OPENAPI_V1_SPEC.paths["/games"]).toBeDefined();
      expect(OPENAPI_V1_SPEC.paths["/media/upload-signature"]).toBeDefined();
    });

    it("RequestMediaUploadSignatureSchema harus menolak berkas di atas 5MB dan tipe terlarang", () => {
      // Valid file
      const validPayload = {
        filename: "avatar.webp",
        fileSize: 2 * 1024 * 1024, // 2MB
        mimeType: "image/webp" as const,
        purpose: "avatar" as const,
        targetProfileId: randomUUID(),
      };
      expect(() => RequestMediaUploadSignatureSchema.parse(validPayload)).not.toThrow();

      // Terlalu besar (> 5MB)
      const oversized = { ...validPayload, fileSize: 6 * 1024 * 1024 };
      expect(() => RequestMediaUploadSignatureSchema.parse(oversized)).toThrow();

      // Tipe tidak diizinkan (misal executable / pdf)
      const invalidMime = { ...validPayload, mimeType: "application/pdf" };
      expect(() => RequestMediaUploadSignatureSchema.parse(invalidMime)).toThrow();
    });
  });

  describe("2. Transactional Outbox Engine", () => {
    it("createOutboxEvent harus menghasilkan envelope terstruktur dengan status pending", () => {
      const event = createOutboxEvent({
        eventName: "ProfileCreated",
        aggregateType: "profile",
        aggregateId: randomUUID(),
        data: {
          displayName: "Kapten Padang",
          entityType: "player",
        },
        correlationId: "req-test-999",
        idempotencyKey: "key-idem-111",
      });

      expect(event.id).toBeDefined();
      expect(event.event_name).toBe("ProfileCreated");
      expect(event.aggregate_type).toBe("profile");
      expect(event.status).toBe("pending");
      expect(event.retry_count).toBe(0);
      expect(event.payload.metadata.correlationId).toBe("req-test-999");
      expect(event.payload.metadata.idempotencyKey).toBe("key-idem-111");
      expect(event.payload.data.displayName).toBe("Kapten Padang");
    });

    it("processOutboxBatch harus berhasil mendispatch event ke handler dan menandai status processed", async () => {
      const sampleEvents = [
        {
          id: "evt-001",
          event_name: "ProfileCreated",
          aggregate_type: "profile",
          aggregate_id: "p-1",
          payload: {
            metadata: { eventId: "evt-001", correlationId: "req-1" },
            data: { displayName: "Player 1" },
          },
          status: "pending",
          retry_count: 0,
        },
      ];

      const mockUpdatedRows: any[] = [];
      const mockSupabase = {
        from: (table: string) => ({
          select: () => ({
            eq: () => ({
              order: () => ({
                limit: async () => ({ data: sampleEvents, error: null }),
              }),
            }),
          }),
          update: (fields: any) => ({
            eq: async (col: string, val: any) => {
              mockUpdatedRows.push({ val, fields });
              return { error: null };
            },
          }),
        }),
      };

      const handlerMock = vi.fn().mockResolvedValue(undefined);
      const handlers = {
        ProfileCreated: handlerMock,
      };

      const result = await processOutboxBatch(mockSupabase, handlers, { batchSize: 5 });

      expect(result.processed).toBe(1);
      expect(result.failed).toBe(0);
      expect(handlerMock).toHaveBeenCalledTimes(1);
      expect(handlerMock).toHaveBeenCalledWith(
        { displayName: "Player 1" },
        { eventId: "evt-001", correlationId: "req-1" }
      );
      expect(mockUpdatedRows[0].fields.status).toBe("processed");
    });

    it("processOutboxBatch harus mencatat retry_count saat handler gagal", async () => {
      const sampleFailingEvent = [
        {
          id: "evt-fail-1",
          event_name: "VerificationSubmitted",
          aggregate_type: "verification",
          aggregate_id: "v-1",
          payload: { data: { requestId: "req-99" } },
          status: "pending",
          retry_count: 0,
        },
      ];

      const mockUpdatedRows: any[] = [];
      const mockSupabase = {
        from: () => ({
          select: () => ({
            eq: () => ({
              order: () => ({
                limit: async () => ({ data: sampleFailingEvent, error: null }),
              }),
            }),
          }),
          update: (fields: any) => ({
            eq: async (col: string, val: any) => {
              mockUpdatedRows.push({ val, fields });
              return { error: null };
            },
          }),
        }),
      };

      const failingHandler = vi.fn().mockRejectedValue(new Error("Downstream service timeout"));
      const result = await processOutboxBatch(
        mockSupabase,
        { VerificationSubmitted: failingHandler },
        { maxRetries: 3 }
      );

      expect(result.processed).toBe(0);
      expect(result.failed).toBe(1);
      expect(mockUpdatedRows[0].fields.retry_count).toBe(1);
      expect(mockUpdatedRows[0].fields.status).toBe("pending"); // belum mencapai maxRetries (3)
    });
  });

  describe("3. Jaminan Idempotensi (Idempotency Guard)", () => {
    it("generateDeterministicIdempotencyKey harus menghasilkan hash identik untuk parameter sama", () => {
      const key1 = generateDeterministicIdempotencyKey("media-upload", "user-123", "hash-abc");
      const key2 = generateDeterministicIdempotencyKey("media-upload", "user-123", "hash-abc");
      const keyDiff = generateDeterministicIdempotencyKey("media-upload", "user-123", "hash-xyz");

      expect(key1).toBe(key2);
      expect(key1).not.toBe(keyDiff);
    });

    it("withIdempotency harus mengeksekusi operasi sekali dan menggunakan cache untuk panggilan kedua", async () => {
      const uniqueKey = `test-idem-${Date.now()}`;
      const operationSpy = vi.fn().mockResolvedValue({ status: "success", count: 42 });

      // Eksekusi pertama: Menjalankan mutasi
      const run1 = await withIdempotency(uniqueKey, operationSpy);
      expect(run1.wasCached).toBe(false);
      expect(run1.result).toEqual({ status: "success", count: 42 });
      expect(operationSpy).toHaveBeenCalledTimes(1);

      // Eksekusi kedua: Menggunakan hasil cache tanpa memanggil ulang mutasi
      const run2 = await withIdempotency(uniqueKey, operationSpy);
      expect(run2.wasCached).toBe(true);
      expect(run2.result).toEqual({ status: "success", count: 42 });
      expect(operationSpy).toHaveBeenCalledTimes(1); // Tetap 1x
    });
  });

  describe("4. Korelasi x-request-id & Sanitasi Pencatatan Struktural", () => {
    it("getOrGenerateCorrelationId harus mengekstrak x-request-id jika ada dan membuat baru jika kosong", () => {
      expect(getOrGenerateCorrelationId({ [CORRELATION_HEADER]: "client-req-007" })).toBe("client-req-007");

      const generated = getOrGenerateCorrelationId(undefined);
      expect(generated.startsWith("req-")).toBe(true);
      expect(generated.length).toBeGreaterThan(10);
    });

    it("Structured Logger harus menyamarkan kunci sensitif (password, token, ktp, nik, secret)", () => {
      const spyLog = vi.spyOn(console, "log").mockImplementation(() => {});

      logger.info("Test login", {
        userId: "user-01",
        password: "super-secret-password",
        token: "jwt-token-value",
        nik: "1371012345678901",
        normalField: "public-safe-data",
      });

      expect(spyLog).toHaveBeenCalled();
      const loggedJson = JSON.parse(spyLog.mock.calls[0][0]);
      expect(loggedJson.userId).toBe("user-01");
      expect(loggedJson.normalField).toBe("public-safe-data");
      expect(loggedJson.password).toBe("[REDACTED]");
      expect(loggedJson.token).toBe("[REDACTED]");
      expect(loggedJson.nik).toBe("[REDACTED]");

      spyLog.mockRestore();
    });
  });
});
