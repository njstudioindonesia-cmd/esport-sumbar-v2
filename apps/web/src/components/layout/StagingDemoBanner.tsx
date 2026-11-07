import React from "react";
import { FlaskConical, AlertTriangle } from "lucide-react";

export function StagingDemoBanner() {
  const isStaging =
    process.env.NEXT_PUBLIC_IS_STAGING === "true" ||
    process.env.SHOW_DEMO_DATA === "true" ||
    process.env.NODE_ENV === "development";

  if (!isStaging) return null;

  const commitSha = process.env.VERCEL_GIT_COMMIT_SHA
    ? process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7)
    : "local";

  return (
    <aside
      role="banner"
      aria-label="Informasi Lingkungan Staging"
      className="sticky top-0 z-[100] w-full bg-amber-500/15 border-b border-amber-500/30 backdrop-blur-md px-4 py-1.5 text-xs font-mono text-amber-300 flex items-center justify-between shadow-sm"
    >
      <div className="flex items-center gap-2 mx-auto">
        <FlaskConical className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
        <span>
          <strong className="font-bold">LINGKUNGAN STAGING (DATA DEMO)</strong> — Platform ESPORT SUMBAR V3 dalam peninjauan pra-rilis.
        </span>
        <span className="hidden sm:inline text-amber-400/60 font-sans">|</span>
        <span className="hidden sm:inline text-[11px] text-amber-300/80">
          Commit: <code className="text-amber-200">{commitSha}</code>
        </span>
      </div>
    </aside>
  );
}
