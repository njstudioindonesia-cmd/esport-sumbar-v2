import React, { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, ChevronLeft, ChevronRight } from "lucide-react";

export interface BannerSlideItem {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  linkUrl?: string;
  sponsorName?: string;
  isSponsored?: boolean;
  ctaText?: string;
}

export interface CarouselProps {
  banners: BannerSlideItem[];
  intervalMs?: number;
  className?: string;
}

export function Carousel({
  banners,
  intervalMs = 6000,
  className = "",
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Jika tidak ada banner aktif, bagian disembunyikan tanpa menyisakan ruang kosong (Section 3.9)
  if (!banners || banners.length === 0) {
    return null;
  }

  // Jika hanya ada 1 banner, tampilkan statis tanpa tombol kontrol (Section 3.9)
  const isSingle = banners.length === 1;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  // Auto-play timer dengan proteksi jeda saat hover/fokus/prefers-reduced-motion (WCAG 2.2.2)
  useEffect(() => {
    if (isSingle) return;

    // Periksa prefers-reduced-motion pengguna
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setIsPlaying(false);
      return;
    }

    if (isPlaying && !isHovered) {
      timerRef.current = setInterval(nextSlide, intervalMs);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isHovered, nextSlide, intervalMs, isSingle]);

  const activeBanner = banners[currentIndex];

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="Pengumuman dan Banner Resmi"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      className={`relative w-full rounded-2xl bg-[#0C0C26] border border-white/[0.08] overflow-hidden select-none transition-all duration-200 ${className}`}
    >
      {/* Aspect Ratio Terkunci (16:9 desktop / 4:3 mobile) untuk pencegahan CLS = 0 */}
      <div className="relative w-full aspect-[21/9] min-h-[160px] p-6 sm:p-8 flex flex-col justify-between">
        {/* Top Header Controls */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            {activeBanner.isSponsored ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FF1752]/20 border border-[#FF1752]/40 text-[#FF4D77]">
                Iklan / Sponsor
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/10 text-white/70">
                Pengumuman Resmi
              </span>
            )}

            {activeBanner.sponsorName && (
              <span className="text-xs text-white/50">
                {activeBanner.sponsorName}
              </span>
            )}
          </div>

          {!isSingle && (
            <div className="flex items-center gap-2">
              {/* Tombol Jeda / Putar Fisik Terlihat (WCAG 2.2.2 Mandate) */}
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                aria-label={isPlaying ? "Jeda rotasi slide otomatis" : "Putar rotasi slide otomatis"}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>

              {/* Indikator Titik Slide */}
              <div className="flex items-center gap-1.5">
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-200 ${
                      idx === currentIndex ? "w-6 bg-[#FF1752]" : "w-1.5 bg-white/20"
                    }`}
                    aria-label={`Beralih ke slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="z-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mt-auto">
          <div className="flex flex-col gap-1 max-w-xl">
            <h3 className="text-lg sm:text-2xl font-bold text-white tracking-tight leading-tight">
              {activeBanner.title}
            </h3>
            {activeBanner.subtitle && (
              <p className="text-xs sm:text-sm text-white/60 leading-relaxed line-clamp-2">
                {activeBanner.subtitle}
              </p>
            )}
          </div>

          {activeBanner.linkUrl && (
            <a
              href={activeBanner.linkUrl}
              rel={activeBanner.isSponsored ? "sponsored noopener" : "noopener"}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors shrink-0"
            >
              {activeBanner.ctaText || "Lihat Rincian"}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
