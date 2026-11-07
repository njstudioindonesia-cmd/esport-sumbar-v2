"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewProfileWizardRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Mandat 1 Akun 1 Identitas Bidang (Keputusan P10): Rute pendaftaran terpusat di /onboarding
    router.replace("/onboarding");
  }, [router]);

  return (
    <main className="min-h-screen w-full bg-[#07080C] flex items-center justify-center text-white/50 text-sm font-mono">
      <span>Mengalihkan ke alur onboarding terpadu...</span>
    </main>
  );
}
