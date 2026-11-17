/**
 * ESPORT SUMBAR V3: Spacing Tokens (8pt Grid System)
 */

export const spacing = {
  0: "0px",
  1: "4px",   // micro-spacing
  2: "8px",   // grid base unit
  3: "12px",
  4: "16px",  // internal card padding
  6: "24px",  // panel padding
  8: "32px",  // mobile section gap
  12: "48px",
  16: "64px",
  24: "96px",  // desktop section gap standard
  32: "128px", // desktop hero / large section gap
} as const;

export const containers = {
  max: "1280px",
  wide: "1440px",
  narrow: "768px",
  form: "480px",
} as const;
