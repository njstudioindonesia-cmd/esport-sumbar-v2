import { permanentRedirect } from "next/navigation";

/**
 * Halaman /ecosystem dialihkan secara permanen langsung ke direktori jelajah talenta (/explore).
 */
export default function EcosystemPage() {
  permanentRedirect("/explore");
}
