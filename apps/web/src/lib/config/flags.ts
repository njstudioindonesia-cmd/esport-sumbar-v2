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
   * Layanan Media Terekstraksi (Sub-langkah 7.1 Microservices)
   * Mengatur apakah pemrosesan media (tanda tangan unggah, validasi biner, kompresi Sharp,
   * pembersihan berkas lama & yatim, dan kuota) menggunakan Media Service baru.
   * Nilai default: true. Jika diset false (via env FEATURE_FLAG_MEDIA_SERVICE=false),
   * sistem seketika melakukan graceful rollback ke penyimpanan warisan.
   */
  get USE_MEDIA_SERVICE(): boolean {
    return process.env.FEATURE_FLAG_MEDIA_SERVICE !== "false";
  },

  /**
   * Layanan Notifikasi Terekstraksi (Sub-langkah 7.2 Microservices)
   * Mengatur apakah pemrosesan notifikasi (konsumsi peristiwa, email, in-app,
   * retry & dead-letter queue, dan preferensi pengguna) menggunakan Notification Service baru.
   * Nilai default: true. Jika diset false (via env FEATURE_FLAG_NOTIFICATION_SERVICE=false),
   * sistem seketika melakukan graceful rollback.
   */
  get USE_NOTIFICATION_SERVICE(): boolean {
    return process.env.FEATURE_FLAG_NOTIFICATION_SERVICE !== "false";
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
