"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface GameInput {
  id?: string;
  name: string;
  shortName: string;
  slug: string;
  genre: "moba" | "battle_royale" | "fps" | "sports" | "other";
  platform: "mobile" | "pc" | "cross_platform";
  publisher?: string;
  category?: string;
  isActive?: boolean;
}

export interface GameRoleInput {
  id?: string;
  gameId: string;
  roleName: string;
  description?: string;
  sortOrder?: number;
}

export interface GameRankInput {
  id?: string;
  gameId: string;
  tierName: string;
  tierLevel: number;
  sortOrder?: number;
}

/**
 * Server Action: Tambah atau Ubah Game (Admin Mandat 5.3)
 */
export async function saveGameAction(input: GameInput): Promise<{ success: boolean; error?: string; gameId?: string }> {
  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) {
      return { success: false, error: "Akses ditolak: Masuk diperlukan." };
    }

    const { data: account } = await supabase
      .from("accounts")
      .select("role")
      .eq("id", authData.user.id)
      .single();

    if (account?.role !== "platform_admin") {
      return { success: false, error: "Akses ditolak: Hanya platform_admin yang berwenang mengelola katalog game." };
    }

    const admin = createAdminClient();
    const gameId = input.id || `game-${input.slug.toLowerCase().replace(/[^a-z0-9]/g, "")}`;

    const { data: existing } = await admin.from("games").select("id, is_active").eq("id", gameId).single();

    const { error } = await admin.from("games").upsert({
      id: gameId,
      name: input.name.trim(),
      short_name: input.shortName.trim(),
      slug: input.slug.trim().toLowerCase(),
      genre: input.genre,
      platform: input.platform,
      publisher: input.publisher?.trim() || null,
      category: input.category?.trim() || null,
      is_active: input.isActive ?? true,
      roles_jsonb: [],
      updated_at: new Date().toISOString(),
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Catat ke audit log
    await admin.from("audit_logs").insert({
      actor_account_id: authData.user.id,
      actor_role: "platform_admin",
      action: existing ? "CATALOG_GAME_UPDATED" : "CATALOG_GAME_CREATED",
      target_type: "games",
      target_id: gameId,
      region_id: null,
      previous_status: existing ? (existing.is_active ? "active" : "inactive") : null,
      new_status: input.isActive ? "active" : "inactive",
      reason: `Pengelolaan katalog game: ${input.name}`,
      metadata_jsonb: { game_id: gameId, name: input.name, genre: input.genre },
    });

    revalidatePath("/admin/games");
    revalidatePath("/explore");
    return { success: true, gameId };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal menyimpan game" };
  }
}

/**
 * Server Action: Aktifkan / Nonaktifkan Game
 */
export async function toggleGameStatusAction(gameId: string, currentStatus: boolean): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) return { success: false, error: "Akses ditolak" };

    const admin = createAdminClient();
    const nextStatus = !currentStatus;

    const { error } = await admin.from("games").update({ is_active: nextStatus }).eq("id", gameId);
    if (error) return { success: false, error: error.message };

    await admin.from("audit_logs").insert({
      actor_account_id: authData.user.id,
      actor_role: "platform_admin",
      action: "CATALOG_GAME_STATUS_TOGGLED",
      target_type: "games",
      target_id: gameId,
      region_id: null,
      previous_status: currentStatus ? "active" : "inactive",
      new_status: nextStatus ? "active" : "inactive",
      reason: `Status game diubah menjadi ${nextStatus ? "aktif" : "non-aktif"}`,
      metadata_jsonb: { game_id: gameId, is_active: nextStatus },
    });

    revalidatePath("/admin/games");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal mengubah status game" };
  }
}

/**
 * Server Action: Hapus Game (Dengan Proteksi Integritas Profil Mandat 5.3)
 */
export async function deleteGameAction(gameId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) return { success: false, error: "Akses ditolak" };

    const admin = createAdminClient();

    // 1. Periksa apakah game sedang digunakan oleh profil
    const { count: profileCount, error: countErr } = await admin
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("main_game_id", gameId);

    if (countErr) return { success: false, error: countErr.message };

    if (profileCount && profileCount > 0) {
      return {
        success: false,
        error: `Game tidak dapat dihapus permanen karena sedang digunakan oleh ${profileCount} profil aktif. Silakan nonaktifkan status game sebagai gantinya (Mandat 5.3).`,
      };
    }

    // 2. Lakukan penghapusan aman jika tidak ada referensi profil
    const { error: delErr } = await admin.from("games").delete().eq("id", gameId);
    if (delErr) return { success: false, error: delErr.message };

    await admin.from("audit_logs").insert({
      actor_account_id: authData.user.id,
      actor_role: "platform_admin",
      action: "CATALOG_GAME_DELETED",
      target_type: "games",
      target_id: gameId,
      region_id: null,
      previous_status: "active",
      new_status: "deleted",
      reason: `Game ${gameId} dihapus permanen oleh admin (0 referensi profil)`,
      metadata_jsonb: { game_id: gameId },
    });

    revalidatePath("/admin/games");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal menghapus game" };
  }
}

/**
 * Server Action: Tambah / Perbarui Role Game
 */
export async function saveGameRoleAction(input: GameRoleInput): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) return { success: false, error: "Akses ditolak" };

    const admin = createAdminClient();
    const { error } = await admin.from("game_roles").upsert({
      ...(input.id ? { id: input.id } : {}),
      game_id: input.gameId,
      role_name: input.roleName.trim(),
      description: input.description?.trim() || null,
      sort_order: input.sortOrder || 1,
    }, { onConflict: "game_id,role_name" });

    if (error) return { success: false, error: error.message };

    revalidatePath("/admin/games");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal menyimpan role" };
  }
}

/**
 * Server Action: Hapus Role Game
 */
export async function deleteGameRoleAction(roleId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) return { success: false, error: "Akses ditolak" };

    const admin = createAdminClient();
    const { error } = await admin.from("game_roles").delete().eq("id", roleId);
    if (error) return { success: false, error: error.message };

    revalidatePath("/admin/games");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal menghapus role" };
  }
}

/**
 * Server Action: Tambah / Perbarui Rank Game
 */
export async function saveGameRankAction(input: GameRankInput): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) return { success: false, error: "Akses ditolak" };

    const admin = createAdminClient();
    const { error } = await admin.from("game_ranks").upsert({
      ...(input.id ? { id: input.id } : {}),
      game_id: input.gameId,
      tier_name: input.tierName.trim(),
      tier_level: input.tierLevel || 1,
      sort_order: input.sortOrder || 1,
    }, { onConflict: "game_id,tier_name" });

    if (error) return { success: false, error: error.message };

    revalidatePath("/admin/games");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal menyimpan rank" };
  }
}

/**
 * Server Action: Hapus Rank Game
 */
export async function deleteGameRankAction(rankId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) return { success: false, error: "Akses ditolak" };

    const admin = createAdminClient();
    const { error } = await admin.from("game_ranks").delete().eq("id", rankId);
    if (error) return { success: false, error: error.message };

    revalidatePath("/admin/games");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal menghapus rank" };
  }
}
