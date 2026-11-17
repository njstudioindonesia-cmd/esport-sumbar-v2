export interface VerificationQueueItem {
  id: string;
  esportId: string;
  name: string;
  ign: string;
  type: "player" | "coach" | "team";
  game: string;
  role: string;
  regionCode: string;
  regionName: string;
  submittedAt: string;
  daysWaiting: number;
  slaStatus: "normal" | "warning" | "critical";
  status: "submitted" | "in_review" | "revision_needed" | "verified" | "rejected";
  assignedTo?: string | null;
  reviewerNotes?: string;
  isFallback?: boolean;
  regionalReviewer?: {
    name: string;
    role: string;
    approvedAt: string;
    notes: string;
  };
  documents: {
    type: string;
    title: string;
    url: string;
    submittedAt: string;
    fileSize: string;
  }[];
  checklist: {
    identityVerified: boolean;
    domicileVerified: boolean;
    gameProofVerified: boolean;
  };
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  actorRole: string;
  actorName: string;
  regionCode: string;
  action: "Lolos Daerah" | "Minta Revisi" | "Tolak Pengajuan" | "Verifikasi Emas" | "Tangguhkan" | string;
  targetId: string;
  targetName: string;
  targetType: "Player" | "Coach" | "Team" | string;
  reason: string;
  logHash?: string;
}
