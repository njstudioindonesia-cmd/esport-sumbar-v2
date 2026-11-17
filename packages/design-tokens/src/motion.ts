/**
 * ESPORT SUMBAR V3: Motion Tokens
 * Gerak halus, bertujuan (purposeful), dan menghormati prefers-reduced-motion.
 */

export const motion = {
  durations: {
    instant: "100ms",
    fast: "180ms",
    normal: "240ms",
    slow: "320ms",
  },

  easings: {
    easeOut: "cubic-bezier(0.16, 1, 0.3, 1)", // spring halus keluar
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
  },

  transitions: {
    interactive: "all 180ms cubic-bezier(0.16, 1, 0.3, 1)",
    surface: "background-color 240ms cubic-bezier(0.16, 1, 0.3, 1), border-color 240ms cubic-bezier(0.16, 1, 0.3, 1)",
    cardFlip: "transform 360ms cubic-bezier(0.16, 1, 0.3, 1)",
  },
} as const;
