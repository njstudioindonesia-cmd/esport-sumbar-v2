"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export type BrandLogoVariant = "lockup" | "mark" | "mark-white" | "responsive";
export type BrandLogoSize = "sm" | "md" | "lg" | "xl";

interface BrandLogoProps {
  variant?: BrandLogoVariant;
  size?: BrandLogoSize;
  className?: string;
  withLink?: boolean;
  priority?: boolean;
}

const SIZE_MAP = {
  sm: {
    markWidth: 28,
    markHeight: 15,
    lockupWidth: 110,
    lockupHeight: 38,
  },
  md: {
    markWidth: 38,
    markHeight: 21,
    lockupWidth: 145,
    lockupHeight: 50,
  },
  lg: {
    markWidth: 54,
    markHeight: 30,
    lockupWidth: 195,
    lockupHeight: 68,
  },
  xl: {
    markWidth: 80,
    markHeight: 44,
    lockupWidth: 260,
    lockupHeight: 90,
  },
};

export function BrandLogo({
  variant = "responsive",
  size = "md",
  className = "",
  withLink = true,
  priority = false,
}: BrandLogoProps) {
  const dimensions = SIZE_MAP[size];

  const content = (
    <div
      className={`inline-flex items-center select-none group transition-transform ${className}`}
      aria-label="ESPORT SUMBAR"
    >
      {variant === "mark" && (
        <Image
          src="/brand/logo-mark-pink.png"
          alt="ESPORT SUMBAR Mark"
          width={dimensions.markWidth}
          height={dimensions.markHeight}
          priority={priority}
          className="object-contain h-auto group-hover:scale-105 transition-transform"
        />
      )}

      {variant === "mark-white" && (
        <Image
          src="/brand/logo-mark-white.png"
          alt="ESPORT SUMBAR Mark White"
          width={dimensions.markWidth}
          height={dimensions.markHeight}
          priority={priority}
          className="object-contain h-auto group-hover:scale-105 transition-transform"
        />
      )}

      {variant === "lockup" && (
        <Image
          src="/brand/logo-lockup-navy-cropped.png"
          alt="ESPORT SUMBAR Lockup"
          width={dimensions.lockupWidth}
          height={dimensions.lockupHeight}
          priority={priority}
          className="object-contain h-auto drop-shadow-sm group-hover:brightness-105 transition-all"
        />
      )}

      {variant === "responsive" && (
        <>
          {/* Mobile view (< 640px): Mark saja */}
          <span className="block sm:hidden">
            <Image
              src="/brand/logo-mark-pink.png"
              alt="ESPORT SUMBAR Mark"
              width={dimensions.markWidth}
              height={dimensions.markHeight}
              priority={priority}
              className="object-contain h-auto"
            />
          </span>

          {/* Desktop/Tablet view (>= 640px): Lockup lengkap */}
          <span className="hidden sm:block">
            <Image
              src="/brand/logo-lockup-navy-cropped.png"
              alt="ESPORT SUMBAR"
              width={dimensions.lockupWidth}
              height={dimensions.lockupHeight}
              priority={priority}
              className="object-contain h-auto drop-shadow-sm"
            />
          </span>
        </>
      )}
    </div>
  );

  if (withLink) {
    return (
      <Link href="/" className="inline-flex items-center shrink-0" title="ESPORT SUMBAR - Beranda">
        {content}
      </Link>
    );
  }

  return content;
}
