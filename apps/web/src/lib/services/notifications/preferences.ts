import { NotificationPreference } from "@esport-sumbar/contracts";
import { createClient, createAdminClient, createPublicServerClient } from "@/lib/supabase/server";

// Fallback in-memory cache jika database belum memiliki tabel khusus preferensi
const preferencesMemoryStore = new Map<string, NotificationPreference>();

export const DEFAULT_NOTIFICATION_PREFERENCE: Omit<NotificationPreference, "accountId" | "updatedAt"> = {
  emailNotifications: true,
  relationAlerts: true,
  marketingEmails: false,
};

/**
 * Mengambil preferensi notifikasi untuk suatu akun pengguna.
 * Jika pengguna belum mengatur preferensi, mengembalikan nilai default yang ramah privasi.
 */
export async function getNotificationPreferences(
  accountId: string,
  client?: any
): Promise<NotificationPreference> {
  const cached = preferencesMemoryStore.get(accountId);
  if (cached) {
    return cached;
  }

  const isPlaceholder = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").includes("placeholder");
  const isTest = process.env.NODE_ENV === "test";

  if (!client && (isTest || isPlaceholder)) {
    const defaultPref: NotificationPreference = {
      accountId,
      ...DEFAULT_NOTIFICATION_PREFERENCE,
      updatedAt: new Date().toISOString(),
    };
    preferencesMemoryStore.set(accountId, defaultPref);
    return defaultPref;
  }

  try {
    const supabase = client || createPublicServerClient();
    const { data } = await supabase
      .from("accounts")
      .select("metadata_jsonb")
      .eq("id", accountId)
      .single();

    const storedPrefs = data?.metadata_jsonb?.notification_preferences;
    if (storedPrefs) {
      const pref: NotificationPreference = {
        accountId,
        emailNotifications: storedPrefs.emailNotifications ?? true,
        relationAlerts: storedPrefs.relationAlerts ?? true,
        marketingEmails: storedPrefs.marketingEmails ?? false,
        updatedAt: storedPrefs.updatedAt || new Date().toISOString(),
      };
      preferencesMemoryStore.set(accountId, pref);
      return pref;
    }
  } catch {
    // Abaikan jika akun belum memiliki kolom atau query gagal
  }

  const defaultPref: NotificationPreference = {
    accountId,
    ...DEFAULT_NOTIFICATION_PREFERENCE,
    updatedAt: new Date().toISOString(),
  };

  preferencesMemoryStore.set(accountId, defaultPref);
  return defaultPref;
}

/**
 * Memperbarui preferensi notifikasi pengguna.
 */
export async function updateNotificationPreferences(
  accountId: string,
  updates: Partial<Omit<NotificationPreference, "accountId" | "updatedAt">>,
  client?: any
): Promise<NotificationPreference> {
  const current = await getNotificationPreferences(accountId, client);

  const updated: NotificationPreference = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  preferencesMemoryStore.set(accountId, updated);

  const isPlaceholder = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").includes("placeholder");
  const isTest = process.env.NODE_ENV === "test";

  if (!client && (isTest || isPlaceholder)) {
    return updated;
  }

  try {
    const supabase = client || createAdminClient();
    const { data: acc } = await supabase
      .from("accounts")
      .select("metadata_jsonb")
      .eq("id", accountId)
      .single();

    const currentMeta = acc?.metadata_jsonb || {};
    await supabase
      .from("accounts")
      .update({
        metadata_jsonb: {
          ...currentMeta,
          notification_preferences: {
            emailNotifications: updated.emailNotifications,
            relationAlerts: updated.relationAlerts,
            marketingEmails: updated.marketingEmails,
            updatedAt: updated.updatedAt,
          },
        },
      })
      .eq("id", accountId);
  } catch {
    // Log atau abaikan jika metadata tidak didukung
  }

  return updated;
}
