"use server";

import { createClient } from "@/lib/supabase/server";
import { validateImageMagicBytes } from "@/lib/security/magic-bytes";
import { revalidatePath } from "next/cache";

const MAX_AVATAR_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB
const MAX_GALLERY_SIZE_BYTES = 3 * 1024 * 1024; // 3 MB
const MAX_GALLERY_PHOTOS_PER_PROFILE = 8;

export interface UploadAvatarResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

export interface GalleryPhotoItem {
  id: string;
  url: string;
  caption?: string;
  sortOrder: number;
}

export interface UploadGalleryResult {
  success: boolean;
  photo?: GalleryPhotoItem;
  error?: string;
}

/**
 * Server Action: Unggah Avatar / Logo / Cover ke Bucket 'avatars'
 * Memenuhi Spesifikasi Prompt 5:
 * - Autentikasi sesi nyata
 * - Validasi tipe berkas biner (magic bytes)
 * - Batas ukuran 2 MB
 * - Path: {account_id}/{profile_id}/avatar.webp atau cover.webp
 * - Pembaruan profil seketika jika profile_id disediakan
 */
export async function uploadAvatarAction(formData: FormData): Promise<UploadAvatarResult> {
  try {
    const file = formData.get("file") as File | null;
    const kind = (formData.get("kind") as string) || "avatar"; // 'avatar' | 'cover'
    const profileId = (formData.get("profileId") as string) || "draft";

    if (!file) {
      return { success: false, error: "Tidak ada berkas yang dikirim." };
    }

    // 1. Validasi Batas Ukuran Sisi Server (2 MB)
    if (file.size > MAX_AVATAR_SIZE_BYTES) {
      return {
        success: false,
        error: `Ukuran berkas (${(file.size / (1024 * 1024)).toFixed(2)} MB) melebihi batas 2 MB.`,
      };
    }

    // 2. Baca Buffer & Validasi Magic Bytes
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const magicCheck = validateImageMagicBytes(buffer);

    if (!magicCheck.valid) {
      return {
        success: false,
        error: magicCheck.error || "Berkas yang diunggah bukan format gambar yang diizinkan (JPG, PNG, WebP).",
      };
    }

    // 3. Verifikasi Autentikasi
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();

    let accountId = authData?.user?.id;
    const isPlaceholder = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").includes("placeholder");

    if (!accountId) {
      if (isPlaceholder) {
        accountId = "00000000-0000-0000-0000-000000000001";
      } else {
        return {
          success: false,
          error: "Akses ditolak: Anda harus masuk ke akun Anda untuk mengunggah foto.",
        };
      }
    }

    // 4. Susun Path Penyimpanan: {account_id}/{profile_id}/avatar.webp atau cover.webp
    const fileName = kind === "cover" ? "cover.webp" : "avatar.webp";
    const storagePath = `${accountId}/${profileId}/${fileName}`;

    // 5. Unggah ke Supabase Storage (Bucket 'avatars')
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(storagePath, buffer, {
        contentType: "image/webp",
        upsert: true,
        cacheControl: "3600",
      });

    if (uploadError) {
      if (isPlaceholder) {
        // Fallback untuk mode pengembangan lokal tanpa kredensial aktif
        const mockUrl = `/mock-avatars/${fileName}?t=${Date.now()}`;
        return {
          success: true,
          url: mockUrl,
          path: storagePath,
        };
      }
      return { success: false, error: uploadError.message };
    }

    // 6. Dapatkan URL Publik
    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(uploadData.path);

    const publicUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`;

    // 7. Jika profileId valid (bukan draf sementara), perbarui tabel profiles
    if (profileId && profileId !== "draft") {
      const updateField =
        kind === "cover"
          ? { cover_path: uploadData.path }
          : { avatar_url: publicUrl, avatar_path: uploadData.path };

      await supabase
        .from("profiles")
        .update({
          ...updateField,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profileId)
        .eq("account_id", accountId);

      revalidatePath(`/profile/${profileId}`);
      revalidatePath("/me/cards");
    }

    return {
      success: true,
      url: publicUrl,
      path: uploadData.path,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan saat mengunggah foto.";
    return { success: false, error: errorMsg };
  }
}

/**
 * Server Action: Unggah Foto ke Galeri (Maksimal 8 Foto untuk Venue & Komunitas)
 */
export async function uploadGalleryPhotoAction(formData: FormData): Promise<UploadGalleryResult> {
  try {
    const file = formData.get("file") as File | null;
    const profileId = formData.get("profileId") as string;
    const caption = (formData.get("caption") as string) || "";
    const sortOrder = parseInt((formData.get("sortOrder") as string) || "0", 10);

    if (!file || !profileId) {
      return { success: false, error: "Berkas dan ID profil wajib disertakan." };
    }

    // 1. Validasi Batas Ukuran (3 MB)
    if (file.size > MAX_GALLERY_SIZE_BYTES) {
      return {
        success: false,
        error: `Ukuran foto galeri (${(file.size / (1024 * 1024)).toFixed(2)} MB) melebihi batas 3 MB.`,
      };
    }

    // 2. Validasi Magic Bytes
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const magicCheck = validateImageMagicBytes(buffer);

    if (!magicCheck.valid) {
      return {
        success: false,
        error: magicCheck.error || "Format berkas tidak diizinkan.",
      };
    }

    // 3. Verifikasi Autentikasi & Kepemilikan Profil
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();

    let accountId = authData?.user?.id;
    const isPlaceholder = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").includes("placeholder");

    if (!accountId) {
      if (isPlaceholder) {
        accountId = "00000000-0000-0000-0000-000000000001";
      } else {
        return { success: false, error: "Akses ditolak: Anda harus masuk ke akun Anda." };
      }
    }

    // Periksa kepemilikan profil
    const { data: profileRecord } = await supabase
      .from("profiles")
      .select("id, account_id")
      .eq("id", profileId)
      .single();

    if (profileRecord && profileRecord.account_id !== accountId && !isPlaceholder) {
      return { success: false, error: "Akses ditolak: Anda bukan pemilik profil ini." };
    }

    // 4. Periksa Batas Maksimal 8 Foto di Galeri
    const { count: currentCount } = await supabase
      .from("media_assets")
      .select("id", { count: "exact", head: true })
      .eq("profile_id", profileId)
      .eq("kind", "gallery");

    if ((currentCount || 0) >= MAX_GALLERY_PHOTOS_PER_PROFILE) {
      return {
        success: false,
        error: `Batas galeri sudah penuh (maksimal ${MAX_GALLERY_PHOTOS_PER_PROFILE} foto). Hapus foto lama untuk menambah baru.`,
      };
    }

    // 5. Unggah ke Bucket 'gallery'
    const photoUuid = crypto.randomUUID();
    const storagePath = `${accountId}/${profileId}/${photoUuid}.webp`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("gallery")
      .upload(storagePath, buffer, {
        contentType: "image/webp",
        upsert: false,
      });

    if (uploadError) {
      if (!isPlaceholder) {
        return { success: false, error: uploadError.message };
      }
    }

    const { data: publicUrlData } = supabase.storage
      .from("gallery")
      .getPublicUrl(uploadData?.path || storagePath);

    const publicUrl = publicUrlData.publicUrl;

    // 6. Simpan Metadata ke Tabel media_assets
    const { data: assetRecord, error: dbError } = await supabase
      .from("media_assets")
      .insert({
        profile_id: profileId,
        kind: "gallery",
        path: publicUrl,
        caption: caption.slice(0, 255),
        sort_order: sortOrder,
      })
      .select("id, path, caption, sort_order")
      .single();

    if (dbError && !isPlaceholder) {
      return { success: false, error: dbError.message };
    }

    revalidatePath(`/profile/${profileId}`);

    return {
      success: true,
      photo: {
        id: assetRecord?.id || photoUuid,
        url: publicUrl,
        caption,
        sortOrder,
      },
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Gagal mengunggah foto ke galeri.";
    return { success: false, error: errorMsg };
  }
}

/**
 * Server Action: Hapus Foto dari Galeri
 */
export async function deleteGalleryPhotoAction(photoId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();

    if (!authData?.user?.id) {
      return { success: false, error: "Akses ditolak: Anda harus masuk ke akun Anda." };
    }

    // Ambil data asset untuk mengecek kepemilikan via profile
    const { data: assetRecord } = await supabase
      .from("media_assets")
      .select("id, path, profile_id, profiles!inner(account_id)")
      .eq("id", photoId)
      .single();

    if (!assetRecord) {
      return { success: false, error: "Foto tidak ditemukan." };
    }

    const profileOwner = (assetRecord as any).profiles?.account_id;
    if (profileOwner && profileOwner !== authData.user.id) {
      return { success: false, error: "Akses ditolak: Anda tidak memiliki wewenang untuk menghapus foto ini." };
    }

    // Hapus dari tabel media_assets
    await supabase.from("media_assets").delete().eq("id", photoId);

    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Gagal menghapus foto galeri.";
    return { success: false, error: errorMsg };
  }
}
