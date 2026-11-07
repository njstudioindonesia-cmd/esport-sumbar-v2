import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { processOutboxBatch } from "@esport-sumbar/lib";
import { processNotificationQueue } from "@/lib/services/notifications";
import { reconcileDirectoryReadModel } from "@/lib/services/directory";
import { findOrphanMedia } from "@/lib/services/media";
import { logger } from "@esport-sumbar/lib";

/**
 * Endpoint Terpadu Penjadwal Latar (Cron Dispatcher V3)
 * Memenuhi Spesifikasi Sub-langkah 2.3 & Keputusan P13:
 * - Terlindungi token otorisasi Bearer CRON_SECRET / SUPABASE_SERVICE_ROLE_KEY
 * - Idempoten & time-bounded (< 25 detik)
 * - Menjalankan:
 *   1. Outbox Event Dispatcher
 *   2. Antrean Notifikasi Email/In-App
 *   3. Rekonsiliasi Model Baca Direktori (Active Sync)
 *   4. Pembersih Media & Audit Retensi Bukti (Mode Laporan)
 */

async function handleCronDispatch(req: NextRequest) {
  const startTime = Date.now();
  const authHeader = req.headers.get("authorization");

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
    // 1. Eksekusi Outbox Batch
    logger.info("Memulai pemrosesan batch outbox terjadwal...");
    const outboxResult = await processOutboxBatch(adminClient, {}, { batchSize: 25 });
    summary.outbox = outboxResult;

    // 2. Eksekusi Antrean Notifikasi
    logger.info("Memulai pemrosesan antrean notifikasi terjadwal...");
    const notificationResult = await processNotificationQueue(25, adminClient);
    summary.notifications = notificationResult;

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

    // 4. Pembersih Media & Audit Retensi Bukti (Mode Laporan / Dry-run)
    logger.info("Memulai audit penyimpanan & pembersih media (mode laporan)...");
    const mediaAuditResult = await findOrphanMedia(true, adminClient);
    summary.mediaAuditReport = {
      scannedBuckets: mediaAuditResult.scannedBuckets,
      totalFilesScanned: mediaAuditResult.totalFilesScanned,
      orphanFilesCount: mediaAuditResult.orphanFilesCount,
      orphanBytesTotal: mediaAuditResult.orphanBytesTotal,
    };

    // 5. Cek Berkas Bukti Verifikasi Melebihi Retensi (90 Hari)
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
    const { count: expiredEvidenceCount, error: evErr } = await adminClient
      .from("verification_requests")
      .select("id", { count: "exact", head: true })
      .lt("created_at", ninetyDaysAgo)
      .in("status", ["verified", "rejected"]);

    summary.evidenceRetention = {
      retentionDays: 90,
      expiredEvidenceCount: expiredEvidenceCount || 0,
      status: evErr ? evErr.message : "OK",
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
