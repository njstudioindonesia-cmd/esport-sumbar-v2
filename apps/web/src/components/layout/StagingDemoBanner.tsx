import React from "react";
import { FlaskConical, AlertTriangle } from "lucide-react";

export function StagingDemoBanner() {
  // Dinonaktifkan secara default pada rilis publik V3 (v3.0.0).
  // Hanya aktif jika secara eksplisit diminta via env NEXT_PUBLIC_SHOW_STAGING_BANNER="true".
  if (process.env.NEXT_PUBLIC_SHOW_STAGING_BANNER !== "true") {
    return null;
  }

  const commitSha = process.env.VERCEL_GIT_COMMIT_SHA
    ? process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7)
    : "local";

  return (
    <aside
      role="banner"
      aria-label="Informasi Lingkungan Uji"
      className="sticky top-0 z-[100] w-full bg-amber-500/15 border-b border-amber-500/30 backdrop-blur-md px-4 py-1.5 text-xs font-mono text-amber-300 flex items-center justify-between shadow-sm"
    >
      <div className="flex items-center gap-2 mx-auto">
        <FlaskConical className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
        <span>
          <strong className="font-bold">LINGKUNGAN UJI</strong> — Mode Pratinjau Terbatas
        </span>
        <span className="hidden sm:inline text-amber-400/60 font-sans">|</span>
        <span className="hidden sm:inline text-[11px] text-amber-300/80">
          Commit: <code className="text-amber-200">{commitSha}</code>
        </span>
      </div>
    </aside>
  );
}
