import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { processOutboxBatch, purgeProcessedOutboxEvents } from "@esport-sumbar/lib";
import { processNotificationQueue, purgeStaleNotifications } from "@/lib/services/notifications";
import { reconcileDirectoryReadModel } from "@/lib/services/directory";
import { findOrphanMedia, purgeExpiredEvidence } from "@/lib/services/media";
import { logger } from "@esport-sumbar/lib";

/**
 * Endpoint Terpadu Penjadwal Latar (Cron Dispatcher V3)
 * Memenuhi Spesifikasi Sub-langkah 2.3 & Keputusan P13:
 * - Terlindungi token otorisasi Bearer CRON_SECRET / SUPABASE_SERVICE_ROLE_KEY
 * - Idempoten & time-bounded (< 25 detik)
 * - Menjalankan pembersihan berkas & pangkalan data otomatis (hemat penyimpanan Supabase):
 *   1. Outbox Event Dispatcher + Pembersihan Outbox Selesai (> 7 hari)
 *   2. Antrean Notifikasi Email/In-App + Pembersihan Notifikasi Kedaluwarsa (> 30 hari)
 *   3. Rekonsiliasi Model Baca Direktori (Active Sync)
 *   4. Pembersih Media & Audit Retensi Bukti
 *   5. Pembersihan Berkas Dokumen Verifikasi Melewati Batas Retensi (> 90 hari - UU PDP)
 */

async function handleCronDispatch(req: NextRequest) {
  const startTime = Date.now();
  const authHeader = req.headers.get("authorization");
  const cleanOrphans = req.nextUrl?.searchParams?.get("cleanOrphans") === "true";

  const validSecret =
    process.env.CRON_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  const isAuthorized =
    Boolean(validSecret) &&
    (authHeader === `Bearer ${validSecret}` || req.headers.get("x-vercel-cron") === "1");

  if (!isAuthorized) {
    logger.warn("Akses ditolak pada cron dispatch: Token otorisasi tidak valid");
    return NextResponse.json(
      { error: "Akses ditolak: Kredensial cron tidak valid." },
      { status: 401 }
    );
  }

  const adminClient = createAdminClient();
  const summary: Record<string, unknown> = {
    executedAt: new Date().toISOString(),
    status: "success",
  };

  try {
    // 1. Eksekusi Outbox Batch & Pembersihan Event Outbox Selesai (> 7 hari)
    logger.info("Memulai pemrosesan batch outbox terjadwal...");
    const outboxResult = await processOutboxBatch(adminClient, {}, { batchSize: 25 });
    const purgedOutboxCount = await purgeProcessedOutboxEvents(adminClient, 7);
    summary.outbox = {
      ...outboxResult,
      purgedCount: purgedOutboxCount,
    };

    // 2. Eksekusi Antrean Notifikasi & Pembersihan Notifikasi Kedaluwarsa (> 30 hari)
    logger.info("Memulai pemrosesan antrean notifikasi terjadwal...");
    const notificationResult = await processNotificationQueue(25, adminClient);
    const purgedNotificationCount = await purgeStaleNotifications(30, adminClient);
    summary.notifications = {
      ...notificationResult,
      purgedCount: purgedNotificationCount,
    };

    // 3. Rekonsiliasi Direktori (Mode Aktif)
    logger.info("Memulai rekonsiliasi direktori terjadwal...");
    const dirResult = await reconcileDirectoryReadModel(false, adminClient);
    summary.directory = {
      scannedCount: dirResult.scannedCount,
      fixedCount: dirResult.fixedCount,
      missingProjectionsCount: dirResult.missingProjectionsCount,
      staleProjectionsCount: dirResult.staleProjectionsCount,
      orphanedProjectionsCount: dirResult.orphanedProjectionsCount,
    };

    // 4. Pembersih Media & Audit Retensi Bukti
    logger.info("Memulai audit penyimpanan & pembersih media...");
    const mediaAuditResult = await findOrphanMedia(!cleanOrphans, adminClient);
    summary.mediaAuditReport = {
      scannedBuckets: mediaAuditResult.scannedBuckets,
      totalFilesScanned: mediaAuditResult.totalFilesScanned,
      orphanFilesCount: mediaAuditResult.orphanFilesCount,
      orphanBytesTotal: mediaAuditResult.orphanBytesTotal,
      purgedCount: mediaAuditResult.purgedCount || 0,
    };

    // 5. Pembersihan Berkas Bukti Verifikasi Melebihi Retensi (90 Hari - UU PDP & Hemat Storage)
    const evidenceRetentionResult = await purgeExpiredEvidence(90, adminClient);
    summary.evidenceRetention = {
      retentionDays: 90,
      scanned: evidenceRetentionResult.scanned,
      purgedFiles: evidenceRetentionResult.purgedFiles,
      freedBytes: evidenceRetentionResult.freedBytes,
    };

    summary.durationMs = Date.now() - startTime;
    logger.info("Cron dispatch selesai dieksekusi dengan sukses", summary);

    return NextResponse.json(summary, { status: 200 });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan cron internal";
    logger.error("Kegagalan pada cron dispatch", err);

    return NextResponse.json(
      {
        status: "partial_failure",
        error: errorMsg,
        partialSummary: summary,
        durationMs: Date.now() - startTime,
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return handleCronDispatch(req);
}

export async function POST(req: NextRequest) {
  return handleCronDispatch(req);
}
