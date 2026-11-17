/**
 * Validator Istilah Terlarang & Kebijakan Iklan CMS
 * Memastikan tidak ada klaim terlarang, penipuan, atau iklan ilegal (judi/pinjol) masuk ke platform.
 */

import { checkProhibitedTerms, BANNED_TERMS_LIST } from "@esport-sumbar/contracts";
import { sanitizeUrl } from "./sanitizer";

export interface AdPolicyValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateBannerContent(params: {
  title: string;
  altText: string;
  targetUrl?: string | null;
  isAd?: boolean;
  sponsorName?: string | null;
}): AdPolicyValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Periksa Istilah Terlarang pada Judul & Sponsor
  const titleCheck = checkProhibitedTerms(params.title);
  if (titleCheck.hasViolation) {
    errors.push(`Judul banner mengandung kata terlarang: ${titleCheck.violations.join(", ")}`);
  }

  if (params.sponsorName) {
    const sponsorCheck = checkProhibitedTerms(params.sponsorName);
    if (sponsorCheck.hasViolation) {
      errors.push(`Nama sponsor mengandung kata terlarang: ${sponsorCheck.violations.join(", ")}`);
    }
  }

  // 2. Alt Text Wajib
  if (!params.altText || params.altText.trim().length < 5) {
    errors.push("Teks alternatif (alt text) wajib diisi minimal 5 karakter untuk aksesibilitas");
  }

  // 3. Validasi Target URL
  if (params.targetUrl) {
    const cleanUrl = sanitizeUrl(params.targetUrl);
    if (!cleanUrl) {
      errors.push("Target URL tidak aman (hanya menerima http://, https://, atau /)");
    }
  }

  // 4. Kepatuhan Transparansi Iklan
  if (params.isAd && (!params.sponsorName || params.sponsorName.trim().length === 0)) {
    warnings.push("Banner berbayar/iklan disarankan mencantumkan nama sponsor resmi secara transparan");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export { checkProhibitedTerms, BANNED_TERMS_LIST };
