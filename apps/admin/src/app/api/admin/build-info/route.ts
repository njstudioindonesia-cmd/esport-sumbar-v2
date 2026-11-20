import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    app: "ESPORT SUMBAR ADMIN",
    version: "3.0.0",
    commitHash: "9deae7a",
    commitBranch: "main",
    buildTime: new Date().toISOString(),
    environment: process.env.NODE_ENV || "production",
    nodeVersion: process.version,
    nextVersion: "16.4.5",
    authenticatedAdmin: {
      userId: "ec36111c-9800-42b6-b30c-be7461a38aa3",
      email: "sano@gmail.com",
    },
  });
}
