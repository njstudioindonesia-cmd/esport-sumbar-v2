"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  Edit,
  Trash2,
  Shield,
  Award,
  Users,
  X,
  Loader2,
  Flame,
  Swords,
  Crosshair,
  Trophy,
} from "lucide-react";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/client";
import {
  saveGameAction,
  toggleGameStatusAction,
  deleteGameAction,
  saveGameRoleAction,
  deleteGameRoleAction,
  saveGameRankAction,
  deleteGameRankAction,
  type GameInput,
} from "@/app/actions/games";

interface GameDetailRecord {
  id: string;
  name: string;
  short_name: string;
  slug: string;
  genre: string;
  platform: string;
  publisher: string | null;
  category: string | null;
  is_active: boolean;
  game_roles?: { id: string; role_name: string; description: string | null; sort_order: number }[];
  game_ranks?: { id: string; tier_name: string; tier_level: number; sort_order: number }[];
}

export default function AdminGamesPage() {
  const [games, setGames] = useState<GameDetailRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [toastMessage, setToastMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  // Modal Game State
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<GameDetailRecord | null>(null);
  const [gameForm, setGameForm] = useState<GameInput>({
    name: "",
    shortName: "",
    slug: "",
    genre: "moba",
    platform: "mobile",
    publisher: "",
    category: "",
    isActive: true,
  });
  const [isSavingGame, setIsSavingGame] = useState(false);

  // Modal Roles & Ranks State
  const [detailGame, setDetailGame] = useState<GameDetailRecord | null>(null);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const [newRankName, setNewRankName] = useState("");
  const [newRankLevel, setNewRankLevel] = useState<number>(1);
  const [isSavingSubItem, setIsSavingSubItem] = useState(false);

  const showToast = (text: string, isError = false) => {
    setToastMessage({ text, isError });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchGames = useCallback(async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("games")
        .select(`
          id, name, short_name, slug, genre, platform, publisher, category, is_active,
          game_roles(id, role_name, description, sort_order),
          game_ranks(id, tier_name, tier_level, sort_order)
        `)
        .order("name", { ascending: true });

      if (!error && data) {
        setGames(data as any);
        if (detailGame) {
          const updated = (data as any).find((g: any) => g.id === detailGame.id);
          if (updated) setDetailGame(updated);
        }
      }
    } catch (err: any) {
      showToast("Gagal memuat katalog game: " + err.message, true);
    } finally {
      setIsLoading(false);
    }
  }, [detailGame]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const handleOpenCreateModal = () => {
    setEditingGame(null);
    setGameForm({
      name: "",
      shortName: "",
      slug: "",
      genre: "moba",
      platform: "mobile",
      publisher: "",
      category: "",
      isActive: true,
    });
    setIsGameModalOpen(true);
  };

  const handleOpenEditModal = (game: GameDetailRecord) => {
    setEditingGame(game);
    setGameForm({
      id: game.id,
      name: game.name,
      shortName: game.short_name,
      slug: game.slug,
      genre: (game.genre as any) || "moba",
      platform: (game.platform as any) || "mobile",
      publisher: game.publisher || "",
      category: game.category || "",
      isActive: game.is_active,
    });
    setIsGameModalOpen(true);
  };

  const handleSaveGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameForm.name.trim() || !gameForm.slug.trim()) {
      showToast("Nama game dan slug wajib diisi.", true);
      return;
    }

    setIsSavingGame(true);
    try {
      const res = await saveGameAction(gameForm);
      if (res.success) {
        showToast(`Game ${gameForm.name} berhasil disimpan.`);
        setIsGameModalOpen(false);
        fetchGames();
      } else {
        showToast(res.error || "Gagal menyimpan game", true);
      }
    } finally {
      setIsSavingGame(false);
    }
  };

  const handleToggleGame = async (gameId: string, currentStatus: boolean) => {
    const res = await toggleGameStatusAction(gameId, currentStatus);
    if (res.success) {
      setGames((prev) =>
        prev.map((g) => (g.id === gameId ? { ...g, is_active: !currentStatus } : g))
      );
      showToast("Status game berhasil diubah.");
    } else {
      showToast(res.error || "Gagal mengubah status", true);
    }
  };

  const handleDeleteGame = async (game: GameDetailRecord) => {
    if (!confirm(`Hapus permanen game "${game.name}"? Jika sedang dipakai profil, penghapusan akan otomatis dicegah.`)) {
      return;
    }

    const res = await deleteGameAction(game.id);
    if (res.success) {
      showToast(`Game "${game.name}" berhasil dihapus.`);
      fetchGames();
    } else {
      showToast(res.error || "Gagal menghapus game", true);
    }
  };

  const handleAddRole = async () => {
    if (!detailGame || !newRoleName.trim()) return;
    setIsSavingSubItem(true);
    try {
      const nextOrder = (detailGame.game_roles?.length || 0) + 1;
      const res = await saveGameRoleAction({
        gameId: detailGame.id,
        roleName: newRoleName.trim(),
        description: newRoleDesc.trim() || undefined,
        sortOrder: nextOrder,
      });

      if (res.success) {
        setNewRoleName("");
        setNewRoleDesc("");
        showToast(`Role "${newRoleName}" ditambahkan.`);
        fetchGames();
      } else {
        showToast(res.error || "Gagal menambah role", true);
      }
    } finally {
      setIsSavingSubItem(false);
    }
  };

  const handleDeleteRole = async (roleId: string, roleName: string) => {
    if (!confirm(`Hapus role "${roleName}"?`)) return;
    const res = await deleteGameRoleAction(roleId);
    if (res.success) {
      showToast(`Role "${roleName}" dihapus.`);
      fetchGames();
    } else {
      showToast(res.error || "Gagal menghapus role", true);
    }
  };

  const handleAddRank = async () => {
    if (!detailGame || !newRankName.trim()) return;
    setIsSavingSubItem(true);
    try {
      const nextOrder = (detailGame.game_ranks?.length || 0) + 1;
      const res = await saveGameRankAction({
        gameId: detailGame.id,
        tierName: newRankName.trim(),
        tierLevel: newRankLevel,
        sortOrder: nextOrder,
      });

      if (res.success) {
        setNewRankName("");
        setNewRankLevel(nextOrder + 1);
        showToast(`Rank "${newRankName}" ditambahkan.`);
        fetchGames();
      } else {
        showToast(res.error || "Gagal menambah rank", true);
      }
    } finally {
      setIsSavingSubItem(false);
    }
  };

  const handleDeleteRank = async (rankId: string, tierName: string) => {
    if (!confirm(`Hapus rank tier "${tierName}"?`)) return;
    const res = await deleteGameRankAction(rankId);
    if (res.success) {
      showToast(`Rank tier "${tierName}" dihapus.`);
      fetchGames();
    } else {
      showToast(res.error || "Gagal menghapus rank", true);
    }
  };

  const getGenreIcon = (genre: string) => {
    switch (genre) {
      case "moba":
        return <Swords className="w-4 h-4 text-emerald-400" />;
      case "battle_royale":
        return <Flame className="w-4 h-4 text-amber-400" />;
      case "fps":
        return <Crosshair className="w-4 h-4 text-rose-400" />;
      case "sports":
        return <Trophy className="w-4 h-4 text-cyan-400" />;
      default:
        return <Gamepad2 className="w-4 h-4 text-indigo-400" />;
    }
  };

  const filteredGames = games.filter((g) => {
    const q = searchQuery.toLowerCase();
    const matchQuery =
      g.name.toLowerCase().includes(q) ||
      g.short_name?.toLowerCase().includes(q) ||
      g.genre?.toLowerCase().includes(q) ||
      g.slug.toLowerCase().includes(q);

    const matchGenre = selectedGenre === "all" || g.genre === selectedGenre;
    return matchQuery && matchGenre;
  });

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-white flex flex-col font-sans selection:bg-[#FF1752]/30 selection:text-white">
      <AdminNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-400 text-[10px] font-mono uppercase font-bold tracking-wider">
                KATALOG RESMI V3
              </span>
              <span className="text-white/40 text-xs font-mono">• DIBACA DINAMIS DARI DATABASE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase text-white tracking-tight mt-1">
              Katalog Game &amp; Role-Rank
            </h1>
            <p className="text-xs sm:text-sm text-white/60">
              Pengelolaan cabang game resmi, penetapan role pertandingan, tier rank, dan proteksi integritas profil (Mandat 5).
            </p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-[#07080C] font-heading font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg hover:brightness-110 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Game Resmi</span>
          </button>
        </div>

        {/* TOAST MESSAGE */}
        {toastMessage && (
          <div
            className={`p-4 rounded-xl border text-xs font-mono flex items-center gap-2 ${
              toastMessage.isError
                ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
            }`}
          >
            {toastMessage.isError ? <XCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
            <span>{toastMessage.text}</span>
          </div>
        )}

        {/* FILTER & SEARCH STRIP */}
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#0B0E17] border border-white/10 p-3 rounded-2xl">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari game (nama, genre, short name)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {["all", "moba", "battle_royale", "fps", "sports"].map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-mono whitespace-nowrap transition-all uppercase ${
                  selectedGenre === g
                    ? "bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] font-bold"
                    : "bg-white/[0.03] border border-white/10 text-white/60 hover:text-white"
                }`}
              >
                {g === "all" ? "Semua Genre" : g.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* GAME CARDS GRID */}
        {isLoading ? (
          <div className="p-16 text-center text-xs font-mono text-white/40 flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#D4AF37]" />
            <span>Memuat katalog game dari pangkalan data...</span>
          </div>
        ) : filteredGames.length === 0 ? (
          <div className="p-16 text-center text-xs font-mono text-white/40 border border-white/10 rounded-2xl bg-[#0B0E17]">
            Tidak ada game yang sesuai kriteria pencarian.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGames.map((game) => (
              <div
                key={game.id}
                className="p-5 rounded-2xl bg-[#0B0E17] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between gap-4 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
                        {getGenreIcon(game.genre)}
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-white/40 uppercase">
                          {game.short_name || game.id}
                        </span>
                        <div className="text-[10px] font-mono text-[#D4AF37] font-bold uppercase">
                          {game.platform}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleGame(game.id, game.is_active)}
                      className="text-xs flex items-center gap-1 transition-colors"
                      title={game.is_active ? "Nonaktifkan Game" : "Aktifkan Game"}
                    >
                      {game.is_active ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Aktif
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/15 text-white/40 text-[10px] font-mono flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> Nonaktif
                        </span>
                      )}
                    </button>
                  </div>

                  <h3 className="font-heading font-black text-lg text-white group-hover:text-[#D4AF37] transition-colors">
                    {game.name}
                  </h3>
                  <p className="text-xs text-white/50 mt-1 line-clamp-1">
                    {game.publisher || game.category || "Game Resmi ESPORT SUMBAR"}
                  </p>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/[0.08] text-xs font-mono">
                    <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                      <span className="text-[10px] text-white/40 uppercase block">Role ({game.game_roles?.length || 0})</span>
                      <span className="font-bold text-white text-xs">
                        {game.game_roles && game.game_roles.length > 0
                          ? game.game_roles.map((r) => r.role_name).slice(0, 2).join(", ") + (game.game_roles.length > 2 ? "..." : "")
                          : "Belum diisi"}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                      <span className="text-[10px] text-white/40 uppercase block">Rank ({game.game_ranks?.length || 0})</span>
                      <span className="font-bold text-white text-xs">
                        {game.game_ranks && game.game_ranks.length > 0
                          ? `${game.game_ranks.length} Tiers`
                          : "Teks Bebas"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-white/[0.08]">
                  <button
                    onClick={() => setDetailGame(game)}
                    className="flex-1 py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-white/80 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Role &amp; Rank</span>
                  </button>

                  <button
                    onClick={() => handleOpenEditModal(game)}
                    className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/60 hover:text-white"
                    title="Ubah Parameter Game"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeleteGame(game)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400"
                    title="Hapus Game (Proteksi Profil Otomatis)"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ============================================================== */}
      {/* MODAL: TAMBAH / UBAH GAME                                      */}
      {/* ============================================================== */}
      {isGameModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#0A0D15] border border-white/15 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-white">
                    {editingGame ? "Ubah Game Resmi" : "Tambah Game Resmi"}
                  </h3>
                  <span className="text-xs font-mono text-white/50">Katalog Pangkalan Data Terpadu</span>
                </div>
              </div>
              <button
                onClick={() => setIsGameModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/10 flex items-center justify-center text-white/70"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveGame} className="flex flex-col gap-4 text-xs font-mono">
              <div>
                <label className="text-white/60 mb-1 block uppercase text-[10px]">Nama Lengkap Game *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Honor of Kings"
                  value={gameForm.name}
                  onChange={(e) => setGameForm({ ...gameForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/60 mb-1 block uppercase text-[10px]">Short Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. HOK"
                    value={gameForm.shortName}
                    onChange={(e) => setGameForm({ ...gameForm, shortName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="text-white/60 mb-1 block uppercase text-[10px]">Slug URL *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. honor-of-kings"
                    value={gameForm.slug}
                    onChange={(e) => setGameForm({ ...gameForm, slug: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/60 mb-1 block uppercase text-[10px]">Genre *</label>
                  <select
                    value={gameForm.genre}
                    onChange={(e) => setGameForm({ ...gameForm, genre: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1118] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="moba">MOBA</option>
                    <option value="battle_royale">Battle Royale</option>
                    <option value="fps">Tactical FPS</option>
                    <option value="sports">Sports</option>
                    <option value="other">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="text-white/60 mb-1 block uppercase text-[10px]">Platform *</label>
                  <select
                    value={gameForm.platform}
                    onChange={(e) => setGameForm({ ...gameForm, platform: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1118] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="mobile">Mobile (Android/iOS)</option>
                    <option value="pc">PC (Windows)</option>
                    <option value="cross_platform">Cross-Platform</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/60 mb-1 block uppercase text-[10px]">Publisher / Developer</label>
                  <input
                    type="text"
                    placeholder="e.g. Level Infinite / TiMi"
                    value={gameForm.publisher}
                    onChange={(e) => setGameForm({ ...gameForm, publisher: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="text-white/60 mb-1 block uppercase text-[10px]">Label Kategori</label>
                  <input
                    type="text"
                    placeholder="e.g. MOBA Mobile Resmi"
                    value={gameForm.category}
                    onChange={(e) => setGameForm({ ...gameForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  checked={gameForm.isActive}
                  onChange={(e) => setGameForm({ ...gameForm, isActive: e.target.checked })}
                  className="rounded border-white/20 bg-white/5 text-[#D4AF37] focus:ring-0"
                />
                <label htmlFor="isActiveToggle" className="text-white/80 text-xs">
                  Aktifkan game ini di formulir pendaftaran dan filter direktori
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 mt-2">
                <button
                  type="button"
                  onClick={() => setIsGameModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-white/70 text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingGame}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-[#07080C] font-heading font-black text-xs uppercase tracking-wider shadow-lg hover:brightness-110 flex items-center gap-2"
                >
                  {isSavingGame && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Simpan Game</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: PENGELOLAAN ROLES & RANKS                               */}
      {/* ============================================================== */}
      {detailGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#0A0D15] border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-white">
                    Role &amp; Rank Tiers: {detailGame.name}
                  </h3>
                  <span className="text-xs font-mono text-white/50">
                    Katalog Dinamis (Mandat 5.2) • ID: {detailGame.id}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setDetailGame(null)}
                className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/10 flex items-center justify-center text-white/70"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* KOLOM KIRI: ROLES */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span className="font-heading font-black text-xs uppercase text-white">
                      Role Pertandingan ({detailGame.game_roles?.length || 0})
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Nama role (e.g. Clash Lane)..."
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]"
                    />
                    <button
                      onClick={handleAddRole}
                      disabled={isSavingSubItem || !newRoleName.trim()}
                      className="px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold"
                    >
                      + Tambah
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Deskripsi peran (opsional)..."
                    value={newRoleDesc}
                    onChange={(e) => setNewRoleDesc(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-white/70 placeholder-white/20 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="flex flex-col gap-1.5 max-h-[300px] overflow-y-auto pr-1">
                  {(!detailGame.game_roles || detailGame.game_roles.length === 0) ? (
                    <div className="p-4 text-center text-xs font-mono text-white/30 border border-white/5 rounded-xl">
                      Belum ada role terdaftar untuk game ini.
                    </div>
                  ) : (
                    detailGame.game_roles.map((r) => (
                      <div
                        key={r.id}
                        className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-heading font-bold text-white block">{r.role_name}</span>
                          {r.description && <span className="text-[10px] text-white/40 block">{r.description}</span>}
                        </div>
                        <button
                          onClick={() => handleDeleteRole(r.id, r.role_name)}
                          className="p-1.5 rounded-lg hover:bg-rose-500/20 text-white/40 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* KOLOM KANAN: RANKS */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#D4AF37]" />
                    <span className="font-heading font-black text-xs uppercase text-white">
                      Tier Rank Terdaftar ({detailGame.game_ranks?.length || 0})
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nama tier (e.g. Grandmaster)..."
                    value={newRankName}
                    onChange={(e) => setNewRankName(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]"
                  />
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={newRankLevel}
                    onChange={(e) => setNewRankLevel(parseInt(e.target.value) || 1)}
                    className="w-16 px-2 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white text-center focus:outline-none focus:border-[#D4AF37]"
                    title="Level Tier (angka urut)"
                  />
                  <button
                    onClick={handleAddRank}
                    disabled={isSavingSubItem || !newRankName.trim()}
                    className="px-3 py-2 rounded-xl bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-mono font-bold"
                  >
                    + Tambah
                  </button>
                </div>

                <div className="flex flex-col gap-1.5 max-h-[300px] overflow-y-auto pr-1">
                  {(!detailGame.game_ranks || detailGame.game_ranks.length === 0) ? (
                    <div className="p-4 text-center text-xs font-mono text-white/30 border border-white/5 rounded-xl">
                      Belum ada tier rank (profil dapat menggunakan input teks bebas).
                    </div>
                  ) : (
                    detailGame.game_ranks.map((rk) => (
                      <div
                        key={rk.id}
                        className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-[#D4AF37]/15 text-[#D4AF37] font-mono text-[10px] font-bold flex items-center justify-center">
                            {rk.tier_level}
                          </span>
                          <span className="font-heading font-bold text-white">{rk.tier_name}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteRank(rk.id, rk.tier_name)}
                          className="p-1.5 rounded-lg hover:bg-rose-500/20 text-white/40 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
