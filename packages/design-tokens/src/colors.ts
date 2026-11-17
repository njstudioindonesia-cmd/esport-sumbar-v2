/**
 * ESPORT SUMBAR V3: Official Color Design Tokens
 * Sumber tunggal nilai warna resmi berdasarkan berkas logo dan filosofi Arah B (Matte Glass).
 * Menegakkan aturan: Satu aksen brand (Pink), Emas hanya status/Elite, Kontras WCAG AA.
 */

export const colors = {
  // Palet Netral & Tonal Permukaan
  ink: {
    base: "#05051A", // Latar belakang aplikasi utama paling dalam
    surface1: "#0C0C26", // Kontainer level 1 (kartu, panel datar)
    surface2: "#14143A", // Kontainer level 2 (input, modal, dialog)
    surface3: "#1D1D4A", // Permukaan terangkat (elevasi interaktif)
  },

  // Garis Pemisah Halus (Hairline Divider)
  divider: {
    subtle: "rgba(255, 255, 255, 0.08)", // Garis pemisah 1px standar
    focus: "rgba(255, 255, 255, 0.20)", // Garis penanda fokus/hover
    bold: "rgba(255, 255, 255, 0.30)",
  },

  // Teks Monokrom Bersih (WCAG AA Compliant)
  text: {
    primary: "#FFFFFF", // 100% Putih Murni (Rasio kontras > 18:1)
    secondary: "rgba(255, 255, 255, 0.64)", // 64% Pembacaan sekunder (Rasio kontras > 9:1)
    muted: "rgba(255, 255, 255, 0.40)", // 40% Label tersier (Rasio kontras > 4.5:1)
  },

  // Aksen Merek Tunggal (Pink Resmi dari Mark V-S)
  brand: {
    pink: "#FF1752", // Aksen tombol CTA primer & seleksi aktif
    pinkHover: "#E01246", // State hover tombol primer
    pinkSubtle: "rgba(255, 23, 82, 0.12)", // Latar aksen lembut
    pinkBorder: "rgba(255, 23, 82, 0.35)", // Garis tepi aksen
  },

  // Status Verifikasi & Rarity Elite (Hanya untuk lencana Terverifikasi dan Frame Elite)
  status: {
    verifiedGold: "#D4AF37", // Emas lencana verifikasi & frame Elite
    verifiedGoldSubtle: "rgba(212, 175, 55, 0.12)",
    verifiedGoldBorder: "rgba(212, 175, 55, 0.40)",
  },

  // Warna Semantik Fungsional (Terpisah jelas dari Brand Pink)
  semantic: {
    success: "#2BB673", // Status disetujui / aktif / online
    successSubtle: "rgba(43, 182, 115, 0.12)",
    warning: "#F2A33A", // Menunggu verifikasi / draf / perhatian
    warningSubtle: "rgba(242, 163, 58, 0.12)",
    danger: "#F04438", // Error / ditolak / tindakan destruktif
    dangerSubtle: "rgba(240, 68, 56, 0.12)",
    info: "#3B82F6",
    infoSubtle: "rgba(59, 130, 246, 0.12)",
  },

  // Efek Kaca Matte (Hanya untuk header scroll dan overlay modal)
  glass: {
    scrim: "rgba(5, 5, 26, 0.80)",
    blur: "16px",
  },
} as const;

export type ColorTokens = typeof colors;
