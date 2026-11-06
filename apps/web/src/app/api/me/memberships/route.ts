import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get("team_id");

    // Jika mencari roster untuk tim spesifik
    if (teamId) {
      const { data: members, error: rosterErr } = await supabase
        .from("memberships")
        .select(`
          id,
          role_in_org,
          status,
          initiated_by,
          started_at,
          member:profiles!memberships_member_profile_id_fkey(
            id,
            display_name,
            ign,
            avatar_url,
            esport_id,
            rarity_tier,
            verification_status,
            entity_type
          )
        `)
        .eq("org_profile_id", teamId)
        .order("created_at", { ascending: true });

      if (rosterErr) {
        return NextResponse.json({ error: rosterErr.message, roster: [] }, { status: 500 });
      }

      const formattedRoster = (members || []).map((m: any) => ({
        id: m.id,
        memberProfileId: m.member?.id,
        name: m.member?.display_name || "Anggota Tim",
        ign: m.member?.ign || "-",
        role: m.role_in_org || "Anggota",
        avatarUrl: m.member?.avatar_url || null,
        esportId: m.member?.esport_id || "-",
        rarityTier: m.member?.rarity_tier || "rookie",
        verificationStatus: m.member?.verification_status || "unverified",
        status: m.status,
        isPending: m.status === "pending",
        startedAt: m.started_at,
      }));

      return NextResponse.json({ roster: formattedRoster });
    }

    // Ambil semua profil milik pengguna saat ini
    const { data: myProfiles } = await supabase
      .from("profiles")
      .select("id, entity_type, display_name")
      .eq("account_id", authData.user.id);

    const profileIds = (myProfiles || []).map((p) => p.id);

    if (profileIds.length === 0) {
      return NextResponse.json({ invitations: [], requests: [], memberships: [] });
    }

    // Ambil data keanggotaan di mana user sebagai anggota (atlet/pelatih)
    const { data: memberRows, error: memErr } = await supabase
      .from("memberships")
      .select(`
        id,
        role_in_org,
        status,
        initiated_by,
        created_at,
        started_at,
        org:profiles!memberships_org_profile_id_fkey(
          id,
          display_name,
          slug,
          avatar_url,
          esport_id,
          regions(name),
          games(name)
        )
      `)
      .in("member_profile_id", profileIds)
      .order("created_at", { ascending: false });

    if (memErr) {
      return NextResponse.json({ error: memErr.message }, { status: 500 });
    }

    const invitations: any[] = [];
    const requests: any[] = [];
    const activeMemberships: any[] = [];

    (memberRows || []).forEach((r: any) => {
      const item = {
        id: r.id,
        teamId: r.org?.id,
        teamName: r.org?.display_name || "Tim Esport",
        teamSlug: r.org?.slug,
        avatarUrl: r.org?.avatar_url,
        esportId: r.org?.esport_id,
        game: r.org?.games?.name || "Esport",
        regionName: r.org?.regions?.name || "Sumatera Barat",
        role: r.role_in_org,
        status: r.status,
        createdAt: r.created_at,
        startedAt: r.started_at,
      };

      if (r.status === "accepted") {
        activeMemberships.push(item);
      } else if (r.status === "pending") {
        if (r.initiated_by === "org") {
          invitations.push(item);
        } else {
          requests.push(item);
        }
      }
    });

    return NextResponse.json({
      invitations,
      requests,
      memberships: activeMemberships,
    });
  } catch (err: any) {
    console.error("API GET /api/me/memberships error:", err);
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
    const { memberProfileId, orgProfileId, roleInOrg, initiatedBy } = body;

    if (!memberProfileId || !orgProfileId) {
      return NextResponse.json({ error: "Member ID and Org ID are required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("memberships")
      .insert({
        member_profile_id: memberProfileId,
        org_profile_id: orgProfileId,
        role_in_org: roleInOrg || "Anggota",
        status: "pending",
        initiated_by: initiatedBy || "member",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, membership: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { membershipId, action } = body; // action: "accept" | "decline"

    if (!membershipId || !action) {
      return NextResponse.json({ error: "Membership ID and action required" }, { status: 400 });
    }

    const newStatus = action === "accept" ? "accepted" : "declined";
    const updatePayload: any = {
      status: newStatus,
      updated_at: new Date().toISOString(),
    };

    if (newStatus === "accepted") {
      updatePayload.started_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("memberships")
      .update(updatePayload)
      .eq("id", membershipId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, membership: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
