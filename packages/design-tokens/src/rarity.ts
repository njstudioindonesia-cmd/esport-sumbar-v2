/**
 * ESPORT SUMBAR V3: Physical Material Rarity Tokens
 * 4 Tier resmi: Rookie, Contender, Elite, Legend.
 * Dibedakan oleh TEKSTUR BAHAN FISIK nyata, bukan glow neon murahan.
 */

export const rarityMaterials = {
  rookie: {
    id: "rookie",
    label: "Rookie",
    material: "Matte Bronze",
    description: "Finishing perunggu grafit matte tanpa refleksi menyilaukan.",
    colors: {
      bg: "linear-gradient(180deg, #1A1412 0%, #0D0A09 100%)",
      border: "rgba(168, 120, 89, 0.35)",
      badge: "#A87859",
      text: "#D4A373",
      accent: "#8D5B3A",
    },
  },
  contender: {
    id: "contender",
    label: "Contender",
    material: "Satin Silver",
    description: "Tekstur perak satin presisi baja canai dingin.",
    colors: {
      bg: "linear-gradient(180deg, #151A24 0%, #0B0E14 100%)",
      border: "rgba(203, 213, 225, 0.40)",
      badge: "#CBD5E1",
      text: "#F1F5F9",
      accent: "#94A3B8",
    },
  },
  elite: {
    id: "elite",
    label: "Elite",
    material: "Brushed Gold",
    description: "Emas matte bertekstur logam mulia dengan highlight presisi.",
    colors: {
      bg: "linear-gradient(180deg, #1F190B 0%, #0E0B05 100%)",
      border: "rgba(212, 175, 55, 0.50)",
      badge: "#D4AF37",
      text: "#FDE68A",
      accent: "#B45309",
    },
  },
  legend: {
    id: "legend",
    label: "Legend",
    material: "Prismatic Crystal",
    description: "Obsidian kristal gelap dengan refraksi prismatik subtil.",
    colors: {
      bg: "linear-gradient(180deg, #191228 0%, #0A0712 100%)",
      border: "rgba(168, 85, 247, 0.45)",
      badge: "#C084FC",
      text: "#F3E8FF",
      accent: "#9333EA",
    },
  },
} as const;

export type RarityTierKey = keyof typeof rarityMaterials;
