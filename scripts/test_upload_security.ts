import { validateImageMagicBytes } from "../src/lib/security/magic-bytes";
import { validateRawImageFile } from "../src/lib/media/client-image";

async function runUploadSecurityTests() {
  console.log("=================================================");
  console.log("ESPORT SUMBAR V2 - PENGUJIAN KEAMANAN UNGGAH FOTO");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  // Uji 1: Header JPEG Asli (FF D8 FF)
  const jpegHeader = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01]);
  const resJpeg = validateImageMagicBytes(jpegHeader);
  if (resJpeg.valid && resJpeg.format === "jpeg") {
    console.log("✅ Uji 1 Lulus: Header biner JPEG dikenali dengan benar.");
    passed++;
  } else {
    console.error("❌ Uji 1 Gagal:", resJpeg);
    failed++;
  }

  // Uji 2: Header PNG Asli (89 50 4E 47 0D 0A 1A 0A)
  const pngHeader = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d]);
  const resPng = validateImageMagicBytes(pngHeader);
  if (resPng.valid && resPng.format === "png") {
    console.log("✅ Uji 2 Lulus: Header biner PNG dikenali dengan benar.");
    passed++;
  } else {
    console.error("❌ Uji 2 Gagal:", resPng);
    failed++;
  }

  // Uji 3: Header WebP Asli (RIFF....WEBP)
  const webpHeader = new Uint8Array([
    0x52, 0x49, 0x46, 0x46, // RIFF
    0x24, 0x00, 0x00, 0x00, // file size
    0x57, 0x45, 0x42, 0x50, // WEBP
  ]);
  const resWebp = validateImageMagicBytes(webpHeader);
  if (resWebp.valid && resWebp.format === "webp") {
    console.log("✅ Uji 3 Lulus: Header biner WebP dikenali dengan benar.");
    passed++;
  } else {
    console.error("❌ Uji 3 Gagal:", resWebp);
    failed++;
  }

  // Uji 4: Penolakan Berkas Executable (.exe / DOS MZ 4D 5A)
  const exeHeader = new Uint8Array([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00]);
  const resExe = validateImageMagicBytes(exeHeader);
  if (!resExe.valid && resExe.error?.includes("executable")) {
    console.log("✅ Uji 4 Lulus: Berkas executable (.exe) berhasil ditolak:", resExe.error);
    passed++;
  } else {
    console.error("❌ Uji 4 Gagal (seharusnya ditolak):", resExe);
    failed++;
  }

  // Uji 5: Penolakan Berkas PDF Disamarkan Menjadi Gambar
  const pdfHeader = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x35, 0x0a, 0x25, 0xd0, 0xd4]);
  const resPdf = validateImageMagicBytes(pdfHeader);
  if (!resPdf.valid && resPdf.error?.includes("PDF")) {
    console.log("✅ Uji 5 Lulus: Berkas PDF berhasil ditolak untuk foto kartu:", resPdf.error);
    passed++;
  } else {
    console.error("❌ Uji 5 Gagal:", resPdf);
    failed++;
  }

  // Uji 6: Validasi Batas Ukuran Klien (> 8 MB)
  const mockFileOver8Mb = {
    name: "photo_huge.jpg",
    size: 20 * 1024 * 1024, // 20 MB
    type: "image/jpeg",
  } as File;
  const resOverSize = validateRawImageFile(mockFileOver8Mb);
  if (!resOverSize.ok && resOverSize.error?.includes("8 MB")) {
    console.log("✅ Uji 6 Lulus: Berkas 20 MB berhasil ditolak di sisi klien:", resOverSize.error);
    passed++;
  } else {
    console.error("❌ Uji 6 Gagal:", resOverSize);
    failed++;
  }

  // Uji 7: Validasi Ekstensi Tidak Didukung (.sh, .php)
  const mockScriptFile = {
    name: "exploit.sh",
    size: 1024,
    type: "application/x-sh",
  } as File;
  const resScript = validateRawImageFile(mockScriptFile);
  if (!resScript.ok && resScript.error?.includes("tidak didukung")) {
    console.log("✅ Uji 7 Lulus: Berkas skrip (.sh) berhasil ditolak:", resScript.error);
    passed++;
  } else {
    console.error("❌ Uji 7 Gagal:", resScript);
    failed++;
  }

  console.log(`\nHasil: ${passed}/7 pengujian lulus.`);
  if (failed === 0) {
    console.log("🎉 SEMUA UJI KEAMANAN UNGGAH FOTO PROMPT 5 BERHASIL LULUS 100%!");
  } else {
    process.exit(1);
  }
}

runUploadSecurityTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
