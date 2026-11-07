export interface VerificationQueueItem {
  id: string;
  esportId: string;
  name: string;
  ign: string;
  type: "player" | "coach" | "team";
  game: string;
  role: string;
  regionCode: string;
  regionName: string;
  submittedAt: string;
  daysWaiting: number;
  slaStatus: "normal" | "warning" | "critical"; // normal: <5 days (green), warning: 5-14 days (yellow), critical: >14 days (red)
  status: "submitted" | "in_review" | "revision_needed" | "verified" | "verified" | "rejected";
  assignedTo?: string | null;
  reviewerNotes?: string;
  isFallback?: boolean; // True for regions without active Komunitas Esport
  regionalReviewer?: {
    name: string;
    role: string;
    approvedAt: string;
    notes: string;
  };
  documents: {
    type: string;
    title: string;
    url: string;
    submittedAt: string;
    fileSize: string;
  }[];
  checklist: {
    identityVerified: boolean;
    domicileVerified: boolean;
    gameProofVerified: boolean;
  };
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  actorRole: string;
  actorName: string;
  regionCode: string;
  action: "Lolos Daerah" | "Minta Revisi" | "Tolak Pengajuan" | "Verifikasi Emas" | "Tangguhkan";
  targetId: string;
  targetName: string;
  targetType: "Player" | "Coach" | "Team";
  reason: string;
  logHash: string;
}

export const MOCK_REGIONAL_QUEUE: VerificationQueueItem[] = [
  {
    id: "rev-pdg-001",
    esportId: "ESB-PDG-PL-000124",
    name: "Raka Pratama",
    ign: "SUTAN_AIM",
    type: "player",
    game: "Mobile Legends",
    role: "Mid Laner",
    regionCode: "PDG",
    regionName: "Kota Padang",
    submittedAt: "2026-03-01T10:15:00Z",
    daysWaiting: 3,
    slaStatus: "normal",
    status: "submitted",
    assignedTo: null,
    documents: [
      {
        type: "kartu_identitas",
        title: "Kartu Tanda Mahasiswa (UNAND Padang)",
        url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=600&auto=format&fit=crop",
        submittedAt: "01 Mar 2026",
        fileSize: "1.4 MB",
      },
      {
        type: "screenshot_game",
        title: "Tangkapan Layar Profil MLBB (IGN & ID Akun)",
        url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop",
        submittedAt: "01 Mar 2026",
        fileSize: "2.1 MB",
      },
      {
        type: "surat_rekomendasi",
        title: "Surat Rekomendasi Komunitas Gamers Padang",
        url: "https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=600&auto=format&fit=crop",
        submittedAt: "01 Mar 2026",
        fileSize: "850 KB",
      },
    ],
    checklist: {
      identityVerified: false,
      domicileVerified: false,
      gameProofVerified: false,
    },
  },
  {
    id: "rev-pdg-002",
    esportId: "ESB-PDG-PL-000139",
    name: "Dini Oktaviani",
    ign: "SrikandiPadang",
    type: "player",
    game: "PUBG Mobile",
    role: "Sniper / Support",
    regionCode: "PDG",
    regionName: "Kota Padang",
    submittedAt: "2026-02-23T14:30:00Z",
    daysWaiting: 9,
    slaStatus: "warning",
    status: "in_review",
    assignedTo: "Admin Wilayah Padang #01",
    documents: [
      {
        type: "kartu_identitas",
        title: "Kartu Pelajar SMAN 1 Padang",
        url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=600&auto=format&fit=crop",
        submittedAt: "23 Feb 2026",
        fileSize: "1.2 MB",
      },
      {
        type: "screenshot_game",
        title: "Tangkapan Layar PUBG Mobile ID: 512993810",
        url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop",
        submittedAt: "23 Feb 2026",
        fileSize: "1.8 MB",
      },
    ],
    checklist: {
      identityVerified: true,
      domicileVerified: true,
      gameProofVerified: false,
    },
  },
  {
    id: "rev-pdg-003",
    esportId: "ESB-PDG-TM-000008",
    name: "Minang Pride Esports",
    ign: "MPE Club",
    type: "team",
    game: "Mobile Legends",
    role: "Organisasi / Tim",
    regionCode: "PDG",
    regionName: "Kota Padang",
    submittedAt: "2026-02-14T09:00:00Z",
    daysWaiting: 18,
    slaStatus: "critical",
    status: "submitted",
    assignedTo: null,
    documents: [
      {
        type: "akta_klub",
        title: "Surat Keputusan Anggaran Dasar Klub ESPORT SUMBAR",
        url: "https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=600&auto=format&fit=crop",
        submittedAt: "14 Feb 2026",
        fileSize: "3.2 MB",
      },
      {
        type: "surat_domisili",
        title: "Surat Keterangan Domisili Sekretariat / Gaming House",
        url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=600&auto=format&fit=crop",
        submittedAt: "14 Feb 2026",
        fileSize: "1.1 MB",
      },
    ],
    checklist: {
      identityVerified: false,
      domicileVerified: false,
      gameProofVerified: false,
    },
  },
  {
    id: "rev-pdg-004",
    esportId: "ESB-PDG-CO-000019",
    name: "Ilham Chaniago",
    ign: "Coach_Ilham",
    type: "coach",
    game: "Mobile Legends",
    role: "Head Coach",
    regionCode: "PDG",
    regionName: "Kota Padang",
    submittedAt: "2026-02-28T11:20:00Z",
    daysWaiting: 4,
    slaStatus: "normal",
    status: "in_review",
    assignedTo: "Admin Wilayah Padang #02",
    documents: [
      {
        type: "sertifikat_pelatih",
        title: "Sertifikasi Pelatih Esports Tingkat Daerah ESPORT SUMBAR",
        url: "https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=600&auto=format&fit=crop",
        submittedAt: "28 Feb 2026",
        fileSize: "2.4 MB",
      },
    ],
    checklist: {
      identityVerified: true,
      domicileVerified: true,
      gameProofVerified: true,
    },
  },
  {
    id: "rev-pdg-005",
    esportId: "ESB-PDG-PL-000155",
    name: "Faris Al-Ghifari",
    ign: "PADANG_SNIPER",
    type: "player",
    game: "Free Fire",
    role: "Rusher",
    regionCode: "PDG",
    regionName: "Kota Padang",
    submittedAt: "2026-02-25T16:45:00Z",
    daysWaiting: 7,
    slaStatus: "warning",
    status: "revision_needed",
    assignedTo: "Admin Wilayah Padang #01",
    reviewerNotes: "Tangkapan layar akun game terpotong pada nomor ID akun. Mohon unggah ulang gambar penuh.",
    documents: [
      {
        type: "screenshot_game",
        title: "Tangkapan Layar Profil Akun Free Fire (Perlu Revisi)",
        url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop",
        submittedAt: "25 Feb 2026",
        fileSize: "940 KB",
      },
    ],
    checklist: {
      identityVerified: true,
      domicileVerified: true,
      gameProofVerified: false,
    },
  },
];

export const MOCK_REGIONAL_LOGS: ActivityLogItem[] = [
  {
    id: "log-pdg-001",
    timestamp: "2026-03-04 14:15:22 WIB",
    actorRole: "Admin Komunitas Esport Padang",
    actorName: "Admin Wilayah Padang #01",
    regionCode: "PDG",
    action: "Lolos Daerah",
    targetId: "ESB-PDG-PL-000118",
    targetName: "Aldi Kurniawan (KURNIA_SHOT)",
    targetType: "Player",
    reason: "Dokumen domisili kartu mahasiswa UNP dan ID game Free Fire valid sesuai persyaratan.",
    logHash: "sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
  },
  {
    id: "log-pdg-002",
    timestamp: "2026-03-03 16:40:11 WIB",
    actorRole: "Admin Komunitas Esport Padang",
    actorName: "Admin Wilayah Padang #02",
    regionCode: "PDG",
    action: "Minta Revisi",
    targetId: "ESB-PDG-PL-000155",
    targetName: "Faris Al-Ghifari (PADANG_SNIPER)",
    targetType: "Player",
    reason: "Tangkapan layar akun game terpotong pada nomor ID akun. Perlu unggah ulang screenshot penuh.",
    logHash: "sha256:88a912e9b0b467d3298c9f538e4a902b85e13583f7a6372ec6861a5563a6a12b",
  },
  {
    id: "log-pdg-003",
    timestamp: "2026-03-02 11:20:05 WIB",
    actorRole: "Admin Komunitas Esport Padang",
    actorName: "Admin Wilayah Padang #01",
    regionCode: "PDG",
    action: "Tolak Pengajuan",
    targetId: "ESB-PDG-PL-000099",
    targetName: "Bambang Sudrajat (BAMBANG_BOY)",
    targetType: "Player",
    reason: "Domisili identitas berlokasi di Pekanbaru, Riau. Wilayah pendaftaran di luar Sumatera Barat.",
    logHash: "sha256:3a4c11b0e922718efda38290a1b660233481f9b3b27b8862cfec031d36d4f91e",
  },
  {
    id: "log-pdg-004",
    timestamp: "2026-03-01 09:12:44 WIB",
    actorRole: "Admin Komunitas Esport Padang",
    actorName: "Admin Wilayah Padang #01",
    regionCode: "PDG",
    action: "Lolos Daerah",
    targetId: "ESB-PDG-TM-000005",
    targetName: "Khatib Squad Padang",
    targetType: "Team",
    reason: "Dokumen legalitas dan struktur pengurus klub terverifikasi lengkap.",
    logHash: "sha256:1b920da87612f0e0ab395066491a329e7104b2a86377227e74cb2292f3e8f810",
  },
];

// ==================== PROVINCE QUEUE & LOGS (PROMPT 4.2) ====================

export const MOCK_PROVINCE_QUEUE: VerificationQueueItem[] = [
  {
    id: "prov-001",
    esportId: "ESB-BKT-PL-000042",
    name: "Fikri Alamsyah",
    ign: "MARAWA_KING",
    type: "player",
    game: "Mobile Legends",
    role: "Kapten / Roamer",
    regionCode: "BKT",
    regionName: "Kota Bukittinggi",
    submittedAt: "2026-03-02T11:00:00Z",
    daysWaiting: 2,
    slaStatus: "normal",
    status: "verified",
    isFallback: false,
    regionalReviewer: {
      name: "Admin Wilayah Bukittinggi #01",
      role: "Komunitas Esport Wilayah Kota Bukittinggi",
      approvedAt: "02 Mar 2026, 14:10 WIB",
      notes: "Berkas identitas domisili Bukittinggi dan sertifikasi kapten tim lengkap. Rekomendasi verifikasi emas.",
    },
    documents: [
      {
        type: "kartu_identitas",
        title: "Kartu Pelajar SMA Negeri 1 Bukittinggi",
        url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=600&auto=format&fit=crop",
        submittedAt: "01 Mar 2026",
        fileSize: "1.5 MB",
      },
      {
        type: "screenshot_game",
        title: "Tangkapan Layar Akun Mythical Immortal MLBB",
        url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop",
        submittedAt: "01 Mar 2026",
        fileSize: "2.3 MB",
      },
      {
        type: "sertifikat_prestasi",
        title: "Sertifikat Juara 1 Piala Walikota Bukittinggi",
        url: "https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=600&auto=format&fit=crop",
        submittedAt: "01 Mar 2026",
        fileSize: "3.1 MB",
      },
    ],
    checklist: {
      identityVerified: true,
      domicileVerified: true,
      gameProofVerified: true,
    },
  },
  {
    id: "prov-002",
    esportId: "ESB-MTW-PL-000012",
    name: "Sikerei Sikabaluan",
    ign: "MentawaiSniper",
    type: "player",
    game: "Free Fire",
    role: "Sniper Utama",
    regionCode: "MTW",
    regionName: "Kabupaten Kepulauan Mentawai",
    submittedAt: "2026-02-20T08:30:00Z",
    daysWaiting: 12,
    slaStatus: "warning",
    status: "submitted",
    isFallback: false,
    documents: [
      {
        type: "kartu_identitas",
        title: "Surat Keterangan Domisili Siberut Utara (Mentawai)",
        url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=600&auto=format&fit=crop",
        submittedAt: "20 Feb 2026",
        fileSize: "980 KB",
      },
      {
        type: "screenshot_game",
        title: "Tangkapan Layar Akun Free Fire ID: 8829104",
        url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop",
        submittedAt: "20 Feb 2026",
        fileSize: "1.7 MB",
      },
    ],
    checklist: {
      identityVerified: false,
      domicileVerified: false,
      gameProofVerified: false,
    },
  },
  {
    id: "prov-003",
    esportId: "ESB-PDG-TM-000001",
    name: "Minang Pride Esports",
    ign: "Minang Pride",
    type: "team",
    game: "Mobile Legends",
    role: "Klub Esport Terdaftar",
    regionCode: "PDG",
    regionName: "Kota Padang",
    submittedAt: "2026-03-03T15:20:00Z",
    daysWaiting: 1,
    slaStatus: "normal",
    status: "verified",
    isFallback: false,
    regionalReviewer: {
      name: "Admin Wilayah Padang #01",
      role: "Komunitas Esport Wilayah Kota Padang",
      approvedAt: "03 Mar 2026, 17:00 WIB",
      notes: "Akta pendirian klub, domisili sekretariat di Padang Barat, dan daftar 5 pemain inti lengkap. Siap verifikasi tier emas.",
    },
    documents: [
      {
        type: "akta_organisasi",
        title: "Akta Notaris & SK Kemenkumham Klub Esport",
        url: "https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=600&auto=format&fit=crop",
        submittedAt: "03 Mar 2026",
        fileSize: "4.2 MB",
      },
      {
        type: "legalitas_organisasi",
        title: "Sertifikat Registrasi Terverifikasi ESPORT SUMBAR",
        url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=600&auto=format&fit=crop",
        submittedAt: "03 Mar 2026",
        fileSize: "1.3 MB",
      },
    ],
    checklist: {
      identityVerified: true,
      domicileVerified: true,
      gameProofVerified: true,
    },
  },
  {
    id: "prov-004",
    esportId: "ESB-PYK-PL-000088",
    name: "Riko Fernando",
    ign: "GalamaiShooter",
    type: "player",
    game: "Free Fire",
    role: "Rusher",
    regionCode: "PYK",
    regionName: "Kota Payakumbuh",
    submittedAt: "2026-02-18T14:15:00Z",
    daysWaiting: 14,
    slaStatus: "critical",
    status: "verified",
    isFallback: false,
    regionalReviewer: {
      name: "Admin Wilayah Payakumbuh #01",
      role: "Komunitas Esport Wilayah Kota Payakumbuh",
      approvedAt: "19 Feb 2026, 10:20 WIB",
      notes: "Lolos daerah. Menunggu verifikasi tingkat provinsi.",
    },
    documents: [
      {
        type: "kartu_identitas",
        title: "Kartu Mahasiswa Politeknik Pertanian Payakumbuh",
        url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=600&auto=format&fit=crop",
        submittedAt: "18 Feb 2026",
        fileSize: "1.1 MB",
      },
    ],
    checklist: {
      identityVerified: true,
      domicileVerified: true,
      gameProofVerified: true,
    },
  },
  {
    id: "prov-005",
    esportId: "ESB-PSB-PL-000021",
    name: "Ilham Syahputra",
    ign: "PasbarHunter",
    type: "player",
    game: "PUBG Mobile",
    role: "Scout / Fragger",
    regionCode: "PSB",
    regionName: "Kabupaten Pasaman Barat",
    submittedAt: "2026-02-24T09:10:00Z",
    daysWaiting: 8,
    slaStatus: "warning",
    status: "submitted",
    isFallback: true, // Fallback wilayah
    documents: [
      {
        type: "kartu_identitas",
        title: "Kartu Pelajar SMAN 1 Pasaman",
        url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=600&auto=format&fit=crop",
        submittedAt: "24 Feb 2026",
        fileSize: "1.4 MB",
      },
    ],
    checklist: {
      identityVerified: false,
      domicileVerified: false,
      gameProofVerified: false,
    },
  },
];

export const MOCK_PROVINCE_LOGS: ActivityLogItem[] = [
  {
    id: "log-prov-001",
    timestamp: "2026-03-04 11:25:10 WIB",
    actorRole: "Admin ESPORT SUMBAR",
    actorName: "Ketua Bidang Atlet ESPORT SUMBAR Sumbar",
    regionCode: "PDG",
    action: "Verifikasi Emas",
    targetId: "ESB-PDG-PL-000003",
    targetName: "Rizky 'Kaba' Ramadhan",
    targetType: "Player",
    reason: "Persetujuan verifikasi profil ESPORT SUMBAR. Nomor Registrasi: ESP-SB-VER-2026-0038 diterbitkan.",
    logHash: "sha256:d89ef12ab34567890abcdef1234567890abcdef1234567890abcdef123456789",
  },
  {
    id: "log-prov-002",
    timestamp: "2026-03-03 15:40:00 WIB",
    actorRole: "Admin ESPORT SUMBAR",
    actorName: "Komisi Disiplin ESPORT SUMBAR",
    regionCode: "SLK",
    action: "Tangguhkan",
    targetId: "ESB-SLK-PL-000077",
    targetName: "Doni Putra (DONI_PRO)",
    targetType: "Player",
    reason: "Terbukti melakukan joki akun pada turnamen kualifikasi Porprov. Status ditangguhkan 6 bulan.",
    logHash: "sha256:99887766554433221100aabbccddeeff99887766554433221100aabbccddeeff",
  },
  {
    id: "log-prov-003",
    timestamp: "2026-03-02 16:10:45 WIB",
    actorRole: "Admin ESPORT SUMBAR",
    actorName: "Sekretaris Umum ESPORT SUMBAR Sumbar",
    regionCode: "BKT",
    action: "Verifikasi Emas",
    targetId: "ESB-BKT-TM-000002",
    targetName: "Bukittinggi Cyber Esports",
    targetType: "Team",
    reason: "Pendaftaran klub esport binaan ESPORT SUMBAR. Masa berlaku 12 bulan (Maret 2027).",
    logHash: "sha256:11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff",
  },
  {
    id: "log-prov-004",
    timestamp: "2026-03-01 13:30:12 WIB",
    actorRole: "Admin ESPORT SUMBAR",
    actorName: "Admin ESPORT SUMBAR #01",
    regionCode: "MTW",
    action: "Lolos Daerah",
    targetId: "ESB-MTW-PL-000009",
    targetName: "Petrus Taileleu (MENTAWAI_WAVE)",
    targetType: "Player",
    reason: "Pemeriksaan berkas verifikasi langsung oleh kurator ESPORT SUMBAR.",
    logHash: "sha256:556677889900aabbccddeeff11223344556677889900aabbccddeeff11223344",
  },
];


// ==================== PLATFORM OPERATOR DATA (PROMPT 4.3) ====================

export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  role: "admin_region" | "admin_province";
  assignedRegionCode: string;
  assignedRegionName: string;
  status: "active" | "inactive";
  lastLogin: string;
  createdAt: string;
}

export interface ProfileReportItem {
  id: string;
  reportedProfileId: string;
  reportedProfileName: string;
  reportedEsportId: string;
  reportedType: "Player" | "Coach" | "Team";
  regionCode: string;
  regionName: string;
  reporterName: string;
  reasonCategory: "fake_identity" | "smurf_jockey" | "abusive_behavior" | "illegal_team";
  description: string;
  evidenceUrl?: string;
  reportedAt: string;
  status: "pending" | "reviewed_clean" | "forwarded_to_province";
}

export const MOCK_ADMIN_ACCOUNTS: AdminAccount[] = [
  {
    id: "adm-001",
    name: "Rizki Mahendra, S.Kom",
    email: "admin.padang@esportsumbar.id",
    role: "admin_region",
    assignedRegionCode: "PDG",
    assignedRegionName: "Kota Padang",
    status: "active",
    lastLogin: "Hari ini, 09:12 WIB",
    createdAt: "10 Jan 2025",
  },
  {
    id: "adm-002",
    name: "Ahmad Fauzi, M.Pd",
    email: "admin.bukittinggi@esportsumbar.id",
    role: "admin_region",
    assignedRegionCode: "BKT",
    assignedRegionName: "Kota Bukittinggi",
    status: "active",
    lastLogin: "Kemarin, 16:40 WIB",
    createdAt: "15 Jan 2025",
  },
  {
    id: "adm-003",
    name: "Drs. Hendri Chaniago",
    email: "sekum@esportsumbar.id",
    role: "admin_province",
    assignedRegionCode: "SUMBAR",
    assignedRegionName: "Seluruh Sumatera Barat (ESPORT SUMBAR)",
    status: "active",
    lastLogin: "Hari ini, 11:30 WIB",
    createdAt: "01 Jan 2025",
  },
  {
    id: "adm-004",
    name: "Budi Santoso",
    email: "admin.payakumbuh@esportsumbar.id",
    role: "admin_region",
    assignedRegionCode: "PYK",
    assignedRegionName: "Kota Payakumbuh",
    status: "active",
    lastLogin: "3 hari lalu",
    createdAt: "20 Jan 2025",
  },
  {
    id: "adm-005",
    name: "Rahmat Hidayat",
    email: "admin.solok@esportsumbar.id",
    role: "admin_region",
    assignedRegionCode: "SLK",
    assignedRegionName: "Kota Solok",
    status: "inactive",
    lastLogin: "2 minggu lalu",
    createdAt: "02 Feb 2025",
  },
];

export const MOCK_REPORTS: ProfileReportItem[] = [
  {
    id: "rep-001",
    reportedProfileId: "pl-contender",
    reportedProfileName: "Doni Putra (DONI_PRO)",
    reportedEsportId: "ESB-SLK-PL-000077",
    reportedType: "Player",
    regionCode: "SLK",
    regionName: "Kota Solok",
    reporterName: "Kapten Singkarak Esports",
    reasonCategory: "smurf_jockey",
    description: "Akun digunakan oleh joki dari luar Sumatera Barat pada pertandingan babak kualifikasi piala daerah.",
    evidenceUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop",
    reportedAt: "03 Mar 2026, 10:20 WIB",
    status: "pending",
  },
  {
    id: "rep-002",
    reportedProfileId: "pl-rookie-fake",
    reportedProfileName: "Anonim Gamer (FAKE_CLONE)",
    reportedEsportId: "ESB-PDG-PL-000999",
    reportedType: "Player",
    regionCode: "PDG",
    regionName: "Kota Padang",
    reporterName: "Raka Pratama",
    reasonCategory: "fake_identity",
    description: "Mengunggah tangkapan layar akun game milik orang lain dari server luar negeri.",
    evidenceUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=600&auto=format&fit=crop",
    reportedAt: "02 Mar 2026, 14:15 WIB",
    status: "forwarded_to_province",
  },
];

export const MOCK_GLOBAL_AUDIT_LOGS = [
  ...MOCK_PROVINCE_LOGS,
  ...MOCK_REGIONAL_LOGS,
  {
    id: "log-sys-001",
    timestamp: "2026-03-04 08:00:00 WIB",
    actorRole: "Operator Platform (Sistem)",
    actorName: "Operator ESPORT SUMBAR",
    regionCode: "ALL",
    action: "Verifikasi Emas" as any,
    targetId: "SYS-CRON-SLA",
    targetName: "Sistem Pemantauan SLA Otomatis",
    targetType: "Player" as any,
    reason: "Pemeriksaan SLA harian: 3 berkas diberi status peringatan kuning dan 1 berkas merah.",
    logHash: "sha256:77889900aabbccddeeff11223344556677889900aabbccddeeff112233445566",
  },
];
