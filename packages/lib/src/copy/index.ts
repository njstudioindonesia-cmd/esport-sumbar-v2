/**
 * ESPORT SUMBAR V3: Typed Centralized Platform Copy Module
 * Single Source of Truth untuk seluruh teks platform, label status, navigasi,
 * pesan sistem, dan metadata. Menjamin 0 kemunculan istilah & klaim terlarang.
 */

export const PLATFORM_COPY = {
  brand: {
    name: "ESPORT SUMBAR",
    shortName: "ES Sumbar",
    tagline: "Pusat Data Esport Sumatera Barat",
    subTagline: "Bangun Namamu di Arena Sumbar",
    description:
      "Platform data, identitas digital, dan ekosistem esport Sumatera Barat oleh ESPORT SUMBAR. Daftar, dapatkan kartu ESPORT ID, dan jelajahi ekosistem.",
    copyright: (year: number = 2026) =>
      `© ${year} ESPORT SUMBAR. Hak cipta dilindungi undang-undang.`,
    ownershipStatement:
      "ESPORT SUMBAR memiliki dan mengelola platform ini, termasuk pemeriksaan dan verifikasi profil.",
    singleVerifier: "Pemverifikasi Tunggal",
    independentPlatform: "Platform mandiri oleh ESPORT SUMBAR",
    cardStamp: "Kartu Digital",
    cardIssuer: "Diterbitkan oleh ESPORT SUMBAR",
  },

  verification: {
    badgeName: "Terverifikasi",
    badgeTitle: "Terverifikasi oleh ESPORT SUMBAR",
    badgeTooltip:
      "Lencana perisai emas menandakan identitas dan data profil telah diperiksa dan disetujui langsung oleh tim ESPORT SUMBAR.",
    singleTierNotice:
      "Pemeriksaan profil dilakukan dalam satu tahap terpadu oleh tim verifikasi ESPORT SUMBAR.",
    statuses: {
      unverified: {
        id: "unverified",
        label: "Belum Terverifikasi",
        description: "Profil belum diajukan untuk diperiksa.",
        badgeVariant: "muted" as const,
      },
      under_review: {
        id: "under_review",
        label: "Menunggu Pemeriksaan",
        description: "Tim ESPORT SUMBAR sedang memeriksa profil ini.",
        badgeVariant: "pending" as const,
      },
      revision: {
        id: "revision",
        label: "Perlu Revisi",
        description: "Ada data yang perlu diperbaiki sebelum diperiksa ulang.",
        badgeVariant: "warning" as const,
      },
      verified: {
        id: "verified",
        label: "Terverifikasi",
        description: (date?: string, exp?: string) =>
          date
            ? `Diperiksa oleh tim ESPORT SUMBAR pada ${date}.${exp ? ` Berlaku sampai ${exp}.` : ""}`
            : "Diperiksa dan disetujui oleh tim ESPORT SUMBAR.",
        badgeVariant: "gold" as const,
      },
      rejected: {
        id: "rejected",
        label: "Ditolak",
        description: "Pengajuan tidak dapat disetujui. Lihat alasan dari tim.",
        badgeVariant: "error" as const,
      },
      suspended: {
        id: "suspended",
        label: "Ditangguhkan",
        description: "Status verifikasi dihentikan sementara.",
        badgeVariant: "muted" as const,
      },
      expired: {
        id: "expired",
        label: "Kedaluwarsa",
        description: "Masa berlaku berakhir. Ajukan pembaruan.",
        badgeVariant: "warning" as const,
      },
    },
  },

  onboarding: {
    singleDomainConfirmation:
      "Satu akun hanya untuk satu bidang. Pilihan ini tidak dapat diubah setelah dikonfirmasi.",
    youthConsentTitle: "Persetujuan Orang Tua / Wali",
    youthConsentNotice:
      "Pendaftaran pemain di bawah usia 18 tahun wajib menyertakan identitas orang tua atau wali untuk perlindungan data anak.",
    successTitle: "Kartu Identitas Digital Terbit!",
    successSubtitle:
      "Profil Anda telah terdaftar di pangkalan data ESPORT SUMBAR. Bagikan kartu dan hubungkan relasi ekosistem Anda.",
  },

  ecosystem: {
    emptyPrompt: (entityType: string = "tim/komunitas/venue") =>
      `Belum terhubung. Cari ${entityType} dan kirim permintaan hubungan.`,
    requestSent: "Permintaan hubungan ekosistem berhasil dikirim.",
    requestApproved: "Permintaan hubungan ekosistem telah disetujui dan kini aktif.",
    requestRejected: "Permintaan hubungan ekosistem telah ditolak.",
    relationEnded: "Hubungan ekosistem telah diakhiri dan dipindahkan ke riwayat.",
    limitReached: (limit: number) =>
      `Batas maksimal relasi aktif (${limit}) untuk jenis hubungan ini telah tercapai.`,
    gameMismatch:
      "Cabang game utama antara kedua profil tidak sesuai dengan aturan relasi.",
  },

  privacy: {
    privateNotice:
      "Data kontak dan alamat jalan hanya terlihat oleh Anda dan tim ESPORT SUMBAR.",
    studentProtectionNotice:
      "Data pribadi pelajar dilindungi. Hanya jumlah agregasi anggota yang ditampilkan kepada publik.",
    dataController: "Pengendali data: ESPORT SUMBAR",
    legalStatus: "Ditinjau tata kelola: Terverifikasi Mandiri",
    dpoContact: "Kontak Pelindungan Data: privasi@esportsumbar.id",
  },

  howItWorks: {
    title: "Cara Kerja",
    subtitle: "Lima langkah mandiri membangun profil dan identitas esport Anda di Sumatera Barat.",
    steps: [
      {
        step: 1,
        title: "Daftar Akun",
        desc: "Buat akun pengguna dengan email aktif untuk memulai.",
      },
      {
        step: 2,
        title: "Lengkapi Profil",
        desc: "Pilih 1 bidang keahlian dan isi data identitas Anda.",
      },
      {
        step: 3,
        title: "Ajukan Verifikasi",
        desc: "Unggah dokumen identitas pendukung untuk diperiksa.",
      },
      {
        step: 4,
        title: "Diperiksa Tim",
        desc: "Tim ESPORT SUMBAR memeriksa kesesuaian dan keabsahan berkas.",
      },
      {
        step: 5,
        title: "Terverifikasi",
        desc: "Lencana terverifikasi aktif pada kartu digital dan profil direktori.",
      },
    ],
  },

  errors: {
    notFoundTitle: "Halaman Tidak Ditemukan",
    notFoundDesc: "Tautan yang Anda tuju mungkin telah dipindahkan atau dinonaktifkan.",
    forbiddenTitle: "Akses Ditolak",
    forbiddenDesc: "Anda tidak memiliki izin untuk membuka halaman ini.",
    serverErrorTitle: "Terjadi Kendala",
    serverErrorDesc: "Tim teknis ESPORT SUMBAR sedang menangani kendala ini. Silakan coba beberapa saat lagi.",
    offlineTitle: "Koneksi Terputus",
    offlineDesc: "Perangkat Anda sedang offline. Menampilkan kartu identitas dari penyimpanan lokal.",
    unauthorized: "Akses ditolak: Anda harus masuk terlebih dahulu.",
    adminOnly: "Akses ditolak: Halaman ini khusus untuk platform administrator.",
    selfVerificationForbidden: "Tindakan ditolak: Administrator tidak dapat memverifikasi akunnya sendiri.",
  },

  navigation: {
    home: "Beranda",
    explore: "Jelajah",
    players: "Atlet",
    coaches: "Pelatih",
    teams: "Tim & Klub",
    communities: "Komunitas",
    venues: "Arena & Venue",
    campuses: "Kampus",
    schools: "Sekolah",
    regions: "Wilayah",
    ecosystem: "Ekosistem",
    games: "Cabang Game",
    news: "Warta",
    about: "Tentang Kami",
    howItWorks: "Cara Kerja",
    verificationStandard: "Standar Verifikasi",
    privacy: "Kebijakan Privasi",
    terms: "Syarat Layanan",
    contentPolicy: "Kebijakan Konten",
    contact: "Kontak",
    faq: "Tanya Jawab",
    dashboard: "Dashboard",
    myCard: "Kartu Saya",
    myEcosystem: "Ekosistem Saya",
    myVerification: "Status Verifikasi",
    mySettings: "Pengaturan",
    adminPanel: "Panel Admin",
    login: "Masuk",
    register: "Daftar",
    logout: "Keluar",
  },
} as const;

export type PlatformCopy = typeof PLATFORM_COPY;
