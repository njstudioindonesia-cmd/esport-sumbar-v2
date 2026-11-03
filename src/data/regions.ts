export interface Region {
  id: string;
  name: string;
  code: string;
  type: "kota" | "kabupaten";
  slug: string;
  isPilot?: boolean;
  adminMode: "active" | "fallback";
}

export const REGIONS: Region[] = [
  // 7 Kota
  { id: "reg-pdg", name: "Kota Padang", code: "PDG", type: "kota", slug: "kota-padang", isPilot: true, adminMode: "active" },
  { id: "reg-bkt", name: "Kota Bukittinggi", code: "BKT", type: "kota", slug: "kota-bukittinggi", isPilot: false, adminMode: "active" },
  { id: "reg-pyk", name: "Kota Payakumbuh", code: "PYK", type: "kota", slug: "kota-payakumbuh", isPilot: false, adminMode: "active" },
  { id: "reg-ppj", name: "Kota Padang Panjang", code: "PPJ", type: "kota", slug: "kota-padang-panjang", isPilot: false, adminMode: "fallback" },
  { id: "reg-prm", name: "Kota Pariaman", code: "PRM", type: "kota", slug: "kota-pariaman", isPilot: false, adminMode: "fallback" },
  { id: "reg-swl", name: "Kota Sawahlunto", code: "SWL", type: "kota", slug: "kota-sawahlunto", isPilot: false, adminMode: "fallback" },
  { id: "reg-slk", name: "Kota Solok", code: "SLK", type: "kota", slug: "kota-solok", isPilot: false, adminMode: "active" },

  // 12 Kabupaten
  { id: "reg-agm", name: "Kab. Agam", code: "AGM", type: "kabupaten", slug: "kab-agam", isPilot: false, adminMode: "active" },
  { id: "reg-dhm", name: "Kab. Dharmasraya", code: "DHM", type: "kabupaten", slug: "kab-dharmasraya", isPilot: false, adminMode: "fallback" },
  { id: "reg-mtw", name: "Kab. Kepulauan Mentawai", code: "MTW", type: "kabupaten", slug: "kab-kepulauan-mentawai", isPilot: false, adminMode: "fallback" },
  { id: "reg-lpk", name: "Kab. Lima Puluh Kota", code: "LPK", type: "kabupaten", slug: "kab-lima-puluh-kota", isPilot: false, adminMode: "fallback" },
  { id: "reg-pdp", name: "Kab. Padang Pariaman", code: "PDP", type: "kabupaten", slug: "kab-padang-pariaman", isPilot: true, adminMode: "active" },
  { id: "reg-pas", name: "Kab. Pasaman", code: "PAS", type: "kabupaten", slug: "kab-pasaman", isPilot: false, adminMode: "fallback" },
  { id: "reg-psb", name: "Kab. Pasaman Barat", code: "PSB", type: "kabupaten", slug: "kab-pasaman-barat", isPilot: false, adminMode: "fallback" },
  { id: "reg-pss", name: "Kab. Pesisir Selatan", code: "PSS", type: "kabupaten", slug: "kab-pesisir-selatan", isPilot: false, adminMode: "fallback" },
  { id: "reg-sjj", name: "Kab. Sijunjung", code: "SJJ", type: "kabupaten", slug: "kab-sijunjung", isPilot: false, adminMode: "fallback" },
  { id: "reg-ksl", name: "Kab. Solok", code: "KSL", type: "kabupaten", slug: "kab-solok", isPilot: false, adminMode: "fallback" },
  { id: "reg-sls", name: "Kab. Solok Selatan", code: "SLS", type: "kabupaten", slug: "kab-solok-selatan", isPilot: false, adminMode: "fallback" },
  { id: "reg-tnd", name: "Kab. Tanah Datar", code: "TND", type: "kabupaten", slug: "kab-tanah-datar", isPilot: false, adminMode: "fallback" },
];
