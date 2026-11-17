/**
 * ESPORT SUMBAR V3: Official Typography Design Tokens
 * Pasangan terpilih: Plus Jakarta Sans (UI) + Barlow Condensed (Display/Numbers).
 * Bebas lisensi (SIL OFL) dan teruji optimal pada teks Bahasa Indonesia.
 */

export const typography = {
  fonts: {
    sans: "var(--font-sans), 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
    display: "var(--font-display), 'Barlow Condensed', sans-serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },

  scale: {
    // Label & teks mikro minimal (Batas bawah sistem, tidak ada teks < 12px)
    xs: {
      fontSize: "12px",
      lineHeight: "16px", // 1.33
      letterSpacing: "0px",
    },
    // Teks isi utama (Body Regular)
    sm: {
      fontSize: "14px",
      lineHeight: "20px", // 1.43
      letterSpacing: "0px",
    },
    // Teks lead / body large
    base: {
      fontSize: "16px",
      lineHeight: "24px", // 1.5
      letterSpacing: "0px",
    },
    // Sub-judul / Title Medium
    lg: {
      fontSize: "18px",
      lineHeight: "26px", // 1.44
      letterSpacing: "-0.01em",
    },
    // Judul Bagian / Title Large
    xl: {
      fontSize: "20px",
      lineHeight: "28px", // 1.4
      letterSpacing: "-0.01em",
    },
    // Judul Halaman / Headline
    "2xl": {
      fontSize: "24px",
      lineHeight: "32px", // 1.33
      letterSpacing: "-0.02em",
    },
    // Display Title
    "3xl": {
      fontSize: "30px",
      lineHeight: "36px", // 1.2
      letterSpacing: "-0.02em",
    },
    // Display Large / Hero Title
    "4xl": {
      fontSize: "36px",
      lineHeight: "42px", // 1.17
      letterSpacing: "-0.03em",
    },
    // Display Heroic IGN
    "5xl": {
      fontSize: "48px",
      lineHeight: "52px", // 1.08
      letterSpacing: "-0.03em",
    },
  },

  weights: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
    black: "900",
  },
} as const;

export type TypographyTokens = typeof typography;
