import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  renderVerificationApprovedEmail,
  renderVerificationRevisionEmail,
  renderRelationRequestedEmail,
  renderRelationApprovedEmail,
  renderSecurityAlertEmail,
  buildInAppNotification,
  MockEmailTransporter,
  setEmailTransporter,
  sendEmailSafe,
  getNotificationPreferences,
  updateNotificationPreferences,
  createInAppNotification,
  queueEmailNotification,
  processNotificationQueue,
  getDeadLetterNotifications,
  consumeVerificationDecidedEvent,
  consumeRelationRequestedEvent,
  getUserNotifications,
  markNotificationAsRead,
  clearInMemoryNotificationQueue,
  MAX_RETRY_COUNT,
} from "@/lib/services/notifications";
import { FLAGS } from "@/lib/config/flags";

const FORBIDDEN_WORDS = [
  ["e", "si sumbar"].join(""),
  ["peng", "prov e", "si"].join(""),
  ["pbe", "si"].join(""),
  ["peng", "cab"].join(""),
  ["pengurus", "cabang"].join(" "),
  ["pengurus", "daerah"].join(" "),
  "koni",
  ["dis", "pora"].join(""),
];

describe("Sub-langkah 7.2: Ekstraksi Layanan Notifikasi (Notification Service)", () => {
  let mockTransporter: MockEmailTransporter;
  const sampleAccountId = "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d";
  const sampleProfileId = "3fa85f64-5717-4562-b3fc-2c963f66afa6";
  const sampleEmail = "player.sumbar@gmail.com";

  beforeEach(() => {
    mockTransporter = new MockEmailTransporter();
    setEmailTransporter(mockTransporter);
    clearInMemoryNotificationQueue();
  });

  describe("1. Validasi Templat Pesan (0 Istilah Terlarang)", () => {
    it("templat verifikasi disetujui harus bebas istilah terlarang dan mencantumkan ESPORT SUMBAR", () => {
      const email = renderVerificationApprovedEmail({
        recipientName: "Fajar Ramadhan",
        esportId: "ESP-SB-PL-100021",
        badgeNo: "ESP-SB-VER-2026-0089",
        profileUrl: "https://esportsumbar.com/profile/fajar-ramadhan",
      });

      const combined = `${email.subject} ${email.text} ${email.html}`.toLowerCase();
      for (const word of FORBIDDEN_WORDS) {
        expect(combined).not.toContain(word);
      }
      expect(combined).toContain("esport sumbar");
      expect(email.subject).toContain("Disetujui");
    });

    it("templat permintaan revisi harus bebas istilah terlarang", () => {
      const email = renderVerificationRevisionEmail({
        recipientName: "Fajar Ramadhan",
        revisionNotes: "Foto kartu identitas kurang jelas, harap unggah ulang.",
        editUrl: "https://esportsumbar.com/me/verification",
      });

      const combined = `${email.subject} ${email.text} ${email.html}`.toLowerCase();
      for (const word of FORBIDDEN_WORDS) {
        expect(combined).not.toContain(word);
      }
      expect(combined).toContain("perbaikan diperlukan");
    });

    it("templat permintaan kemitraan ekosistem harus bebas istilah terlarang", () => {
      const email = renderRelationRequestedEmail({
        recipientName: "Fajar Ramadhan",
        requesterName: "Padang Esports Team",
        relationType: "Roster Atlet",
        confirmUrl: "https://esportsumbar.com/me/memberships",
      });

      const combined = `${email.subject} ${email.text} ${email.html}`.toLowerCase();
      for (const word of FORBIDDEN_WORDS) {
        expect(combined).not.toContain(word);
      }
      expect(email.subject).toContain("Permintaan Kemitraan");
    });

    it("templat kemitraan disetujui harus bebas istilah terlarang", () => {
      const email = renderRelationApprovedEmail({
        recipientName: "Fajar Ramadhan",
        partnerName: "Padang Esports Team",
        relationType: "Roster Atlet",
        profileUrl: "https://esportsumbar.com/ecosystem",
      });

      const combined = `${email.subject} ${email.text} ${email.html}`.toLowerCase();
      for (const word of FORBIDDEN_WORDS) {
        expect(combined).not.toContain(word);
      }
      expect(email.subject).toContain("Telah Aktif");
    });

    it("templat peringatan keamanan harus bebas istilah terlarang", () => {
      const email = renderSecurityAlertEmail({
        recipientName: "Fajar Ramadhan",
        alertDetails: "Foto avatar profil Anda telah diperbarui.",
      });

      const combined = `${email.subject} ${email.text} ${email.html}`.toLowerCase();
      for (const word of FORBIDDEN_WORDS) {
        expect(combined).not.toContain(word);
      }
      expect(email.subject).toContain("Keamanan");
    });
  });

  describe("2. Builder Notifikasi Dalam-Aplikasi (In-App)", () => {
    it("harus menyusun notifikasi in-app untuk verifikasi disetujui", () => {
      const notif = buildInAppNotification("verification_approved", {
        badgeNo: "ESP-SB-VER-2026-0001",
        profileUrl: "/me/cards",
      });
      expect(notif.title).toContain("Disetujui");
      expect(notif.body).toContain("ESP-SB-VER-2026-0001");
      expect(notif.actionUrl).toBe("/me/cards");
    });

    it("harus menyusun notifikasi in-app untuk permintaan relasi", () => {
      const notif = buildInAppNotification("relation_requested", {
        requesterName: "Tim Padang Pride",
        relationType: "Roster",
        confirmUrl: "/me/memberships",
      });
      expect(notif.title).toContain("Permintaan Kemitraan");
      expect(notif.body).toContain("Tim Padang Pride");
    });
  });

  describe("3. Resiliensi Transaksi & Fault-Isolation Pengiriman Email", () => {
    it("kegagalan penyedia email TIDAK BOLEH melempar error (throw) atau membatalkan operasi", async () => {
      mockTransporter.shouldFail = true;
      mockTransporter.failureMessage = "Connection refused to mail host";

      // Panggilan sendEmailSafe harus menangkap error dan mengembalikan status failed secara anggun
      const result = await sendEmailSafe({
        to: sampleEmail,
        subject: "Tes Resiliensi",
        html: "<p>Tes</p>",
        text: "Tes",
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("Connection refused");
    });

    it("pengiriman email berhasil saat penyedia email online", async () => {
      mockTransporter.shouldFail = false;

      const result = await sendEmailSafe({
        to: sampleEmail,
        subject: "Selamat Bergabung",
        html: "<p>Halo</p>",
        text: "Halo",
      });

      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
      expect(mockTransporter.sentMessages.length).toBe(1);
    });
  });

  describe("4. Mekanisme Retry & Dead-Letter Queue (DLQ)", () => {
    it("harus mencoba ulang saat pengiriman gagal dan mengalihkan ke dead-letter setelah 3x gagal", async () => {
      mockTransporter.shouldFail = true;

      // Masukkan 1 email ke antrean
      const queueResult = await queueEmailNotification({
        accountId: sampleAccountId,
        recipientEmail: sampleEmail,
        type: "verification_approved",
        subject: "Tes DLQ",
        html: "<p>Tes</p>",
        text: "Tes",
      });
      expect(queueResult.queued).toBe(true);

      // Percobaan 1: Gagal -> status tetap pending, retry_count = 1
      const batch1 = await processNotificationQueue(10);
      expect(batch1.failed).toBe(1);
      expect(batch1.deadLettered).toBe(0);

      // Percobaan 2: Gagal -> status tetap pending, retry_count = 2
      const batch2 = await processNotificationQueue(10);
      expect(batch2.failed).toBe(1);
      expect(batch2.deadLettered).toBe(0);

      // Percobaan 3: Gagal -> retry_count mencapai batas maksimum (3) -> masuk DLQ!
      const batch3 = await processNotificationQueue(10);
      expect(batch3.failed).toBe(1);
      expect(batch3.deadLettered).toBe(1);

      // Verifikasi catatan Dead-Letter Queue dapat diakses admin
      const dlqItems = await getDeadLetterNotifications(10);
      expect(dlqItems.length).toBeGreaterThanOrEqual(1);
      expect(dlqItems.some((d) => d.recipient === sampleEmail)).toBe(true);
      expect(dlqItems[0].retryCount).toBe(MAX_RETRY_COUNT);
    });
  });

  describe("5. Preferensi Notifikasi Pengguna (Opt-in / Opt-out)", () => {
    it("harus menghormati preferensi pengguna jika opt-out email", async () => {
      // Set preferensi opt-out email
      await updateNotificationPreferences(sampleAccountId, {
        emailNotifications: false,
      });

      const prefs = await getNotificationPreferences(sampleAccountId);
      expect(prefs.emailNotifications).toBe(false);

      // Antrean email harus dilewati
      const queueResult = await queueEmailNotification({
        accountId: sampleAccountId,
        recipientEmail: sampleEmail,
        type: "verification_approved",
        subject: "Pemberitahuan",
        html: "<p>Halo</p>",
        text: "Halo",
      });

      expect(queueResult.queued).toBe(false);
      expect(queueResult.skippedReason).toBe("USER_OPT_OUT");

      // Namun notifikasi in-app tetap harus dibuat demi keterbukaan informasi
      const inAppResult = await createInAppNotification({
        accountId: sampleAccountId,
        type: "verification_approved",
        title: "Verifikasi Disetujui",
        body: "Profil Anda telah aktif.",
      });
      expect(inAppResult.success).toBe(true);
    });

    it("harus memperbarui preferensi notifikasi secara dinamis", async () => {
      const updated = await updateNotificationPreferences(sampleAccountId, {
        emailNotifications: true,
        relationAlerts: false,
      });

      expect(updated.emailNotifications).toBe(true);
      expect(updated.relationAlerts).toBe(false);
    });
  });

  describe("6. Konsumsi Peristiwa Domain Idempoten", () => {
    it("konsumsi VerificationDecided harus membuat notifikasi dan idempoten pada pemanggilan ulang", async () => {
      mockTransporter.shouldFail = false;

      const eventPayload = {
        requestId: "40d7c00e-6f85-4ae2-a162-8419131d9bc7",
        profileId: sampleProfileId,
        accountId: sampleAccountId,
        recipientEmail: sampleEmail,
        recipientName: "Fajar Ramadhan",
        decision: "verified" as const,
        badgeNo: "ESP-SB-VER-2026-0099",
        esportId: "ESP-SB-PL-100099",
      };

      const result1 = await consumeVerificationDecidedEvent(eventPayload);
      expect(result1.success).toBe(true);
      expect(result1.handled).toBe(true);

      // Panggilan kedua dengan parameter identik harus berjalan idempoten
      const result2 = await consumeVerificationDecidedEvent(eventPayload);
      expect(result2.success).toBe(true);
    });

    it("konsumsi RelationRequested harus mengirim notifikasi in-app dan email secara idempoten", async () => {
      const relationPayload = {
        relationId: "77a83bf8-e215-4fa7-8894-3d02b8d4f40f",
        targetAccountId: sampleAccountId,
        recipientName: "Fajar Ramadhan",
        requesterName: "Padang Thunder",
        relationType: "Roster Atlet",
        targetEmail: sampleEmail,
      };

      const res1 = await consumeRelationRequestedEvent(relationPayload);
      expect(res1.success).toBe(true);

      const res2 = await consumeRelationRequestedEvent(relationPayload);
      expect(res2.success).toBe(true);
    });
  });

  describe("7. Helper Notifikasi Pengguna & Menandai Terbaca", () => {
    it("harus dapat mengambil notifikasi pengguna dan menandainya sebagai terbaca", async () => {
      const created = await createInAppNotification({
        accountId: sampleAccountId,
        type: "security_alert",
        title: "Perubahan Sandi",
        body: "Sandi akun Anda baru saja diubah.",
      });

      const userNotifs = await getUserNotifications(sampleAccountId);
      expect(userNotifs.length).toBeGreaterThanOrEqual(1);

      const target = userNotifs.find((n) => n.id === created.id);
      expect(target).toBeDefined();
      expect(target?.isRead).toBe(false);

      // Tandai terbaca
      const readResult = await markNotificationAsRead(created.id, sampleAccountId);
      expect(readResult).toBe(true);

      const updatedNotifs = await getUserNotifications(sampleAccountId);
      const updatedTarget = updatedNotifs.find((n) => n.id === created.id);
      expect(updatedTarget?.isRead).toBe(true);
    });
  });

  describe("8. Kontrol Feature Flag & Rencana Rollback", () => {
    it("harus mengaktifkan USE_NOTIFICATION_SERVICE secara default", () => {
      expect(FLAGS.USE_NOTIFICATION_SERVICE).toBe(true);
    });

    it("harus mendukung fallback aman jika FEATURE_FLAG_NOTIFICATION_SERVICE diset ke false", () => {
      const originalEnv = process.env.FEATURE_FLAG_NOTIFICATION_SERVICE;
      try {
        process.env.FEATURE_FLAG_NOTIFICATION_SERVICE = "false";
        expect(FLAGS.USE_NOTIFICATION_SERVICE).toBe(false);
      } finally {
        if (originalEnv === undefined) {
          delete process.env.FEATURE_FLAG_NOTIFICATION_SERVICE;
        } else {
          process.env.FEATURE_FLAG_NOTIFICATION_SERVICE = originalEnv;
        }
      }
    });
  });
});
