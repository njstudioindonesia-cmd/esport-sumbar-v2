import sharp from "sharp";
import { createClient, createAdminClient, createPublicServerClient } from "@/lib/supabase/server";
import { validateImageMagicBytes, type AllowedImageFormat } from "@/lib/security/magic-bytes";
import {
  RequestMediaUploadSignatureSchema,
  type RequestMediaUploadSignatureInput,
  type MediaUploadSignatureResponse,
  type MediaPurpose,
} from "@esport-sumbar/contracts";
import { createOutboxEvent, publishOutboxEvent } from "@esport-sumbar/lib";
import { withIdempotency, generateDeterministicIdempotencyKey } from "@esport-sumbar/lib";
import { FLAGS } from "@/lib/config/flags";
import { logger } from "@esport-sumbar/lib";

// ==============================================================================
// 1. KONFIGURASI BATAS & KUOTA PENYIMPANAN MEDIA V3
// ==============================================================================

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB per berkas

export const STORAGE_QUOTAS_BYTES: Record<string, number> = {
  // Atlet dan Pelatih (Perorangan): 10 MB total
  player: 10 * 1024 * 1024,
  coach: 10 * 1024 * 1024,
  // Organisasi / Institusi: 25 MB total
  team: 25 * 1024 * 1024,
  community: 25 * 1024 * 1024,
  venue: 25 * 1024 * 1024,
  campus: 25 * 1024 * 1024,
  school: 25 * 1024 * 1024,
};

export const DEFAULT_QUOTA_BYTES = 10 * 1024 * 1024;

export const BUCKET_MAPPING: Record<MediaPurpose, string> = {
  avatar: "avatars",
  cover: "avatars",
  gallery: "gallery",
  evidence: "evidence",
};

export interface CompressionResult {
  compressedBuffer: Buffer;
  format: "webp";
  width?: number;
  height?: number;
  originalSize: number;
  compressedSize: number;
  savingsBytes: number;
  savingsPercent: number;
}

export interface QuotaCheckResult {
  allowed: boolean;
  currentUsageBytes: number;
  quotaLimitBytes: number;
  availableBytes: number;
  error?: string;
}

export interface OrphanMediaReport {
  scannedBuckets: string[];
  totalFilesScanned: number;
  orphanFilesCount: number;
  orphanBytesTotal: number;
  orphans: Array<{
    bucket: string;
    path: string;
    size?: number;
  }>;
  purged: boolean;
  purgedCount?: number;
}

// ==============================================================================
// 2. KOMPRESI SISI SERVER (SHARP) & PEMBERSIHAN METADATA PRIVASI
// ==============================================================================

/**
 * Kompresi gambar sisi server menggunakan Sharp:
 * - Dikonversi ke format WebP (kualitas 85).
 * - Metadata EXIF (lokasi GPS, identitas perangkat) DIHAPUS demi kepatuhan UU PDP No. 27/2022.
 * - Dimensi disesuaikan proporsional sesuai tujuan (avatar max 1024, cover max 1920, dll).
 */
export async function compressImageWithSharp(
  inputBuffer: Uint8Array | Buffer,
  purpose: MediaPurpose = "avatar"
): Promise<CompressionResult> {
  const originalSize = inputBuffer.length;
  const image = sharp(inputBuffer);

  // Atur batas dimensi berdasarkan tujuan media
  let maxWidth = 1024;
  let maxHeight = 1024;
  let quality = 85;

  switch (purpose) {
    case "cover":
      maxWidth = 1920;
      maxHeight = 1080;
      quality = 85;
      break;
    case "gallery":
      maxWidth = 1600;
      maxHeight = 1200;
      quality = 85;
      break;
    case "evidence":
      maxWidth = 1600;
      maxHeight = 1600;
      quality = 80;
      break;
    case "avatar":
    default:
      maxWidth = 1024;
      maxHeight = 1024;
      quality = 85;
      break;
  }

  // Pipeline kompresi: Resize proporsional tanpa pembesaran paksa + Konversi ke WebP + Strip EXIF
  const pipeline = image
    .resize(maxWidth, maxHeight, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({
      quality,
      effort: 4,
    });

  // Hapus metadata (EXIF/IPTC/XMP) secara tegas untuk privasi pengguna
  // Dalam Sharp, tidak memanggil .withMetadata() akan secara default menghapus semua metadata.
  const { data: compressedBuffer, info } = await pipeline.toBuffer({ resolveWithObject: true });
  const compressedSize = compressedBuffer.length;
  const savingsBytes = Math.max(0, originalSize - compressedSize);
  const savingsPercent = originalSize > 0 ? Number(((savingsBytes / originalSize) * 100).toFixed(1)) : 0;

  return {
    compressedBuffer,
    format: "webp",
    width: info.width,
    height: info.height,
    originalSize,
    compressedSize,
    savingsBytes,
    savingsPercent,
  };
}

// ==============================================================================
// 3. PEMERIKSAAN KUOTA PENYIMPANAN PROFIL
// ==============================================================================

/**
 * Menghitung kuota penyimpanan yang telah digunakan oleh suatu profil dan memeriksa
 * apakah penambahan berkas baru melebihi kuota entitas tersebut.
 */
export async function checkProfileStorageQuota(
  profileId: string,
  incomingSizeBytes: number = 0,
  client?: any
): Promise<QuotaCheckResult> {
  const supabase = client || createPublicServerClient();

  // 1. Ambil entity_type profil untuk menentukan batas kuota
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, entity_type")
    .eq("id", profileId)
    .single();

  const entityType = profile?.entity_type || "player";
  const quotaLimitBytes = STORAGE_QUOTAS_BYTES[entityType] || DEFAULT_QUOTA_BYTES;

  // 2. Hitung total ukuran berkas aktif di tabel media_assets
  const { data: assets } = await supabase
    .from("media_assets")
    .select("path")
    .eq("profile_id", profileId);

  // Estimasi penggunaan berkas galeri (asumsi rata-rata jika ukuran byte tidak dicatat di DB)
  const estimatedAssetsBytes = (assets?.length || 0) * 350 * 1024; // ~350KB per WebP terkompresi

  // Tambahkan estimasi avatar (150KB) dan cover (300KB)
  const currentUsageBytes = estimatedAssetsBytes + 450 * 1024;
  const projectedTotal = currentUsageBytes + incomingSizeBytes;

  const allowed = projectedTotal <= quotaLimitBytes;
  const availableBytes = Math.max(0, quotaLimitBytes - currentUsageBytes);

  return {
    allowed,
    currentUsageBytes,
    quotaLimitBytes,
    availableBytes,
    error: allowed
      ? undefined
      : `Kuota penyimpanan untuk profil (${(currentUsageBytes / (1024 * 1024)).toFixed(1)} MB / ${(quotaLimitBytes / (1024 * 1024)).toFixed(0)} MB) tidak mencukupi untuk berkas ini.`,
  };
}

// ==============================================================================
// 4. API TANDA TANGAN UNGGAH (UPLOAD SIGNATURE API)
// ==============================================================================

/**
 * Membuat tanda tangan unggah (Signed Upload URL) aman untuk klien.
 * Memvalidasi skema kontrak Zod, batas ukuran, dan kuota sebelum menerbitkan izin unggah.
 */
export async function createUploadSignature(
  input: RequestMediaUploadSignatureInput,
  accountId: string,
  client?: any
): Promise<MediaUploadSignatureResponse> {
  // 1. Validasi Input melalui Zod Kontrak V1
  const validated = RequestMediaUploadSignatureSchema.parse(input);

  // 2. Validasi Kuota Profil
  const quotaCheck = await checkProfileStorageQuota(validated.targetProfileId, validated.fileSize, client);
  if (!quotaCheck.allowed) {
    throw new Error(quotaCheck.error || "Penyimpanan melebihi kuota profil.");
  }

  const bucket = BUCKET_MAPPING[validated.purpose];
  const fileUuid = crypto.randomUUID();
  const fileExt = "webp";
  const storagePath = `${accountId}/${validated.targetProfileId}/${validated.purpose}_${fileUuid}.${fileExt}`;

  const supabase = client || (await createClient());

  // 3. Terbitkan Signed Upload URL (berlaku 15 menit)
  const expiresInSeconds = 900;
  const expiresAt = new Date(Date.now() + expiresInSeconds * 1000).toISOString();

  let uploadUrl = "";
  let token = crypto.randomUUID();

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUploadUrl(storagePath);

    if (error || !data) {
      // Fallback jika mode mock atau lokal
      uploadUrl = `/mock-upload/${bucket}/${storagePath}?token=${token}`;
    } else {
      uploadUrl = data.signedUrl;
      token = data.token;
    }
  } catch {
    uploadUrl = `/mock-upload/${bucket}/${storagePath}?token=${token}`;
  }

  // 4. Dapatkan Public URL atau Signed Read URL
  let publicUrl = "";
  if (bucket === "evidence") {
    // Evidence bersifat privat: hasilkan tautan privat berumur pendek
    publicUrl = `/api/media/evidence-view?path=${encodeURIComponent(storagePath)}`;
  } else {
    const { data: pubData } = supabase.storage.from(bucket).getPublicUrl(storagePath);
    publicUrl = pubData?.publicUrl || `https://placeholder.supabase.co/storage/v1/object/public/${bucket}/${storagePath}`;
  }

  return {
    uploadUrl,
    storagePath,
    token,
    expiresAt,
    publicUrl,
  };
}

// ==============================================================================
// 5. PEMROSESAN LENGKAP & PENGUNGGAHAN BERKAS (SERVER-SIDE WORKFLOW)
// ==============================================================================

export interface ProcessMediaUploadParams {
  fileBuffer: Uint8Array | Buffer;
  fileName: string;
  purpose: MediaPurpose;
  profileId: string;
  accountId: string;
  oldPublicUrl?: string | null;
  caption?: string;
  sortOrder?: number;
}

export interface ProcessMediaUploadResult {
  success: boolean;
  publicUrl?: string;
  storagePath?: string;
  fileSize?: number;
  savingsPercent?: number;
  error?: string;
}

/**
 * Alur terpadu pemrosesan media sisi server:
 * 1. Validasi tipe sebenarnya (Magic Bytes).
 * 2. Kompresi WebP & Pembersihan Metadata EXIF (Sharp).
 * 3. Pemeriksaan Kuota Profil.
 * 4. Pengunggahan ke Supabase Storage.
 * 5. Penghapusan berkas lama jika diganti + Publikasi peristiwa `MediaReplaced`.
 */
export async function processAndUploadMedia(
  params: ProcessMediaUploadParams,
  client?: any
): Promise<ProcessMediaUploadResult> {
  const { fileBuffer, purpose, profileId, accountId, oldPublicUrl, caption, sortOrder } = params;

  // 1. Validasi Batas Ukuran Awal
  if (fileBuffer.length > MAX_FILE_SIZE_BYTES) {
    return {
      success: false,
      error: `Ukuran berkas (${(fileBuffer.length / (1024 * 1024)).toFixed(2)} MB) melebihi batas 5 MB.`,
    };
  }

  // 2. Validasi Magic Bytes
  const uint8Buffer = fileBuffer instanceof Uint8Array ? fileBuffer : new Uint8Array(fileBuffer);
  const magicCheck = validateImageMagicBytes(uint8Buffer);
  if (!magicCheck.valid) {
    return {
      success: false,
      error: magicCheck.error || "Format berkas tidak valid atau tidak didukung.",
    };
  }

  // 3. Kompresi Sisi Server dengan Sharp
  let compressedResult: CompressionResult;
  try {
    compressedResult = await compressImageWithSharp(fileBuffer, purpose);
  } catch (err) {
    return {
      success: false,
      error: `Gagal mengompresi gambar: ${err instanceof Error ? err.message : "Kesalahan internal Sharp"}`,
    };
  }

  // 4. Pemeriksaan Kuota Penyimpanan
  const quota = await checkProfileStorageQuota(profileId, compressedResult.compressedSize, client);
  if (!quota.allowed) {
    return {
      success: false,
      error: quota.error || "Penyimpanan profil telah penuh.",
    };
  }

  // 5. Susun Lokasi Penyimpanan
  const bucket = BUCKET_MAPPING[purpose];
  const fileUuid = crypto.randomUUID();
  const timestamp = Date.now();
  const storagePath = `${accountId}/${profileId}/${purpose}_${timestamp}_${fileUuid}.webp`;

  const supabase = client || (await createClient());
  const isPlaceholder = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").includes("placeholder");

  // 6. Unggah ke Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(storagePath, compressedResult.compressedBuffer, {
      contentType: "image/webp",
      upsert: true,
      cacheControl: "31536000", // 1 tahun immutable cache
    });

  if (uploadError && !isPlaceholder) {
    return {
      success: false,
      error: `Gagal menyimpan berkas ke storage: ${uploadError.message}`,
    };
  }

  // Dapatkan URL Publik
  const finalPath = uploadData?.path || storagePath;
  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(finalPath);
  const newPublicUrl = publicUrlData?.publicUrl || `/mock-storage/${bucket}/${finalPath}`;

  // 7. Hapus Berkas Lama Jika Penggantian (Avatar / Cover) & Publikasikan MediaReplaced
  if (oldPublicUrl && (purpose === "avatar" || purpose === "cover")) {
    await deleteOldMediaFile(bucket, oldPublicUrl, supabase);

    // Kirim Peristiwa Domain MediaReplaced via Outbox
    try {
      const outboxEvt = createOutboxEvent({
        eventName: "MediaReplaced",
        aggregateType: "ProfileMedia",
        aggregateId: profileId,
        data: {
          profileId,
          mediaType: purpose === "cover" ? "banner" : "avatar",
          oldFileUrl: oldPublicUrl,
          newFileUrl: newPublicUrl,
          fileSize: compressedResult.compressedSize,
        },
      });
      await publishOutboxEvent(outboxEvt, supabase);
    } catch (e) {
      logger.warn("Gagal merekam peristiwa outbox MediaReplaced", { error: e });
    }
  }

  // 8. Catat ke Tabel media_assets jika Tujuan Galeri
  if (purpose === "gallery") {
    try {
      await supabase.from("media_assets").insert({
        profile_id: profileId,
        kind: "gallery",
        path: newPublicUrl,
        caption: caption?.slice(0, 255) || "",
        sort_order: sortOrder || 0,
        width: compressedResult.width,
        height: compressedResult.height,
      });
    } catch (e) {
      logger.warn("Gagal mencatat baris media_assets galeri", { error: e });
    }
  }

  return {
    success: true,
    publicUrl: newPublicUrl,
    storagePath: finalPath,
    fileSize: compressedResult.compressedSize,
    savingsPercent: compressedResult.savingsPercent,
  };
}

// ==============================================================================
// 6. PENGHAPUSAN BERKAS LAMA & PEMBERSIH YATIM (ORPHAN CLEANER)
// ==============================================================================

/**
 * Menghapus berkas fisik lama dari bucket Supabase Storage saat diganti.
 */
export async function deleteOldMediaFile(
  bucket: string,
  fileUrlOrPath: string,
  client?: any
): Promise<boolean> {
  if (!fileUrlOrPath) return false;

  try {
    const supabase = client || (await createClient());

    // Ekstrak path relatif dalam bucket
    let relativePath = fileUrlOrPath;
    if (fileUrlOrPath.includes(`/${bucket}/`)) {
      const parts = fileUrlOrPath.split(`/${bucket}/`);
      relativePath = parts[1] ? decodeURIComponent(parts[1].split("?")[0]) : fileUrlOrPath;
    }

    const { error } = await supabase.storage.from(bucket).remove([relativePath]);
    if (error) {
      logger.warn("Gagal menghapus berkas lama dari storage", { bucket, path: relativePath, error: error.message });
      return false;
    }
    return true;
  } catch (err) {
    logger.warn("Kesalahan saat menghapus berkas lama", { error: err });
    return false;
  }
}

/**
 * Pembersih Berkas Yatim (Orphan Media Cleaner):
 * Mode laporan dahulu (dryRun = true): membandingkan berkas di Storage dengan rujukan aktif di DB.
 * Mode pembersihan (dryRun = false): menghapus berkas yatim yang tidak dirujuk oleh entitas manapun.
 */
export async function findOrphanMedia(
  dryRun: boolean = true,
  client?: any
): Promise<OrphanMediaReport> {
  const supabase = client || createAdminClient();
  const bucketsToScan = ["avatars", "gallery", "evidence"];

  // 1. Kumpulkan seluruh rujukan aktif dari Database
  const activePaths = new Set<string>();

  // A. Dari tabel profiles (avatar & cover)
  const { data: profiles } = await supabase
    .from("profiles")
    .select("avatar_url, avatar_path, cover_path");

  if (profiles) {
    for (const p of profiles) {
      if (p.avatar_url) activePaths.add(p.avatar_url);
      if (p.avatar_path) activePaths.add(p.avatar_path);
      if (p.cover_path) activePaths.add(p.cover_path);
    }
  }

  // B. Dari tabel media_assets (galeri)
  const { data: mediaAssets } = await supabase
    .from("media_assets")
    .select("path");

  if (mediaAssets) {
    for (const m of mediaAssets) {
      if (m.path) activePaths.add(m.path);
    }
  }

  // C. Dari tabel verification_requests (bukti verifikasi)
  const { data: verifs } = await supabase
    .from("verification_requests")
    .select("evidence_files");

  if (verifs) {
    for (const v of verifs) {
      if (Array.isArray(v.evidence_files)) {
        for (const item of v.evidence_files) {
          if (typeof item === "string") activePaths.add(item);
          if (typeof item === "object" && item?.path) activePaths.add(item.path);
        }
      }
    }
  }

  // 2. Pindai berkas fisik dalam storage bucket
  const orphans: Array<{ bucket: string; path: string; size?: number }> = [];
  let totalFilesScanned = 0;
  let orphanBytesTotal = 0;

  for (const bucket of bucketsToScan) {
    try {
      const { data: fileList, error } = await supabase.storage.from(bucket).list("", {
        limit: 1000,
        sortBy: { column: "created_at", order: "desc" },
      });

      if (error || !fileList) continue;

      for (const file of fileList) {
        totalFilesScanned++;
        const fileSize = file.metadata?.size || 0;
        const filePath = file.name;

        // Cek apakah file dirujuk dalam activePaths (mencocokkan substring path atau URL)
        let isReferenced = false;
        for (const ref of activePaths) {
          if (ref.includes(filePath)) {
            isReferenced = true;
            break;
          }
        }

        if (!isReferenced) {
          orphans.push({
            bucket,
            path: filePath,
            size: fileSize,
          });
          orphanBytesTotal += fileSize;
        }
      }
    } catch (e) {
      logger.warn(`Gagal memindai bucket ${bucket} saat audit yatim`, { error: e });
    }
  }

  // 3. Eksekusi Pembersihan jika bukan Dry Run
  let purgedCount = 0;
  if (!dryRun && orphans.length > 0) {
    for (const item of orphans) {
      try {
        const { error } = await supabase.storage.from(item.bucket).remove([item.path]);
        if (!error) purgedCount++;
      } catch {
        // Abaikan error individual
      }
    }
  }

  return {
    scannedBuckets: bucketsToScan,
    totalFilesScanned,
    orphanFilesCount: orphans.length,
    orphanBytesTotal,
    orphans,
    purged: !dryRun,
    purgedCount,
  };
}

// ==============================================================================
// 7. KONSUMEN PERISTIWA (EVENT CONSUMERS)
// ==============================================================================

/**
 * Konsumen Peristiwa `MediaReplaced`:
 * Menjamin pembersihan berkas lama secara idempoten.
 */
export async function handleMediaReplacedEvent(
  eventPayload: {
    profileId: string;
    mediaType: "avatar" | "banner" | "evidence";
    oldFileUrl?: string | null;
    newFileUrl: string;
  },
  client?: any
): Promise<{ success: boolean; processed: boolean }> {
  if (!eventPayload.oldFileUrl) {
    return { success: true, processed: false };
  }

  const idempotencyKey = generateDeterministicIdempotencyKey(
    "consume-media-replaced",
    eventPayload.profileId,
    eventPayload.oldFileUrl
  );

  const { result } = await withIdempotency(idempotencyKey, async () => {
    const bucket = eventPayload.mediaType === "evidence" ? "evidence" : "avatars";
    const cleaned = await deleteOldMediaFile(bucket, eventPayload.oldFileUrl!, client);
    logger.info("MediaReplaced event diproses", {
      profileId: eventPayload.profileId,
      oldFileUrl: eventPayload.oldFileUrl,
      cleaned,
    });
    return { cleaned };
  });

  return { success: true, processed: result.cleaned };
}

/**
 * Konsumen Peristiwa `ProfileDeleted`:
 * Menghapus seluruh berkas avatar, cover, galeri, dan dokumen bukti yang terkait
 * dengan profil yang dihapus secara idempoten.
 */
export async function handleProfileDeletedEvent(
  eventPayload: {
    profileId: string;
    accountId: string;
  },
  client?: any
): Promise<{ success: boolean; deletedCount: number }> {
  const idempotencyKey = generateDeterministicIdempotencyKey(
    "consume-profile-deleted-media",
    eventPayload.profileId
  );

  const { result } = await withIdempotency(idempotencyKey, async () => {
    let supabase = client;
    if (!supabase) {
      try {
        supabase = createAdminClient();
      } catch {
        supabase = createPublicServerClient();
      }
    }
    let totalDeleted = 0;

    // 1. Ambil seluruh aset galeri profil
    const { data: galleryAssets } = await supabase
      .from("media_assets")
      .select("path")
      .eq("profile_id", eventPayload.profileId);

    if (galleryAssets && galleryAssets.length > 0) {
      for (const asset of galleryAssets) {
        if (asset.path) {
          await deleteOldMediaFile("gallery", asset.path, supabase);
          totalDeleted++;
        }
      }
      // Hapus rekaman dari media_assets
      await supabase.from("media_assets").delete().eq("profile_id", eventPayload.profileId);
    }

    // 2. Hapus berkas pada prefix {accountId}/{profileId}/ di bucket avatars
    try {
      const folderPrefix = `${eventPayload.accountId}/${eventPayload.profileId}`;
      const { data: avatarFiles } = await supabase.storage.from("avatars").list(folderPrefix);
      if (avatarFiles && avatarFiles.length > 0) {
        const pathsToRemove = avatarFiles.map((f: { name: string }) => `${folderPrefix}/${f.name}`);
        await supabase.storage.from("avatars").remove(pathsToRemove);
        totalDeleted += pathsToRemove.length;
      }
    } catch {
      // Abaikan jika folder kosong
    }

    logger.info("ProfileDeleted media cleanup selesai", {
      profileId: eventPayload.profileId,
      totalDeleted,
    });

    return { totalDeleted };
  });

  return { success: true, deletedCount: result.totalDeleted };
}
