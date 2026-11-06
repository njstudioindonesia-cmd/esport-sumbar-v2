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
   * Layanan Direktori Terekstraksi (Sub-langkah 7.3 Microservices)
   * Mengatur apakah pembacaan profil publik, pencarian, filter, dan statistik
   * menggunakan Read Model denormalisasi dan cache berbasis peristiwa dari Directory Service.
   * Nilai default: true. Jika diset false (via env FEATURE_FLAG_DIRECTORY_SERVICE=false),
   * sistem seketika melakukan graceful rollback ke kueri monolit.
   */
  get USE_DIRECTORY_SERVICE(): boolean {
    return process.env.FEATURE_FLAG_DIRECTORY_SERVICE !== "false";
  },

  /**
   * Layanan Verifikasi & Audit Terekstraksi (Sub-langkah 7.4 Microservices)
   * Mengatur apakah penelaahan verifikasi, mesin status, SLA antrean,
   * validasi portofolio prestasi, dan audit log append-only menggunakan Verification Service baru.
   * Nilai default: true. Jika diset false (via env FEATURE_FLAG_VERIFICATION_SERVICE=false),
   * sistem seketika melakukan graceful rollback ke RPC monolitik.
   */
  get USE_VERIFICATION_SERVICE(): boolean {
    return process.env.FEATURE_FLAG_VERIFICATION_SERVICE !== "false";
  },

  /**
   * Layanan Konten & CMS Terekstraksi (Sub-langkah 7.5 Microservices)
   * Mengatur apakah pengelolaan artikel, alur editorial, taksonomi kategori,
   * dan proyeksi berita publik menggunakan Content Service baru.
   * Nilai default: true. Jika diset false (via env FEATURE_FLAG_CONTENT_SERVICE=false),
   * sistem seketika melakukan graceful rollback ke kueri monolitik.
   */
  get USE_CONTENT_SERVICE(): boolean {
    return process.env.FEATURE_FLAG_CONTENT_SERVICE !== "false";
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
