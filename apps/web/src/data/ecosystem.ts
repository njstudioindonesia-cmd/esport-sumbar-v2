export interface CommunityItem {
  id: string;
  name: string;
  slug: string;
  regionId: string;
  regionName: string;
  category: string; // e.g. Mobile Legends, Multi-Game, FPS, Sim-Racing
  memberCount: number;
  leaderName: string;
  verifiedStatus: "verified" | "registered" | "pending";
  description: string;
  contactWa: string;
  socialMedia: string;
  foundedYear: string;
}

export interface VenueItem {
  id: string;
  name: string;
  slug: string;
  regionId: string;
  regionName: string;
  address: string;
  category: "Gaming House" | "Cyber Lounge" | "Esports Arena" | "Bootcamp Station";
  pcCount?: number;
  mobileStations?: number;
  internetSpeedMbps: number;
  isVerified: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
  contactPhone: string;
  facilities: string[];
}

export interface SchoolCampusItem {
  id: string;
  name: string;
  slug: string;
  type: "Universitas / Perguruan Tinggi" | "SMA / SMK" | "Akademi Olahraga";
  regionId: string;
  regionName: string;
  clubName: string;
  activePlayersCount: number;
  isRegistered: boolean;
  coachName: string;
  achievementsCount: number;
  description: string;
}

export const MOCK_COMMUNITIES: CommunityItem[] = [
  {
    id: "com-01",
    name: "Komunitas MLBB Ranah Minang",
    slug: "mlbb-ranah-minang",
    regionId: "reg-pdg",
    regionName: "Kota Padang",
    category: "Mobile Legends: Bang Bang",
    memberCount: 3420,
    leaderName: "Irfan 'MinangRoam' Syahputra",
    verifiedStatus: "verified",
    description: "Komunitas penggiat pemain Mobile Legends terbesar se-Sumbar dengan agenda mabar mingguan dan scouting atlet Komunitas Esport.",
    contactWa: "+62 812-6677-8899",
    socialMedia: "@mlbb_ranahminang",
    foundedYear: "2020",
  },
  {
    id: "com-02",
    name: "Bukittinggi Battle Royale Guild",
    slug: "bkt-battle-royale",
    regionId: "reg-bkt",
    regionName: "Kota Bukittinggi",
    category: "PUBG Mobile & Free Fire",
    memberCount: 1850,
    leaderName: "Randi 'AimGod' Pratama",
    verifiedStatus: "verified",
    description: "Wadah kompetitif skuad battle royale kawasan Bukittinggi dan Agam Timur dengan turnamen bulanan.",
    contactWa: "+62 821-4433-2211",
    socialMedia: "@bkt_brguild",
    foundedYear: "2021",
  },
  {
    id: "com-03",
    name: "Luak Limopuluah Cyber Alliance",
    slug: "luak-limopuluah-cyber",
    regionId: "reg-pyk",
    regionName: "Kota Payakumbuh",
    category: "Multi-Game PC & Mobile",
    memberCount: 1240,
    leaderName: "Yogi Pratama",
    verifiedStatus: "verified",
    description: "Aliansi pegiat esport Payakumbuh dan Lima Puluh Kota yang menaungi divisi MOBA, FPS, dan simulator sepak bola.",
    contactWa: "+62 853-9988-7766",
    socialMedia: "@luak50_cyber",
    foundedYear: "2022",
  },
  {
    id: "com-04",
    name: "Solok Raya Tactical FPS",
    slug: "solok-tactical-fps",
    regionId: "reg-slk",
    regionName: "Kota Solok",
    category: "Valorant & Tactical Shooter",
    memberCount: 780,
    leaderName: "Haikal 'Phantom' Akbar",
    verifiedStatus: "registered",
    description: "Komunitas penembak taktis dan pemain PC games wilayah Solok Raya dan sekitarnya.",
    contactWa: "+62 813-1122-3344",
    socialMedia: "@solok_fps",
    foundedYear: "2023",
  },
];

export const MOCK_VENUES: VenueItem[] = [
  {
    id: "ven-01",
    name: "Minang Cyber Arena Padang",
    slug: "minang-cyber-arena",
    regionId: "reg-pdg",
    regionName: "Kota Padang",
    address: "Jl. Veteran No. 45, Padang Barat (Dekat Pantai Padang)",
    category: "Esports Arena",
    pcCount: 48,
    mobileStations: 20,
    internetSpeedMbps: 500,
    isVerified: true,
    coordinates: { lat: -0.9471, lng: 100.3543 },
    contactPhone: "+62 751-897654",
    facilities: [
      "Broadcasting Booth & Stage Turnamen",
      "VIP Bootcamp Room (5 PC Isolasi Suara)",
      "Dedicated Leased Line 500 Mbps Dual ISP",
      "Kantin Atlet Berstandar Gizi",
      "Area Nonton Bareng LED Videotron",
    ],
  },
  {
    id: "ven-02",
    name: "Jam Gadang Gaming Lounge",
    slug: "jam-gadang-gaming-lounge",
    regionId: "reg-bkt",
    regionName: "Kota Bukittinggi",
    address: "Jl. Sudirman No. 18, Tarok Dipo, Bukittinggi",
    category: "Cyber Lounge",
    pcCount: 32,
    mobileStations: 16,
    internetSpeedMbps: 300,
    isVerified: true,
    coordinates: { lat: -0.3055, lng: 100.3692 },
    contactPhone: "+62 752-624119",
    facilities: [
      "PC Gaming Spek Turnamen RTX 4070",
      "Monitor 240Hz Fast IPS",
      "Lounge Khusus Mobile Games dengan Wi-Fi 6",
      "Ruang Diskusi & Analisis Replay Coach",
    ],
  },
  {
    id: "ven-03",
    name: "Lembah Harau Bootcamp Base",
    slug: "lembah-harau-bootcamp",
    regionId: "reg-pyk",
    regionName: "Kota Payakumbuh",
    address: "Kawasan Wisata Harau, Payakumbuh",
    category: "Bootcamp Station",
    pcCount: 15,
    mobileStations: 25,
    internetSpeedMbps: 200,
    isVerified: true,
    coordinates: { lat: -0.2248, lng: 100.6309 },
    contactPhone: "+62 812-7788-9900",
    facilities: [
      "Suasana Pelatihan Alam Terbuka Bebas Bising",
      "Mes Atlet 20 Kamar dengan AC",
      "Ruang Sidang Taktik & Whiteboard Analyst",
      "Koneksi Fiber Optik Langsung",
    ],
  },
  {
    id: "ven-04",
    name: "GOR H. Agus Salim Esport Center",
    slug: "gor-agus-salim-esport",
    regionId: "reg-pdg",
    regionName: "Kota Padang",
    address: "Gedung PKM Kompleks GOR H. Agus Salim, Padang",
    category: "Esports Arena",
    pcCount: 20,
    mobileStations: 40,
    internetSpeedMbps: 1000,
    isVerified: true,
    coordinates: { lat: -0.9238, lng: 100.3601 },
    contactPhone: "+62 751-705123",
    facilities: [
      "Pusat Pelatihan Daerah Atlet PON Sumbar",
      "Gedung Berkapasitas 800 Penonton",
      "Lighting & Sound System Panggung Penuh",
      "Klinik Medis Olahraga & Psikologi Atlet",
    ],
  },
];

export const MOCK_SCHOOLS: SchoolCampusItem[] = [
  {
    id: "sch-01",
    name: "Universitas Andalas (UNAND)",
    slug: "universitas-andalas",
    type: "Universitas / Perguruan Tinggi",
    regionId: "reg-pdg",
    regionName: "Kota Padang",
    clubName: "UNAND Titans Esports Association",
    activePlayersCount: 145,
    isRegistered: true,
    coachName: "Fadli 'Tactician' Pratama",
    achievementsCount: 14,
    description: "UKM olahraga elektronik kampus terdaftar dengan divisi Mobile Legends, PUBG Mobile, Valorant, dan eFootball.",
  },
  {
    id: "sch-02",
    name: "Universitas Negeri Padang (UNP)",
    slug: "universitas-negeri-padang",
    type: "Universitas / Perguruan Tinggi",
    regionId: "reg-pdg",
    regionName: "Kota Padang",
    clubName: "UNP Cyber Warriors",
    activePlayersCount: 120,
    isRegistered: true,
    coachName: "Romi Kurniawan, M.Pd",
    achievementsCount: 11,
    description: "Pusat riset dan pembinaan atlet mahasiswa dengan integrasi kurikulum kepelatihan Fakultas Ilmu Keolahragaan.",
  },
  {
    id: "sch-03",
    name: "SMK Negeri 2 Padang",
    slug: "smk-negeri-2-padang",
    type: "SMA / SMK",
    regionId: "reg-pdg",
    regionName: "Kota Padang",
    clubName: "SMKN 2 Esports Pioneer",
    activePlayersCount: 65,
    isRegistered: true,
    coachName: "Budi Satria, S.Kom",
    achievementsCount: 8,
    description: "Sekolah kejuruan teknologi pertama di Sumbar dengan ekstrakurikuler esport terdaftar di bawah bimbingan Komunitas Esport Padang.",
  },
  {
    id: "sch-04",
    name: "SMA Negeri 1 Bukittinggi",
    slug: "sma-negeri-1-bukittinggi",
    type: "SMA / SMK",
    regionId: "reg-bkt",
    regionName: "Kota Bukittinggi",
    clubName: "Landbouw High Esports",
    activePlayersCount: 50,
    isRegistered: true,
    coachName: "Dedi 'Analyst' Gunawan",
    achievementsCount: 6,
    description: "Sekolah menengah unggulan dengan tim PUBG Mobile peraih juara turnamen antar-pelajar tingkat provinsi.",
  },
];
