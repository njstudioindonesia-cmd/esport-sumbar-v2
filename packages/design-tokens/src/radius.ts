/**
 * ESPORT SUMBAR V3: Border Radius Tokens
 * Konsisten di seluruh modul:
 * - sm (8px): Tombol, Input, Kontrol interaktif
 * - md (16px): Kartu UI, Container standar
 * - lg (24px): Panel besar, Modal, Dialog
 * - full (9999px): Avatar, StatusBadge pil
 */

export const radius = {
  none: "0px",
  sm: "8px",     // controls, inputs, buttons
  md: "16px",    // UI cards, containers
  lg: "24px",    // modals, drawers, major panels
  card: "20px",  // physical digital cards
  full: "9999px",// pills, avatars, circular badges
} as const;
