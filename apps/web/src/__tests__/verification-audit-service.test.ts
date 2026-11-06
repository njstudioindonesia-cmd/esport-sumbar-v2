import { describe, it, expect, beforeEach } from "vitest";
import {
  canTransitionVerification,
  validateVerificationTransition,
  generateVerificationBadgeNo,
  validateVerificationEvidence,
  calculateSlaStatus,
  prioritizeVerificationQueue,
  calculateAuditLogHash,
  recordAuditLog,
  queryAuditLogs,
  verifyAuditTrailIntegrity,
  clearAuditLogsStore,
  submitVerification,
  reviewVerificationDecision,
  getVerificationQueue,
  getVerificationStats,
  clearVerificationServiceStore,
  registerMockProfile,
  VerificationState,
  VerificationQueueItem,
} from "../lib/services/verification";
import { clearIdempotencyStore } from "@esport-sumbar/lib";

describe("Sub-langkah 7.4: Ekstraksi Layanan Verifikasi & Audit (Verification & Audit Service)", () => {
  beforeEach(() => {
    clearVerificationServiceStore();
    clearAuditLogsStore();
    clearIdempotencyStore();
  });

  describe("1. Mesin Status Verifikasi (State Machine V3)", () => {
    it("harus mengizinkan transisi status yang sah dalam siklus hidup verifikasi", () => {
      expect(canTransitionVerification("unverified", "submitted")).toBe(true);
      expect(canTransitionVerification("submitted", "under_review")).toBe(true);
      expect(canTransitionVerification("under_review", "verified")).toBe(true);
      expect(canTransitionVerification("under_review", "revision_requested")).toBe(true);
      expect(canTransitionVerification("revision_requested", "submitted")).toBe(true);
      expect(canTransitionVerification("verified", "suspended")).toBe(true);
      expect(canTransitionVerification("suspended", "verified")).toBe(true);
      expect(canTransitionVerification("rejected", "submitted")).toBe(true);
    });

    it("harus menolak transisi status ilegal", () => {
      // Unverified tidak boleh langsung loncat ke verified tanpa proses submission
      expect(canTransitionVerification("unverified", "verified")).toBe(false);
      // Status verified tidak boleh langsung diubah ke submitted tanpa suspend/expire
      expect(canTransitionVerification("verified", "submitted")).toBe(false);
    });

    it("harus menegakkan aturan Pemisahan Kepentingan (Separation of Duties)", () => {
      // Admin tidak boleh menelaah atau memverifikasi akun miliknya sendiri
      expect(() => {
        validateVerificationTransition({
          currentStatus: "submitted",
          newStatus: "verified",
          profileAccountId: "admin-account-123",
          reviewerAccountId: "admin-account-123",
          reviewerRole: "platform_admin",
        });
      }).toThrow(/Administrator dilarang menelaah atau memverifikasi akun\/profil miliknya sendiri/);
    });

    it("harus menolak telaah jika dilakukan oleh peran di luar platform_admin", () => {
      expect(() => {
        validateVerificationTransition({
          currentStatus: "submitted",
          newStatus: "verified",
          profileAccountId: "user-456",
          reviewerAccountId: "user-789",
          reviewerRole: "user",
        });
      }).toThrow(/Hanya platform_admin ESPORT SUMBAR yang berwenang/);
    });

    it("harus mewajibkan alasan minimal 5 karakter untuk penolakan, revisi, dan penangguhan", () => {
      expect(() => {
        validateVerificationTransition({
          currentStatus: "submitted",
          newStatus: "rejected",
          profileAccountId: "user-1",
          reviewerAccountId: "admin-1",
          reviewerRole: "platform_admin",
          reason: "no", // kurang dari 5 karakter
        });
      }).toThrow(/Alasan keputusan telaah wajib disertakan minimal 5 karakter/);

      expect(() => {
        validateVerificationTransition({
          currentStatus: "submitted",
          newStatus: "revision_requested",
          profileAccountId: "user-1",
          reviewerAccountId: "admin-1",
          reviewerRole: "platform_admin",
          reason: "",
        });
      }).toThrow(/Alasan keputusan telaah wajib disertakan/);
    });

    it("harus menghasilkan nomor registrasi resmi ESP-SB-VER-YYYY-XXXX", () => {
      const badgeNo = generateVerificationBadgeNo(null, "4521");
      const currentYear = new Date().getFullYear();
      expect(badgeNo).toBe(`ESP-SB-VER-${currentYear}-4521`);
    });

    it("harus mempertahankan nomor registrasi yang sudah ada jika formatnya sudah sesuai", () => {
      const existing = "ESP-SB-VER-2025-1089";
      const result = generateVerificationBadgeNo(existing);
      expect(result).toBe(existing);
    });
  });

  describe("2. Validasi Bukti & Portofolio Prestasi (Validator)", () => {
    it("harus menolak pengajuan jika tidak menyertakan berkas bukti sama sekali", () => {
      const res = validateVerificationEvidence({
        profileId: "p1",
        accountId: "a1",
        entityType: "player",
        regionId: "reg-1",
        evidenceFiles: [],
      });

      expect(res.isValid).toBe(false);
      expect(res.completenessScore).toBe(0);
      expect(res.errors).toContain("Minimal 1 berkas bukti verifikasi wajib diunggah.");
    });

    it("harus menghitung skor kelengkapan dan memberikan rekomendasi untuk atlet (player)", () => {
      const res = validateVerificationEvidence({
        profileId: "p1",
        accountId: "a1",
        entityType: "player",
        regionId: "reg-1",
        notes: "Atlet Valorant divisi Padang dengan pengalaman kompetitif turnamen lokal.",
        evidenceFiles: [
          { name: "profile-id.png", url: "https://storage.supabase.co/evidence/id.png" },
          { name: "rank-immortal.png", url: "https://storage.supabase.co/evidence/rank.png" },
        ],
        achievements: [
          {
            title: "Juara 1 Turnamen Minang Cup",
            eventName: "Minang Esports Cup 2026",
            year: 2026,
            rankOrPlacement: "Juara 1",
          },
        ],
      });

      expect(res.isValid).toBe(true);
      expect(res.completenessScore).toBeGreaterThanOrEqual(80);
      expect(res.feedback).toContain("Bukti profil in-game dan tangkapan layar akun lengkap.");
    });

    it("harus mengevaluasi berkas institusi pendidikan (school/campus)", () => {
      const res = validateVerificationEvidence({
        profileId: "sch-1",
        accountId: "acc-sch",
        entityType: "school",
        regionId: "reg-padang",
        notes: "Ekstrakurikuler Esports SMA Negeri 1 Padang.",
        evidenceFiles: [
          { name: "surat-keterangan-sekolah.pdf", url: "https://storage.supabase.co/evidence/sk.pdf" },
        ],
      });

      expect(res.isValid).toBe(true);
      expect(res.completenessScore).toBeGreaterThanOrEqual(60);
    });
  });

  describe("3. Pengukuran SLA & Prioritisasi Antrean (SLA Engine)", () => {
    it("harus menghitung status SLA on_track untuk pengajuan di bawah 24 jam", () => {
      const recentSubmission = new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(); // 5 jam lalu
      const { waitingHours, slaStatus } = calculateSlaStatus(recentSubmission);

      expect(waitingHours).toBe(5);
      expect(slaStatus).toBe("on_track");
    });

    it("harus menandai warning jika pengajuan berada di antara 24 hingga 48 jam", () => {
      const warningSubmission = new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(); // 30 jam lalu
      const { waitingHours, slaStatus } = calculateSlaStatus(warningSubmission);

      expect(waitingHours).toBe(30);
      expect(slaStatus).toBe("warning");
    });

    it("harus menandai breached jika pengajuan melampaui batas SLA 48 jam", () => {
      const breachedSubmission = new Date(Date.now() - 50 * 60 * 60 * 1000).toISOString(); // 50 jam lalu
      const { waitingHours, slaStatus } = calculateSlaStatus(breachedSubmission);

      expect(waitingHours).toBe(50);
      expect(slaStatus).toBe("breached");
    });

    it("harus memprioritaskan antrean breached terlebih dahulu sebelum warning dan on_track (FIFO)", () => {
      const items: VerificationQueueItem[] = [
        {
          id: "req-recent",
          profileId: "p1",
          accountId: "a1",
          displayName: "Player Baru",
          esportId: "ESP-SB-001",
          entityType: "player",
          regionName: "Padang",
          regionCode: "PDG",
          status: "submitted",
          submittedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
          waitingHours: 2,
          slaHoursLimit: 48,
          slaStatus: "on_track",
          evidenceFiles: [],
          achievements: [],
        },
        {
          id: "req-urgent",
          profileId: "p2",
          accountId: "a2",
          displayName: "Player Tertunda Lama",
          esportId: "ESP-SB-002",
          entityType: "player",
          regionName: "Bukittinggi",
          regionCode: "BKT",
          status: "submitted",
          submittedAt: new Date(Date.now() - 60 * 3600 * 1000).toISOString(),
          waitingHours: 60,
          slaHoursLimit: 48,
          slaStatus: "breached",
          evidenceFiles: [],
          achievements: [],
        },
        {
          id: "req-medium",
          profileId: "p3",
          accountId: "a3",
          displayName: "Player Peringatan",
          esportId: "ESP-SB-003",
          entityType: "player",
          regionName: "Solok",
          regionCode: "SLK",
          status: "submitted",
          submittedAt: new Date(Date.now() - 32 * 3600 * 1000).toISOString(),
          waitingHours: 32,
          slaHoursLimit: 48,
          slaStatus: "warning",
          evidenceFiles: [],
          achievements: [],
        },
      ];

      const prioritized = prioritizeVerificationQueue(items);

      expect(prioritized[0].id).toBe("req-urgent"); // Breached first
      expect(prioritized[1].id).toBe("req-medium"); // Warning second
      expect(prioritized[2].id).toBe("req-recent"); // On-track last
    });
  });

  describe("4. Jejak Audit Append-Only Kriptografis (Audit Service)", () => {
    it("harus menghitung hash SHA-256 yang konsisten untuk entri log", () => {
      const hash1 = calculateAuditLogHash({
        actorAccountId: "admin-1",
        actorRole: "platform_admin",
        action: "VERIFICATION_TRANSITION_VERIFIED",
        targetType: "profile",
        targetId: "prof-1",
        previousStatus: "submitted",
        newStatus: "verified",
        occurredAt: "2026-11-06T12:00:00.000Z",
      });

      const hash2 = calculateAuditLogHash({
        actorAccountId: "admin-1",
        actorRole: "platform_admin",
        action: "VERIFICATION_TRANSITION_VERIFIED",
        targetType: "profile",
        targetId: "prof-1",
        previousStatus: "submitted",
        newStatus: "verified",
        occurredAt: "2026-11-06T12:00:00.000Z",
      });

      expect(hash1).toBe(hash2);
      expect(hash1.startsWith("SHA256:")).toBe(true);
    });

    it("harus mencatat entri log append-only dan memverifikasi integritasnya", async () => {
      const entry = await recordAuditLog({
        actorAccountId: "admin-99",
        actorRole: "platform_admin",
        action: "VERIFICATION_SUBMITTED",
        targetType: "profile",
        targetId: "p-abc",
        newStatus: "submitted",
        reason: "Uji integritas",
        metadata: { score: 90 },
      });

      expect(entry.id).toBeDefined();
      expect(entry.logHash).toBeDefined();

      const { logs } = await queryAuditLogs({ targetId: "p-abc" });
      expect(logs.length).toBe(1);

      const integrity = verifyAuditTrailIntegrity(logs);
      expect(integrity.isUntampered).toBe(true);
      expect(integrity.tamperedLogIds).toHaveLength(0);
    });

    it("harus mendeteksi jika log audit telah dimanipulasi", async () => {
      const entry = await recordAuditLog({
        actorAccountId: "admin-99",
        actorRole: "platform_admin",
        action: "VERIFICATION_APPROVED",
        targetType: "profile",
        targetId: "p-xyz",
        newStatus: "verified",
        reason: "Validasi asli",
        metadata: {},
      });

      // Simulasikan pemalsuan data pada log
      const tamperedEntry = {
        ...entry,
        newStatus: "rejected", // Dipalsukan tanpa memperbarui hash
      };

      const integrity = verifyAuditTrailIntegrity([tamperedEntry]);
      expect(integrity.isUntampered).toBe(false);
      expect(integrity.tamperedLogIds).toContain(entry.id);
    });
  });

  describe("5. Layanan Inti Verifikasi & Integrasi Alur End-to-End", () => {
    it("harus memproses pengajuan verifikasi, mencatat log audit, dan memicu outbox event", async () => {
      registerMockProfile({
        id: "prof-fajar",
        accountId: "acc-fajar",
        displayName: "Fajar Ramadhan",
        ign: "FajarR",
        esportId: "ESP-SB-PDG-001",
        entityType: "player",
        regionId: "reg-padang",
        regionName: "Kota Padang",
        regionCode: "PDG",
        gameName: "Valorant",
        verificationStatus: "unverified",
      });

      const result = await submitVerification({
        profileId: "prof-fajar",
        accountId: "acc-fajar",
        entityType: "player",
        regionId: "reg-padang",
        notes: "Pengajuan verifikasi atlet resmi.",
        evidenceFiles: [
          { name: "id.png", url: "https://storage.supabase.co/evidence/id.png" },
        ],
      });

      expect(result.success).toBe(true);
      expect(result.requestId).toBeDefined();

      // Periksa antrean
      const queue = await getVerificationQueue();
      expect(queue.length).toBe(1);
      expect(queue[0].profileId).toBe("prof-fajar");
      expect(queue[0].status).toBe("submitted");

      // Periksa log audit
      const { logs } = await queryAuditLogs({ targetId: "prof-fajar" });
      expect(logs.length).toBe(1);
      expect(logs[0].action).toBe("VERIFICATION_SUBMITTED");
    });

    it("harus memproses keputusan persetujuan verifikasi dan menerbitkan lencana resmi", async () => {
      registerMockProfile({
        id: "prof-fajar",
        accountId: "acc-fajar",
        displayName: "Fajar Ramadhan",
        esportId: "ESP-SB-PDG-001",
        entityType: "player",
        regionId: "reg-padang",
        regionName: "Kota Padang",
        regionCode: "PDG",
        verificationStatus: "unverified",
      });

      const subRes = await submitVerification({
        profileId: "prof-fajar",
        accountId: "acc-fajar",
        entityType: "player",
        regionId: "reg-padang",
        evidenceFiles: [
          { name: "id.png", url: "https://storage.supabase.co/evidence/id.png" },
        ],
      });

      const decisionRes = await reviewVerificationDecision({
        requestId: subRes.requestId!,
        reviewerId: "admin-operator-1",
        reviewerRole: "platform_admin",
        decision: "verified",
        reason: "Seluruh berkas terverifikasi lengkap dan absah.",
        badgeNo: "7721",
      });

      expect(decisionRes.success).toBe(true);
      expect(decisionRes.newStatus).toBe("verified");
      expect(decisionRes.badgeNo).toMatch(/^ESP-SB-VER-\d{4}-7721$/);
      expect(decisionRes.expiresAt).toBeDefined();

      // Periksa audit log telah mencatat VERIFICATION_TRANSITION_VERIFIED
      const { logs } = await queryAuditLogs({ targetId: "prof-fajar" });
      const approvalLog = logs.find((l) => l.action === "VERIFICATION_TRANSITION_VERIFIED");
      expect(approvalLog).toBeDefined();
      expect(approvalLog?.actorAccountId).toBe("admin-operator-1");
    });

    it("harus menghitung metrik statistik verifikasi platform dengan akurat", async () => {
      const stats = await getVerificationStats();
      expect(stats.averageProcessingHours).toBe(18.5);
      expect(typeof stats.totalPending).toBe("number");
      expect(typeof stats.totalVerified).toBe("number");
    });
  });
});
