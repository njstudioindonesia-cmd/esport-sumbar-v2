export interface TournamentMatch {
  id: string;
  round: "Quarterfinals" | "Semifinals" | "Bronze Match" | "Grand Finals";
  matchNumber: number;
  teamA: {
    name: string;
    score: number;
    tag: string;
    isWinner?: boolean;
  };
  teamB: {
    name: string;
    score: number;
    tag: string;
    isWinner?: boolean;
  };
  status: "completed" | "live" | "upcoming";
  scheduledTime: string;
}

export interface TournamentItem {
  id: string;
  title: string;
  slug: string;
  tier: "Mayor (Provinsi)" | "Reguler (Kota/Kab)" | "Pelajar / Kampus";
  game: string;
  gameShort: string;
  regionName: string;
  prizePool: string;
  registeredTeamsCount: number;
  maxTeams: number;
  startDate: string;
  endDate: string;
  status: "pendaftaran" | "berlangsung" | "selesai";
  organizer: string;
  isOfficial: boolean;
  rulesSummary: string;
  matches: TournamentMatch[];
}

export interface CircuitLeaderboardEntry {
  rank: number;
  teamName: string;
  teamTag: string;
  regionName: string;
  regionCode: string;
  game: string;
  points: number;
  goldMedals: number;
  silverMedals: number;
  bronzeMedals: number;
  tournamentsPlayed: number;
}

export const MOCK_TOURNAMENTS: TournamentItem[] = [
  {
    id: "trn-01",
    title: "Piala Gubernur Esport Sumatera Barat 2026",
    slug: "piala-gubernur-esport-sumbar-2026",
    tier: "Mayor (Provinsi)",
    game: "Mobile Legends: Bang Bang",
    gameShort: "MLBB",
    regionName: "Seluruh Sumatera Barat (19 Kota/Kab)",
    prizePool: "Rp 50.000.000",
    registeredTeamsCount: 64,
    maxTeams: 64,
    startDate: "20 Mei 2026",
    endDate: "24 Mei 2026",
    status: "berlangsung",
    organizer: "ESPORT SUMBAR Official",
    isOfficial: true,
    rulesSummary: "Sistem Single Elimination BO3 hingga Semifinal, Grand Finals BO5. Wajib menyertakan kartu verifikasi ESPORT ID aktif untuk seluruh roster.",
    matches: [
      {
        id: "m-01",
        round: "Quarterfinals",
        matchNumber: 1,
        teamA: { name: "Marawa Squad Padang", tag: "MRW", score: 2, isWinner: true },
        teamB: { name: "Singa Singgalang BKT", tag: "SSG", score: 1 },
        status: "completed",
        scheduledTime: "21 Mei 2026 - 14:00 WIB",
      },
      {
        id: "m-02",
        round: "Quarterfinals",
        matchNumber: 2,
        teamA: { name: "Harau Cyber Payakumbuh", tag: "HCP", score: 2, isWinner: true },
        teamB: { name: "Sijunjung Rangers", tag: "SJR", score: 0 },
        status: "completed",
        scheduledTime: "21 Mei 2026 - 16:30 WIB",
      },
      {
        id: "m-03",
        round: "Quarterfinals",
        matchNumber: 3,
        teamA: { name: "UNAND Titans", tag: "UND", score: 2, isWinner: true },
        teamB: { name: "Solok Bareh Esports", tag: "SLK", score: 1 },
        status: "completed",
        scheduledTime: "21 Mei 2026 - 19:00 WIB",
      },
      {
        id: "m-04",
        round: "Quarterfinals",
        matchNumber: 4,
        teamA: { name: "Pariaman Coastal Kings", tag: "PCK", score: 2, isWinner: true },
        teamB: { name: "Pasaman Warriors", tag: "PSW", score: 0 },
        status: "completed",
        scheduledTime: "21 Mei 2026 - 21:00 WIB",
      },
      {
        id: "m-05",
        round: "Semifinals",
        matchNumber: 5,
        teamA: { name: "Marawa Squad Padang", tag: "MRW", score: 2, isWinner: true },
        teamB: { name: "Harau Cyber Payakumbuh", tag: "HCP", score: 1 },
        status: "completed",
        scheduledTime: "22 Mei 2026 - 15:00 WIB",
      },
      {
        id: "m-06",
        round: "Semifinals",
        matchNumber: 6,
        teamA: { name: "UNAND Titans", tag: "UND", score: 2, isWinner: true },
        teamB: { name: "Pariaman Coastal Kings", tag: "PCK", score: 0 },
        status: "completed",
        scheduledTime: "22 Mei 2026 - 18:30 WIB",
      },
      {
        id: "m-07",
        round: "Bronze Match",
        matchNumber: 7,
        teamA: { name: "Harau Cyber Payakumbuh", tag: "HCP", score: 2, isWinner: true },
        teamB: { name: "Pariaman Coastal Kings", tag: "PCK", score: 1 },
        status: "completed",
        scheduledTime: "23 Mei 2026 - 15:00 WIB",
      },
      {
        id: "m-08",
        round: "Grand Finals",
        matchNumber: 8,
        teamA: { name: "Marawa Squad Padang", tag: "MRW", score: 3, isWinner: true },
        teamB: { name: "UNAND Titans", tag: "UND", score: 2 },
        status: "completed",
        scheduledTime: "24 Mei 2026 - 19:00 WIB",
      },
    ],
  },
  {
    id: "trn-02",
    title: "Liga Pelajar Esport Padang 2026",
    slug: "liga-pelajar-esport-padang-2026",
    tier: "Pelajar / Kampus",
    game: "Free Fire",
    gameShort: "Free Fire",
    regionName: "Kota Padang",
    prizePool: "Rp 15.000.000",
    registeredTeamsCount: 36,
    maxTeams: 48,
    startDate: "10 Juni 2026",
    endDate: "14 Juni 2026",
    status: "pendaftaran",
    organizer: "Komunitas Esport Kota Padang x Dinas Pendidikan",
    isOfficial: true,
    rulesSummary: "Khusus pelajar SMA/SMK se-Kota Padang dengan izin orang tua / wali sah sesuai UU PDP. Format Battle Royale 6 Match per Day.",
    matches: [],
  },
  {
    id: "trn-03",
    title: "Bukittinggi PUBG Mobile Championship 2026",
    slug: "bukittinggi-pubg-mobile-2026",
    tier: "Reguler (Kota/Kab)",
    game: "PUBG Mobile",
    gameShort: "PUBGM",
    regionName: "Kota Bukittinggi",
    prizePool: "Rp 20.000.000",
    registeredTeamsCount: 32,
    maxTeams: 32,
    startDate: "1 Juli 2026",
    endDate: "3 Juli 2026",
    status: "pendaftaran",
    organizer: "Komunitas Esport Bukittinggi",
    isOfficial: true,
    rulesSummary: "Piala Bergilir Jam Gadang Cup divisi PUBG Mobile. Terbuka untuk klub berdomisili Bukittinggi, Agam, dan Tanah Datar.",
    matches: [],
  },
];

export const MOCK_CIRCUIT_LEADERBOARD: CircuitLeaderboardEntry[] = [
  {
    rank: 1,
    teamName: "Marawa Squad Padang",
    teamTag: "MRW",
    regionName: "Kota Padang",
    regionCode: "PDG",
    game: "Mobile Legends: Bang Bang",
    points: 1250,
    goldMedals: 3,
    silverMedals: 1,
    bronzeMedals: 0,
    tournamentsPlayed: 4,
  },
  {
    rank: 2,
    teamName: "UNAND Titans",
    teamTag: "UND",
    regionName: "Kota Padang",
    regionCode: "PDG",
    game: "Mobile Legends & Valorant",
    points: 980,
    goldMedals: 1,
    silverMedals: 2,
    bronzeMedals: 1,
    tournamentsPlayed: 4,
  },
  {
    rank: 3,
    teamName: "Harau Cyber Payakumbuh",
    teamTag: "HCP",
    regionName: "Kota Payakumbuh",
    regionCode: "PYK",
    game: "Mobile Legends & Free Fire",
    points: 820,
    goldMedals: 1,
    silverMedals: 1,
    bronzeMedals: 2,
    tournamentsPlayed: 4,
  },
  {
    rank: 4,
    teamName: "Singa Singgalang Bukittinggi",
    teamTag: "SSG",
    regionName: "Kota Bukittinggi",
    regionCode: "BKT",
    game: "PUBG Mobile",
    points: 710,
    goldMedals: 1,
    silverMedals: 0,
    bronzeMedals: 1,
    tournamentsPlayed: 3,
  },
  {
    rank: 5,
    teamName: "Pariaman Coastal Kings",
    teamTag: "PCK",
    regionName: "Kota Pariaman",
    regionCode: "PRM",
    game: "Battle Royale Mobile",
    points: 620,
    goldMedals: 0,
    silverMedals: 1,
    bronzeMedals: 1,
    tournamentsPlayed: 3,
  },
  {
    rank: 6,
    teamName: "Solok Bareh Esports",
    teamTag: "SLK",
    regionName: "Kota Solok",
    regionCode: "SLK",
    game: "eFootball & Free Fire",
    points: 540,
    goldMedals: 0,
    silverMedals: 1,
    bronzeMedals: 0,
    tournamentsPlayed: 2,
  },
];
