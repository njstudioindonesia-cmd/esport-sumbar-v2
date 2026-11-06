/**
 * Mesin Pengukur SLA & Prioritisasi Antrean Telaah ESPORT SUMBAR (SLA Engine V3)
 * Menjamin kepastian waktu respons telaah (Target SLA: 48 jam).
 */

import { SlaStatus, VerificationQueueItem } from "./types";

export const DEFAULT_SLA_HOURS_LIMIT = 48; // 2 hari kerja
export const SLA_WARNING_HOURS_LIMIT = 24; // 1 hari

/**
 * Menghitung selisih jam tunggu dan status SLA dari tanggal pengajuan
 */
export function calculateSlaStatus(
  submittedAt: string | Date,
  slaHoursLimit: number = DEFAULT_SLA_HOURS_LIMIT
): { waitingHours: number; slaStatus: SlaStatus } {
  const submitTime = new Date(submittedAt).getTime();
  const now = Date.now();
  const diffMs = Math.max(0, now - submitTime);
  const waitingHours = Math.floor(diffMs / (1000 * 60 * 60));

  let slaStatus: SlaStatus = "on_track";
  if (waitingHours >= slaHoursLimit) {
    slaStatus = "breached";
  } else if (waitingHours >= SLA_WARNING_HOURS_LIMIT) {
    slaStatus = "warning";
  }

  return { waitingHours, slaStatus };
}

/**
 * Memprioritaskan antrean telaah (FIFO dengan eskalasi SLA):
 * 1. Urutan prioritas status SLA: breached (paling mendesak) -> warning -> on_track
 * 2. Urutan pengajuan: yang lebih lama menunggu diutamakan (FIFO)
 */
export function prioritizeVerificationQueue(
  items: VerificationQueueItem[]
): VerificationQueueItem[] {
  const slaWeight: Record<SlaStatus, number> = {
    breached: 3,
    warning: 2,
    on_track: 1,
  };

  return [...items].sort((a, b) => {
    // 1. Bobot SLA lebih tinggi didahulukan
    const weightDiff = slaWeight[b.slaStatus] - slaWeight[a.slaStatus];
    if (weightDiff !== 0) {
      return weightDiff;
    }

    // 2. Jika bobot sama, antrean tertua diproses terlebih dahulu (FIFO)
    return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
  });
}
