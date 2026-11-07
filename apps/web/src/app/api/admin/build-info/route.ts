import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/auth/api-guard";
import { execSync } from "child_process";

function getGitCommit(): { hash: string; branch: string } {
  if (process.env.VERCEL_GIT_COMMIT_SHA) {
    return {
      hash: process.env.VERCEL_GIT_COMMIT_SHA,
      branch: process.env.VERCEL_GIT_COMMIT_REF || "main",
    };
  }

  try {
    const hash = execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
    const branch = execSync("git rev-parse --abbrev-ref HEAD", { encoding: "utf8" }).trim();
    return { hash, branch };
  } catch {
    return { hash: "67c8cd7", branch: "main" };
  }
}

export async function GET(request: NextRequest) {
  const { auth, errorResponse } = await verifyAdminAuth(["platform_admin"]);
  if (errorResponse) return errorResponse;

  const git = getGitCommit();

  return NextResponse.json({
    app: "ESPORT SUMBAR Web",
    version: "3.0.0",
    commitHash: git.hash,
    commitBranch: git.branch,
    buildTime: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    vercelUrl: process.env.VERCEL_URL || null,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://esport-sumbar-v2.vercel.app",
    nodeVersion: process.version,
    nextVersion: "16.4.5",
    authenticatedAdmin: auth ? { userId: auth.userId, email: auth.email } : null,
  });
}
