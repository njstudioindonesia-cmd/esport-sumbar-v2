"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Gamepad2,
  Plus,
  CheckCircle2,
  XCircle,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Layers,
  Search,
  ExternalLink,
} from "lucide-react";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/client";

interface GameRecord {
  id: string;
  name: string;
  short_name: string;
  slug: string;
  genre: string;
  platform: string;
  is_active: boolean;
  game_roles?: { id: string; name: string }[];
}

export default function AdminGamesPage() {
  const [games, setGames] = useState<GameRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchGames = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("games")
        .select("id, name, short_name, slug, genre, platform, is_active, game_roles(id, name)")
        .order("name", { ascending: true });

      if (!error && data) {
        setGames(data as any);
      }
    } catch (err) {
      console.warn("Failed to load games:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleToggleGame = async (gameId: string, currentStatus: boolean) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("games")
        .update({ is_active: !currentStatus })
        .eq("id", gameId);

      if (!error) {
        setGames((prev) =>
          prev.map((g) => (g.id === gameId ? { ...g, is_active: !currentStatus } : g))
        );
        setToastMessage(`Status game berhasil diperbarui.`);
        setTimeout(() => setToastMessage(null), 2500);
      }
    } catch (err: any) {
      setToastMessage(`Gagal mengubah status: ${err.message}`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const filteredGames = games.filter((g) => {
    const q = searchQuery.toLowerCase();
    return (
      g.name.toLowerCase().includes(q) ||
      g.short_name?.toLowerCase().includes(q) ||
      g.genre?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-white flex flex-col font-sans selection:bg-[#FF1752]/30 selection:text-white">
      <AdminNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-400 text-[10px] font-mono uppercase font-bold tracking-wider">
                KATALOG DINAMIS V3
              </span>
              <span className="text-white/40 text-xs font-mono">• Basis Data PostgreSQL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase text-white tracking-tight mt-1">
              Katalog Game & Peran Resmi
            </h1>
            <p className="text-xs sm:text-sm text-white/60">
              Pengelolaan judul game yang didukung (termasuk Honor of Kings & Valorant), spesifikasi platform, dan daftar role.
            </p>
          </div>

          <button
            onClick={() => fetchGames()}
            className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-white/80 transition-all"
          >
            Segarkan Katalog
          </button>
        </div>

        {/* TOAST MESSAGE */}
        {toastMessage && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* SEARCH BAR */}
        <div className="p-4 rounded-2xl bg-[#0B0E17] border border-white/10 flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul game atau genre..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#FF1752]/60"
            />
          </div>
          <span className="text-xs font-mono text-white/40">
            Total {filteredGames.length} Game Terdaftar
          </span>
        </div>

        {/* GAMES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <div className="col-span-full p-12 text-center text-white/40 text-xs font-mono animate-pulse">
              Memuat katalog game dari basis data...
            </div>
          ) : filteredGames.length === 0 ? (
            <div className="col-span-full p-12 text-center text-white/40 text-xs">
              Tidak ada game yang sesuai pencarian.
            </div>
          ) : (
            filteredGames.map((game) => (
              <div
                key={game.id}
                className="p-5 rounded-2xl bg-[#0B0E17] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between gap-4"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                        <Gamepad2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-heading font-black text-sm text-white">
                          {game.name}
                        </h3>
                        <span className="text-[10px] font-mono text-white/40 uppercase">
                          {game.short_name} • {game.id}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleGame(game.id, game.is_active)}
                      className={`text-xs p-1 rounded-lg transition-colors ${
                        game.is_active ? "text-emerald-400" : "text-white/30"
                      }`}
                      title={game.is_active ? "Nonaktifkan Game" : "Aktifkan Game"}
                    >
                      {game.is_active ? (
                        <ToggleRight className="w-6 h-6 text-emerald-400" />
                      ) : (
                        <ToggleLeft className="w-6 h-6 text-white/30" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-white/10 text-white/70">
                      {game.genre}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-white/10 text-white/70">
                      {game.platform}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold ${
                        game.is_active
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-white/5 text-white/40"
                      }`}
                    >
                      {game.is_active ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>

                  {/* ROLES PREVIEW */}
                  {game.game_roles && game.game_roles.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-white/5">
                      <span className="text-[10px] font-mono text-white/40 uppercase block mb-1">
                        Roles ({game.game_roles.length}):
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {game.game_roles.map((r) => (
                          <span
                            key={r.id}
                            className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-blue-500/10 border border-blue-500/20 text-blue-300"
                          >
                            {r.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
