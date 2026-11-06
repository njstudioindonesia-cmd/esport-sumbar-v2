/**
 * Subdomain Core: Ecosystem (Sub-langkah 7.6)
 * Mengelola kemitraan terhubung antar 7 entitas esports Sumatera Barat
 * dengan penegakan relation_rules tanpa foreign key constraint langsung ke profil.
 */

import { EntityType } from "../profile/types";

export type RelationStatus = "pending" | "active" | "rejected" | "ended";

export interface EcosystemRelationRule {
  id: string;
  sourceEntityType: EntityType;
  targetEntityType: EntityType;
  relationType: string;
  requiresApproval: boolean;
  maxActiveLimit: number;
  gameMatchRequired: boolean;
  isActive: boolean;
}

export interface EntityRelationRecord {
  id: string;
  sourceProfileId: string; // ID murni
  targetProfileId: string; // ID murni
  relationType: string;
  gameId: string | null;   // ID murni
  status: RelationStatus;
  initiatedBy: string;
  respondedBy: string | null;
  startedAt: string | null;
  endedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RequestRelationParams {
  sourceProfileId: string;
  sourceEntityType: EntityType;
  sourceGameId?: string | null;
  targetProfileId: string;
  targetEntityType: EntityType;
  targetGameId?: string | null;
  relationType: string;
  gameId?: string | null;
  message?: string;
}
