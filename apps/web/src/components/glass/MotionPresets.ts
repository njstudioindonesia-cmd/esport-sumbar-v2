/**
 * ESPORT SUMBAR V3: Liquid Glass 2026 Motion Tokens & Presets
 * Mengatur durasi, pegas (spring), stagger, dan kurva transisi standar platform.
 * Sesuai Bagian 3.5 & 10.1–10.4:
 * - Durasi: instan 100ms, cepat 180ms, dasar 280ms, lambat 450ms, sinematik 700ms
 * - Spring: snappy, fluid, gentle
 * - Stagger: 30-50ms
 * - Easing: standardIn [0.4, 0, 1, 1], standardOut [0.22, 1, 0.36, 1]
 * - GPU Compositing: Hanya transform dan opacity
 */

export const MOTION_DURATIONS = {
  instant: 0.1,    // 100ms: micro-interactions, click feedback
  fast: 0.18,      // 180ms: hover, focus, tab indicators
  base: 0.28,      // 280ms: dialogs, drawers, morph overlays
  slow: 0.45,      // 450ms: page transitions, card flips
  cinematic: 0.7,  // 700ms: hero intro sequences
} as const;

export const MOTION_STAGGER = {
  fast: 0.03, // 30ms
  base: 0.04, // 40ms
  slow: 0.05, // 50ms
} as const;

export const MOTION_SPRINGS = {
  // Snappy: cepat, kekakuan tinggi, redaman sedang (tombol, switch, tabs, toasts)
  snappy: {
    type: "spring" as const,
    stiffness: 400,
    damping: 30,
    mass: 0.8,
  },
  // Fluid: halus, elastis terkontrol (morph overlay, sheet, dialog, kartu sukses)
  fluid: {
    type: "spring" as const,
    stiffness: 280,
    damping: 24,
    mass: 1,
  },
  // Gentle: lembut, pergerakan ambient (floating cards, hero items, background lights)
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

/**
 * Variasi Framer Motion standar (GPU composited: hanya transform dan opacity)
 */
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
  staggerContainer: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: MOTION_STAGGER.base,
      },
    },
  },
  heroSequence: {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: MOTION_DURATIONS.cinematic,
        ease: MOTION_EASINGS.standardOut,
      },
    },
  },
} as const;

/**
 * Alternatif tanpa gerak untuk preferensi reduced-motion
 */
export const REDUCED_MOTION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: MOTION_DURATIONS.instant },
  },
  instant: {
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    exit: { opacity: 1 },
    transition: { duration: 0 },
  },
} as const;
