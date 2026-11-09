"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Compass,
  Newspaper,
  MapPin,
  Sparkles,
  Shield,
  ArrowRight,
  Users,
  Gamepad2,
  Award,
  Flame,
  Building2,
  GraduationCap,
  Building,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { REGIONS_DETAIL } from "@/data/regions";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export type PaletteCategory =
  | "Navigasi"
  | "Pemain"
  | "Pelatih"
  | "Tim"
  | "Komunitas"
  | "Venue"
  | "Kampus"
  | "Sekolah"
  | "Daerah"
  | "Direktori";

interface PaletteItem {
  id: string;
  category: PaletteCategory;
  title: string;
  subtitle: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  avatarUrl?: string;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [dbResults, setDbResults] = useState<PaletteItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Default Quick Links
  const quickLinks: PaletteItem[] = useMemo(
    () => [
      {
        id: "nav-explore",
        category: "Navigasi",
        title: "Jelajah Roster & Ekosistem",
        subtitle: "Direktori lengkap 7 pilar entitas esport Sumatera Barat",
        href: "/explore",
        icon: Compass,
      },
      {
        id: "nav-players",
        category: "Navigasi",
        title: "Direktori Atlet & Pemain",
        subtitle: "Pangkalan data atlet kompetitif terdaftar",
        href: "/players",
        icon: Gamepad2,
      },
      {
        id: "nav-teams",
        category: "Navigasi",
        title: "Klub & Roster Tim",
        subtitle: "Daftar tim dan skuad divisi esport",
        href: "/teams",
        icon: Users,
      },
      {
        id: "nav-coaches",
        category: "Navigasi",
        title: "Pelatih & Coach Berlisensi",
        subtitle: "Peracik strategi dan analis taktikal resmi",
        href: "/coaches",
        icon: Award,
      },
      {
        id: "nav-card-new",
        category: "Navigasi",
        title: "Daftarkan Identitas Digital",
        subtitle: "Penerbitan paspor digital dan kartu ESPORT ID baru",
        href: "/onboarding",
        icon: Sparkles,
        badge: "Mandiri",
      },
      {
        id: "nav-regions",
        category: "Navigasi",
        title: "19 Kota & Kabupaten",
        subtitle: "Peta struktur sebaran ekosistem se-Sumbar",
        href: "/regions",
        icon: MapPin,
      },
      {
        id: "nav-news",
        category: "Navigasi",
        title: "Warta Berita Esport",
        subtitle: "Kabar pemusatan latihan, turnamen & pengumuman",
        href: "/news",
        icon: Newspaper,
      },
      {
        id: "nav-verification",
        category: "Navigasi",
        title: "Standar Verifikasi Tunggal",
        subtitle: "Regulasi kurasi mandiri dan lencana resmi ESP-SB-VER",
        href: "/verification-standard",
        icon: Shield,
      },
    ],
    []
  );

  // Focus on input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setDbResults([]);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Debounced search directly to database via /api/profiles?search=...
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setDbResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/profiles?search=${encodeURIComponent(trimmed)}&limit=8`, {
          signal: controller.signal,
        });
        if (res.ok) {
          const json = await res.json();
          if (json.profiles && Array.isArray(json.profiles)) {
            const mapped: PaletteItem[] = json.profiles.map((p: any) => {
              const entityType = p.entityType || "player";
              const IconComponent =
                entityType === "player"
                  ? Gamepad2
                  : entityType === "coach"
                  ? Award
                  : entityType === "team"
                  ? Users
                  : entityType === "community"
                  ? Flame
                  : entityType === "venue"
                  ? Building2
                  : entityType === "campus"
                  ? GraduationCap
                  : Building;

              const categoryName: PaletteCategory =
                entityType === "player"
                  ? "Pemain"
                  : entityType === "coach"
                  ? "Pelatih"
                  : entityType === "team"
                  ? "Tim"
                  : entityType === "community"
                  ? "Komunitas"
                  : entityType === "venue"
                  ? "Venue"
                  : entityType === "campus"
                  ? "Kampus"
                  : "Sekolah";

              const ignPart =
                p.ign && p.ign.toLowerCase() !== p.displayName.toLowerCase()
                  ? ` (@${p.ign})`
                  : "";

              return {
                id: `db-${p.id}`,
                category: categoryName,
                title: `${p.displayName}${ignPart}`,
                subtitle: `${p.esportId} · ${p.mainGameName || p.roleName || "Esport"} (${p.regionName || p.regionCode || "Sumbar"})`,
                href: `/${entityType}/${p.slug}`,
                icon: IconComponent,
                badge: p.verificationStatus === "verified" ? "TERVERIFIKASI" : p.rarityTier?.toUpperCase(),
                avatarUrl: p.avatarUrl || undefined,
              };
            });
            setDbResults(mapped);
          } else {
            setDbResults([]);
          }
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setDbResults([]);
        }
      } finally {
        setIsSearching(false);
      }
    }, 150);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // Combined search results
  const results: PaletteItem[] = useMemo(() => {
    if (!query.trim()) {
      return quickLinks;
    }

    const q = query.toLowerCase().trim();
    const list: PaletteItem[] = [];

    // 1. Live database results
    dbResults.forEach((item) => {
      list.push(item);
    });

    // 2. Search in 19 Regions
    REGIONS_DETAIL.forEach((r) => {
      if (
        r.name.toLowerCase().includes(q) ||
        r.code.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q)
      ) {
        list.push({
          id: `region-${r.id}`,
          category: "Daerah",
          title: r.name,
          subtitle: `Wilayah ESPORT SUMBAR (${r.code}) · 19 Kota & Kabupaten`,
          href: `/regions/${r.slug}`,
          icon: MapPin,
          badge: "WILAYAH",
        });
      }
    });

    // 3. Match quicklinks / navigation
    quickLinks.forEach((k) => {
      if (k.title.toLowerCase().includes(q) || k.subtitle.toLowerCase().includes(q)) {
        list.push(k);
      }
    });

    // 4. Always provide fallback option to search in /explore directory
    list.push({
      id: "search-explore-all",
      category: "Direktori",
      title: `Cari "${query.trim()}" di Seluruh Roster`,
      subtitle: `Buka halaman /explore dengan filter pencarian "${query.trim()}"`,
      href: `/explore?q=${encodeURIComponent(query.trim())}`,
      icon: Compass,
      badge: "JELAJAH",
    });

    return list.slice(0, 10);
  }, [query, dbResults, quickLinks]);

  // Keyboard navigation & global shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle palette on Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }

      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(results.length, 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev === 0 ? Math.max(results.length - 1, 0) : prev - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (results[selectedIndex]) {
          const target = results[selectedIndex].href;
          onClose();
          router.push(target);
        } else if (query.trim()) {
          onClose();
          router.push(`/explore?q=${encodeURIComponent(query.trim())}`);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose, router, query]);

  const handleSelect = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-[#0F1118] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col"
          >
            {/* Top Search Input */}
            <div className="flex items-center px-4 py-3.5 border-b border-white/[0.08] gap-3">
              {isSearching ? (
                <Loader2 className="w-5 h-5 text-[#FF1752] animate-spin shrink-0" />
              ) : (
                <Search className="w-5 h-5 text-[#D4AF37] shrink-0" />
              )}
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Cari atlet, ign, tim, venue, kampus, sekolah, atau esport id..."
                className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="p-1 text-gray-500 hover:text-white"
                  aria-label="Bersihkan pencarian"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 rounded bg-white/[0.05] border border-white/10 text-[10px] font-mono text-gray-400">
                ESC
              </kbd>
            </div>

            {/* Results List */}
            <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
              {results.length === 0 ? (
                <div className="py-12 text-center text-gray-500 text-xs">
                  {isSearching ? "Mencari di basis data..." : `Tidak ada hasil untuk "${query}"`}
                </div>
              ) : (
                results.map((item, idx) => {
                  const Icon = item.icon;
                  const isSelected = idx === selectedIndex;
                  const isVerifiedBadge = item.badge === "TERVERIFIKASI" || item.badge === "VERIFIED";

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item.href)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-white/[0.06] border border-[#D4AF37]/30 text-white"
                          : "text-gray-300 hover:bg-white/[0.03]"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {item.avatarUrl ? (
                          <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-black/40 border border-white/10">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.avatarUrl}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                              isSelected
                                ? "bg-[#D4AF37]/20 text-[#D4AF37]"
                                : "bg-white/[0.03] text-gray-400"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-heading font-bold text-white truncate">
                              {item.title}
                            </span>
                            {item.badge && (
                              <span
                                className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase shrink-0 flex items-center gap-0.5 ${
                                  isVerifiedBadge
                                    ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30"
                                    : item.badge === "LEGEND" || item.badge === "ELITE"
                                    ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30"
                                    : "bg-white/[0.05] text-gray-400 border border-white/10"
                                }`}
                              >
                                {isVerifiedBadge && <CheckCircle2 className="w-2.5 h-2.5" />}
                                <span>{item.badge}</span>
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-[#9AA3B2] block truncate">
                            {item.subtitle}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-mono shrink-0 ml-3">
                        <span className="hidden sm:inline">{item.category}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Keyboard Hint Bar */}
            <div className="px-4 py-2.5 border-t border-white/[0.06] bg-[#07080C]/80 flex items-center justify-between text-[11px] text-gray-400 font-mono">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.2 rounded bg-white/5 border border-white/10">↑</kbd>
                  <kbd className="px-1.5 py-0.2 rounded bg-white/5 border border-white/10">↓</kbd>
                  <span>Navigasi</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.2 rounded bg-white/5 border border-white/10">↵</kbd>
                  <span>Buka Halaman</span>
                </span>
              </div>
              <span className="text-white/40">Basis Data Terhubung</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
