import { PlayerCardData, CardRarity, CardVerification } from "@/types/card";

export interface MockCardVariant {
  id: string;
  rarity: CardRarity;
  verification: CardVerification;
  data: PlayerCardData;
  tagline: string;
}

export const MOCK_PLAYERS: MockCardVariant[] = [
  {
    id: "rookie-player",
    rarity: "rookie",
    verification: "regional",
    tagline: "Profil atlet muda dengan verifikasi awal ESI Kota Padang",
    data: {
      ign: "SUTAN_AIM",
      displayName: "Raka Pratama",
      avatarUrl:
        "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=400&auto=format&fit=crop",
      game: "Free Fire",
      role: "Rusher",
      team: {
        name: "Marawa Muda",
      },
      region: {
        name: "Kota Padang",
        code: "PDG",
      },
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
        {
          title: "Liga Pelajar SMA Sumbar",
          level: "provinsi",
          placement: "Top 4",
          year: "2025",
          isValidated: false,
        },
      ],
      history: [
        {
          teamName: "Marawa Muda",
          period: "2025 - Sekarang",
          role: "Rusher",
        },
        {
          teamName: "Khatib Squad",
          period: "2024 - 2025",
          role: "Fragger",
        },
      ],
      joinedAt: "Januari 2025",
    },
  },
  {
    id: "elite-player",
    rarity: "elite",
    verification: "verified",
    tagline: "Atlet berprestasi resmi diverifikasi penuh oleh ESI Sumbar",
    data: {
      ign: "MARAWA_KING",
      displayName: "Fikri Alamsyah",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
      game: "Mobile Legends: Bang Bang",
      role: "Roamer / Shotcaller",
      team: {
        name: "Minang Pride",
      },
      region: {
        name: "Kota Bukittinggi",
        code: "BKT",
      },
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
        {
          title: "Turnamen Terbuka Jam Gadang",
          level: "kota",
          placement: "Juara 1",
          year: "2024",
          isValidated: true,
        },
      ],
      history: [
        {
          teamName: "Minang Pride",
          period: "2024 - Sekarang",
          role: "Roamer",
        },
        {
          teamName: "Bukittinggi Esport Club",
          period: "2023 - 2024",
          role: "Mid Laner",
        },
      ],
      joinedAt: "Maret 2024",
    },
  },
  {
    id: "legend-player",
    rarity: "legend",
    verification: "verified",
    tagline: "Atlet level nasional dengan frame kristal animasi prestisius",
    data: {
      ign: "SINGA_SINGKARAK",
      displayName: "Aidil Syahputra",
      avatarUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
      game: "PUBG Mobile",
      role: "Sniper / IGL",
      team: {
        name: "Ranah Garuda",
      },
      region: {
        name: "Kab. Padang Pariaman",
        code: "PDP",
      },
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
        {
          title: "Kualifikasi Pra-PON Regional Sumatera",
          level: "provinsi",
          placement: "Juara 1",
          year: "2023",
          isValidated: true,
        },
      ],
      history: [
        {
          teamName: "Ranah Garuda",
          period: "2023 - Sekarang",
          role: "IGL",
        },
        {
          teamName: "Pariaman All-Stars",
          period: "2022 - 2023",
          role: "Sniper",
        },
      ],
      joinedAt: "Januari 2023",
    },
  },
];
