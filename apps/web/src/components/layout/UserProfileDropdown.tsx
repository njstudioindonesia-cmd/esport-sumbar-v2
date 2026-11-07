"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  User,
  CreditCard,
  ShieldCheck,
  Network,
  Lock,
  Settings,
  ShieldAlert,
  LogOut,
  ExternalLink,
  ChevronDown,
  Edit3,
} from "lucide-react";
import { GlassStatusBadge, GlassRarityBadge } from "@/components/glass";
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
  verificationStatus: "verified" | "pending" | "rejected" | "unregistered";
  rarityTier?: "rookie" | "rising" | "contender" | "elite" | "master" | "legendary";
}

interface UserProfileDropdownProps {
  isMobileDrawer?: boolean;
  onClose?: () => void;
}

export function UserProfileDropdown({
  isMobileDrawer = false,
  onClose,
}: UserProfileDropdownProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{
    id: string;
    email: string;
    fullName?: string;
    role?: string;
  } | null>(null);
  const [profile, setProfile] = useState<UserProfileItem | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Muat data profil pengguna dari endpoint BFF /api/me/profiles
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const res = await fetch("/api/me/profiles");
        if (res.ok) {
          const json = await res.json();
          if (isMounted) {
            setUser(json.user || null);
            // S2: Satu akun = satu profil
            const prof = Array.isArray(json.profiles)
              ? json.profiles[0]
              : json.profile || null;
            setProfile(prof);
          }
        }
      } catch (err) {
        console.warn("Gagal memuat profil pengguna:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Tutup dropdown saat klik di luar atau tekan Escape
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Aksi Keluar
  const handleSignOut = async () => {
    try {
      await signOutAction();
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    }
  };

  // State: Masih memuat
  if (isLoading) {
    return (
      <div className="w-9 h-9 rounded-full bg-white/[0.08] animate-pulse border border-white/10" />
    );
  }

  // State: Belum masuk
  if (!user) {
    return null;
  }

  const avatarSrc = profile?.avatarUrl;
  const initialLetter = (profile?.displayName || user.fullName || user.email)
    .charAt(0)
    .toUpperCase();
  const isAdmin = user.role === "platform_admin" || user.role === "admin";

  // Konten Dropdown Menu
  const menuContent = (
    <div className="flex flex-col text-left font-sans">
      {/* 1. KEPALA MENU (IDENTITAS PROFIL TUNGGAL V3) */}
      <div className="p-4 border-b border-white/10 bg-slate-900/60">
        <div className="flex items-start gap-3">
          <div className="relative w-11 h-11 rounded-2xl overflow-hidden border border-pink-500/40 bg-slate-950 shrink-0">
            {avatarSrc ? (
              <Image
                src={avatarSrc}
                alt={profile?.displayName || "Avatar"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-white text-base bg-gradient-to-br from-pink-600 to-indigo-950">
                {initialLetter}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-sm text-white truncate max-w-[150px]">
                {profile?.displayName || user.fullName || "Akun Terdaftar"}
              </span>
              {profile?.rarityTier && (
                <GlassRarityBadge rarity={profile.rarityTier} size="sm" />
              )}
            </div>

            {profile?.ign && (
              <p className="text-[11px] font-mono text-pink-400 truncate">
                @{profile.ign}
              </p>
            )}

            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              {profile?.esportId && (
                <span className="text-[10px] font-mono text-slate-400">
                  {profile.esportId}
                </span>
              )}
              <GlassStatusBadge
                status={profile?.verificationStatus || "unregistered"}
                size="sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. TAUTAN MENU */}
      <div className="p-2.5 flex flex-col gap-1">
        <Link
          href="/me"
          onClick={() => {
            setIsOpen(false);
            if (onClose) onClose();
          }}
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-white hover:bg-white/[0.08] transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <User className="w-4 h-4 text-pink-400" />
            <span>Profil Saya</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
        </Link>

        <Link
          href="/me/edit"
          onClick={() => {
            setIsOpen(false);
            if (onClose) onClose();
          }}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.08] transition-colors"
        >
          <Edit3 className="w-4 h-4 text-slate-400" />
          <span>Edit Biodata</span>
        </Link>

        <Link
          href="/me/card"
          onClick={() => {
            setIsOpen(false);
            if (onClose) onClose();
          }}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.08] transition-colors"
        >
          <CreditCard className="w-4 h-4 text-slate-400" />
          <span>Kartu Paspor Digital & QR</span>
        </Link>

        <Link
          href="/me/verification"
          onClick={() => {
            setIsOpen(false);
            if (onClose) onClose();
          }}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.08] transition-colors"
        >
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Status Verifikasi Satu Tahap</span>
        </Link>

        <Link
          href="/me/ecosystem"
          onClick={() => {
            setIsOpen(false);
            if (onClose) onClose();
          }}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.08] transition-colors"
        >
          <Network className="w-4 h-4 text-slate-400" />
          <span>Keterhubungan Ekosistem</span>
        </Link>

        <Link
          href="/me/privacy"
          onClick={() => {
            setIsOpen(false);
            if (onClose) onClose();
          }}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.08] transition-colors"
        >
          <Lock className="w-4 h-4 text-slate-400" />
          <span>Privasi & Izin Data</span>
        </Link>

        <Link
          href="/me/settings"
          onClick={() => {
            setIsOpen(false);
            if (onClose) onClose();
          }}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.08] transition-colors"
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Pengaturan & Efek Visual</span>
        </Link>

        {/* Panel Admin jika berhak */}
        {isAdmin && (
          <div className="pt-2 mt-1 border-t border-white/10">
            <Link
              href="/admin"
              onClick={() => {
                setIsOpen(false);
                if (onClose) onClose();
              }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-amber-300 hover:bg-amber-500/15 transition-colors"
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Panel Admin Platform</span>
            </Link>
          </div>
        )}

        {/* Keluar */}
        <div className="pt-2 mt-1 border-t border-white/10">
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:text-rose-200 hover:bg-rose-500/15 transition-colors cursor-pointer"
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
    return (
      <div className="w-full rounded-3xl bg-slate-950/95 border border-white/15 overflow-hidden">
        {menuContent}
      </div>
    );
  }

  // Desktop Dropdown
  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* TRIGGER AVATAR PILL */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 pl-2 pr-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 hover:border-white/25 transition-all shadow-sm group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 min-h-[44px]"
        aria-label="Menu profil pengguna"
        aria-expanded={isOpen}
      >
        <div className="relative w-7 h-7 rounded-xl overflow-hidden border border-pink-500/50 bg-slate-950 shrink-0">
          {avatarSrc ? (
            <Image
              src={avatarSrc}
              alt={profile?.displayName || "Profil"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-bold text-white text-xs bg-gradient-to-br from-pink-600 to-indigo-950">
              {initialLetter}
            </div>
          )}
        </div>

        <span className="text-xs font-bold text-slate-200 group-hover:text-white truncate max-w-[120px]">
          {profile?.displayName || user.fullName || user.email.split("@")[0]}
        </span>

        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* DROPDOWN POPOVER */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-76 rounded-3xl bg-slate-950/95 border border-white/20 shadow-2xl shadow-black/80 backdrop-blur-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          {menuContent}
        </div>
      )}
    </div>
  );
}
