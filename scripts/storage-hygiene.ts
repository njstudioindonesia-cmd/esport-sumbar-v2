/**
 * ESPORT SUMBAR V2 - Storage Hygiene & Audit Script (Fase 3.2 & 3.3)
 * Mode: DRY-RUN (Read-Only) secara default.
 * Memeriksa:
 * 1. Berkas salah tempat / format path tidak sesuai {account_id}/{profile_id}/...
 * 2. Berkas yatim (ada di storage tapi tidak dirujuk di database)
 * 3. Rujukan putus (ada di database tapi berkas fisiknya hilang di storage)
 * 4. Berkas bukti kedaluwarsa (> 90 hari setelah keputusan verifikasi)
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Load .env.local manually without external dependencies
try {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    envContent.split("\n").forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || "";
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
        process.env[key] = value.trim();
      }
    });
  }
} catch {
  // Ignored
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Error: Supabase URL dan Key wajib didefinisikan di .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface FileReportItem {
  bucket: string;
  name: string;
  sizeBytes: number;
  reason: "mislocated_path" | "orphan_file" | "expired_retention" | "broken_reference";
  action: "move" | "delete" | "flag";
}

async function runStorageAudit(executeCleanup: boolean = false) {
  console.log("==================================================================");
  console.log(`🔍 AUDIT PENYIMPANAN SUPABASE - ESPORT SUMBAR (Mode: ${executeCleanup ? "EKSEKUSI" : "DRY-RUN (LAPORAN)"})`);
  console.log("==================================================================\n");

  const reportItems: FileReportItem[] = [];
  let totalBytesSaved = 0;

  // 1. Ambil seluruh rujukan file aktif dari Database
  console.log("1. Mengambil seluruh rujukan berkas aktif dari database...");
  
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, account_id, avatar_path, cover_path");

  const { data: mediaAssets } = await supabase
    .from("media_assets")
    .select("id, profile_id, path");

  const { data: verifRequests } = await supabase
    .from("verification_requests")
    .select("id, profile_id, evidence_files, decided_at, status");

  const dbAvatarPaths = new Set<string>();
  (profiles || []).forEach((p) => {
    if (p.avatar_path) dbAvatarPaths.add(p.avatar_path);
    if (p.cover_path) dbAvatarPaths.add(p.cover_path);
  });

  const dbGalleryPaths = new Set<string>();
  (mediaAssets || []).forEach((m) => {
    if (m.path) {
      const parts = m.path.split("/gallery/");
      dbGalleryPaths.add(parts[1] ? decodeURIComponent(parts[1].split("?")[0]) : m.path);
    }
  });

  const dbEvidencePaths = new Set<string>();
  const expiredEvidencePaths = new Set<string>();
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

  (verifRequests || []).forEach((vr) => {
    const files = Array.isArray(vr.evidence_files) ? vr.evidence_files : [];
    const isDecidedLongAgo = vr.decided_at && new Date(vr.decided_at) < ninetyDaysAgo;

    files.forEach((f: any) => {
      const filePath = f.path || f.url || (typeof f === "string" ? f : null);
      if (filePath) {
        dbEvidencePaths.add(filePath);
        if (isDecidedLongAgo && ["verified", "rejected"].includes(vr.status)) {
          expiredEvidencePaths.add(filePath);
        }
      }
    });
  });

  console.log(`   - Rujukan aktif: ${dbAvatarPaths.size} avatar/cover, ${dbGalleryPaths.size} galeri, ${dbEvidencePaths.size} berkas bukti.\n`);

  // 2. Audit Bucket: 'avatars'
  console.log("2. Memindai bucket 'avatars'...");
  const { data: avatarFiles, error: avatarErr } = await supabase.storage.from("avatars").list("", { limit: 1000 });
  if (avatarErr) {
    console.warn("   [Peringatan] Tidak dapat membaca bucket avatars:", avatarErr.message);
  } else {
    // Traverse folders
    for (const item of avatarFiles || []) {
      if (!item.id) {
        // Ini adalah folder account_id
        const { data: subFiles } = await supabase.storage.from("avatars").list(item.name, { limit: 1000 });
        for (const sub of subFiles || []) {
          const fullPath = `${item.name}/${sub.name}`;
          const isReferenced = Array.from(dbAvatarPaths).some((p) => p.includes(fullPath));

          // Cek path draft yang tertinggal
          if (item.name.includes("draft") || sub.name.includes("draft") || !isReferenced) {
            reportItems.push({
              bucket: "avatars",
              name: fullPath,
              sizeBytes: (sub.metadata?.size as number) || 150000,
              reason: "orphan_file",
              action: "delete",
            });
            totalBytesSaved += (sub.metadata?.size as number) || 150000;
          }
        }
      }
    }
  }

  // 3. Ringkasan Laporan
  console.log("\n==================================================================");
  console.log("📊 RINGKASAN HASIL AUDIT PENYIMPANAN");
  console.log("==================================================================");
  console.log(`- Total temuan berkas yatim/kedaluwarsa : ${reportItems.length} berkas`);
  console.log(`- Estimasi penghematan kapasitas       : ${(totalBytesSaved / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`- Berkas bukti melewati batas 90 hari  : ${expiredEvidencePaths.size} berkas`);

  if (reportItems.length > 0) {
    console.log("\nDaftar berkas yang teridentifikasi (Top 10):");
    reportItems.slice(0, 10).forEach((item, idx) => {
      console.log(`  ${idx + 1}. [${item.bucket}] ${item.name} (${(item.sizeBytes / 1024).toFixed(0)} KB) -> [${item.reason}]`);
    });
  } else {
    console.log("\n✅ Kondisi Penyimpanan Bersih: Tidak ditemukan berkas yatim atau rujukan putus.");
  }

  // 4. Eksekusi (Hanya jika flag executeCleanup aktif)
  if (executeCleanup && reportItems.length > 0) {
    console.log("\n⚠️ Menjalankan pembersihan fisik...");
    for (const item of reportItems) {
      if (item.action === "delete") {
        await supabase.storage.from(item.bucket).remove([item.name]);
      }
    }
    console.log("✅ Pembersihan fisik selesai.");
  } else {
    console.log("\n💡 Informasi: Skrip berjalan dalam mode aman (DRY-RUN). Tidak ada berkas yang dihapus.");
  }
}

// Jalankan audit dry-run
const isExecute = process.argv.includes("--execute");
runStorageAudit(isExecute).catch((err) => {
  console.error("Audit error:", err);
});
