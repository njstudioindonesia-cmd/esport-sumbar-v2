/**
 * Utilitas Pengolahan Gambar Sisi Klien (Client-Side Image Processing)
 * Sesuai Spesifikasi Prompt 5 Go-Live:
 * - Batas input berkas 8 MB
 * - Format: JPG, PNG, WebP, HEIC
 * - Crop rasio interaktif sesuai bidang (4:5, 1:1, 16:9)
 * - Skala & geser (zoom & pan)
 * - Resize maksimal 1200px pada sisi terpanjang
 * - Kompresi ke WebP kualitas ~82%
 * - Penghapusan metadata EXIF & GPS otomatis via Canvas
 * - Ukuran output akhir <= 2 MB
 */

export const MAX_INPUT_FILE_SIZE_BYTES = 8 * 1024 * 1024; // 8 MB
export const MAX_OUTPUT_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB
export const MAX_IMAGE_DIMENSION_PX = 1200; // 1200px longest edge

export type AspectRatioType = "avatar" | "logo" | "cover";

export interface CropArea {
  x: number; // offset X in pixels relative to natural image
  y: number; // offset Y in pixels relative to natural image
  width: number; // crop width
  height: number; // crop height
  zoom: number; // zoom multiplier (1.0 - 3.0)
}

export function getAspectRatioValue(type: AspectRatioType): number {
  switch (type) {
    case "avatar":
      return 4 / 5; // Player & Coach (0.8)
    case "logo":
      return 1 / 1; // Team, Community, Campus, School (1.0)
    case "cover":
      return 16 / 9; // Venue Cover (1.777)
    default:
      return 1;
  }
}

/**
 * Validasi awal berkas mentah sebelum diproses
 */
export function validateRawImageFile(file: File): { ok: boolean; error?: string } {
  if (!file) {
    return { ok: false, error: "Tidak ada berkas yang dipilih." };
  }

  if (file.size > MAX_INPUT_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      ok: false,
      error: `Ukuran berkas (${sizeMb} MB) melebihi batas maksimum 8 MB. Harap pilih foto lain.`,
    };
  }

  const validTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/heic",
    "image/heif",
  ];

  const ext = file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 1).toLowerCase();
  const validExts = ["jpg", "jpeg", "png", "webp", "heic", "heif"];

  const typeMatched = file.type ? validTypes.includes(file.type.toLowerCase()) : false;
  const extMatched = validExts.includes(ext);

  if (!typeMatched && !extMatched) {
    return {
      ok: false,
      error: "Format berkas tidak didukung. Harap pilih foto dengan format JPG, PNG, atau WebP.",
    };
  }

  return { ok: true };
}

/**
 * Membaca File gambar menjadi HTMLImageElement
 */
export function loadFileAsImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Gagal memuat gambar. Berkas mungkin rusak atau format tidak didukung browser ini."));
    };

    img.src = objectUrl;
  });
}

/**
 * Memotong, mengubah ukuran, menghapus EXIF, dan mengonversi ke WebP
 */
export async function cropAndCompressToWebP(
  img: HTMLImageElement,
  cropArea: {
    sourceX: number;
    sourceY: number;
    sourceWidth: number;
    sourceHeight: number;
  },
  aspectRatio: number,
  quality = 0.82
): Promise<{ blob: Blob; dataUrl: string; width: number; height: number }> {
  // Hitung dimensi target dengan batas maksimal 1200px sisi panjang
  let targetWidth: number;
  let targetHeight: number;

  if (aspectRatio >= 1) {
    // Landscape atau Square (mis. 16:9 atau 1:1)
    targetWidth = Math.min(MAX_IMAGE_DIMENSION_PX, cropArea.sourceWidth);
    targetHeight = Math.round(targetWidth / aspectRatio);
  } else {
    // Portrait (mis. 4:5)
    targetHeight = Math.min(MAX_IMAGE_DIMENSION_PX, cropArea.sourceHeight);
    targetWidth = Math.round(targetHeight * aspectRatio);
  }

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext("2d", { willReadFrequently: false });
  if (!ctx) {
    throw new Error("Gagal menginisialisasi konteks grafis Canvas.");
  }

  // Gunakan imageSmoothing berkualitas tinggi untuk resize bersih
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Gambar area potong ke canvas (Menghapus seluruh metadata EXIF / GPS otomatis)
  ctx.drawImage(
    img,
    cropArea.sourceX,
    cropArea.sourceY,
    cropArea.sourceWidth,
    cropArea.sourceHeight,
    0,
    0,
    targetWidth,
    targetHeight
  );

  // Konversi ke Blob WebP
  let blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/webp", quality);
  });

  // Fallback jika browser lawas tidak mendukung export webp
  if (!blob) {
    blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", quality);
    });
  }

  if (!blob) {
    throw new Error("Gagal mengonversi gambar ke WebP.");
  }

  // Jika hasil masih > 2 MB, kompresi ulang dengan kualitas 0.70
  if (blob.size > MAX_OUTPUT_FILE_SIZE_BYTES) {
    blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/webp", 0.7);
    });
  }

  if (!blob || blob.size > MAX_OUTPUT_FILE_SIZE_BYTES) {
    throw new Error("Hasil kompresi gambar melebihi batas 2 MB. Harap pilih gambar dengan resolusi lebih wajar.");
  }

  const dataUrl = canvas.toDataURL("image/webp", quality);

  return {
    blob,
    dataUrl,
    width: targetWidth,
    height: targetHeight,
  };
}
