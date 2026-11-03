export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: "Agenda Resmi ESI" | "Turnamen Daerah" | "Tata Kelola" | "Prestasi Klub";
  region: string;
  date: string;
  readTime: string;
  imageUrl: string;
  isHeadline?: boolean;
}

export const MOCK_NEWS: Article[] = [
  {
    id: "news-headline-1",
    slug: "esi-sumbar-pemusatan-latihan-atlet-nasional-2026",
    title:
      "ESI Sumatera Barat Umumkan Pemusatan Latihan Terpusat Atlet Menuju Kualifikasi Nasional 2026",
    excerpt:
      "Pengurus Provinsi ESI Sumbar secara resmi membuka agenda pemusatan latihan atlet esports terverifikasi dari 19 Kota dan Kabupaten, mengintegrasikan data rekam jejak digital ESPORT ID sebagai tolok ukur pembinaan berjenjang.",
    category: "Agenda Resmi ESI",
    region: "Sumatera Barat",
    date: "3 Nov 2026",
    readTime: "4 menit baca",
    imageUrl:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
    isHeadline: true,
  },
  {
    id: "news-sub-1",
    slug: "piala-walikota-padang-esport-pelajar",
    title:
      "Piala Walikota Padang Esport: 64 Roster Pelajar Bertanding di GOR H. Agus Salim",
    excerpt:
      "Ajang kompetisi pelajar tingkat SMP/SMA sederajat se-Kota Padang resmi dibuka dengan standar verifikasi atlet muda dan persetujuan wali.",
    category: "Turnamen Daerah",
    region: "Kota Padang",
    date: "2 Nov 2026",
    readTime: "3 menit baca",
    imageUrl:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "news-sub-2",
    slug: "sosialisasi-registrasi-esport-id-bukittinggi",
    title:
      "Sosialisasi Registrasi ESPORT ID Digelar di Bukittinggi & Payakumbuh",
    excerpt:
      "Pengcab ESI Bukittinggi menggandeng komunitas lokal untuk mendata atlet dan pelatih agar terdaftar secara resmi di pangkalan data terpusat.",
    category: "Tata Kelola",
    region: "Kota Bukittinggi",
    date: "1 Nov 2026",
    readTime: "2 menit baca",
    imageUrl:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "news-sub-3",
    slug: "ranah-garuda-amankan-tiket-final-pubg-mobile",
    title:
      "Roster Ranah Garuda Amankan Tiket Grand Final Divisi PUBG Mobile",
    excerpt:
      "Klub asal Padang Pariaman tampil dominan di fase kualifikasi regional Sumatera dengan perolehan dua kali WWCD berturut-turut.",
    category: "Prestasi Klub",
    region: "Kab. Padang Pariaman",
    date: "31 Okt 2026",
    readTime: "3 menit baca",
    imageUrl:
      "https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=400&auto=format&fit=crop",
  },
];
