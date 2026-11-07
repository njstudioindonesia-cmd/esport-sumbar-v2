import { redirect } from "next/navigation";

/**
 * Rute lama /admin/moderation dialihkan permanen ke /admin/reports (Mandat 9.1 & 9.3).
 */
export default function AdminModerationPage() {
  redirect("/admin/reports");
}
