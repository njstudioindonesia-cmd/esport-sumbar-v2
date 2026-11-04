/**
 * Feature Flags Configuration
 * Mengatur visibilitas data demo, mode sistem, dan konfigurasi rilis PBESI Sumbar.
 */

export const FLAGS = {
  /**
   * Apakah data dengan penanda `is_demo = true` diizinkan tampil di antarmuka publik.
   * Default: false di produksi, true di lokal jika disetel.
   */
  get SHOW_DEMO_DATA(): boolean {
    if (typeof window !== "undefined") {
      return process.env.NEXT_PUBLIC_SHOW_DEMO_DATA === "true";
    }
    return (
      process.env.NEXT_PUBLIC_SHOW_DEMO_DATA === "true" ||
      process.env.SHOW_DEMO_DATA === "true"
    );
  },

  /**
   * Apakah registrasi entitas tertentu sedang dibuka di masa pra-rilis.
   */
  ENABLED_ENTITY_TYPES: [
    "player",
    "coach",
    "team",
    "community",
    "venue",
    "campus",
    "school",
  ] as const,
};
