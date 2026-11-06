/**
 * ESPORT SUMBAR V2 - Central Entity Definitions & Schema Module
 * Single Source of Truth untuk 7 Bidang Ekosistem Esport Sumatera Barat
 * (Player, Coach, Team, Community, Venue, Campus, School)
 *
 * Digunakan oleh:
 * 1. Wizard pembuatan profil (form dinamis & validasi klien)
 * 2. Server Actions (validasi Zod & sanitasi teks)
 * 3. Halaman profil publik (rendering atribut dinamis)
 * 4. Kartu TCG (Frame Rarity & Lencana ESPORT SUMBAR)
 * 5. Kalkulator kelengkapan data & rarity tier
 */

export * from "./types";
export * from "./schemas";
export * from "./completeness";
export * from "./registry";
