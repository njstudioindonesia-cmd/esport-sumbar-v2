import {
  UnifiedCardData,
  CardRarity,
  CardVerification,
  CardEntityType,
} from "@/types/card";

export interface MockCardVariant {
  id: string;
  type: CardEntityType;
  rarity: CardRarity;
  verification: CardVerification;
  tagline: string;
  data: UnifiedCardData;
}

export const GALLERY_CARDS: MockCardVariant[] = [
  // ==================== 1. PLAYER CARDS (4 RARITIES) ====================
  {
    id: "pl-rookie",
    type: "player",
    rarity: "rookie",
    verification: "unverified",
    tagline: "Pemain baru terdaftar, profil dasar lengkap",
    data: {
      ign: "KABA_SHOOTER",
      displayName: "Rizky Ramadhan",
      avatarUrl:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400&auto=format&fit=crop",
      game: "Free Fire",
      role: "Rusher",
      team: { name: "Singkarak Esports" },
      region: { name: "Kota Solok", code: "SLK" },
      esportId: "ESB-SLK-PL-000301",
      achievements: [],
      history: [{ teamName: "Singkarak Esports", period: "2026 - Sekarang", role: "Rusher" }],
      joinedAt: "Februari 2026",
    },
  },
  {
    id: "pl-contender",
    type: "player",
    rarity: "contender",
    verification: "regional",
    tagline: "Profil lengkap >80% & relasi tim aktif tervalidasi ESI Daerah",
    data: {
      ign: "SUTAN_AIM",
      displayName: "Raka Pratama",
      avatarUrl:
        "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=400&auto=format&fit=crop",
      game: "Free Fire",
      role: "Sniper / Rusher",
      team: { name: "Marawa Muda" },
      region: { name: "Kota Padang", code: "PDG" },
      esportId: "ESB-PDG-PL-000124",
      badgeNumber: "ESI-PDG-2026-088",
      achievements: [
        {
          title: "Piala Walikota Padang Esport",
          level: "kota",
          placement: "Juara 1",
          year: "2025",
          isValidated: true,
        },
      ],
      history: [
        { teamName: "Marawa Muda", period: "2025 - Sekarang", role: "Sniper" },
        { teamName: "Khatib Squad", period: "2024 - 2025", role: "Fragger" },
      ],
      joinedAt: "Januari 2025",
    },
  },
  {
    id: "pl-elite",
    type: "player",
    rarity: "elite",
    verification: "verified",
    tagline: "Prestasi kejuaraan daerah tervalidasi & diverifikasi ESI Provinsi",
    data: {
      ign: "MARAWA_KING",
      displayName: "Fikri Alamsyah",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
      game: "Mobile Legends: Bang Bang",
      role: "Roamer / Shotcaller",
      team: { name: "Minang Pride" },
      region: { name: "Kota Bukittinggi", code: "BKT" },
      esportId: "ESB-BKT-PL-000042",
      badgeNumber: "ESI-SB-2025-0042",
      achievements: [
        {
          title: "Kejuaraan Daerah ESI Sumbar",
          level: "provinsi",
          placement: "Medali Emas",
          year: "2025",
          isValidated: true,
        },
        {
          title: "Piala Presiden Regional Barat",
          level: "nasional",
          placement: "Top 8",
          year: "2024",
          isValidated: true,
        },
      ],
      history: [
        { teamName: "Minang Pride", period: "2024 - Sekarang", role: "Roamer" },
        { teamName: "Jam Gadang Team", period: "2023 - 2024", role: "Mid Laner" },
      ],
      joinedAt: "Maret 2024",
    },
  },
  {
    id: "pl-legend",
    type: "player",
    rarity: "legend",
    verification: "verified",
    tagline: "Medali Emas PON XXI Aceh-Sumut, atlet kebanggaan Ranah Minang",
    data: {
      ign: "SINGA_SINGKARAK",
      displayName: "Aidil Syahputra",
      avatarUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
      game: "PUBG Mobile",
      role: "Sniper / IGL",
      team: { name: "Ranah Garuda" },
      region: { name: "Kab. Padang Pariaman", code: "PDP" },
      esportId: "ESB-PDP-PL-000007",
      badgeNumber: "ESI-SB-2024-0007",
      achievements: [
        {
          title: "PON XXI Eksibisi Esport",
          level: "nasional",
          placement: "Medali Emas",
          year: "2024",
          isValidated: true,
        },
        {
          title: "Kejurnas Esport Indonesia",
          level: "nasional",
          placement: "Runner-up",
          year: "2024",
          isValidated: true,
        },
      ],
      history: [
        { teamName: "Ranah Garuda", period: "2023 - Sekarang", role: "IGL" },
        { teamName: "Pariaman All-Stars", period: "2022 - 2023", role: "Sniper" },
      ],
      joinedAt: "Januari 2023",
    },
  },

  // ==================== 2. COACH CARDS (4 RARITIES) ====================
  {
    id: "co-rookie",
    type: "coach",
    rarity: "rookie",
    verification: "unverified",
    tagline: "Pelatih komunitas mandiri memulai pendaftaran",
    data: {
      displayName: "Ilham Fauzi",
      ign: "COACH_ILHAM",
      avatarUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
      game: "Free Fire",
      role: "Pelatih Komunitas",
      team: { name: "Harau Gaming" },
      region: { name: "Kab. Lima Puluh Kota", code: "LPK" },
      esportId: "ESB-LPK-CO-000109",
      certification: {
        isCertified: false,
        name: "Non-Sertifikasi",
        issuer: "Komunitas",
      },
      history: [{ teamName: "Harau Gaming", period: "2025 - Sekarang", role: "Pelatih" }],
      joinedAt: "Januari 2026",
    },
  },
  {
    id: "co-contender",
    type: "coach",
    rarity: "contender",
    verification: "regional",
    tagline: "Pelatih dengan lisensi tingkat kota/kabupaten tervalidasi",
    data: {
      displayName: "Hendra Wijaya",
      ign: "TACTICIAN_HEN",
      avatarUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
      game: "Mobile Legends",
      role: "Analis & Taktikal",
      team: { name: "Padang Panjang FC" },
      region: { name: "Kota Padang Panjang", code: "PPJ" },
      esportId: "ESB-PPJ-CO-000045",
      badgeNumber: "ESI-PPJ-2025-012",
      certification: {
        isCertified: true,
        name: "Lisensi Pelatih C ESI",
        issuer: "ESI Padang Panjang",
        year: "2025",
      },
      history: [
        { teamName: "Padang Panjang FC", period: "2025 - Sekarang", role: "Head Coach" },
        { teamName: "Merapi Esports", period: "2024 - 2025", role: "Analis" },
      ],
      joinedAt: "Juni 2024",
    },
  },
  {
    id: "co-elite",
    type: "coach",
    rarity: "elite",
    verification: "verified",
    tagline: "Pelatih bersertifikasi Garudaku Nasional dengan rekam jejak juara",
    data: {
      displayName: "Dedi Kurniawan, S.Pd",
      ign: "COACH_DEDI",
      avatarUrl:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop",
      game: "Mobile Legends: Bang Bang",
      role: "Pelatih Kepala (Head Coach)",
      team: { name: "Minang Pride" },
      region: { name: "Kota Padang", code: "PDG" },
      esportId: "ESB-PDG-CO-000012",
      badgeNumber: "ESI-SB-2024-C002",
      certification: {
        isCertified: true,
        name: "Lisensi Nasional B PBESI",
        issuer: "Akademi Garudaku / PBESI",
        year: "2024",
      },
      achievements: [
        {
          title: "Kejurda ESI Sumbar 2025",
          level: "provinsi",
          placement: "Juara 1 (Pelatih)",
          year: "2025",
          isValidated: true,
        },
      ],
      history: [
        { teamName: "Minang Pride", period: "2024 - Sekarang", role: "Head Coach" },
        { teamName: "Tim PON Sumbar Cadangan", period: "2023 - 2024", role: "Analis" },
      ],
      joinedAt: "Februari 2024",
    },
  },
  {
    id: "co-legend",
    type: "coach",
    rarity: "legend",
    verification: "verified",
    tagline: "Head Coach Tim Esport PON Sumbar berlisensi kepelatihan tingkat A",
    data: {
      displayName: "Bambang Pamungkas, M.Or",
      ign: "MASTER_BAMBANG",
      avatarUrl:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop",
      game: "PUBG Mobile & Valorant",
      role: "Direktur Taktikal Provinsi",
      team: { name: "Puslatda ESI Sumbar" },
      region: { name: "Kota Padang", code: "PDG" },
      esportId: "ESB-PDG-CO-000001",
      badgeNumber: "ESI-SB-2023-C001",
      certification: {
        isCertified: true,
        name: "Lisensi Kepelatihan A PBESI",
        issuer: "PBESI Pusat",
        year: "2023",
      },
      achievements: [
        {
          title: "PON XXI Aceh-Sumut",
          level: "nasional",
          placement: "Medali Emas (Head Coach)",
          year: "2024",
          isValidated: true,
        },
      ],
      history: [
        { teamName: "Kontingen PON Sumbar", period: "2023 - 2024", role: "Pelatih Utama" },
        { teamName: "Minang United Esports", period: "2020 - 2023", role: "Head Coach" },
      ],
      joinedAt: "Januari 2023",
    },
  },

  // ==================== 3. TEAM CARDS (4 RARITIES) ====================
  {
    id: "tm-rookie",
    type: "team",
    rarity: "rookie",
    verification: "unverified",
    tagline: "Klub kampus baru terbentuk, pendaftaran anggota awal",
    data: {
      displayName: "Universitas Andalas Esport",
      teamName: "UNAND Titans",
      teamTag: "UTN",
      logoUrl:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop",
      game: "Valorant",
      homebase: "Kota Padang",
      region: { name: "Kota Padang", code: "PDG" },
      esportId: "ESB-PDG-TM-000088",
      captainOrManager: { name: "Fathur Rahman", role: "Kapten" },
      rosterCount: { current: 5, max: 7 },
      rosterMembers: [
        { ign: "Fathur", role: "Duelist" },
        { ign: "Daffa", role: "Initiator" },
        { ign: "Rayhan", role: "Controller" },
        { ign: "Bintang", role: "Sentinel" },
        { ign: "Gilang", role: "Flex" },
      ],
      foundedAt: "Desember 2025",
    },
  },
  {
    id: "tm-contender",
    type: "team",
    rarity: "contender",
    verification: "regional",
    tagline: "Klub kota aktif dengan roster terdaftar di ESI Payakumbuh",
    data: {
      displayName: "Payakumbuh United Esports",
      teamName: "Payakumbuh Cyber",
      teamTag: "PKC",
      logoUrl:
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=300&auto=format&fit=crop",
      game: "Free Fire",
      homebase: "Kota Payakumbuh",
      region: { name: "Kota Payakumbuh", code: "PYK" },
      esportId: "ESB-PYK-TM-000034",
      badgeNumber: "ESI-PYK-2025-007",
      captainOrManager: { name: "Wahyu Pratama", role: "Manajer" },
      rosterCount: { current: 5, max: 6 },
      rosterMembers: [
        { ign: "Wahyu", role: "Shotcaller" },
        { ign: "Derry", role: "Rusher" },
        { ign: "Niko", role: "Sniper" },
        { ign: "Aldo", role: "Support" },
        { ign: "Zaki", role: "Sub" },
      ],
      achievements: [
        {
          title: "Turnamen Esport Luak Limopuluah",
          level: "kota",
          placement: "Juara 2",
          year: "2025",
          isValidated: true,
        },
      ],
      foundedAt: "Agustus 2024",
    },
  },
  {
    id: "tm-elite",
    type: "team",
    rarity: "elite",
    verification: "verified",
    tagline: "Klub profesional resmi terakreditasi ESI Provinsi Sumatera Barat",
    data: {
      displayName: "Minang Pride Esports Club",
      teamName: "Minang Pride",
      teamTag: "MPR",
      logoUrl:
        "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=300&auto=format&fit=crop",
      game: "Mobile Legends: Bang Bang",
      homebase: "Kota Bukittinggi",
      region: { name: "Kota Bukittinggi", code: "BKT" },
      esportId: "ESB-BKT-TM-000015",
      badgeNumber: "ESI-SB-2024-T005",
      captainOrManager: { name: "Andi Saputra", role: "Manajer" },
      coachName: "Coach Dedi Kurniawan",
      rosterCount: { current: 6, max: 8 },
      rosterMembers: [
        { ign: "MARAWA_KING", role: "Roamer" },
        { ign: "BukitSlayer", role: "Jungler" },
        { ign: "SingaMalam", role: "Gold Laner" },
        { ign: "PariamanBoy", role: "EXP Laner" },
        { ign: "AgamWizard", role: "Mid Laner" },
        { ign: "RookieSub", role: "Sub / Flex" },
      ],
      achievements: [
        {
          title: "Liga Esport Piala Gubernur Sumbar",
          level: "provinsi",
          placement: "Juara 1 (Emas)",
          year: "2025",
          isValidated: true,
        },
        {
          title: "Kualifikasi Piala Presiden Barat",
          level: "nasional",
          placement: "Semifinalis",
          year: "2024",
          isValidated: true,
        },
      ],
      foundedAt: "Maret 2023",
    },
  },
  {
    id: "tm-legend",
    type: "team",
    rarity: "legend",
    verification: "verified",
    tagline: "Klub legendaris peraih medali PON XXI mewakili Sumatera Barat",
    data: {
      displayName: "Ranah Garuda Esports",
      teamName: "Ranah Garuda",
      teamTag: "RGD",
      logoUrl:
        "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=300&auto=format&fit=crop",
      game: "PUBG Mobile",
      homebase: "Kota Padang",
      region: { name: "Kota Padang", code: "PDG" },
      esportId: "ESB-PDG-TM-000001",
      badgeNumber: "ESI-SB-2023-T001",
      captainOrManager: { name: "H. Syahrul Munaf", role: "Manajer" },
      coachName: "Bambang Pamungkas",
      rosterCount: { current: 5, max: 6 },
      rosterMembers: [
        { ign: "SINGA_SINGKARAK", role: "IGL / Sniper" },
        { ign: "MarawaStrike", role: "Rusher 1" },
        { ign: "GarudaFly", role: "Rusher 2" },
        { ign: "KhatibSupport", role: "Support" },
        { ign: "AndalasShield", role: "Tactical Sub" },
      ],
      achievements: [
        {
          title: "PON XXI Aceh-Sumut",
          level: "nasional",
          placement: "Medali Emas",
          year: "2024",
          isValidated: true,
        },
        {
          title: "Kejurnas Esport Indonesia",
          level: "nasional",
          placement: "Juara 1 Nasional",
          year: "2024",
          isValidated: true,
        },
      ],
      foundedAt: "Januari 2022",
    },
  },
];
