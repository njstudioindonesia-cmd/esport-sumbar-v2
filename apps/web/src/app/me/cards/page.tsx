import { permanentRedirect } from "next/navigation";

/**
 * Pengalihan Rute Multi-Profil Warisan (Keputusan P10)
 * Setiap akun hanya memiliki 1 profil dan 1 kartu digital aktif (/me/card).
 */
export default function MyCardsPage() {
  permanentRedirect("/me/card");
}
