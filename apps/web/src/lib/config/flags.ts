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
   * Visibilitas Halaman Turnamen (Keputusan P9)
   * Disembunyikan (false) hingga data riil kejuaraan terisi dan lolos sapu klaim.
   */
  get ENABLE_TOURNAMENTS(): boolean {
    return process.env.NEXT_PUBLIC_ENABLE_TOURNAMENTS === "true";
  },

  /**
   * Visibilitas Halaman Papan Peringkat / Leaderboard (Keputusan P9)
   * Disembunyikan (false) hingga data riil statistik aktif.
   */
  get ENABLE_LEADERBOARD(): boolean {
    return process.env.NEXT_PUBLIC_ENABLE_LEADERBOARD === "true";
  },

  /**
   * Visibilitas Halaman Galeri Dokumentasi (Keputusan P9)
   * Disembunyikan (false) hingga berkas media terkurasi diunggah.
   */
  get ENABLE_GALLERY(): boolean {
    return process.env.NEXT_PUBLIC_ENABLE_GALLERY === "true";
  },

  /**
   * Visibilitas Halaman Peta Wilayah Interaktif (Keputusan P9)
   * Disembunyikan (false) hingga peta geojson tervalidasi.
   */
  get ENABLE_MAP(): boolean {
    return process.env.NEXT_PUBLIC_ENABLE_MAP === "true";
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
   * Modularisasi Core Subdomain (Sub-langkah 7.6 Microservices)
   * Menegakkan isolasi modul inti (Identity, Profile, Ecosystem, Catalog),
   * eliminasi JOIN lintas schema, dan referensi berbasis ID murni.
   * Nilai default: true. Jika diset false (via env FEATURE_FLAG_MODULAR_CORE=false),
   * sistem seketika melakukan graceful rollback ke fungsi monolitik.
   */
  get USE_MODULAR_CORE(): boolean {
    return process.env.FEATURE_FLAG_MODULAR_CORE !== "false";
  },

  /**
   * Pembatasan Pendaftaran Publik (Keputusan P11 / Bagian 4.3 Soft Launch)
   * Mengatur apakah pendaftaran terbuka untuk umum atau dibatasi untuk kelompok kecil uji terkendali.
   */
  get ENABLE_REGISTRATION(): boolean {
    return process.env.NEXT_PUBLIC_ENABLE_REGISTRATION !== "false";
  },

  /**
   * Mode Pemeliharaan Sistem (Keputusan P14 / Runbook Rilis)
   * Mengatur pengalihan seluruh lalu lintas non-admin ke halaman pemeliharaan.
   */
  get MAINTENANCE_MODE(): boolean {
    return process.env.MAINTENANCE_MODE === "true";
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
