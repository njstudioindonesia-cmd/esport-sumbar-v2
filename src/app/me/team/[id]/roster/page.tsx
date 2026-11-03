import React, { Suspense } from "react";
import TeamRosterClient from "./TeamRosterClient";

export function generateStaticParams() {
  return [
    { id: "tm-rookie" },
    { id: "tm-contender" },
    { id: "tm-elite" },
    { id: "tm-legend" },
    { id: "minang-pride" },
    { id: "singkarak" },
  ];
}

export default async function TeamRosterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B0D12]" />}>
      <TeamRosterClient teamId={id} />
    </Suspense>
  );
}
