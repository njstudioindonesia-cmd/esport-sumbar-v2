/**
 * Tipe dan Kontrak Layanan Verifikasi & Audit V3 (Sub-langkah 7.4)
 * Menegakkan model status verifikasi tunggal ESPORT SUMBAR, validasi prestasi,
 * metrik SLA penelaahan, serta catatan audit anti-manipulasi (append-only).
 */

export type VerificationState =
  | "unverified"
  | "submitted"
  | "under_review"
  | "verified"
  | "revision_requested"
  | "rejected"
  | "suspended"
  | "expired";

export type SlaStatus = "on_track" | "warning" | "breached";

export interface VerificationEvidenceItem {
  id?: string;
  name: string;
  url: string;
  size?: string;
  type?: string;
  uploadedAt?: string;
}

export interface AchievementItem {
  id?: string;
  title: string;
  eventName: string;
  year: number;
  rankOrPlacement: string;
  certificateUrl?: string;
  verifiedByEsportSumbar?: boolean;
}

export interface VerificationSubmission {
  profileId: string;
  accountId: string;
  entityType: string;
  regionId: string;
  notes?: string;
  evidenceFiles: VerificationEvidenceItem[];
  achievements?: AchievementItem[];
}

export interface AchievementValidationResult {
  isValid: boolean;
  completenessScore: number;
  feedback: string[];
  errors: string[];
}

export interface VerificationQueueItem {
  id: string;
  profileId: string;
  accountId: string;
  displayName: string;
  ign?: string;
  esportId: string;
  entityType: string;
  gameName?: string;
  regionName: string;
  regionCode: string;
  status: VerificationState;
  submittedAt: string;
  waitingHours: number;
  slaHoursLimit: number;
  slaStatus: SlaStatus;
  notes?: string;
  evidenceFiles: VerificationEvidenceItem[];
  achievements: AchievementItem[];
  revisionFields?: string[];
  reviewedAt?: string;
  reviewerId?: string;
}

export interface VerificationDecisionInput {
  requestId: string;
  reviewerId: string;
  reviewerRole?: string;
  decision: "verified" | "revision_requested" | "rejected" | "suspended";
  reason: string;
  notes?: string;
  revisionFields?: string[];
  badgeNo?: string;
}

export interface VerificationDecisionResult {
  success: boolean;
  requestId: string;
  profileId: string;
  previousStatus: VerificationState;
  newStatus: VerificationState;
  badgeNo?: string;
  verifiedAt?: string;
  expiresAt?: string;
  outboxEventId?: string;
  error?: string;
}

export interface AuditLogEntry {
  id: string;
  actorAccountId?: string | null;
  actorRole: "platform_admin" | "user" | "system_worker";
  action: string;
  targetType: string;
  targetId: string;
  previousStatus?: string | null;
  newStatus?: string | null;
  reason?: string | null;
  metadata: Record<string, unknown>;
  occurredAt: string;
  logHash: string;
}

export interface VerificationStats {
  totalPending: number;
  underReview: number;
  slaBreached: number;
  slaWarning: number;
  totalVerified: number;
  totalRejected: number;
  averageProcessingHours: number;
}
