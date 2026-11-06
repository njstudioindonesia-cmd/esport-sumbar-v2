/**
 * System Constants for ESPORT SUMBAR V3
 */

export const SYSTEM_CONSTANTS = {
  // Brand identity
  BRAND_NAME: "ESPORT SUMBAR",
  BRAND_TAGLINE: "Platform Ekosistem & Identitas Digital Esport Sumatera Barat",
  
  // Certificate & Badge prefix
  VERIFICATION_BADGE_PREFIX: "ESP-SB-VER",
  VERIFICATION_VALIDITY_MONTHS: 12,
  
  // SLA Thresholds in hours
  SLA_HOURS_GREEN: 48,
  SLA_HOURS_YELLOW: 96,
  
  // Relation rule defaults
  RELATION_EXPIRY_DAYS: 14,
  MAX_DAILY_RELATION_REQUESTS: 5,
  
  // Correlation header
  CORRELATION_HEADER: "x-request-id",
} as const;
