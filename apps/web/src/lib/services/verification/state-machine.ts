/**
 * Mesin Status Verifikasi Mandiri ESPORT SUMBAR (State Machine V3)
 * Menegakkan transisi satu tahap langsung oleh ESPORT SUMBAR (ADR-001, ADR-002),
 * aturan pemisahan kepentingan (Separation of Duties), alasan wajib, dan
 * penerbitan nomor lencana registrasi standar ESP-SB-VER-YYYY-XXXX.
 */

import { VerificationState } from "./types";

/**
 * Matriks Transisi Status yang Sah
 */
export const VALID_VERIFICATION_TRANSITIONS: Record<VerificationState, VerificationState[]> = {
  unverified: ["submitted"],
  submitted: ["under_review", "verified", "revision_requested", "rejected"],
  under_review: ["verified", "revision_requested", "rejected"],
  revision_requested: ["submitted"],
  verified: ["suspended", "expired"],
  suspended: ["under_review", "verified"],
  rejected: ["submitted"],
  expired: ["submitted"],
};

/**
 * Memeriksa apakah transisi dari status lama ke status baru sah menurut aturan V3
 */
export function canTransitionVerification(
  from: VerificationState,
  to: VerificationState
): boolean {
  if (from === to) return true;
  const allowed = VALID_VERIFICATION_TRANSITIONS[from];
  return Boolean(allowed && allowed.includes(to));
}

export interface TransitionValidationParams {
  currentStatus: VerificationState;
  newStatus: VerificationState;
  profileAccountId: string;
  reviewerAccountId: string;
  reason?: string | null;
  reviewerRole?: string;
}

/**
 * Menvalidasi aturan transisi verifikasi secara ketat
 * Melempar Error jika aturan bisnis atau tata kelola integritas dilanggar
 */
export function validateVerificationTransition(params: TransitionValidationParams): void {
  const { currentStatus, newStatus, profileAccountId, reviewerAccountId, reason, reviewerRole } = params;

  // 1. Validasi peran penelaah
  if (reviewerRole && reviewerRole !== "platform_admin") {
    throw new Error("Akses ditolak: Hanya platform_admin ESPORT SUMBAR yang berwenang menelaah verifikasi.");
  }

  // 2. Pemisahan Kepentingan (Separation of Duties)
  // Administrator DILARANG menelaah atau memverifikasi akun/profil miliknya sendiri
  if (profileAccountId && reviewerAccountId && profileAccountId === reviewerAccountId) {
    throw new Error(
      "Pelanggaran integritas: Administrator dilarang menelaah atau memverifikasi akun/profil miliknya sendiri."
    );
  }

  // 3. Validasi transisi status
  if (!canTransitionVerification(currentStatus, newStatus)) {
    throw new Error(
      `Transisi status tidak sah: Tidak dapat mengubah status dari "${currentStatus}" menjadi "${newStatus}".`
    );
  }

  // 4. Alasan Wajib untuk Penolakan, Revisi, atau Penangguhan
  if (["rejected", "revision_requested", "suspended"].includes(newStatus)) {
    if (!reason || reason.trim().length < 5) {
      throw new Error(
        "Alasan keputusan telaah wajib disertakan minimal 5 karakter untuk penolakan, permintaan revisi, atau penangguhan."
      );
    }
  }
}

/**
 * Menghasilkan Nomor Registrasi Verifikasi Tunggal Resmi ESPORT SUMBAR
 * Pola Standar: ESP-SB-VER-YYYY-XXXX (contoh: ESP-SB-VER-2026-4821)
 */
export function generateVerificationBadgeNo(
  existingBadgeNo?: string | null,
  customCode?: string
): string {
  // Jika sudah memiliki nomor registrasi standar V3, pertahankan untuk integritas sejarah
  if (existingBadgeNo && /^ESP-SB-VER-\d{4}-\d{4}$/.test(existingBadgeNo)) {
    return existingBadgeNo;
  }

  const currentYear = new Date().getFullYear();
  let code = customCode;

  if (!code || !/^\d{4}$/.test(code)) {
    // Generate 4-digit acak antara 1000 s/d 9999
    code = Math.floor(1000 + Math.random() * 9000).toString();
  }

  return `ESP-SB-VER-${currentYear}-${code}`;
}
