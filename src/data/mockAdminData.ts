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
  status: "submitted" | "in_review" | "revision_needed" | "regional_checked" | "verified" | "rejected";
  assignedTo?: string | null;
  reviewerNotes?: string;
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
    assignedTo: "Admin Pengcab Padang #01",
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
        title: "Surat Keterangan Terdaftar Klub dari KONI Padang",
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
    assignedTo: "Admin Pengcab Padang #02",
    documents: [
      {
        type: "sertifikat_pelatih",
        title: "Sertifikasi Pelatih Esports Tingkat Daerah PBESI",
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
    assignedTo: "Admin Pengcab Padang #01",
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
    actorRole: "Admin Pengcab ESI Padang",
    actorName: "Admin Pengcab Padang #01",
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
    actorRole: "Admin Pengcab ESI Padang",
    actorName: "Admin Pengcab Padang #02",
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
    actorRole: "Admin Pengcab ESI Padang",
    actorName: "Admin Pengcab Padang #01",
    regionCode: "PDG",
    action: "Tolak Pengajuan",
    targetId: "ESB-PDG-PL-000099",
    targetName: "Bambang Sudrajat (BAMBANG_BOY)",
    targetType: "Player",
    reason: "Domisili KTP/identitas berlokasi di Pekanbaru, Riau. Diarahkan untuk mendaftar ke ESI Riau.",
    logHash: "sha256:3a4c11b0e922718efda38290a1b660233481f9b3b27b8862cfec031d36d4f91e",
  },
  {
    id: "log-pdg-004",
    timestamp: "2026-03-01 09:12:44 WIB",
    actorRole: "Admin Pengcab ESI Padang",
    actorName: "Admin Pengcab Padang #01",
    regionCode: "PDG",
    action: "Lolos Daerah",
    targetId: "ESB-PDG-TM-000005",
    targetName: "Khatib Squad Padang",
    targetType: "Team",
    reason: "Surat rekomendasi klub terdaftar di KONI Padang lengkap dengan susunan pengurus.",
    logHash: "sha256:1b920da87612f0e0ab395066491a329e7104b2a86377227e74cb2292f3e8f810",
  },
];
