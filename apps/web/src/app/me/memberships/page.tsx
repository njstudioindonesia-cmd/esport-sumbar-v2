import { permanentRedirect } from "next/navigation";

/**
 * Pengalihan Rute Relasi Multi-Profil Warisan (Keputusan P10)
 * Seluruh relasi ekosistem tunggal dikelola di /me/ecosystem.
 */
export default function MembershipsPage() {
  permanentRedirect("/me/ecosystem");
}
