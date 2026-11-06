import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { verifyAdminAuth } from "@/lib/auth/api-guard";

export async function GET(request: NextRequest) {
  const { auth, errorResponse } = await verifyAdminAuth(["platform_admin"]);
  if (errorResponse) return errorResponse;

  try {
    const admin = createAdminClient();
    const { data: accountsData, error: accountsError } = await admin
      .from("accounts")
      .select("id, email, role, is_active, created_at")
      .order("created_at", { ascending: false });

    if (accountsError) {
      return NextResponse.json({ error: accountsError.message, accounts: [] }, { status: 500 });
    }

    // Fetch linked profiles
    const accountIds = (accountsData || []).map((a) => a.id);
    const { data: profilesData } = await admin
      .from("profiles")
      .select("id, account_id, display_name, entity_type, esport_id, verification_status")
      .in("account_id", accountIds);

    const profileMap = new Map<string, any>();
    (profilesData || []).forEach((p) => {
      profileMap.set(p.account_id, {
        id: p.id,
        displayName: p.display_name,
        entityType: p.entity_type,
        esportId: p.esport_id,
        verificationStatus: p.verification_status,
      });
    });

    const accounts = (accountsData || []).map((acc: any) => ({
      id: acc.id,
      email: acc.email,
      role: acc.role,
      status: acc.is_active ? "active" : "inactive",
      createdAt: new Date(acc.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      profile: profileMap.get(acc.id) || null,
    }));

    return NextResponse.json({ accounts });
  } catch (err: any) {
    console.error("API /api/admin/accounts error:", err);
    return NextResponse.json({ error: err.message, accounts: [] }, { status: 500 });
  }
}
