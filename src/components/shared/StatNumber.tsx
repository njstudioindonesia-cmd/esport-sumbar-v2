"use client";

import React, { useEffect, useState, useRef } from "react";

interface StatNumberProps {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export function StatNumber({
  value,
  label,
  prefix = "",
  suffix = "",
  duration = 1600,
  className = "",
}: StatNumberProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(easeOutProgress * value));

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(value);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [value, duration, hasAnimated]);

  return (
    <div ref={elementRef} className={`flex flex-col items-center ${className}`}>
      <span className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-white tracking-tight tabular-nums">
        {prefix}
        {count.toLocaleString("id-ID")}
        {suffix}
      </span>
      <span className="text-xs sm:text-sm font-heading font-bold uppercase tracking-wider text-[#9AA3B2] mt-1">
        {label}
      </span>
    </div>
  );
}
