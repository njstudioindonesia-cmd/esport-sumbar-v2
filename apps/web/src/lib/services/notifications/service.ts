import { createClient, createAdminClient, createPublicServerClient } from "@/lib/supabase/server";
import {
  NotificationPayload,
  NotificationType,
  NotificationPreference,
} from "@esport-sumbar/contracts";
import {
  withIdempotency,
  generateDeterministicIdempotencyKey,
  logger,
  createResiliencePolicy,
} from "@esport-sumbar/lib";
import { sendEmailSafe } from "./transporter";
import { getNotificationPreferences } from "./preferences";
import {
  renderVerificationApprovedEmail,
  renderVerificationRevisionEmail,
  renderRelationRequestedEmail,
  renderRelationApprovedEmail,
  renderSecurityAlertEmail,
  buildInAppNotification,
} from "./templates";
import { FLAGS } from "@/lib/config/flags";

export const MAX_RETRY_COUNT = 3;

export const notificationResiliencePolicy = createResiliencePolicy({
  name: "notification-service",
  timeoutMs: 4000,
  retry: {
    maxAttempts: 3,
    baseDelayMs: 50,
  },
  circuitBreaker: {
    failureThreshold: 4,
    recoveryTimeoutMs: 15000,
  },
});

export interface InAppNotificationRecord {
  id: string;
  accountId: string;
  type: NotificationType;
  title: string;
  body: string;
  actionUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface DeadLetterNotificationRecord {
  id: string;
  accountId: string;
  type: string;
  channel: string;
  recipient: string;
  subject: string;
  errorMessage: string;
  retryCount: number;
  createdAt: string;
}

// In-memory fallback antrean untuk pengujian / serverless standalone
const inMemoryQueue: any[] = [];

export function clearInMemoryNotificationQueue(): void {
  inMemoryQueue.length = 0;
}

function shouldUseInMemoryOnly(client?: any): boolean {
  if (client) return false;
  const isPlaceholder = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").includes("placeholder");
  const isTest = process.env.NODE_ENV === "test";
  return isTest || isPlaceholder;
}

// ==============================================================================
// 1. PENCATATAN NOTIFIKASI DALAM-APLIKASI (IN-APP NOTIFICATIONS)
// ==============================================================================

export async function createInAppNotification(
  params: {
    accountId: string;
    type: NotificationType;
    title: string;
    body: string;
    actionUrl?: string;
    metadata?: Record<string, any>;
  },
  client?: any
): Promise<{ success: boolean; id: string }> {
  const notifId = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const payload = {
    channel: "in_app",
    title: params.title,
    body: params.body,
    actionUrl: params.actionUrl,
    is_read: false,
    metadata: params.metadata || {},
  };

  if (shouldUseInMemoryOnly(client)) {
    inMemoryQueue.push({
      id: notifId,
      account_id: params.accountId,
      type: params.type,
      payload_jsonb: payload,
      status: "sent",
      sent_at: createdAt,
      created_at: createdAt,
    });
    return { success: true, id: notifId };
  }

  try {
    const supabase = client || createAdminClient();
    const { error } = await supabase.from("notifications_queue").insert({
      id: notifId,
      account_id: params.accountId,
      type: params.type,
      payload_jsonb: payload,
      status: "sent",
      sent_at: createdAt,
      created_at: createdAt,
    });

    if (error) {
      inMemoryQueue.push({
        id: notifId,
        account_id: params.accountId,
        type: params.type,
        payload_jsonb: payload,
        status: "sent",
        created_at: createdAt,
      });
    }
  } catch {
    inMemoryQueue.push({
      id: notifId,
      account_id: params.accountId,
      type: params.type,
      payload_jsonb: payload,
      status: "sent",
      created_at: createdAt,
    });
  }

  logger.info("In-app notification created", {
    accountId: params.accountId,
    type: params.type,
    title: params.title,
  });

  return { success: true, id: notifId };
}

// ==============================================================================
// 2. PENAMBAHAN KE ANTREAN EMAIL (EMAIL NOTIFICATIONS QUEUE)
// ==============================================================================

export async function queueEmailNotification(
  params: {
    accountId: string;
    recipientEmail: string;
    type: NotificationType;
    subject: string;
    html: string;
    text: string;
    metadata?: Record<string, any>;
  },
  client?: any
): Promise<{ queued: boolean; skippedReason?: string; id?: string }> {
  // 1. Hormati preferensi notifikasi pengguna
  const prefs = await getNotificationPreferences(params.accountId, client);
  if (!prefs.emailNotifications) {
    logger.info("Pengiriman email dilewati karena preferensi pengguna menolak notifikasi email", {
      accountId: params.accountId,
    });
    return { queued: false, skippedReason: "USER_OPT_OUT" };
  }

  // 2. Masukkan ke antrean
  const notifId = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const payload = {
    channel: "email",
    to: params.recipientEmail,
    subject: params.subject,
    html: params.html,
    text: params.text,
    retry_count: 0,
    dead_letter: false,
    metadata: params.metadata || {},
  };

  if (shouldUseInMemoryOnly(client)) {
    inMemoryQueue.push({
      id: notifId,
      account_id: params.accountId,
      type: params.type,
      payload_jsonb: payload,
      status: "pending",
      created_at: createdAt,
    });
    return { queued: true, id: notifId };
  }

  try {
    const supabase = client || createAdminClient();
    const { error } = await supabase.from("notifications_queue").insert({
      id: notifId,
      account_id: params.accountId,
      type: params.type,
      payload_jsonb: payload,
      status: "pending",
      created_at: createdAt,
    });

    if (error) {
      inMemoryQueue.push({
        id: notifId,
        account_id: params.accountId,
        type: params.type,
        payload_jsonb: payload,
        status: "pending",
        created_at: createdAt,
      });
    }
  } catch {
    inMemoryQueue.push({
      id: notifId,
      account_id: params.accountId,
      type: params.type,
      payload_jsonb: payload,
      status: "pending",
      created_at: createdAt,
    });
  }

  logger.info("Email notification queued", {
    accountId: params.accountId,
    to: params.recipientEmail,
    subject: params.subject,
  });

  return { queued: true, id: notifId };
}

// ==============================================================================
// 3. PEMROSES ANTREAN & DEAD-LETTER QUEUE (DLQ WORKER ENGINE)
// ==============================================================================

export async function processNotificationQueue(
  batchSize = 20,
  client?: any
): Promise<{
  processed: number;
  sent: number;
  failed: number;
  deadLettered: number;
}> {
  let pendingItems: any[] = [];

  if (shouldUseInMemoryOnly(client)) {
    pendingItems = inMemoryQueue.filter((item) => item.status === "pending").slice(0, batchSize);
  } else {
    try {
      const supabase = client || createAdminClient();
      const { data } = await supabase
        .from("notifications_queue")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: true })
        .limit(batchSize);

      if (data && data.length > 0) {
        pendingItems = data;
      }
    } catch {
      // Abaikan jika database query gagal
    }

    // Gabungkan dengan item pending di memori
    const memPending = inMemoryQueue.filter((item) => item.status === "pending").slice(0, batchSize);
    for (const m of memPending) {
      if (!pendingItems.some((p) => p.id === m.id)) {
        pendingItems.push(m);
      }
    }
  }

  let sent = 0;
  let failed = 0;
  let deadLettered = 0;

  for (const item of pendingItems) {
    const payload = item.payload_jsonb || {};
    if (payload.channel !== "email") continue;

    const emailMsg = {
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    };

    // Eksekusi pengiriman email aman terlindungi oleh Circuit Breaker & Retry
    const sendResult = await notificationResiliencePolicy.execute(
      async () => {
        const res = await sendEmailSafe(emailMsg);
        if (!res.success) {
          throw new Error(res.error || "Email transport error");
        }
        return res;
      },
      (err) => ({
        success: false,
        error: err?.message || "Circuit breaker open / delivery failed",
      })
    );

    if (sendResult.success) {
      sent++;
      item.status = "sent";
      item.sent_at = new Date().toISOString();

      try {
        const supabase = client || createAdminClient();
        await supabase
          .from("notifications_queue")
          .update({
            status: "sent",
            sent_at: item.sent_at,
          })
          .eq("id", item.id);
      } catch {
        // Fallback
      }
    } else {
      failed++;
      const currentRetries = payload.retry_count || 0;
      const nextRetries = currentRetries + 1;
      const isDeadLetter = nextRetries >= MAX_RETRY_COUNT;

      payload.retry_count = nextRetries;
      payload.last_error = sendResult.error;

      if (isDeadLetter) {
        deadLettered++;
        payload.dead_letter = true;
        item.status = "failed";
        logger.error("Notifikasi email dialihkan ke Dead-Letter Queue (DLQ)", {
          notificationId: item.id,
          to: payload.to,
          error: sendResult.error,
          retryCount: nextRetries,
        });
      } else {
        item.status = "pending";
        logger.warn("Notifikasi email gagal terkirim, dijadwalkan ulang untuk dicoba kembali", {
          notificationId: item.id,
          to: payload.to,
          retryCount: nextRetries,
        });
      }

      try {
        const supabase = client || createAdminClient();
        await supabase
          .from("notifications_queue")
          .update({
            status: item.status,
            payload_jsonb: payload,
          })
          .eq("id", item.id);
      } catch {
        // Fallback
      }
    }
  }

  return {
    processed: pendingItems.length,
    sent,
    failed,
    deadLettered,
  };
}

// ==============================================================================
// 4. KONSUMEN PERISTIWA DOMAIN ASINKRON & IDEMPOTEN
// ==============================================================================

/**
 * Konsumen Peristiwa `VerificationDecided`:
 * Mengirim notifikasi in-app dan email sesuai keputusan verifikasi (disetujui, revisi, ditolak).
 */
export async function consumeVerificationDecidedEvent(
  event: {
    requestId: string;
    profileId: string;
    accountId?: string;
    recipientEmail?: string;
    recipientName?: string;
    decision: "verified" | "revision_requested" | "rejected" | "suspended";
    badgeNo?: string;
    esportId?: string;
    notes?: string;
  },
  client?: any
): Promise<{ success: boolean; handled: boolean }> {
  if (!event.accountId) {
    return { success: true, handled: false };
  }

  const idempotencyKey = generateDeterministicIdempotencyKey(
    "consume-verification-decided",
    event.requestId,
    event.decision
  );

  const { result } = await withIdempotency(idempotencyKey, async () => {
    const recipientName = event.recipientName || "Pengguna ESPORT SUMBAR";
    const recipientEmail = event.recipientEmail;

    if (event.decision === "verified") {
      // 1. Buat notifikasi dalam aplikasi
      const inAppMsg = buildInAppNotification("verification_approved", {
        badgeNo: event.badgeNo,
        profileUrl: `/profile/${event.profileId}`,
      });
      await createInAppNotification(
        {
          accountId: event.accountId!,
          type: "verification_approved",
          title: inAppMsg.title,
          body: inAppMsg.body,
          actionUrl: inAppMsg.actionUrl,
        },
        client
      );

      // 2. Buat antrean email jika alamat email tersedia
      if (recipientEmail) {
        const emailContent = renderVerificationApprovedEmail({
          recipientName,
          esportId: event.esportId || "ESP-SB-PL-0000",
          badgeNo: event.badgeNo || "ESP-SB-VER-2026-0000",
          profileUrl: `https://esportsumbar.com/profile/${event.profileId}`,
        });

        await queueEmailNotification(
          {
            accountId: event.accountId!,
            recipientEmail,
            type: "verification_approved",
            subject: emailContent.subject,
            html: emailContent.html,
            text: emailContent.text,
          },
          client
        );
      }
    } else if (event.decision === "revision_requested") {
      const inAppMsg = buildInAppNotification("verification_revision", {
        notes: event.notes,
        editUrl: `/me/verification`,
      });
      await createInAppNotification(
        {
          accountId: event.accountId!,
          type: "verification_revision",
          title: inAppMsg.title,
          body: inAppMsg.body,
          actionUrl: inAppMsg.actionUrl,
        },
        client
      );

      if (recipientEmail) {
        const emailContent = renderVerificationRevisionEmail({
          recipientName,
          revisionNotes: event.notes || "Harap periksa dan lengkapi berkas Anda.",
          editUrl: `https://esportsumbar.com/me/verification`,
        });

        await queueEmailNotification(
          {
            accountId: event.accountId!,
            recipientEmail,
            type: "verification_revision",
            subject: emailContent.subject,
            html: emailContent.html,
            text: emailContent.text,
          },
          client
        );
      }
    }

    return { handled: true };
  });

  return { success: true, handled: result.handled };
}

/**
 * Konsumen Peristiwa `RelationRequested`:
 * Mengirim notifikasi permintaan relasi ekosistem baru ke profil target.
 */
export async function consumeRelationRequestedEvent(
  event: {
    relationId: string;
    targetAccountId?: string;
    recipientName?: string;
    requesterName?: string;
    relationType?: string;
    targetEmail?: string;
  },
  client?: any
): Promise<{ success: boolean; handled: boolean }> {
  if (!event.targetAccountId) {
    return { success: true, handled: false };
  }

  const idempotencyKey = generateDeterministicIdempotencyKey(
    "consume-relation-requested",
    event.relationId
  );

  const { result } = await withIdempotency(idempotencyKey, async () => {
    const inAppMsg = buildInAppNotification("relation_requested", {
      requesterName: event.requesterName,
      relationType: event.relationType,
      confirmUrl: `/me/memberships`,
    });

    await createInAppNotification(
      {
        accountId: event.targetAccountId!,
        type: "relation_requested",
        title: inAppMsg.title,
        body: inAppMsg.body,
        actionUrl: inAppMsg.actionUrl,
      },
      client
    );

    if (event.targetEmail) {
      const emailContent = renderRelationRequestedEmail({
        recipientName: event.recipientName || "Pengguna ESPORT SUMBAR",
        requesterName: event.requesterName || "Suatu Entitas",
        relationType: event.relationType || "Kemitraan",
        confirmUrl: `https://esportsumbar.com/me/memberships`,
      });

      await queueEmailNotification(
        {
          accountId: event.targetAccountId!,
          recipientEmail: event.targetEmail,
          type: "relation_requested",
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text,
        },
        client
      );
    }

    return { handled: true };
  });

  return { success: true, handled: result.handled };
}

// ==============================================================================
// 5. HELPER KONSUMEN & QUERY API PENGGUNA
// ==============================================================================

/**
 * Mengambil daftar notifikasi dalam-aplikasi untuk suatu akun pengguna.
 */
export async function getUserNotifications(
  accountId: string,
  limit = 20,
  client?: any
): Promise<InAppNotificationRecord[]> {
  if (shouldUseInMemoryOnly(client)) {
    return inMemoryQueue
      .filter((item) => item.account_id === accountId && item.payload_jsonb?.channel === "in_app")
      .map((item) => ({
        id: item.id,
        accountId: item.account_id,
        type: item.type as NotificationType,
        title: item.payload_jsonb?.title || "Pemberitahuan",
        body: item.payload_jsonb?.body || "",
        actionUrl: item.payload_jsonb?.actionUrl,
        isRead: !!item.payload_jsonb?.is_read,
        createdAt: item.created_at,
      }))
      .slice(0, limit);
  }

  try {
    const supabase = client || (await createClient());
    const { data } = await supabase
      .from("notifications_queue")
      .select("*")
      .eq("account_id", accountId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (data && data.length > 0) {
      return data
        .filter((item: any) => item.payload_jsonb?.channel === "in_app")
        .map((item: any) => ({
          id: item.id,
          accountId: item.account_id,
          type: item.type as NotificationType,
          title: item.payload_jsonb?.title || "Pemberitahuan",
          body: item.payload_jsonb?.body || "",
          actionUrl: item.payload_jsonb?.actionUrl,
          isRead: !!item.payload_jsonb?.is_read,
          createdAt: item.created_at,
        }));
    }
  } catch {
    // Fallback in-memory
  }

  return inMemoryQueue
    .filter((item) => item.account_id === accountId && item.payload_jsonb?.channel === "in_app")
    .map((item) => ({
      id: item.id,
      accountId: item.account_id,
      type: item.type as NotificationType,
      title: item.payload_jsonb?.title || "Pemberitahuan",
      body: item.payload_jsonb?.body || "",
      actionUrl: item.payload_jsonb?.actionUrl,
      isRead: !!item.payload_jsonb?.is_read,
      createdAt: item.created_at,
    }))
    .slice(0, limit);
}

/**
 * Menandai notifikasi sebagai terbaca (is_read = true).
 */
export async function markNotificationAsRead(
  notificationId: string,
  accountId: string,
  client?: any
): Promise<boolean> {
  if (shouldUseInMemoryOnly(client)) {
    const memItem = inMemoryQueue.find((i) => i.id === notificationId && i.account_id === accountId);
    if (memItem) {
      memItem.payload_jsonb.is_read = true;
      return true;
    }
    return false;
  }

  try {
    const supabase = client || (await createClient());
    const { data: item } = await supabase
      .from("notifications_queue")
      .select("payload_jsonb")
      .eq("id", notificationId)
      .eq("account_id", accountId)
      .single();

    if (item) {
      const payload = { ...item.payload_jsonb, is_read: true };
      await supabase
        .from("notifications_queue")
        .update({ payload_jsonb: payload })
        .eq("id", notificationId);
      return true;
    }
  } catch {
    // Fallback in-memory
  }

  const memItem = inMemoryQueue.find((i) => i.id === notificationId && i.account_id === accountId);
  if (memItem) {
    memItem.payload_jsonb.is_read = true;
    return true;
  }

  return false;
}

/**
 * Mengambil daftar notifikasi yang gagal dan masuk ke Dead-Letter Queue (DLQ).
 */
export async function getDeadLetterNotifications(
  limit = 50,
  client?: any
): Promise<DeadLetterNotificationRecord[]> {
  if (shouldUseInMemoryOnly(client)) {
    return inMemoryQueue
      .filter((item) => item.status === "failed" && item.payload_jsonb?.dead_letter === true)
      .map((item) => ({
        id: item.id,
        accountId: item.account_id,
        type: item.type,
        channel: item.payload_jsonb?.channel || "unknown",
        recipient: item.payload_jsonb?.to || "unknown",
        subject: item.payload_jsonb?.subject || "-",
        errorMessage: item.payload_jsonb?.last_error || "Unknown error",
        retryCount: item.payload_jsonb?.retry_count || 0,
        createdAt: item.created_at,
      }))
      .slice(0, limit);
  }

  try {
    const supabase = client || createAdminClient();
    const { data } = await supabase
      .from("notifications_queue")
      .select("*")
      .eq("status", "failed")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (data && data.length > 0) {
      return data
        .filter((item: any) => item.payload_jsonb?.dead_letter === true)
        .map((item: any) => ({
          id: item.id,
          accountId: item.account_id,
          type: item.type,
          channel: item.payload_jsonb?.channel || "unknown",
          recipient: item.payload_jsonb?.to || "unknown",
          subject: item.payload_jsonb?.subject || "-",
          errorMessage: item.payload_jsonb?.last_error || "Unknown error",
          retryCount: item.payload_jsonb?.retry_count || 0,
          createdAt: item.created_at,
        }));
    }
  } catch {
    // Fallback in-memory
  }

  return inMemoryQueue
    .filter((item) => item.status === "failed" && item.payload_jsonb?.dead_letter === true)
    .map((item) => ({
      id: item.id,
      accountId: item.account_id,
      type: item.type,
      channel: item.payload_jsonb?.channel || "unknown",
      recipient: item.payload_jsonb?.to || "unknown",
      subject: item.payload_jsonb?.subject || "-",
      errorMessage: item.payload_jsonb?.last_error || "Unknown error",
      retryCount: item.payload_jsonb?.retry_count || 0,
      createdAt: item.created_at,
    }))
    .slice(0, limit);
}

/**
 * Membersihkan notifikasi lama yang sudah terkirim ('sent') atau gagal ('failed') melebihi batas usia.
 * Mencegah pembengkakan penyimpanan database pada tabel notifications_queue saat ribuan player terdaftar.
 */
export async function purgeStaleNotifications(
  daysOld: number = 30,
  client?: any
): Promise<number> {
  const supabase = client || createAdminClient();

  try {
    const { data: rpcCount, error: rpcError } = await supabase.rpc("purge_stale_notifications", {
      p_days_old: daysOld,
    });

    if (!rpcError && typeof rpcCount === "number") {
      return rpcCount;
    }
  } catch {
    // Fallback ke query langsung jika RPC belum terdaftar
  }

  try {
    const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from("notifications_queue")
      .delete()
      .in("status", ["sent", "failed"])
      .lt("created_at", cutoffDate)
      .select("id");

    if (error) {
      logger.warn("Gagal membersihkan notifications_queue kedaluwarsa", { error: error.message });
      return 0;
    }

    const count = data?.length || 0;
    if (count > 0) {
      logger.info(`Berhasil memangkas ${count} notifikasi kedaluwarsa (> ${daysOld} hari).`);
    }
    return count;
  } catch (err: any) {
    logger.warn("Kesalahan saat mengeksekusi purgeStaleNotifications", { error: err.message });
    return 0;
  }
}
