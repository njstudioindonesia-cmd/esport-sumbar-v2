import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";


export async function GET() {
  try {
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData.user) {
      return NextResponse.json({ profile: null, request: null }, { status: 401 });
    }

    // Ambil profil aktif milik akun pengguna
    const { data: profiles, error: profileErr } = await supabase
      .from("profiles")
      .select("*")
      .eq("account_id", authData.user.id)
      .order("created_at", { ascending: false })
      .limit(1);

    if (profileErr || !profiles || profiles.length === 0) {
      return NextResponse.json({ profile: null, request: null });
    }

    const activeProfile: any = profiles[0];

    // Ambil nama wilayah jika ada region_id
    let regionName = "Sumatera Barat";
    let regionCode = "SB";
    if (activeProfile.region_id) {
      const { data: reg } = await supabase
        .from("regions")
        .select("name, code")
        .eq("id", activeProfile.region_id)
        .maybeSingle();
      if (reg) {
        regionName = reg.name;
        regionCode = reg.code;
      }
    }

    // Ambil game jika ada main_game_id
    let gameName = "Esport";
    if (activeProfile.main_game_id) {
      const { data: gm } = await supabase
        .from("games")
        .select("name")
        .eq("id", activeProfile.main_game_id)
        .maybeSingle();
      if (gm) {
        gameName = gm.name;
      }
    }

    // Ambil permohonan verifikasi terakhir
    const { data: requests } = await supabase
      .from("verification_requests")
      .select("*")
      .eq("profile_id", activeProfile.id)
      .order("submitted_at", { ascending: false })
      .limit(1);

    const latestRequest = requests && requests.length > 0 ? requests[0] : null;

    return NextResponse.json({
      profile: {
        id: activeProfile.id,
        displayName: activeProfile.display_name,
        ign: activeProfile.ign,
        esportId: activeProfile.esport_id,
        entityType: activeProfile.entity_type,
        regionId: activeProfile.region_id,
        regionName,
        regionCode,
        gameName,
        verificationStatus: activeProfile.verification_status,
        rarityTier: activeProfile.rarity_tier,
      },
      request: latestRequest
        ? {
            id: latestRequest.id,
            status: latestRequest.status,
            notes: latestRequest.notes,
            submittedAt: latestRequest.submitted_at,
            decidedAt: latestRequest.decided_at,
            evidenceFiles: Array.isArray(latestRequest.evidence_files)
              ? latestRequest.evidence_files
              : [],
            revisionFields: Array.isArray(latestRequest.revision_fields_jsonb)
              ? latestRequest.revision_fields_jsonb
              : [],
          }
        : null,
    });
  } catch (err: any) {
    console.error("API /api/me/verification error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { profileId, regionId, notes, evidenceFiles } = body;

    if (!profileId) {
      return NextResponse.json({ error: "Profile ID required" }, { status: 400 });
    }

    // Verifikasi bahwa user adalah pemilik profil
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, region_id")
      .eq("id", profileId)
      .eq("account_id", authData.user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: "Profile not found or access denied" }, { status: 403 });
    }

    const effectiveRegionId = regionId || profile.region_id;

    // Masukkan ke verification_requests
    const { data: inserted, error: insertErr } = await supabase
      .from("verification_requests")
      .insert({
        profile_id: profileId,
        region_id: effectiveRegionId,
        status: "submitted",
        notes: notes || "",
        evidence_files: evidenceFiles || [],
        submitted_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertErr) {
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }

    // Perbarui status profil ke submitted
    await supabase
      .from("profiles")
      .update({
        verification_status: "submitted",
        updated_at: new Date().toISOString(),
      })
      .eq("id", profileId);

    return NextResponse.json({ success: true, request: inserted });
  } catch (err: any) {
    console.error("API POST /api/me/verification error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
