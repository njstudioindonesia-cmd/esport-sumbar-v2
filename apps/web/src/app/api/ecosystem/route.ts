import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserEcosystem, getRelationRules } from "@/lib/services/relations";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, account_id, entity_type, display_name, ign, main_game_id, region_id, rarity_tier, completeness_score, verification_status")
      .eq("account_id", authData.user.id)
      .single();

    if (!profile) {
      return NextResponse.json({
        profile: null,
        rules: [],
        active: [],
        incomingPending: [],
        outgoingPending: [],
        history: [],
      });
    }

    const [rules, ecosystem] = await Promise.all([
      getRelationRules(),
      getUserEcosystem(profile.id),
    ]);

    // Filter rules yang berlaku untuk entity_type profil pengguna saat ini
    const applicableRules = rules.filter((r) => r.sourceEntityType === profile.entity_type);

    return NextResponse.json({
      profile,
      rules: applicableRules,
      active: ecosystem.active,
      incomingPending: ecosystem.incomingPending,
      outgoingPending: ecosystem.outgoingPending,
      history: ecosystem.history,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal memuat ekosistem" }, { status: 500 });
  }
}
