import React, { Suspense } from "react";
import AdminRegionReviewClient from "./AdminRegionReviewClient";

export const instant = false;

export default async function AdminRegionReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B0D12]" />}>
      <AdminRegionReviewClient reviewId={id} />
    </Suspense>
  );
}
