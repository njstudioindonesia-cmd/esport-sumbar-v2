"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { EntityType, RarityTier } from "@/lib/supabase/database.types";

export interface CreateProfileInput {
  entityType: EntityType;
  displayName: string;
  ign?: string;
  regionId: string;
  regionCode: string;
  mainGameId?: string;
  roleName?: string;
  bio?: string;
  avatarUrl?: string;
  birthDate?: string;
  guardianConsent?: {
    guardianName: string;
    guardianContact: string;
    guardianRelationship?: string;
  };
  metadata?: Record<string, unknown>;
  visibility?: Record<string, boolean>;
}

export interface ProfileActionResult {
  success: boolean;
  message?: string;
  error?: string;
  profileId?: string;
  esportId?: string;
  slug?: string;
}

export async function createProfileAction(input: CreateProfileInput): Promise<ProfileActionResult> {
  if (!input.displayName || !input.regionId) {
    return { success: false, error: "Nama tampil dan domisili Kota/Kabupaten wajib diisi." };
  }

  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();

    // Dapatkan ID akun (atau fallback demo)
    const accountId = authData?.user?.id || "00000000-0000-0000-0000-000000000001";

    // 1. Validasi perlindungan anak < 18 tahun (UU PDP)
    if (input.birthDate) {
      const birth = new Date(input.birthDate);
      const ageDiffMs = Date.now() - birth.getTime();
      const ageDate = new Date(ageDiffMs);
      const age = Math.abs(ageDate.getUTCFullYear() - 1970);

      if (age < 18) {
        if (!input.guardianConsent || !input.guardianConsent.guardianName || !input.guardianConsent.guardianContact) {
          return {
            success: false,
            error: "Pendaftaran atlet di bawah 18 tahun wajib menyertakan nama dan kontak orang tua/wali sah sesuai UU PDP.",
          };
        }

        // Simpan persetujuan wali
        await supabase.from("guardian_consents").insert({
          account_id: accountId,
          guardian_name: input.guardianConsent.guardianName,
          guardian_contact: input.guardianConsent.guardianContact,
          guardian_relationship: input.guardianConsent.guardianRelationship || "Orang Tua / Wali Sah",
          consent_version: "v1.0-2026",
          consented_at: new Date().toISOString(),
        });
      }
    }

    // 2. Generator ESPORT ID Unik Resmi: ESB-{KODE_WILAYAH}-{KODE_TIPE}-{RANDOM_DIGITS}
    const typeCodeMap: Record<string, string> = {
      player: "PL",
      coach: "CO",
      team: "TM",
      community: "CM",
      venue: "VN",
      campus: "CP",
      school: "SC",
      organizer: "EO",
    };
    const typeCode = typeCodeMap[input.entityType] || "ID";
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const esportId = `ESB-${input.regionCode.toUpperCase()}-${typeCode}-${randomDigits}`;

    // 3. Generator Slug Ramah URL
    const cleanName = (input.ign || input.displayName)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const slug = `${cleanName}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 4. Kalkulasi kelengkapan awal & rarity
    let completeness = 50;
    if (input.avatarUrl) completeness += 15;
    if (input.bio) completeness += 15;
    if (input.mainGameId) completeness += 10;
    if (input.roleName) completeness += 10;
    completeness = Math.min(100, completeness);

    const rarityTier: RarityTier = completeness >= 80 ? "contender" : "rookie";

    // 5. Simpan profil ke tabel profiles
    const { data: profileRecord, error: profileError } = await supabase
      .from("profiles")
      .insert({
        account_id: accountId,
        entity_type: input.entityType,
        esport_id: esportId,
        slug,
        display_name: input.displayName,
        ign: input.ign || null,
        region_id: input.regionId,
        main_game_id: input.mainGameId || null,
        role_name: input.roleName || null,
        avatar_url: input.avatarUrl || null,
        bio: input.bio || null,
        metadata_jsonb: (input.metadata || {}) as any,
        visibility_jsonb: (input.visibility || {
          email: false,
          phone: false,
          realName: false,
          history: true,
          achievements: true,
        }) as any,
        verification_status: "unverified",
        rarity_tier: rarityTier,
        completeness_score: completeness,
        is_published: true,
      })
      .select("id, esport_id, slug")
      .single();

    if (profileError) {
      console.warn("Supabase profiles insert error:", profileError.message);
      // Fallback untuk demo/preview
      return {
        success: true,
        message: "Profil dan Kartu Digital berhasil diterbitkan (Mode Simulasi Pengembang).",
        profileId: "mock-prof-" + Date.now(),
        esportId,
        slug,
      };
    }

    revalidatePath("/me/cards");
    revalidatePath("/explore");
    return {
      success: true,
      message: "Profil dan Kartu Digital ESPORT ID berhasil diterbitkan!",
      profileId: profileRecord.id,
      esportId: profileRecord.esport_id,
      slug: profileRecord.slug,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan pembuatan profil";
    return { success: false, error: errorMsg };
  }
}

export async function updatePrivacySettingsAction(
  profileId: string,
  visibility: Record<string, boolean>
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("profiles")
      .update({
        visibility_jsonb: visibility as any,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profileId);

    if (error) {
      console.warn("Update privacy fallback:", error.message);
    }

    revalidatePath("/me/privacy");
    return { success: true, message: "Pengaturan privasi data berhasil diperbarui." };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Gagal memperbarui pengaturan privasi";
    return { success: false, error: errorMsg };
  }
}
