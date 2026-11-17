/**
 * ESPORT SUMBAR V3: Elevation & Shadow Tokens
 * Menghilangkan efek glow neon murahan, menggantikan dengan elevasi tonal bertingkat.
 */

export const elevation = {
  // Tonal Background Layers
  tonal: {
    ground: "#05051A",
    surface1: "#0C0C26",
    surface2: "#14143A",
    surface3: "#1D1D4A",
  },

  // Soft Natural Shadows (No glowing neon)
  shadows: {
    none: "none",
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.4)",
    md: "0 4px 12px 0 rgba(0, 0, 0, 0.5)",
    lg: "0 8px 24px -4px rgba(0, 0, 0, 0.6)",
    card: "0 12px 32px -6px rgba(0, 0, 0, 0.7)",
  },

  // Matte Glass (Strictly for scroll header and popover modals)
  glass: {
    nav: "backdrop-blur-md bg-[#05051A]/80 border-b border-white/[0.08]",
    modal: "backdrop-blur-lg bg-[#05051A]/85 border border-white/[0.12]",
  },
} as const;
