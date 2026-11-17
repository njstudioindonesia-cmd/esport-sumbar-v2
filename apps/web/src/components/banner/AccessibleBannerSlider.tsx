"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play, Pause, ExternalLink } from "lucide-react";
import type { Banner } from "@esport-sumbar/contracts";

export interface AccessibleBannerSliderProps {
  banners: Banner[];
  autoPlayIntervalMs?: number; // Default 6000ms (6s), range 4000 - 12000ms
  className?: string;
  ariaLabel?: string;
}

export function AccessibleBannerSlider({
  banners,
  autoPlayIntervalMs = 6000,
  className = "",
  ariaLabel = "Banner Promosi & Pengumuman Resmi",
}: AccessibleBannerSliderProps) {
  // Aturan 3.9 & 8.4: 0 banner = sembunyikan seluruh kontainer (tanpa ruang kosong)
  if (!banners || banners.length === 0) {
    return null;
  }

  // Aturan: 1 banner = render statis tanpa kontrol navigasi / auto-play
  if (banners.length === 1) {
    const single = banners[0];
    return (
      <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 ${className}`}>
        <BannerItem banner={single} isPriority={true} />
      </div>
    );
  }

  return (
    <MultiBannerCarousel
      banners={banners}
      autoPlayIntervalMs={autoPlayIntervalMs}
      className={className}
      ariaLabel={ariaLabel}
    />
  );
}

function MultiBannerCarousel({
  banners,
  autoPlayIntervalMs,
  className,
  ariaLabel,
}: {
  banners: Banner[];
  autoPlayIntervalMs: number;
  className: string;
  ariaLabel: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Touch Swipe detection state
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Clamp interval between 4s and 12s
  const interval = Math.max(4000, Math.min(12000, autoPlayIntervalMs));

  // 1. Deteksi prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mediaQuery.matches);
      if (mediaQuery.matches) {
        setIsPlaying(false);
      }

      const handleChange = (e: MediaQueryListEvent) => {
        setReducedMotion(e.matches);
        if (e.matches) setIsPlaying(false);
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  // 2. Navigasi Slide
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
  };

  // 3. Timer Auto-Play (WCAG 2.2.2: jeda saat hover, keyboard focus, sentuhan, atau prefers-reduced-motion)
  useEffect(() => {
    if (!isPlaying || isHovered || isFocused || isTouched || reducedMotion) {
      return;
    }

    const timer = setInterval(() => {
      goToNext();
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered, isFocused, isTouched, reducedMotion, interval, goToNext]);

  // 4. Keyboard Navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goToPrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goToNext();
    }
  };

  // 5. Touch Gestures (Swipe)
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsTouched(true);
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const deltaX = touchStartX.current - touchEndX.current;
      const swipeThreshold = 50; // px
      if (deltaX > swipeThreshold) {
        goToNext();
      } else if (deltaX < -swipeThreshold) {
        goToPrev();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
    setTimeout(() => setIsTouched(false), 2000);
  };

  const activeBanner = banners[currentIndex];

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
      className={`relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 outline-none focus:ring-1 focus:ring-[#FF1752]/50 rounded-2xl ${className}`}
    >
      {/* Pengumuman Ramah Aksesibilitas (Live Region ARIA) */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Slide {currentIndex + 1} dari {banners.length}: {activeBanner.title}
        {activeBanner.is_ad ? " (Iklan)" : ""}
      </div>

      {/* Kontainer Slide (Rasio Tetap Zero-CLS) */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A1E]/80 shadow-2xl aspect-[16/8] sm:aspect-[21/8] lg:aspect-[24/8]">
        {banners.map((banner, index) => {
          const isCurrent = index === currentIndex;
          return (
            <div
              key={banner.id || index}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} dari ${banners.length}`}
              aria-hidden={!isCurrent}
              className={`absolute inset-0 transition-opacity duration-500 ease-out ${
                isCurrent
                  ? "opacity-100 z-10 pointer-events-auto"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <BannerItem banner={banner} isPriority={index === 0} />
            </div>
          );
        })}

        {/* Tombol Navigasi Kiri & Kanan (Desktop/Tablet) */}
        <div className="absolute inset-y-0 left-3 z-20 flex items-center">
          <button
            type="button"
            onClick={goToPrev}
            aria-label="Slide sebelumnya"
            className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer shadow-lg active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="absolute inset-y-0 right-3 z-20 flex items-center">
          <button
            type="button"
            onClick={goToNext}
            aria-label="Slide berikutnya"
            className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer shadow-lg active:scale-95"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Kontrol Bawah: Tombol Pause/Play & Indikator Titik */}
        <div className="absolute bottom-3 inset-x-0 z-20 flex items-center justify-between px-4 sm:px-6">
          {/* Tombol Putar/Jeda Terlihat (WCAG 2.2.2) */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? "Jeda putar otomatis banner" : "Mulai putar otomatis banner"}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-white/80 hover:text-white transition-all cursor-pointer shadow"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-[#FF1752]" />
                <span className="hidden sm:inline">Jeda</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-[#2BB673]" />
                <span className="hidden sm:inline">Putar</span>
              </>
            )}
          </button>

          {/* Indikator Titik (Dots) */}
          <div
            role="tablist"
            aria-label="Pilih slide banner"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10"
          >
            {banners.map((_, dotIdx) => {
              const active = dotIdx === currentIndex;
              return (
                <button
                  key={dotIdx}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={`Buka slide ${dotIdx + 1} dari ${banners.length}`}
                  onClick={() => goToSlide(dotIdx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    active ? "w-6 bg-[#FF1752]" : "w-2 bg-white/30 hover:bg-white/50"
                  }`}
                />
              );
            })}
          </div>

          {/* Badge Indikator Status & Waktu */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] text-white/50">
            <span>
              {currentIndex + 1} / {banners.length}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function BannerItem({ banner, isPriority }: { banner: Banner; isPriority: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasTrackedImpression = useRef(false);

  // Pelacakan Impression Anonim & Agregat (≥50% terlihat selama ≥1 detik, 1x/sesi)
  useEffect(() => {
    if (typeof window === "undefined" || !banner.id || hasTrackedImpression.current) return;

    const el = containerRef.current;
    if (!el) return;

    let timer: NodeJS.Timeout;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          timer = setTimeout(() => {
            if (!hasTrackedImpression.current) {
              hasTrackedImpression.current = true;
              fetch(`/api/banners/${banner.id}/track`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ eventType: "impression" }),
              }).catch(() => {});
            }
          }, 1000); // 1 detik
        } else {
          clearTimeout(timer);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [banner.id]);

  const handleBannerClick = () => {
    if (banner.id) {
      fetch(`/api/banners/${banner.id}/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventType: "click" }),
      }).catch(() => {});
    }
  };

  const content = (
    <div ref={containerRef} className="relative w-full h-full group">
      {/* Gambar Desktop */}
      <div className="hidden sm:block absolute inset-0">
        <Image
          src={banner.desktop_image_url}
          alt={banner.alt_text}
          fill
          priority={isPriority}
          sizes="(max-width: 1280px) 100vw, 1280px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.01]"
        />
      </div>

      {/* Gambar Mobile */}
      <div className="block sm:hidden absolute inset-0">
        <Image
          src={banner.mobile_image_url || banner.desktop_image_url}
          alt={banner.alt_text}
          fill
          priority={isPriority}
          sizes="100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.01]"
        />
      </div>

      {/* Lapisan Gradien Elegan & Matte Glass Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

      {/* Overlay Konten & Label Sponsor/Iklan */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex items-center gap-2">
        {banner.is_ad && (
          <span className="px-2 py-0.5 rounded-md bg-[#FF1752]/90 border border-white/20 text-[10px] font-bold tracking-wider uppercase text-white shadow-md">
            Iklan
          </span>
        )}
        {banner.sponsor_name && (
          <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-semibold text-white/90 shadow-md">
            Sponsor: {banner.sponsor_name}
          </span>
        )}
      </div>

      {/* Judul & Teks Aksesibel di Pojok Kiri Bawah */}
      <div className="absolute bottom-10 sm:bottom-12 left-4 sm:left-6 right-4 sm:right-6 z-10 pointer-events-none">
        <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-white drop-shadow-md line-clamp-1">
          {banner.title}
        </h3>
        {banner.target_url && (
          <p className="hidden sm:flex items-center gap-1 text-xs text-white/70 mt-0.5">
            <span>Buka tautan informasi</span>
            <ExternalLink className="w-3 h-3 text-[#FF1752]" />
          </p>
        )}
      </div>
    </div>
  );

  if (banner.target_url) {
    const isExternal = banner.target_url.startsWith("http");
    const rel = banner.is_ad
      ? "sponsored noopener"
      : isExternal
      ? "noopener noreferrer"
      : undefined;

    return (
      <Link
        href={banner.target_url}
        target={banner.open_in_new_tab ? "_blank" : undefined}
        rel={rel}
        onClick={handleBannerClick}
        className="block w-full h-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF1752]"
      >
        {content}
      </Link>
    );
  }

  return content;
}
