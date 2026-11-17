export interface OfficialGame {
  id: string;
  name: string;
  shortName: string;
  genre: "MOBA" | "Battle Royale" | "Sports" | "FPS" | "Fighting";
  publisher: string;
  isActive: boolean;
}

export const OFFICIAL_GAMES: OfficialGame[] = [
  { id: "mlbb", name: "Mobile Legends: Bang Bang", shortName: "MLBB", genre: "MOBA", publisher: "Moonton", isActive: true },
  { id: "pubgm", name: "PUBG Mobile", shortName: "PUBGM", genre: "Battle Royale", publisher: "Krafton / Tencent", isActive: true },
  { id: "ff", name: "Free Fire", shortName: "FF", genre: "Battle Royale", publisher: "Garena", isActive: true },
  { id: "hok", name: "Honor of Kings", shortName: "HOK", genre: "MOBA", publisher: "Tencent / Level Infinite", isActive: true },
  { id: "efootball", name: "eFootball", shortName: "eFootball", genre: "Sports", publisher: "Konami", isActive: true },
];

export interface RegionDetail {
  id: string;
  code: string;
  name: string;
  type: "Kota" | "Kabupaten";
  slug: string;
}

export const REGIONS: RegionDetail[] = [
  { id: "reg-pdg", code: "PDG", name: "Kota Padang", type: "Kota", slug: "kota-padang" },
  { id: "reg-bkt", code: "BKT", name: "Kota Bukittinggi", type: "Kota", slug: "kota-bukittinggi" },
  { id: "reg-pyk", code: "PYK", name: "Kota Payakumbuh", type: "Kota", slug: "kota-payakumbuh" },
  { id: "reg-pdgp", code: "PDGP", name: "Kota Padang Panjang", type: "Kota", slug: "kota-padang-panjang" },
  { id: "reg-prm", code: "PRM", name: "Kota Pariaman", type: "Kota", slug: "kota-pariaman" },
  { id: "reg-slk", code: "SLK", name: "Kota Solok", type: "Kota", slug: "kota-solok" },
  { id: "reg-swl", code: "SWL", name: "Kota Sawahlunto", type: "Kota", slug: "kota-sawahlunto" },
  { id: "reg-agm", code: "AGM", name: "Kabupaten Agam", type: "Kabupaten", slug: "kabupaten-agam" },
  { id: "reg-tnd", code: "TND", name: "Kabupaten Tanah Datar", type: "Kabupaten", slug: "kabupaten-tanah-datar" },
  { id: "reg-lmp", code: "LMP", name: "Kabupaten Lima Puluh Kota", type: "Kabupaten", slug: "kabupaten-lima-puluh-kota" },
  { id: "reg-pdgp2", code: "PDGP2", name: "Kabupaten Padang Pariaman", type: "Kabupaten", slug: "kabupaten-padang-pariaman" },
  { id: "reg-pes", code: "PES", name: "Kabupaten Pesisir Selatan", type: "Kabupaten", slug: "kabupaten-pesisir-selatan" },
  { id: "reg-slk2", code: "SLK2", name: "Kabupaten Solok", type: "Kabupaten", slug: "kabupaten-solok" },
  { id: "reg-sls", code: "SLS", name: "Kabupaten Solok Selatan", type: "Kabupaten", slug: "kabupaten-solok-selatan" },
  { id: "reg-sjj", code: "SJJ", name: "Kabupaten Sijunjung", type: "Kabupaten", slug: "kabupaten-sijunjung" },
  { id: "reg-dhr", code: "DHR", name: "Kabupaten Dharmasraya", type: "Kabupaten", slug: "kabupaten-dharmasraya" },
  { id: "reg-pas", code: "PAS", name: "Kabupaten Pasaman", type: "Kabupaten", slug: "kabupaten-pasaman" },
  { id: "reg-psb", code: "PSB", name: "Kabupaten Pasaman Barat", type: "Kabupaten", slug: "kabupaten-pasaman-barat" },
  { id: "reg-mtw", code: "MTW", name: "Kabupaten Kepulauan Mentawai", type: "Kabupaten", slug: "kabupaten-kepulauan-mentawai" },
];

export const REGIONS_DETAIL = REGIONS;
