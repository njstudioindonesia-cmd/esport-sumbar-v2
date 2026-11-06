/**
 * Manajemen Draf Pembuatan Profil Sisi Klien
 * Menyimpan progres input secara otomatis agar pengguna tidak kehilangan data jika koneksi terputus.
 */

const DRAFT_STORAGE_KEY = "esport_sumbar_wizard_draft_v2";

export interface WizardDraftData {
  step: number;
  entityType: string;
  birthDate?: string;
  guardianName?: string;
  guardianContact?: string;
  guardianRelationship?: string;
  guardianConsent?: boolean;
  displayName: string;
  regionCode: string;
  avatarUrl?: string;
  coverUrl?: string;
  bio: string;
  attributes: Record<string, any>;
  privacy: {
    kontak: boolean;
    tglLahir: boolean;
    statistik: boolean;
    fotoPublik: boolean;
  };
  savedAt: number;
}

export function saveWizardDraft(data: Partial<WizardDraftData>): void {
  if (typeof window === "undefined") return;
  try {
    const existing = loadWizardDraft() || {};
    const updated = {
      ...existing,
      ...data,
      savedAt: Date.now(),
    };
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Storage quota or private browsing fallback
  }
}

export function loadWizardDraft(): WizardDraftData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Draft kadaluarsa setelah 7 hari
    if (Date.now() - (parsed.savedAt || 0) > 7 * 24 * 60 * 60 * 1000) {
      clearWizardDraft();
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearWizardDraft(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch {
    // safe fallback
  }
}
