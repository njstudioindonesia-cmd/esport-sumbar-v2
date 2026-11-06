import { NextResponse } from "next/server";
import { getGamesCatalog } from "@/lib/services/games";

export async function GET() {
  try {
    const catalog = await getGamesCatalog();
    return NextResponse.json({
      success: true,
      games: catalog,
      total: catalog.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Gagal memuat katalog game" },
      { status: 500 }
    );
  }
}
