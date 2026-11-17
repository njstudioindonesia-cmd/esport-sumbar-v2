/**
 * Client Revalidasi Cache Berbasis Tag Bertanda Tangan HMAC
 * Memungkinkan Admin Portal memicu pembaruan cache ISR di Web Utama dengan proteksi anti-replay.
 */

import { generateRevalidationSignature, RevalidationPayload } from "../security/hmac";

export interface TriggerRevalidationParams {
  tags: string[];
  webBaseUrl?: string;
  revalidationSecret?: string;
}

export async function triggerTagRevalidation({
  tags,
  webBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  revalidationSecret = process.env.REVALIDATION_SECRET || "esport-sumbar-revalidation-secret-v3",
}: TriggerRevalidationParams): Promise<{ success: boolean; message: string; revalidatedTags?: string[] }> {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const payload: RevalidationPayload = {
      tags,
      timestamp,
    };

    const signature = generateRevalidationSignature(payload, revalidationSecret);

    const targetEndpoint = `${webBaseUrl.replace(/\/$/, "")}/api/revalidate`;
    const response = await fetch(targetEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Revalidation-Signature": signature,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorJson.message || `HTTP ${response.status} saat menghubungi endpoint revalidasi`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      message: "Revalidasi tag cache berhasil diproses",
      revalidatedTags: data.revalidatedTags || tags,
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Gagal memicu revalidasi cache: ${error?.message || "Kesalahan jaringan"}`,
    };
  }
}
