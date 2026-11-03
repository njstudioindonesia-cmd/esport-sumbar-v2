"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Calendar,
  MapPin,
  ShieldCheck,
  Users,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Swords,
  Sparkles,
  Award,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TournamentItem } from "@/data/tournaments";

interface Props {
  tournament: TournamentItem;
}

export default function TournamentDetailClient({ tournament }: Props) {
  const [activeTab, setActiveTab] = useState<"bracket" | "rules" | "register">("bracket");
  const [teamName, setTeamName] = useState("");
  const [captainEsportId, setCaptainEsportId] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegisterTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName || !captainEsportId) return;
    setIsRegistered(true);
  };

  const quarters = tournament.matches.filter((m) => m.round === "Quarterfinals");
  const semis = tournament.matches.filter((m) => m.round === "Semifinals");
  const finals = tournament.matches.filter((m) => m.round === "Grand Finals");
  const bronze = tournament.matches.filter((m) => m.round === "Bronze Match");

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#F3F4F6] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* BREADCRUMB */}
        <nav className="flex items-center gap-2 text-xs text-[#9AA3B2] font-mono mb-4">
          <Link href="/tournaments" className="hover:text-white transition-colors">
            Turnamen
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#D4AF37] font-bold">{tournament.title}</span>
        </nav>

        {/* HERO BANNER */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#12151C] border border-[#262B38] shadow-2xl relative overflow-hidden mb-8">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/10 blur-3xl pointer-events-none" />

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-2.5 py-0.5 rounded bg-[#1A1E28] border border-[#262B38] text-[10px] font-mono text-[#D4AF37] uppercase font-bold">
              {tournament.tier}
            </span>
            <span className="px-2.5 py-0.5 rounded bg-blue-950 border border-blue-800 text-[10px] font-mono text-blue-300 font-bold uppercase">
              {tournament.game}
            </span>
            {tournament.isOfficialEsi && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#22C55E]/20 border border-[#22C55E]/40 text-[#22C55E] text-[10px] font-heading font-extrabold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Sertifikasi Resmi PBESI Sumbar
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black uppercase text-white tracking-tight mb-3">
            {tournament.title}
          </h1>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#1A1E28]/80 border border-[#262B38] my-6">
            <div>
              <span className="text-[10px] font-mono uppercase text-gray-400 block">Total Hadiah</span>
              <span className="text-lg sm:text-xl font-heading font-black text-[#D4AF37]">{tournament.prizePool}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-gray-400 block">Jadwal Pelaksanaan</span>
              <span className="text-xs sm:text-sm font-heading font-bold text-white">{tournament.startDate}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-gray-400 block">Lokasi & Tuan Rumah</span>
              <span className="text-xs sm:text-sm font-heading font-bold text-white">{tournament.regionName}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-gray-400 block">Slot Roster</span>
              <span className="text-xs sm:text-sm font-heading font-bold text-[#22C55E]">
                {tournament.registeredTeamsCount}/{tournament.maxTeams} Tim
              </span>
            </div>
          </div>

          {/* TABS NAVIGATION */}
          <div className="flex items-center gap-2 border-b border-[#262B38] pt-2">
            {[
              { id: "bracket", label: "Bagan Pertandingan (Bracket)" },
              { id: "rules", label: "Regulasi & Ketentuan PBESI" },
              { id: "register", label: "Pendaftaran Tim" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 text-xs font-heading font-bold uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === tab.id
                    ? "border-[#D4AF37] text-[#D4AF37]"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* TAB 1: BRACKET TREE VIEW */}
        {activeTab === "bracket" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#12151C] border border-[#262B38] shadow-xl overflow-x-auto">
            <div className="min-w-[800px] flex flex-col gap-8">
              <div className="flex items-center justify-between border-b border-[#262B38] pb-4">
                <div className="flex items-center gap-2">
                  <Swords className="w-5 h-5 text-[#D4AF37]" />
                  <h2 className="text-lg font-heading font-black uppercase text-white">
                    Bagan Knockout Single Elimination
                  </h2>
                </div>
                <span className="text-xs font-mono text-gray-400">Status Pertandingan Terverifikasi Wasit ESI</span>
              </div>

              {/* STAGES GRID */}
              <div className="grid grid-cols-3 gap-6 items-center">
                {/* 1. QUARTERFINALS */}
                <div className="flex flex-col gap-4">
                  <span className="text-xs font-mono uppercase text-gray-400 text-center font-bold tracking-widest block bg-[#1A1E28] py-1 rounded-lg">
                    Perempat Final (BO3)
                  </span>

                  {quarters.map((m) => (
                    <div
                      key={m.id}
                      className="p-3 rounded-xl bg-[#1A1E28] border border-[#262B38] shadow-md flex flex-col gap-1.5"
                    >
                      <span className="text-[10px] font-mono text-gray-400 flex items-center justify-between">
                        <span>Match #{m.matchNumber}</span>
                        <span className="text-emerald-400 font-bold">{m.status.toUpperCase()}</span>
                      </span>

                      <div
                        className={`flex items-center justify-between p-2 rounded-lg ${
                          m.teamA.isWinner ? "bg-[#D4AF37]/20 border border-[#D4AF37]/50" : "bg-[#12151C]"
                        }`}
                      >
                        <span className="text-xs font-heading font-extrabold text-white truncate">
                          {m.teamA.name}
                        </span>
                        <span className="text-xs font-mono font-bold text-[#D4AF37] px-1.5 py-0.5 rounded bg-black/40">
                          {m.teamA.score}
                        </span>
                      </div>

                      <div
                        className={`flex items-center justify-between p-2 rounded-lg ${
                          m.teamB.isWinner ? "bg-[#D4AF37]/20 border border-[#D4AF37]/50" : "bg-[#12151C]"
                        }`}
                      >
                        <span className="text-xs font-heading font-extrabold text-white truncate">
                          {m.teamB.name}
                        </span>
                        <span className="text-xs font-mono font-bold text-[#D4AF37] px-1.5 py-0.5 rounded bg-black/40">
                          {m.teamB.score}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 2. SEMIFINALS */}
                <div className="flex flex-col gap-8">
                  <span className="text-xs font-mono uppercase text-gray-400 text-center font-bold tracking-widest block bg-[#1A1E28] py-1 rounded-lg">
                    Semifinal (BO3)
                  </span>

                  {semis.map((m) => (
                    <div
                      key={m.id}
                      className="p-4 rounded-xl bg-[#1A1E28] border border-[#262B38] shadow-lg flex flex-col gap-2"
                    >
                      <span className="text-[10px] font-mono text-gray-400 flex items-center justify-between">
                        <span>Match #{m.matchNumber}</span>
                        <span className="text-emerald-400 font-bold">{m.status.toUpperCase()}</span>
                      </span>

                      <div
                        className={`flex items-center justify-between p-2.5 rounded-lg ${
                          m.teamA.isWinner ? "bg-[#D4AF37]/20 border border-[#D4AF37]/50" : "bg-[#12151C]"
                        }`}
                      >
                        <span className="text-xs font-heading font-extrabold text-white">
                          {m.teamA.name}
                        </span>
                        <span className="text-xs font-mono font-bold text-[#D4AF37] px-2 py-0.5 rounded bg-black/40">
                          {m.teamA.score}
                        </span>
                      </div>

                      <div
                        className={`flex items-center justify-between p-2.5 rounded-lg ${
                          m.teamB.isWinner ? "bg-[#D4AF37]/20 border border-[#D4AF37]/50" : "bg-[#12151C]"
                        }`}
                      >
                        <span className="text-xs font-heading font-extrabold text-white">
                          {m.teamB.name}
                        </span>
                        <span className="text-xs font-mono font-bold text-[#D4AF37] px-2 py-0.5 rounded bg-black/40">
                          {m.teamB.score}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 3. GRAND FINALS & BRONZE */}
                <div className="flex flex-col gap-6">
                  {/* GRAND FINALS */}
                  <div className="p-5 rounded-2xl bg-gradient-to-b from-[#1E1B13] to-[#12151C] border-2 border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                    <div className="flex items-center justify-center gap-1.5 text-xs font-heading font-black uppercase text-[#D4AF37] mb-3">
                      <Trophy className="w-4 h-4 text-[#D4AF37]" />
                      <span>Grand Final (BO5)</span>
                    </div>

                    {finals.map((m) => (
                      <div key={m.id} className="flex flex-col gap-2">
                        <div
                          className={`flex items-center justify-between p-3 rounded-xl ${
                            m.teamA.isWinner ? "bg-[#D4AF37] text-black font-black" : "bg-[#1A1E28] text-white"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {m.teamA.isWinner && <Award className="w-4 h-4 text-black" />}
                            <span className="text-xs font-heading font-extrabold">
                              {m.teamA.name}
                            </span>
                          </div>
                          <span className="text-sm font-mono font-black">
                            {m.teamA.score}
                          </span>
                        </div>

                        <div
                          className={`flex items-center justify-between p-3 rounded-xl ${
                            m.teamB.isWinner ? "bg-[#D4AF37] text-black font-black" : "bg-[#1A1E28] text-white"
                          }`}
                        >
                          <span className="text-xs font-heading font-extrabold">
                            {m.teamB.name}
                          </span>
                          <span className="text-sm font-mono font-black">
                            {m.teamB.score}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* BRONZE MATCH */}
                  {bronze.length > 0 && (
                    <div className="p-4 rounded-xl bg-[#1A1E28] border border-[#262B38]">
                      <span className="text-[10px] font-mono text-[#F59E0B] font-bold uppercase block text-center mb-2">
                        Perebutan Juara 3 (Bronze Match)
                      </span>
                      {bronze.map((m) => (
                        <div key={m.id} className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between p-2 rounded bg-[#12151C] text-xs">
                            <span className="text-gray-200">{m.teamA.name}</span>
                            <span className="font-mono text-[#D4AF37] font-bold">{m.teamA.score}</span>
                          </div>
                          <div className="flex items-center justify-between p-2 rounded bg-[#12151C] text-xs">
                            <span className="text-gray-200">{m.teamB.name}</span>
                            <span className="font-mono text-[#D4AF37] font-bold">{m.teamB.score}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RULES */}
        {activeTab === "rules" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#12151C] border border-[#262B38] shadow-xl flex flex-col gap-4">
            <h2 className="text-xl font-heading font-bold text-white uppercase">
              Regulasi Resmi Pertandingan PBESI Sumatera Barat
            </h2>
            <p className="text-xs text-[#9AA3B2] leading-relaxed">
              Seluruh peserta wajib membaca dan menaati kode etik dan regulasi resmi keolahragaan elektronik Pengprov ESI Sumbar:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="p-4 rounded-xl bg-[#1A1E28] border border-[#262B38]">
                <h3 className="text-sm font-heading font-extrabold text-[#D4AF37] uppercase mb-1">
                  1. Keabsahan Atlet (ESPORT ID)
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Semua pemain wajib memiliki kartu identitas digital ESPORT ID aktif dari portal ESPORT SUMBAR. Pemain yang berstatus suspended dilarang bertanding.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#1A1E28] border border-[#262B38]">
                <h3 className="text-sm font-heading font-extrabold text-[#D4AF37] uppercase mb-1">
                  2. Ketentuan Usia & Persetujuan Wali
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Atlet di bawah usia 18 tahun wajib melampirkan persetujuan orang tua/wali sah sesuai undang-undang perlindungan data pribadi dan ketentuan KONI Sumbar.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#1A1E28] border border-[#262B38]">
                <h3 className="text-sm font-heading font-extrabold text-[#D4AF37] uppercase mb-1">
                  3. Perangkat & Jaringan
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Pertandingan offline dilaksanakan pada venue terakreditasi dengan dedicated leased line minimal 300 Mbps dan switch LAN resmi turnamen.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#1A1E28] border border-[#262B38]">
                <h3 className="text-sm font-heading font-extrabold text-[#D4AF37] uppercase mb-1">
                  4. Akumulasi Poin Sirkuit
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Pemenang turnamen Mayor memperoleh 500 Circuit Points, Juara 2 memperoleh 300 poin, dan Juara 3 memperoleh 150 poin untuk penetapan ranking PON.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: REGISTER FORM */}
        {activeTab === "register" && (
          <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#12151C] border border-[#262B38] shadow-xl">
            <h2 className="text-xl font-heading font-bold text-white uppercase text-center mb-1">
              Pendaftaran Tim Resmi
            </h2>
            <p className="text-xs text-[#9AA3B2] text-center mb-6">
              Daftarkan skuad klub Anda ke turnamen {tournament.title}.
            </p>

            {isRegistered ? (
              <div className="p-6 rounded-2xl bg-[#22C55E]/15 border border-[#22C55E]/40 text-center animate-in zoom-in-95">
                <CheckCircle2 className="w-12 h-12 text-[#22C55E] mx-auto mb-3" />
                <h3 className="text-lg font-heading font-black text-white uppercase">
                  Pendaftaran Berhasil!
                </h3>
                <p className="text-xs text-gray-300 mt-1 mb-4">
                  Tim <strong>{teamName}</strong> telah terdaftar pada antrean verifikasi panitia turnamen.
                </p>
                <Link
                  href="/tournaments"
                  className="px-5 py-2.5 rounded-xl bg-[#1A1E28] text-xs font-heading font-bold uppercase text-white hover:bg-[#262B38]"
                >
                  Kembali ke Daftar Turnamen
                </Link>
              </div>
            ) : (
              <form onSubmit={handleRegisterTeam} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-heading font-semibold text-gray-300 uppercase">
                    Nama Tim / Klub
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    required
                    placeholder="Contoh: Marawa Squad Padang"
                    className="w-full bg-[#1A1E28] border border-[#262B38] focus:border-[#D4AF37] rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-heading font-semibold text-gray-300 uppercase">
                    ESPORT ID Kapten / Manajer
                  </label>
                  <input
                    type="text"
                    value={captainEsportId}
                    onChange={(e) => setCaptainEsportId(e.target.value)}
                    required
                    placeholder="Contoh: ESB-PDG-PL-000124"
                    className="w-full bg-[#1A1E28] border border-[#262B38] focus:border-[#D4AF37] rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-500 font-mono focus:outline-none uppercase"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5C358] text-black text-xs font-heading font-extrabold uppercase tracking-wider shadow-lg hover:brightness-110"
                >
                  Kirim Pendaftaran Roster
                </button>
              </form>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
