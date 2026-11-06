import { createClient } from "@/lib/supabase/server";

export const BUCKET_VERIFICATION_PROOFS = "verification-proofs";
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // Maksimal 5 MB
export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];
export const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".pdf"];

export interface UploadProofResult {
  success: boolean;
  path?: string;
  signedUrl?: string;
  error?: string;
}

/**
 * Upload berkas bukti verifikasi ke Supabase Private Storage dengan validasi keamanan ketat.
 * Berkas privat tidak dapat diakses secara publik dan memerlukan signed URL berumur pendek (15 menit).
 */
export async function uploadVerificationProof(
  file: File | Blob,
  fileName: string,
  profileId: string
): Promise<UploadProofResult> {
  // 1. Validasi Ukuran Berkas (Maksimal 5 MB)
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      success: false,
      error: "Ukuran berkas melebihi batas maksimum 5 MB.",
    };
  }

  // 2. Validasi Tipe Konten (MIME Type)
  if (file.type && !ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
    return {
      success: false,
      error: "Format berkas tidak diizinkan. Hanya menerima berkas gambar (JPG, PNG, WEBP) dan dokumen PDF.",
    };
  }

  // 3. Validasi Ekstensi Berkas (Mencegah Stored XSS / File Upload Vulnerability)
  const ext = fileName.slice(((fileName.lastIndexOf(".") - 1) >>> 0) + 1).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return {
      success: false,
      error: `Ekstensi berkas '${ext}' tidak diizinkan. Hanya berkas .jpg, .jpeg, .png, .webp, dan .pdf yang diperbolehkan.`,
    };
  }

  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();

    const isPlaceholder = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").includes("placeholder");
    if (!authData?.user?.id && !isPlaceholder) {
      return {
        success: false,
        error: "Akses ditolak: Anda harus masuk ke akun untuk mengunggah berkas.",
      };
    }

    // 4. Sanitasi Nama Berkas
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = `${profileId}/${Date.now()}_${cleanFileName}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_VERIFICATION_PROOFS)
      .upload(filePath, file, {
        cacheControl: "3600",
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (error) {
      if (isPlaceholder) {
        return {
          success: true,
          path: `mock-storage/${filePath}`,
          signedUrl: `/mock-proofs/${cleanFileName}`,
        };
      }
      return {
        success: false,
        error: error.message,
      };
    }

    // 5. Buat short-lived signed URL yang berlaku 15 menit (900 detik) sesuai PRD Bab 8.2
    const { data: signedData, error: signedError } = await supabase.storage
      .from(BUCKET_VERIFICATION_PROOFS)
      .createSignedUrl(data.path, 900);

    return {
      success: true,
      path: data.path,
      signedUrl: signedError ? undefined : signedData?.signedUrl,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan upload berkas";
    return {
      success: false,
      error: errorMsg,
    };
  }
}

/**
 * Mengambil Signed URL berumur pendek (15 menit) untuk berkas bukti privat yang sudah tersimpan.
 */
export async function getProofSignedUrl(filePath: string): Promise<string | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.storage
      .from(BUCKET_VERIFICATION_PROOFS)
      .createSignedUrl(filePath, 900); // 15 menit

    if (error) {
      console.warn("Failed to create signed URL:", error.message);
      return null;
    }

    return data?.signedUrl || null;
  } catch (err) {
    console.warn("Error getting proof signed URL:", err);
    return null;
  }
}
