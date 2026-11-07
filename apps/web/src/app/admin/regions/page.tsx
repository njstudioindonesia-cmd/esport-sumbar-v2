import { redirect } from "next/navigation";

/**
 * Rute lama /admin/regions dialihkan 301 permanen ke /admin (Mandat 9.3).
 * Tidak ada sisa hierarki UI daerah/provinsi di V3.
 */
export default function AdminRegionsPage() {
  redirect("/admin");
}
