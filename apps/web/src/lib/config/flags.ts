/**
 * Feature Flags Configuration
 * Mengatur visibilitas data demo, mode sistem, dan konfigurasi rilis ESPORT SUMBAR.
 */

export const FLAGS = {
  /**
   * Apakah data dengan penanda `is_demo = true` diizinkan tampil di antarmuka publik.
   * Dipastikan false untuk mode produksi bersih (hanya menampilkan data riil pendaftar).
   */
  get SHOW_DEMO_DATA(): boolean {
    return false;
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
