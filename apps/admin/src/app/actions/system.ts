"use server";

import { createAdminClient } from "@/lib/supabase/server";

export interface StorageBucketInfo {
  name: string;
  fileCount: number;
  totalBytes: number;
  formattedSize: string;
}

export interface SystemStorageMetrics {
  totalUsedBytes: number;
  formattedTotalUsed: string;
  limitBytes: number;
  formattedLimit: string;
  percentUsed: number;
  proofBucketBytes: number;
  proofBucketFileCount: number;
  formattedProofSize: string;
  buckets: StorageBucketInfo[];
}

export async function getSystemStorageAction(): Promise<{
  success: boolean;
  data: SystemStorageMetrics;
  error?: string;
}> {
  try {
    const admin = createAdminClient();
    const { data: buckets, error: bErr } = await admin.storage.listBuckets();
    if (bErr || !buckets) {
      throw new Error(bErr?.message || "Gagal membaca bucket storage Supabase");
    }

    const bucketInfos: StorageBucketInfo[] = [];
    let totalBytes = 0;
    let proofBytes = 0;
    let proofCount = 0;

    for (const b of buckets) {
      const { data: files } = await admin.storage.from(b.name).list("", { limit: 1000 });
      let bBytes = 0;
      let bCount = files?.length || 0;
      if (files) {
        for (const f of files) {
          bBytes += (f.metadata as any)?.size || 0;
        }
      }
      totalBytes += bBytes;
      if (b.name === "verification-proofs" || b.name === "evidence") {
        proofBytes += bBytes;
        proofCount += bCount;
      }

      const formatted =
        bBytes > 1024 * 1024
          ? `${(bBytes / (1024 * 1024)).toFixed(2)} MB`
          : bBytes > 1024
          ? `${(bBytes / 1024).toFixed(2)} KB`
          : `${bBytes} Bytes`;

      bucketInfos.push({
        name: b.name,
        fileCount: bCount,
        totalBytes: bBytes,
        formattedSize: formatted,
      });
    }

    const limitBytes = 10 * 1024 * 1024 * 1024; // 10 GB
    const percentUsed = Number(((totalBytes / limitBytes) * 100).toFixed(2));
    const formattedProof =
      proofBytes > 1024 * 1024
        ? `${(proofBytes / (1024 * 1024)).toFixed(2)} MB`
        : proofBytes > 1024
        ? `${(proofBytes / 1024).toFixed(2)} KB`
        : `${proofBytes} Bytes`;

    const formattedTotal =
      totalBytes > 1024 * 1024
        ? `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`
        : totalBytes > 1024
        ? `${(totalBytes / 1024).toFixed(2)} KB`
        : `${totalBytes} Bytes`;

    return {
      success: true,
      data: {
        totalUsedBytes: totalBytes,
        formattedTotalUsed: formattedTotal,
        limitBytes,
        formattedLimit: "10 GB",
        percentUsed,
        proofBucketBytes: proofBytes,
        proofBucketFileCount: proofCount,
        formattedProofSize: `${formattedProof} (${proofCount} berkas)`,
        buckets: bucketInfos,
      },
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Gagal memuat status penyimpanan";
    return {
      success: false,
      data: {
        totalUsedBytes: 0,
        formattedTotalUsed: "0 Bytes",
        limitBytes: 10 * 1024 * 1024 * 1024,
        formattedLimit: "10 GB",
        percentUsed: 0,
        proofBucketBytes: 0,
        proofBucketFileCount: 0,
        formattedProofSize: "0 Bytes (0 berkas)",
        buckets: [],
      },
      error: errorMsg,
    };
  }
}
