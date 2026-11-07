/**
 * ESPORT SUMBAR V3: Liquid Glass 2026 Motion Tokens & Presets
 * Mengatur durasi, pegas (spring), dan kurva transisi standar platform.
 */

export const MOTION_DURATIONS = {
  instant: 0.1,    // 100ms: micro-interactions, click feedback
  fast: 0.18,      // 180ms: hover, focus, tab indicators
  base: 0.28,      // 280ms: dialogs, drawers, morph overlays
  slow: 0.45,      // 450ms: page transitions, card flips
  cinematic: 0.7,  // 700ms: hero intro sequences
} as const;

export const MOTION_SPRINGS = {
  // Snappy: cepat, kekakuan tinggi, redaman sedang (tombol, switch, tabs)
  snappy: {
    type: "spring" as const,
    stiffness: 400,
    damping: 30,
    mass: 0.8,
  },
  // Fluid: halus, elastis terkontrol (morph overlay, sheet, dialog)
  fluid: {
    type: "spring" as const,
    stiffness: 280,
    damping: 24,
    mass: 1,
  },
  // Gentle: lembut, pergerakan ambient (floating cards, hero items)
  gentle: {
    type: "spring" as const,
    stiffness: 140,
    damping: 18,
    mass: 1.2,
  },
} as const;

export const MOTION_EASINGS = {
  standardIn: [0.4, 0, 1, 1] as const,
  standardOut: [0.22, 1, 0.36, 1] as const,
  gentleEase: [0.25, 0.1, 0.25, 1] as const,
} as const;

export const GLASS_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: MOTION_DURATIONS.fast },
  },
  slideUp: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 12 },
    transition: MOTION_SPRINGS.snappy,
  },
  scalePop: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.96 },
    transition: MOTION_SPRINGS.fluid,
  },
} as const;
