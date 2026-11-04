/**
 * Verifikasi Magic Bytes (File Signatures) Sisi Server
 * Mencegah File Upload Vulnerabilities, Mismatched MIME, Stored XSS, dan Eksekusi Script Jahat.
 */

export type AllowedImageFormat = "jpeg" | "png" | "webp";

export interface MagicBytesValidationResult {
  valid: boolean;
  format?: AllowedImageFormat;
  mime?: string;
  error?: string;
}

/**
 * Validasi Magic Bytes dari buffer berkas gambar.
 * Memeriksa header biner aktual, bukan hanya ekstensi berkas atau header Content-Type dari klien.
 */
export function validateImageMagicBytes(buffer: Uint8Array): MagicBytesValidationResult {
  if (!buffer || buffer.length < 12) {
    return {
      valid: false,
      error: "Ukuran data berkas terlalu kecil untuk diverifikasi sebagai gambar.",
    };
  }

  // 1. JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return {
      valid: true,
      format: "jpeg",
      mime: "image/jpeg",
    };
  }

  // 2. PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return {
      valid: true,
      format: "png",
      mime: "image/png",
    };
  }

  // 3. WebP: 52 49 46 46 (RIFF) ... bytes 8-11: 57 45 42 50 (WEBP)
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return {
      valid: true,
      format: "webp",
      mime: "image/webp",
    };
  }

  // Deteksi format terlarang yang umum (Executable, PDF, Script)
  // DOS/PE Executable (.exe, .dll): MZ (4D 5A)
  if (buffer[0] === 0x4d && buffer[1] === 0x5a) {
    return {
      valid: false,
      error: "Berkas executable (.exe) dilarang keras demi keamanan sistem.",
    };
  }

  // ELF Executable (Linux/Unix): 7F 45 4C 46
  if (buffer[0] === 0x7f && buffer[1] === 0x45 && buffer[2] === 0x4c && buffer[3] === 0x46) {
    return {
      valid: false,
      error: "Berkas biner sistem dilarang.",
    };
  }

  // PDF: %PDF- (25 50 44 46)
  if (buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46) {
    return {
      valid: false,
      error: "Berkas PDF tidak diperbolehkan untuk foto/logo profil.",
    };
  }

  return {
    valid: false,
    error: "Format berkas tidak valid atau tidak didukung. Harap unggah berkas gambar asli (JPG, PNG, atau WebP).",
  };
}
