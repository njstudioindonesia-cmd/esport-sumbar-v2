export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: "Agenda Resmi ESI" | "Turnamen Daerah" | "Tata Kelola" | "Prestasi Klub";
  region: string;
  author: string;
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
    content: [
      "PADANG — Pengurus Provinsi Perkumpulan Esport Indonesia (Pengprov ESI) Sumatera Barat secara resmi mengumumkan pembukaan Pemusatan Latihan Terpusat (Puslatda) atlet esports dalam rangka persiapan menghadapi babak kualifikasi kejuaraan tingkat nasional 2026.",
      "Langkah strategis ini menandai era baru tata kelola olahraga elektronik di Ranah Minang, di mana seluruh atlet yang dipanggil merupakan talenta yang telah memiliki identitas digital resmi (ESPORT ID) dan lolos verifikasi berjenjang dari Pengcab ESI Kabupaten/Kota masing-masing.",
      "Ketua Harian Pengprov ESI Sumbar dalam sambutannya menegaskan bahwa transparansi data menjadi kunci objektivitas pemilihan kontingen. 'Kita tidak lagi memilih atlet berdasarkan rekomendasi subjektif semata. Setiap atlet yang dipanggil memiliki rekam jejak prestasi digital yang terdata, tervalidasi, dan memiliki integritas rekam jejak yang jelas,' ungkapnya di Sekretariat ESI Sumbar, Padang.",
      "Pemusatan latihan ini mencakup lima nomor game resmi yang dipertandingkan, yaitu Mobile Legends: Bang Bang (MLBB), Free Fire, PUBG Mobile, Valorant, dan eFootball. Selain pelatihan mekanik dan taktik permainan, tim pelatih juga membekali atlet dengan analisis mental kompetisi, nutrisi, dan pemahaman regulasi anti-doping elektronik.",
      "Diharapkan dengan pemanfaatan platform ESPORT SUMBAR sebagai satu sumber data tunggal (single source of truth), ekosistem esports di 19 kota dan kabupaten dapat terus melahirkan bibit-bibit juara yang siap mengharumkan nama Sumatera Barat di kancah nasional maupun internasional.",
    ],
    category: "Agenda Resmi ESI",
    region: "Sumatera Barat",
    author: "Biro Humas & Media ESI Sumbar",
    date: "3 Nov 2026",
    readTime: "4 menit baca",
    imageUrl:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop",
    isHeadline: true,
  },
  {
    id: "news-sub-1",
    slug: "piala-walikota-padang-esport-pelajar",
    title:
      "Piala Walikota Padang Esport: 64 Roster Pelajar Bertanding di GOR H. Agus Salim",
    excerpt:
      "Ajang kompetisi pelajar tingkat SMP/SMA sederajat se-Kota Padang resmi dibuka dengan standar verifikasi atlet muda dan persetujuan wali.",
    content: [
      "PADANG — Sebanyak 64 tim pelajar tingkat sekolah menengah pertama dan atas se-Kota Padang resmi berlaga dalam kejuaraan Piala Walikota Padang Esport 2026 yang berlangsung di kawasan GOR H. Agus Salim.",
      "Turnamen ini menarik perhatian luas karena menjadi kompetisi pelajar pertama di Sumatera Barat yang mengadopsi regulasi ketat perlindungan anak sesuai UU PDP dan panduan ESI. Setiap peserta di bawah usia 18 tahun diwajibkan menyertakan surat persetujuan orang tua/wali serta rekomendasi sekolah.",
      "Kategori yang dipertandingkan meliputi Free Fire dan Mobile Legends. Selain memperebutkan piala bergilir dan beasiswa pembinaan, para juara turnamen ini secara otomatis mendapatkan peningkatan tier rarity ke Contender/Elite pada kartu identitas digital ESPORT ID mereka.",
    ],
    category: "Turnamen Daerah",
    region: "Kota Padang",
    author: "Redaksi ESPORT SUMBAR",
    date: "2 Nov 2026",
    readTime: "3 menit baca",
    imageUrl:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "news-sub-2",
    slug: "sosialisasi-registrasi-esport-id-bukittinggi",
    title:
      "Sosialisasi Registrasi ESPORT ID Digelar di Bukittinggi & Payakumbuh",
    excerpt:
      "Pengcab ESI Bukittinggi menggandeng komunitas lokal untuk mendata atlet dan pelatih agar terdaftar secara resmi di pangkalan data terpusat.",
    content: [
      "BUKITTINGGI — Pengurus Cabang ESI Kota Bukittinggi bekerja sama dengan ESI Kota Payakumbuh menggelar lokakarya sosialisasi sistem registrasi ESPORT ID di Balai Sidang Bung Hatta.",
      "Kegiatan ini dihadiri oleh puluhan manajer tim, pemilik game house, pembina ekskul sekolah, serta perwakilan komunitas gamer dari kawasan Luak Agam dan Luak Limopuluah.",
      "Sekretaris Umum ESI Bukittinggi memaparkan alur pemeriksaan berjenjang di mana tim dan atlet yang terdata akan mendapatkan verifikasi 'Regional Checked' sebelum diajukan untuk mendapatkan status verifikasi penuh di tingkat provinsi.",
    ],
    category: "Tata Kelola",
    region: "Kota Bukittinggi",
    author: "Koresponden Bukittinggi",
    date: "1 Nov 2026",
    readTime: "2 menit baca",
    imageUrl:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "news-sub-3",
    slug: "ranah-garuda-amankan-tiket-final-pubg-mobile",
    title:
      "Roster Ranah Garuda Amankan Tiket Grand Final Divisi PUBG Mobile",
    excerpt:
      "Klub asal Padang Pariaman tampil dominan di fase kualifikasi regional Sumatera dengan perolehan dua kali WWCD berturut-turut.",
    content: [
      "PADANG PARIAMAN — Klub kebanggaan masyarakat Padang Pariaman, Ranah Garuda Esports, berhasil mengamankan tiket menuju putaran Grand Final turnamen kualifikasi regional Sumatera divisi PUBG Mobile.",
      "Dipimpin oleh kapten dan sniper handal Aidil 'SINGA_SINGKARAK' Syahputra, skuad Ranah Garuda menunjukkan konsistensi permainan rotasi dan penguasaan zona yang sangat matang sepanjang lima ronde pertandingan fase grup.",
      "Prestasi gemilang ini semakin mengukuhkan reputasi Ranah Garuda sebagai pemegang status kartu Tier 4 (Legend) terverifikasi resmi ESI Sumbar.",
    ],
    category: "Prestasi Klub",
    region: "Kab. Padang Pariaman",
    author: "Liputan Lapangan Esport",
    date: "31 Okt 2026",
    readTime: "3 menit baca",
    imageUrl:
      "https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "news-sub-4",
    slug: "pembekalan-lisensi-pelatih-esport-sumbar",
    title:
      "Akademi Garudaku & ESI Sumbar Sukses Gelar Sertifikasi Pelatih Lisensi B",
    excerpt:
      "Sebanyak 24 calon pelatih taktis dari berbagai daerah di Sumatera Barat dinyatakan lulus uji kompetensi kepelatihan nasional.",
    content: [
      "PADANG — Pengprov ESI Sumbar bersama Akademi Garudaku resmi menutup rangkaian program sertifikasi kepelatihan esport lisensi nasional tingkat B yang berlangsung selama tiga hari.",
      "Para pelatih yang lulus kini tercatat secara resmi di database direktori ESPORT SUMBAR dengan kartu profil khusus Coach berlisensi.",
    ],
    category: "Tata Kelola",
    region: "Sumatera Barat",
    author: "Biro Humas & Media ESI Sumbar",
    date: "28 Okt 2026",
    readTime: "3 menit baca",
    imageUrl:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop",
  },
];
