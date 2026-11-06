import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetType = searchParams.get("type");
    const gameId = searchParams.get("game_id");
    const q = searchParams.get("q") || "";

    if (!targetType) {
      return NextResponse.json({ error: "Parameter type target entitas diperlukan" }, { status: 400 });
    }

    const supabase = await createClient();
    let query = supabase
      .from("profiles")
      .select("id, display_name, ign, entity_type, esport_id, slug, avatar_url, main_game_id, region_id, verification_status")
      .eq("entity_type", targetType as any)
      .neq("verification_status", "suspended")
      .order("display_name", { ascending: true })
      .limit(30);

    if (gameId) {
      query = query.eq("main_game_id", gameId);
    }

    if (q.trim()) {
      query = query.ilike("display_name", `%${q.trim()}%`);
    }

    const { data: targets, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ targets: targets || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal mengambil target relasi" }, { status: 500 });
  }
}
