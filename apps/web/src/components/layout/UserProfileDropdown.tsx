"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  User,
  CreditCard,
  ShieldCheck,
  Users,
  Lock,
  Settings,
  ShieldAlert,
  LogOut,
  PlusCircle,
  ExternalLink,
  ChevronDown,
  Check,
  Edit3,
  Sparkles,
} from "lucide-react";
import { signOutAction } from "@/app/actions/auth";

export interface UserProfileItem {
  id: string;
  entityType: string;
  esportId: string;
  slug: string;
  displayName: string;
  ign: string | null;
  regionName: string;
  mainGameName: string;
  avatarUrl: string | null;
  verificationStatus: string;
  rarityTier: string;
  completenessScore: number;
}

interface UserProfileDropdownProps {
  isMobileDrawer?: boolean;
  onClose?: () => void;
}

export function UserProfileDropdown({ isMobileDrawer = false, onClose }: UserProfileDropdownProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; email: string; fullName: string; role: string } | null>(null);
  const [profiles, setProfiles] = useState<UserProfileItem[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Muat data profil resmi dari endpoint /api/me/profiles
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const res = await fetch("/api/me/profiles");
        if (res.ok) {
          const json = await res.json();
          if (isMounted) {
            setUser(json.user || null);
            const userProfiles: UserProfileItem[] = json.profiles || [];
            setProfiles(userProfiles);

            if (userProfiles.length > 0) {
              const savedActiveId = typeof window !== "undefined" ? localStorage.getItem("active_profile_id") : null;
              const matched = userProfiles.find((p) => p.id === savedActiveId);
              setActiveProfileId(matched ? matched.id : userProfiles[0].id);
            }
          }
        }
      } catch (e) {
        console.warn("Failed to load user profiles in dropdown:", e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0] || null;

  const handleSelectProfile = (id: string) => {
    setActiveProfileId(id);
    if (typeof window !== "undefined") {
      localStorage.setItem("active_profile_id", id);
    }
  };

  const handleSignOut = async () => {
    await signOutAction();
    setUser(null);
    setProfiles([]);
    if (onClose) onClose();
    router.push("/login");
    router.refresh();
  };

  // State: Masih memuat
  if (isLoading) {
    return (
      <div className="w-8 h-8 rounded-full bg-white/[0.08] animate-pulse border border-white/10" />
    );
  }

  // State: Belum masuk
  if (!user) {
    return null;
  }

  // Label lencana status verifikasi
  const renderVerificationBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[9px] font-mono font-bold text-[#D4AF37]">
            <Sparkles className="w-2.5 h-2.5" />
            TERVERIFIKASI
          </span>
        );
      case "regional_approved":
      case "regional_checked":
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#10B981]/20 border border-[#10B981]/50 text-[9px] font-mono font-bold text-[#10B981]">
            <ShieldCheck className="w-2.5 h-2.5" />
            LOLOS DAERAH
          </span>
        );
      case "in_review_regional":
      case "in_review_provincial":
      case "submitted":
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#F59E0B]/20 border border-[#F59E0B]/50 text-[9px] font-mono font-bold text-[#F59E0B]">
            DITINJAU
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/[0.08] border border-white/15 text-[9px] font-mono font-bold text-white/50">
            BELUM DIVERIFIKASI
          </span>
        );
    }
  };

  // Label Rarity Tier
  const renderRarityBadge = (tier: string) => {
    const colorMap: Record<string, string> = {
      legendary: "text-[#FF1752] border-[#FF1752]/50 bg-[#FF1752]/10",
      champion: "text-[#D4AF37] border-[#D4AF37]/50 bg-[#D4AF37]/10",
      prodigy: "text-[#A855F7] border-[#A855F7]/50 bg-[#A855F7]/10",
      elite: "text-[#3B82F6] border-[#3B82F6]/50 bg-[#3B82F6]/10",
      contender: "text-[#10B981] border-[#10B981]/50 bg-[#10B981]/10",
      rookie: "text-white/60 border-white/20 bg-white/[0.06]",
    };
    const style = colorMap[tier] || colorMap.rookie;
    return (
      <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono uppercase tracking-wider font-extrabold border ${style}`}>
        {tier}
      </span>
    );
  };

  // Link Panel Admin sesuai peran
  const getAdminPanelLink = () => {
    if (user.role === "platform_admin") {
      return { href: "/admin", label: "Panel Admin Platform" };
    }
    return null;
  };
  const adminPanel = getAdminPanelLink();

  // Avatar Button Image / Initials
  const avatarSrc = activeProfile?.avatarUrl;
  const initialLetter = (activeProfile?.displayName || user.fullName || user.email).charAt(0).toUpperCase();

  // Konten Dropdown Menu (Digunakan bersama oleh Desktop Popover dan Mobile Drawer)
  const menuContent = (
    <div className="flex flex-col text-left">
      {/* 1. KEPALA MENU (IDENTITAS PROFIL AKTIF) */}
      {activeProfile ? (
        <div className="p-4 border-b border-white/[0.08] bg-[#0A0D15]/80">
          <div className="flex items-start gap-3">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border border-[#FF1752]/40 bg-[#12151E] shrink-0">
              {avatarSrc ? (
                <Image src={avatarSrc} alt={activeProfile.displayName} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-heading font-black text-white text-base bg-gradient-to-br from-[#FF1752] to-[#0A0A2E]">
                  {initialLetter}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-heading font-bold text-sm text-white truncate max-w-[150px]">
                  {activeProfile.displayName}
                </span>
                {renderRarityBadge(activeProfile.rarityTier)}
              </div>

              {activeProfile.ign && (
                <p className="text-[11px] font-mono text-[#FF4D77] truncate">@{activeProfile.ign}</p>
              )}

              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-[10px] font-mono text-white/50 tracking-wider">
                  {activeProfile.esportId}
                </span>
                {renderVerificationBadge(activeProfile.verificationStatus)}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 border-b border-white/[0.08] bg-[#0A0D15]/80">
          <p className="text-xs font-heading font-bold text-white truncate">{user.email}</p>
          <p className="text-[11px] text-white/50 mt-0.5">Belum memiliki kartu profil digital</p>
          <Link
            href="/me/profile/new"
            onClick={() => {
              setIsOpen(false);
              if (onClose) onClose();
            }}
            className="mt-3 btn-brand-primary text-xs py-1.5 px-3 w-full flex items-center justify-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Buat Kartu Pertama</span>
          </Link>
        </div>
      )}

      {/* 2. TAUTAN UTAMA SESUAI SPEC 2.4 */}
      <div className="p-2 flex flex-col gap-0.5">
        {activeProfile && (
          <>
            <Link
              href={`/${activeProfile.entityType}/${activeProfile.slug}`}
              onClick={() => {
                setIsOpen(false);
                if (onClose) onClose();
              }}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-heading text-white hover:bg-white/[0.06] transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-[#FF4D77]" />
                <span className="font-bold">Profil Saya (Publik)</span>
              </div>
              <ExternalLink className="w-3 h-3 text-white/30 group-hover:text-white/70" />
            </Link>

            <Link
              href={`/me/profile/${activeProfile.id}/edit`}
              onClick={() => {
                setIsOpen(false);
                if (onClose) onClose();
              }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-heading text-white/80 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              <Edit3 className="w-4 h-4 text-white/50" />
              <span>Edit Profil Aktif</span>
            </Link>
          </>
        )}

        <Link
          href="/me/cards"
          onClick={() => {
            setIsOpen(false);
            if (onClose) onClose();
          }}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-heading text-white/80 hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          <CreditCard className="w-4 h-4 text-white/50" />
          <span>Kartu Paspor Saya</span>
        </Link>

        <Link
          href="/me/verification"
          onClick={() => {
            setIsOpen(false);
            if (onClose) onClose();
          }}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-heading text-white/80 hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          <ShieldCheck className="w-4 h-4 text-white/50" />
          <span>Status Verifikasi</span>
        </Link>

        <Link
          href="/me/memberships"
          onClick={() => {
            setIsOpen(false);
            if (onClose) onClose();
          }}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-heading text-white/80 hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          <Users className="w-4 h-4 text-white/50" />
          <span>Relasi & Afiliasi Tim</span>
        </Link>

        <Link
          href="/me/privacy"
          onClick={() => {
            setIsOpen(false);
            if (onClose) onClose();
          }}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-heading text-white/80 hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          <Lock className="w-4 h-4 text-white/50" />
          <span>Privasi & Izin Data</span>
        </Link>

        <Link
          href="/me/settings"
          onClick={() => {
            setIsOpen(false);
            if (onClose) onClose();
          }}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-heading text-white/80 hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          <Settings className="w-4 h-4 text-white/50" />
          <span>Pengaturan Akun</span>
        </Link>

        {/* Panel Admin jika berhak */}
        {adminPanel && (
          <div className="pt-1.5 mt-1 border-t border-white/[0.06]">
            <Link
              href={adminPanel.href}
              onClick={() => {
                setIsOpen(false);
                if (onClose) onClose();
              }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-heading font-bold text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors"
            >
              <ShieldAlert className="w-4 h-4 text-[#D4AF37]" />
              <span>{adminPanel.label}</span>
            </Link>
          </div>
        )}

        {/* Keluar */}
        <div className="pt-1.5 mt-1 border-t border-white/[0.06]">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-heading text-white/60 hover:text-[#F04438] hover:bg-white/[0.04] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Jika dipanggil dalam konteks Mobile Drawer
  if (isMobileDrawer) {
    return <div className="w-full rounded-2xl bg-[#0B0D14] border border-white/10 overflow-hidden">{menuContent}</div>;
  }

  // Desktop Dropdown
  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* TRIGGER AVATAR PILL */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full bg-[#0A0A2E] hover:bg-[#12123F] border border-white/[0.08] hover:border-white/20 transition-all shadow-sm group focus:outline-none"
        aria-label="Menu profil pengguna"
      >
        <div className="relative w-6 h-6 rounded-full overflow-hidden border border-[#FF1752]/60 bg-[#12151E] shrink-0">
          {avatarSrc ? (
            <Image src={avatarSrc} alt={activeProfile?.displayName || "Profil"} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-heading font-black text-white text-[11px] bg-gradient-to-br from-[#FF1752] to-[#0A0A2E]">
              {initialLetter}
            </div>
          )}
        </div>

        <span className="text-xs font-heading font-bold text-white/90 group-hover:text-white truncate max-w-[110px]">
          {activeProfile?.displayName || user.fullName || user.email.split("@")[0]}
        </span>

        <ChevronDown className={`w-3.5 h-3.5 text-white/50 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* DROPDOWN POPOVER */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#0B0D14] border border-white/[0.12] shadow-2xl shadow-black/80 backdrop-blur-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          {menuContent}
        </div>
      )}
    </div>
  );
}
