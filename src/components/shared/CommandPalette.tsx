"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Compass,
  Newspaper,
  MapPin,
  HelpCircle,
  Sparkles,
  Shield,
  Layers,
  ArrowRight,
  User,
  Users,
  Trophy,
} from "lucide-react";
import { GALLERY_CARDS } from "@/data/mockCards";
import { REGIONS_DETAIL } from "@/data/regions";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PaletteItem {
  id: string;
  category: "Navigasi" | "Pemain" | "Tim" | "Daerah";
  title: string;
  subtitle: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Default Quick Links
  const quickLinks: PaletteItem[] = [
    {
      id: "nav-explore",
      category: "Navigasi",
      title: "Jelajah Ekosistem",
      subtitle: "Direktori lengkap pemain, klub & pelatih",
      href: "/explore",
      icon: Compass,
    },
    {
      id: "nav-card-new",
      category: "Navigasi",
      title: "Buat Kartu ESPORT ID",
      subtitle: "Penerbitan kartu identitas atlet baru",
      href: "/me/profile/new",
      icon: Sparkles,
      badge: "Gratis",
    },
    {
      id: "nav-regions",
      category: "Navigasi",
      title: "19 Kota & Kabupaten",
      subtitle: "Peta struktur Pengcab ESI se-Sumbar",
      href: "/regions",
      icon: MapPin,
    },
    {
      id: "nav-news",
      category: "Navigasi",
      title: "Warta Esport Sumbar",
      subtitle: "Kabar pemusatan latihan & turnamen",
      href: "/news",
      icon: Newspaper,
    },
    {
      id: "nav-how",
      category: "Navigasi",
      title: "Cara Kerja & Regulasi",
      subtitle: "Panduan tier rarity & verifikasi resmi",
      href: "/how-it-works",
      icon: HelpCircle,
    },
    {
      id: "nav-admin-region",
      category: "Navigasi",
      title: "Portal Pengcab Padang",
      subtitle: "Akses antrean verifikasi daerah",
      href: "/admin/region",
      icon: Shield,
      badge: "Admin",
    },
    {
      id: "nav-admin-province",
      category: "Navigasi",
      title: "Portal Pengprov Sumbar",
      subtitle: "Otoritas tunggal Lencana Emas",
      href: "/admin/province",
      icon: Trophy,
      badge: "Admin",
    },
  ];

  // Dynamic search results
  const results: PaletteItem[] = React.useMemo(() => {
    if (!query.trim()) {
      return quickLinks;
    }

    const q = query.toLowerCase().trim();
    const list: PaletteItem[] = [];

    // 1. Search in Players
    GALLERY_CARDS.filter((c) => c.type === "player").forEach((c) => {
      const ign = c.data.ign || "";
      const name = c.data.displayName || "";
      const game = c.data.game || "";
      if (
        ign.toLowerCase().includes(q) ||
        name.toLowerCase().includes(q) ||
        game.toLowerCase().includes(q)
      ) {
        const slug = (ign || name).toLowerCase().replace(/\s+/g, "-");
        list.push({
          id: `player-${c.id}`,
          category: "Pemain",
          title: ign,
          subtitle: `${name} · ${game} (${c.data.region.name})`,
          href: `/player/${slug}`,
          icon: User,
          badge: c.rarity.toUpperCase(),
        });
      }
    });

    // 2. Search in Teams
    GALLERY_CARDS.filter((c) => c.type === "team").forEach((c) => {
      const name = c.data.displayName || "";
      const game = c.data.game || "";
      if (name.toLowerCase().includes(q) || game.toLowerCase().includes(q)) {
        const slug = name.toLowerCase().replace(/\s+/g, "-");
        list.push({
          id: `team-${c.id}`,
          category: "Tim",
          title: name,
          subtitle: `${game} · ${c.data.region.name}`,
          href: `/team/${slug}`,
          icon: Users,
          badge: c.rarity.toUpperCase(),
        });
      }
    });

    // 3. Search in 19 Regions
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
          subtitle: `Wilayah PBESI (${r.code}) · ${r.verifiedCount} profil`,
          href: `/regions/${r.slug}`,
          icon: MapPin,
          badge: r.adminMode === "fallback" ? "FALLBACK" : "PENGCAB",
        });
      }
    });

    // 4. Also match quicklinks
    quickLinks.forEach((k) => {
      if (k.title.toLowerCase().includes(q) || k.subtitle.toLowerCase().includes(q)) {
        list.push(k);
      }
    });

    return list.slice(0, 10);
  }, [query]);

  // Focus on input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard navigation & global shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle palette on Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent or window dispatch
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
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose, router]);

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
              <Search className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Cari atlet, tim, 19 wilayah, atau navigasi..."
                className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="p-1 text-gray-500 hover:text-white"
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
                  Tidak ada hasil untuk &quot;{query}&quot;
                </div>
              ) : (
                results.map((item, idx) => {
                  const Icon = item.icon;
                  const isSelected = idx === selectedIndex;

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
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected
                              ? "bg-[#D4AF37]/20 text-[#D4AF37]"
                              : "bg-white/[0.03] text-gray-400"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-heading font-bold text-white">
                              {item.title}
                            </span>
                            {item.badge && (
                              <span
                                className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase ${
                                  item.badge === "LEGEND" || item.badge === "ELITE"
                                    ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30"
                                    : "bg-white/[0.05] text-gray-400 border border-white/10"
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-[#9AA3B2] block line-clamp-1">
                            {item.subtitle}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-mono">
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
                  <span>Buka</span>
                </span>
              </div>
              <span>ESPORT SUMBAR Search</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
