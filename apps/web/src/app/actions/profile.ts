"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { EntityType, RarityTier } from "@/lib/supabase/database.types";
import { calculateCompletenessScore, calculateRarityTier } from "@/lib/entities";

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
  const cleanDisplayName = input.displayName?.trim();
  const cleanRegionId = input.regionId?.trim();

  // Validasi Input Sisi Server
  if (!cleanDisplayName || !cleanRegionId) {
    return { success: false, error: "Nama tampil dan domisili Kota/Kabupaten wajib diisi." };
  }

  if (cleanDisplayName.length > 100) {
    return { success: false, error: "Nama tampil tidak boleh melebihi 100 karakter." };
  }

  if (input.ign && input.ign.trim().length > 50) {
    return { success: false, error: "In-Game Name (IGN) tidak boleh melebihi 50 karakter." };
  }

  if (input.bio && input.bio.trim().length > 500) {
    return { success: false, error: "Bio profil tidak boleh melebihi 500 karakter." };
  }

  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();

    // Verifikasi otentikasi akun pengguna
    let accountId = authData?.user?.id;
    if (!accountId) {
      const isPlaceholder = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").includes("placeholder");
      if (isPlaceholder) {
        accountId = "00000000-0000-0000-0000-000000000001";
      } else {
        return {
          success: false,
          error: "Akses ditolak: Anda harus masuk ke akun Anda terlebih dahulu untuk membuat profil.",
        };
      }
    }

    // 0. Penegakan Aturan V3: Periksa Peran Admin & 1 Akun 1 Profil
    if (accountId && !accountId.startsWith("00000000")) {
      const { data: accountData } = await supabase
        .from("accounts")
        .select("role")
        .eq("id", accountId)
        .maybeSingle();

      if (accountData?.role === "platform_admin") {
        return {
          success: false,
          error: "Akun administrator platform dilarang memiliki profil entitas.",
        };
      }

      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id, esport_id")
        .eq("account_id", accountId)
        .maybeSingle();

      if (existingProfile) {
        return {
          success: false,
          error: "Sesuai aturan ketat 1 akun 1 profil (V3), akun Anda telah memiliki profil terdaftar.",
          profileId: existingProfile.id,
          esportId: existingProfile.esport_id,
        };
      }
    }

    // 1. Validasi perlindungan anak < 18 tahun (UU PDP)
    if (input.birthDate) {
      const birth = new Date(input.birthDate);
      const ageDiffMs = Date.now() - birth.getTime();
      const ageDate = new Date(ageDiffMs);
      const age = Math.abs(ageDate.getUTCFullYear() - 1970);

      if (age < 18) {
        if (!input.guardianConsent || !input.guardianConsent.guardianName?.trim() || !input.guardianConsent.guardianContact?.trim()) {
          return {
            success: false,
            error: "Pendaftaran atlet di bawah 18 tahun wajib menyertakan nama dan kontak orang tua/wali sah sesuai UU PDP.",
          };
        }

        // Simpan persetujuan wali
        await supabase.from("guardian_consents").insert({
          account_id: accountId,
          guardian_name: input.guardianConsent.guardianName.trim().slice(0, 150),
          guardian_contact: input.guardianConsent.guardianContact.trim().slice(0, 100),
          guardian_relationship: (input.guardianConsent.guardianRelationship || "Orang Tua / Wali Sah").slice(0, 50),
          consent_version: "v1.0-2026",
          consented_at: new Date().toISOString(),
        });
      }
    }

    // 2. Generator ESPORT ID Unik Resmi via RPC Database atau Standar Formula
    let esportId: string;
    try {
      const { data: rpcId } = await supabase.rpc("generate_esport_id" as any, {
        p_region_id: cleanRegionId,
        p_entity_type: input.entityType,
      });
      if (rpcId && typeof rpcId === "string") {
        esportId = rpcId;
      } else {
        const typeCodeMap: Record<string, string> = {
          player: "PL",
          coach: "CO",
          team: "TM",
          community: "CM",
          venue: "VN",
          campus: "CP",
          school: "SC",
        };
        const typeCode = typeCodeMap[input.entityType] || "ID";
        const randomDigits = Math.floor(100000 + Math.random() * 900000);
        esportId = `ESB-${(input.regionCode || "SB").toUpperCase()}-${typeCode}-${randomDigits}`;
      }
    } catch {
      const typeCodeMap: Record<string, string> = {
        player: "PL",
        coach: "CO",
        team: "TM",
        community: "CM",
        venue: "VN",
        campus: "CP",
        school: "SC",
      };
      const typeCode = typeCodeMap[input.entityType] || "ID";
      const randomDigits = Math.floor(100000 + Math.random() * 900000);
      esportId = `ESB-${(input.regionCode || "SB").toUpperCase()}-${typeCode}-${randomDigits}`;
    }

    // 3. Generator Slug Ramah URL
    const cleanName = (input.ign || cleanDisplayName)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const slug = `${cleanName}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 4. Kalkulasi kelengkapan & rarity tier resmi
    const completeness = calculateCompletenessScore(
      input.entityType,
      {
        display_name: cleanDisplayName,
        region_id: cleanRegionId,
        avatar_url: input.avatarUrl,
        bio: input.bio,
        main_game_id: input.mainGameId,
      },
      input.metadata || {}
    );

    const rarityTier: RarityTier = calculateRarityTier({
      completenessScore: completeness,
      confirmedRelationsCount: 0,
      validatedAchievementsCount: 0,
    });

    // 5. Sanitasi atribut publik (Keluarkan data kontak privat sebelum simpan ke profiles)
    const rawMeta = { ...(input.metadata || {}) };
    const publicAttributes: Record<string, unknown> = {};
    const privateKeys = new Set([
      "whatsapp",
      "phone",
      "email",
      "full_name",
      "game_account_id",
      "game_server",
      "address_street",
      "guardian_whatsapp",
      "manager_whatsapp",
    ]);

    for (const [k, v] of Object.entries(rawMeta)) {
      if (!privateKeys.has(k)) {
        publicAttributes[k] = v;
      }
    }

    const { data: profileRecord, error: profileError } = await supabase
      .from("profiles")
      .insert({
        account_id: accountId,
        entity_type: input.entityType,
        esport_id: esportId,
        slug,
        display_name: cleanDisplayName,
        ign: input.ign?.trim() || null,
        region_id: cleanRegionId,
        main_game_id: input.mainGameId || null,
        role_name: input.roleName || null,
        avatar_url: input.avatarUrl || null,
        avatar_path: input.avatarUrl || null,
        bio: input.bio?.trim() || null,
        attributes: publicAttributes as any,
        metadata_jsonb: publicAttributes as any,
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
      return { success: false, error: profileError.message };
    }

    // 6. Simpan data pribadi & kontak ke profile_private (Kepatuhan UU PDP)
    try {
      await supabase.from("profile_private").upsert(
        {
          profile_id: profileRecord.id,
          account_id: accountId,
          full_name: (rawMeta.full_name as string) || cleanDisplayName,
          whatsapp_e164: (rawMeta.whatsapp as string) || (rawMeta.phone as string) || null,
          contact_email: (rawMeta.email as string) || null,
          birth_date: input.birthDate || null,
          gender: (rawMeta.gender as any) || null,
          address_street: (rawMeta.address_street as string) || (rawMeta.address as string) || null,
          kecamatan: (rawMeta.kecamatan as string) || null,
          nagari_kelurahan: (rawMeta.nagari_kelurahan as string) || null,
          game_account_id: (rawMeta.game_account_id as string) || null,
          game_server: (rawMeta.game_server as string) || null,
          guardian_name: input.guardianConsent?.guardianName || null,
          guardian_whatsapp: input.guardianConsent?.guardianContact || null,
          guardian_relationship: input.guardianConsent?.guardianRelationship || null,
          rate_note: (rawMeta.rate_note as string) || null,
          manager_name: (rawMeta.manager_name as string) || null,
          manager_role: (rawMeta.manager_role as string) || null,
          manager_whatsapp: (rawMeta.manager_whatsapp as string) || null,
        },
        { onConflict: "profile_id" }
      );
    } catch {
      // Jangan batalkan jika tabel profile_private belum di-migrate di database target
    }

    // 7. Catat persetujuan syarat & ketentuan ke tabel consents
    try {
      await supabase.from("consents").insert([
        {
          account_id: accountId,
          type: "terms_of_service",
          version: "v1.0-2026",
        },
        {
          account_id: accountId,
          type: "privacy_policy",
          version: "v1.0-2026",
        },
      ]);
    } catch {
      // Ignored if table not ready
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
    const { data: authData } = await supabase.auth.getUser();

    if (!authData?.user?.id) {
      return { success: false, error: "Akses ditolak: Anda harus masuk ke akun Anda." };
    }

    // Verifikasi Kepemilikan Profil (Mencegah IDOR)
    const { data: profileData, error: profileFetchError } = await supabase
      .from("profiles")
      .select("account_id")
      .eq("id", profileId)
      .single();

    if (profileData && profileData.account_id !== authData.user.id) {
      return { success: false, error: "Akses ditolak: Anda bukan pemilik sah dari profil ini." };
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        visibility_jsonb: visibility as any,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profileId)
      .eq("account_id", authData.user.id); // Guard klausa akun pemilik

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/me/privacy");
    return { success: true, message: "Pengaturan privasi data berhasil diperbarui." };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Gagal memperbarui pengaturan privasi";
    return { success: false, error: errorMsg };
  }
}

/**
 * Menyimpan draf profil sementara ke basis data
 */
export async function saveProfileDraftAction(
  input: Partial<CreateProfileInput>
): Promise<{ success: boolean; draftId?: string; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();

    let accountId = authData?.user?.id;
    const isPlaceholder = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").includes("placeholder");

    if (!accountId) {
      if (isPlaceholder) {
        accountId = "00000000-0000-0000-0000-000000000001";
      } else {
        return { success: false, error: "Akses ditolak: Masuk untuk menyimpan draf." };
      }
    }

    const cleanDisplayName = input.displayName?.trim() || "Draf Profil Baru";
    const cleanRegionId = input.regionId || "reg-pdg-01";
    const entityType = input.entityType || "player";
    const draftSlug = `draft-${accountId?.slice(0, 8) || "user"}-${Date.now()}`;

    const { data: draftRecord, error } = await supabase
      .from("profiles")
      .upsert(
        {
          account_id: accountId,
          entity_type: entityType,
          slug: draftSlug,
          display_name: cleanDisplayName,
          region_id: cleanRegionId,
          ign: input.ign?.trim() || null,
          main_game_id: input.mainGameId || null,
          role_name: input.roleName || null,
          avatar_url: input.avatarUrl || null,
          bio: input.bio?.trim() || null,
          attributes: (input.metadata || {}) as any,
          metadata_jsonb: (input.metadata || {}) as any,
          visibility_jsonb: (input.visibility || {}) as any,
          verification_status: "unverified",
          is_published: false,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      )
      .select("id")
      .single();

    if (error && !isPlaceholder) {
      return { success: false, error: error.message };
    }

    return { success: true, draftId: draftRecord?.id };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Gagal menyimpan draf";
    return { success: false, error: errorMsg };
  }
}

/**
 * Server Action: Perbarui Profil Eksisting (SPEC 4.4)
 * Menerapkan aturan verifikasi ulang otomatis bila field kunci diubah.
 */
export async function updateProfileAction(
  profileId: string,
  input: {
    displayName: string;
    ign?: string;
    bio?: string;
    roleName?: string;
    avatarUrl?: string;
    metadata?: Record<string, unknown>;
  }
): Promise<{ success: boolean; message?: string; error?: string; reVerifyRequired?: boolean }> {
  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData?.user?.id;

    if (!userId) {
      return { success: false, error: "Akses ditolak: Anda harus masuk ke akun Anda." };
    }

    // 1. Ambil data profil lama untuk memvalidasi kepemilikan dan field kunci
    const { data: existing, error: fetchErr } = await supabase
      .from("profiles")
      .select("id, account_id, display_name, ign, verification_status, attributes")
      .eq("id", profileId)
      .single();

    if (fetchErr || !existing) {
      return { success: false, error: "Profil tidak ditemukan." };
    }

    if (existing.account_id !== userId) {
      return { success: false, error: "Akses ditolak: Anda bukan pemilik profil ini." };
    }

    // 2. Cek apakah field identitas kunci diubah saat sudah verified
    const keyFieldChanged =
      existing.display_name !== input.displayName.trim() ||
      (existing.ign || "") !== (input.ign?.trim() || "");

    const wasVerified = existing.verification_status === "verified";
    let newStatus = existing.verification_status;
    let reVerifyRequired = false;

    if (wasVerified && keyFieldChanged) {
      newStatus = "submitted";
      reVerifyRequired = true;

      // Catat ke audit log
      try {
        await supabase.from("audit_logs").insert({
          actor_account_id: userId,
          actor_role: "user",
          action: "PROFILE_KEY_FIELD_MODIFIED",
          target_type: "profiles",
          target_id: profileId,
          region_id: null,
          previous_status: existing.verification_status,
          new_status: "submitted",
          reason: "Perubahan nama atau IGN pada profil terverifikasi memicu verifikasi ulang otomatis.",
          metadata_jsonb: {
            old_name: existing.display_name,
            new_name: input.displayName.trim(),
            old_ign: existing.ign,
            new_ign: input.ign?.trim(),
          },
        });
      } catch {
        // Ignored
      }
    }

    // 3. Pisahkan atribut publik vs data privat
    const rawMeta = { ...(input.metadata || {}) };
    const publicAttrs: Record<string, unknown> = { ...(existing.attributes as Record<string, unknown> || {}) };
    const privateKeys = new Set([
      "whatsapp",
      "phone",
      "email",
      "full_name",
      "game_account_id",
      "game_server",
      "address_street",
      "guardian_whatsapp",
      "manager_whatsapp",
    ]);

    for (const [k, v] of Object.entries(rawMeta)) {
      if (!privateKeys.has(k)) {
        publicAttrs[k] = v;
      }
    }

    // 4. Update tabel profiles
    const { error: updateErr } = await supabase
      .from("profiles")
      .update({
        display_name: input.displayName.trim(),
        ign: input.ign?.trim() || null,
        bio: input.bio?.trim() || null,
        role_name: input.roleName || null,
        avatar_url: input.avatarUrl || undefined,
        attributes: publicAttrs as any,
        verification_status: newStatus as any,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profileId)
      .eq("account_id", userId);

    if (updateErr) {
      return { success: false, error: updateErr.message };
    }

    // 5. Update tabel profile_private
    try {
      await supabase.from("profile_private").upsert(
        {
          profile_id: profileId,
          account_id: userId,
          full_name: (rawMeta.full_name as string) || input.displayName.trim(),
          whatsapp_e164: (rawMeta.whatsapp as string) || (rawMeta.phone as string) || null,
          contact_email: (rawMeta.email as string) || null,
          address_street: (rawMeta.address_street as string) || null,
          kecamatan: (rawMeta.kecamatan as string) || null,
          nagari_kelurahan: (rawMeta.nagari_kelurahan as string) || null,
          game_account_id: (rawMeta.game_account_id as string) || null,
          game_server: (rawMeta.game_server as string) || null,
          rate_note: (rawMeta.rate_note as string) || null,
          manager_name: (rawMeta.manager_name as string) || null,
          manager_role: (rawMeta.manager_role as string) || null,
          manager_whatsapp: (rawMeta.manager_whatsapp as string) || null,
        },
        { onConflict: "profile_id" }
      );
    } catch {
      // Ignored if table not migrated yet
    }

    revalidatePath(`/profile/${profileId}`);
    revalidatePath("/me/cards");
    revalidatePath("/explore");

    return {
      success: true,
      message: reVerifyRequired
        ? "Perubahan berhasil disimpan. Karena nama/IGN diubah, status verifikasi dialihkan ke peninjauan ulang."
        : "Profil berhasil diperbarui!",
      reVerifyRequired,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Gagal memperbarui profil";
    return { success: false, error: errorMsg };
  }
}

