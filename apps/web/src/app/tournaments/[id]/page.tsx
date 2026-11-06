import { notFound } from "next/navigation";
import { Suspense } from "react";
import TournamentDetailClient from "./TournamentDetailClient";
import { MOCK_TOURNAMENTS } from "@/data/tournaments";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return MOCK_TOURNAMENTS.map((t) => ({
    id: t.id,
  }));
}

export default async function TournamentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const tournament = MOCK_TOURNAMENTS.find((t) => t.id === id) || MOCK_TOURNAMENTS[0];

  if (!tournament) {
    notFound();
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B0D12] text-white p-8">Memuat detail turnamen...</div>}>
      <TournamentDetailClient tournament={tournament} />
    </Suspense>
  );
}
