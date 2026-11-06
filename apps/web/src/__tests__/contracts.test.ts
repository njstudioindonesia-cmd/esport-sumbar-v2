import { describe, it, expect } from "vitest";
import {
  AccountCreatedEventSchema,
  VerificationDecidedEventSchema,
  SubmitVerificationSchema,
} from "@esport-sumbar/contracts";
import { SYSTEM_CONSTANTS as LIB_CONSTANTS } from "@esport-sumbar/lib";

describe("Domain Contracts & Schemas", () => {
  it("harus memvalidasi AccountCreated event payload dengan benar", () => {
    const validPayload = {
      accountId: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
      email: "player@esportsumbar.id",
      role: "user" as const,
      createdAt: new Date().toISOString(),
    };

    const result = AccountCreatedEventSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("harus menolak role yang tidak dikenal pada AccountCreated event", () => {
    const invalidPayload = {
      accountId: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
      email: "player@esportsumbar.id",
      role: "unknown_legacy_role", // Peran tidak dikenal / terlarang di V3
      createdAt: new Date().toISOString(),
    };

    const result = AccountCreatedEventSchema.safeParse(invalidPayload);
    expect(result.success).toBe(false);
  });

  it("harus memvalidasi prefix lencana digital ESPORT SUMBAR", () => {
    expect(LIB_CONSTANTS.VERIFICATION_BADGE_PREFIX).toBe("ESP-SB-VER");
    expect(LIB_CONSTANTS.VERIFICATION_VALIDITY_MONTHS).toBe(12);
  });
});
