/**
 * Mesin Validasi Otomatis Portofolio Prestasi & Berkas Bukti (Validator V3)
 * Menilai kelengkapan berkas bukti, validitas URL/berkas, dan kepatuhan
 * terhadap standar verifikasi per entitas tanpa meminta data identitas sensitif (KTP/NIK/KK).
 */

import { AchievementValidationResult, VerificationSubmission } from "./types";

/**
 * Memvalidasi berkas bukti dan portofolio prestasi verifikasi
 */
export function validateVerificationEvidence(
  submission: VerificationSubmission
): AchievementValidationResult {
  const errors: string[] = [];
  const feedback: string[] = [];
  let score = 0;

  // 1. Verifikasi Keberadaan Berkas Bukti
  if (!submission.evidenceFiles || submission.evidenceFiles.length === 0) {
    errors.push("Minimal 1 berkas bukti verifikasi wajib diunggah.");
    return {
      isValid: false,
      completenessScore: 0,
      feedback: ["Unggah berkas bukti pendukung untuk memulai proses telaah."],
      errors,
    };
  }

  // Bobot dasar: berkas terunggah (+40 poin)
  score += 40;

  // 2. Validasi Struktur & URL Berkas
  const validFiles = submission.evidenceFiles.filter((file) => {
    return file.url && (file.url.startsWith("http://") || file.url.startsWith("https://") || file.url.startsWith("/"));
  });

  if (validFiles.length < submission.evidenceFiles.length) {
    errors.push("Satu atau lebih berkas bukti memiliki tautan/URL yang tidak valid.");
  } else {
    score += 20;
  }

  // 3. Evaluasi Khusus per Jenis Entitas
  switch (submission.entityType) {
    case "player":
      if (submission.evidenceFiles.length >= 2) {
        score += 20;
        feedback.push("Bukti profil in-game dan tangkapan layar akun lengkap.");
      } else {
        feedback.push("Saran: Tambahkan tangkapan layar rank tertinggi atau riwayat turnamen untuk mempercepat telaah.");
      }
      break;

    case "coach":
      if (submission.evidenceFiles.some((f) => f.name.toLowerCase().includes("sertifikat") || f.name.toLowerCase().includes("portofolio"))) {
        score += 20;
        feedback.push("Portofolio kepelatihan atau sertifikasi terlampir.");
      } else {
        feedback.push("Saran: Sertakan riwayat pembinaan tim atau sertifikat kepelatihan pendukung.");
      }
      break;

    case "team":
      if (submission.evidenceFiles.length >= 2) {
        score += 20;
        feedback.push("Berkas struktur tim dan identitas skuad lengkap.");
      } else {
        feedback.push("Saran: Unggah susunan roster dan logo resmi beresolusi tinggi.");
      }
      break;

    case "community":
      if (submission.notes && submission.notes.length >= 20) {
        score += 20;
        feedback.push("Deskripsi basis anggota dan profil komunitas memadai.");
      } else {
        feedback.push("Saran: Berikan deskripsi aktivitas rutin dan jumlah anggota aktif komunitas.");
      }
      break;

    case "venue":
      if (submission.evidenceFiles.some((f) => f.name.toLowerCase().includes("lokasi") || f.name.toLowerCase().includes("fasilitas"))) {
        score += 20;
        feedback.push("Dokumentasi fasilitas arena dan lokasi fisik terlampir.");
      } else {
        feedback.push("Saran: Unggah foto tampak depan/plang arena serta perangkat PC/konsol.");
      }
      break;

    case "school":
    case "campus":
      score += 20;
      feedback.push("Dokumentasi kegiatan unit ekstrakurikuler/komunitas kampus terlampir.");
      break;

    default:
      score += 10;
      break;
  }

  // 4. Portofolio Prestasi Turnamen (Bonus +20 poin)
  if (submission.achievements && submission.achievements.length > 0) {
    const validAchievements = submission.achievements.filter((a) => a.title && a.year && a.rankOrPlacement);
    if (validAchievements.length > 0) {
      score += 20;
      feedback.push(`Tercatat ${validAchievements.length} riwayat prestasi/turnamen.`);
    }
  }

  // 5. Catatan Pemohon (+10 poin jika informatif)
  if (submission.notes && submission.notes.trim().length >= 10) {
    score = Math.min(100, score + 10);
  }

  const finalScore = Math.min(100, Math.max(0, score));
  const isValid = errors.length === 0 && finalScore >= 50;

  return {
    isValid,
    completenessScore: finalScore,
    feedback,
    errors,
  };
}
