import React, { useState, useEffect } from "react";
import { Search, User, LogOut, Bell, Settings, Layers } from "lucide-react";
import { Menu, MenuItem } from "./Menu";

export interface NavLinkItem {
  id: string;
  label: string;
  href: string;
  isActive?: boolean;
}

export interface HeaderUser {
  displayName: string;
  slug?: string;
  avatarUrl?: string | null;
  role?: string;
  branch?: string;
}

export interface HeaderProps {
  logo?: React.ReactNode;
  navLinks?: NavLinkItem[];
  user?: HeaderUser | null;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
  onSearchClick?: () => void;
  onNavigate?: (href: string) => void;
  className?: string;
}

export function Header({
  logo,
  navLinks = [
    { id: "explore", label: "Jelajah", href: "/explore", isActive: true },
    { id: "ecosystem", label: "Ekosistem", href: "/ecosystem" },
    { id: "news", label: "Berita", href: "/news" },
    { id: "regions", label: "Daerah", href: "/regions" },
    { id: "about", label: "Tentang", href: "/about" },
  ],
  user,
  onLoginClick,
  onLogoutClick,
  onSearchClick,
  onNavigate,
  className = "",
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const userMenuItems: MenuItem[] = [
    {
      id: "profile",
      label: "Profil Saya",
      icon: <User className="w-4 h-4 text-white/70" />,
      onClick: () => user?.slug && onNavigate?.(`/${user.branch || "player"}/${user.slug}`),
    },
    {
      id: "ecosystem",
      label: "Ekosistem Saya",
      icon: <Layers className="w-4 h-4 text-white/70" />,
      onClick: () => onNavigate?.("/me/ecosystem"),
    },
    {
      id: "notifications",
      label: "Notifikasi",
      icon: <Bell className="w-4 h-4 text-white/70" />,
      onClick: () => onNavigate?.("/me/notifications"),
    },
    {
      id: "settings",
      label: "Pengaturan Akun",
      icon: <Settings className="w-4 h-4 text-white/70" />,
      onClick: () => onNavigate?.("/me/settings"),
    },
    {
      id: "logout",
      label: "Keluar",
      icon: <LogOut className="w-4 h-4 text-[#F04438]" />,
      danger: true,
      onClick: onLogoutClick,
    },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between transition-all duration-300 ${
        isScrolled
          ? "bg-[#05051A]/85 backdrop-blur-md border-b border-white/[0.08] shadow-lg"
          : "bg-transparent border-b border-transparent"
      } ${className}`}
    >
      {/* KIRI: Logo Mark V-S Transparan */}
      <div className="flex items-center gap-3">
        {logo || (
          <div className="flex items-center gap-2 select-none">
            <span className="w-7 h-7 rounded-md bg-[#FF1752] text-white flex items-center justify-center font-black text-xs">
              V
            </span>
            <span className="font-extrabold tracking-tight text-white text-sm hidden sm:inline">
              ESPORT SUMBAR
            </span>
          </div>
        )}
      </div>

      {/* TENGAH: Maksimal 5 Tautan Teks Murni (Tanpa pil/kotak) */}
      <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
        {navLinks.slice(0, 5).map((link) => (
          <a
            key={link.id}
            href={link.href}
            onClick={(e) => {
              if (onNavigate) {
                e.preventDefault();
                onNavigate(link.href);
              }
            }}
            className={`relative py-1 transition-colors select-none ${
              link.isActive ? "text-white font-bold" : "text-white/70 hover:text-white"
            }`}
          >
            <span>{link.label}</span>
            {link.isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF1752] rounded-full" />
            )}
          </a>
        ))}
      </nav>

      {/* KANAN: Search (⌘K) & Satu Tombol Primer / Avatar Pengguna */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onSearchClick}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white/50 hover:text-white/80 transition-colors"
          title="Pencarian Cepat"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Cari</span>
          <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono">⌘K</kbd>
        </button>

        {user ? (
          <Menu
            trigger={
              <div className="flex items-center gap-2.5 p-1 rounded-full hover:bg-white/[0.06] transition-colors">
                <div className="w-9 h-9 rounded-full bg-[#14143A] border border-white/15 overflow-hidden flex items-center justify-center">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.displayName} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4 text-white/60" />
                  )}
                </div>
              </div>
            }
            items={userMenuItems}
          />
        ) : (
          <button
            type="button"
            onClick={onLoginClick}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-[#FF1752] text-white hover:bg-[#E01246] transition-colors shadow-sm select-none"
          >
            Masuk
          </button>
        )}
      </div>
    </header>
  );
}
