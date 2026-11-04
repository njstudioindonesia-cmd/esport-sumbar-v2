import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData.user) {
      return NextResponse.json({ profiles: [], user: null }, { status: 200 });
    }

    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("*, regions(name, code), games(name, short_name)")
      .eq("account_id", authData.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Fetch user profiles error:", error);
      return NextResponse.json({ profiles: [], user: authData.user }, { status: 200 });
    }

    const mappedProfiles = (profiles || []).map((p: any) => ({
      id: p.id,
      entityType: p.entity_type,
      esportId: p.esport_id,
      slug: p.slug,
      displayName: p.display_name,
      ign: p.ign,
      regionName: p.regions?.name || "Sumatera Barat",
      regionCode: p.regions?.code || "SB",
      mainGameName: p.games?.name || "Esport",
      roleName: p.role_name,
      avatarUrl: p.avatar_url,
      verificationStatus: p.verification_status,
      rarityTier: p.rarity_tier,
      completenessScore: p.completeness_score,
      attributes: p.attributes || {},
      isDemo: p.is_demo,
      createdAt: p.created_at,
    }));

    return NextResponse.json({
      profiles: mappedProfiles,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        fullName: authData.user.user_metadata?.full_name || authData.user.email?.split("@")[0],
      },
    });
  } catch (error: any) {
    console.error("API /api/me/profiles error:", error);
    return NextResponse.json({ profiles: [], user: null });
  }
}
