import React from "react";

interface SkeletonProps {
  className?: string;
}

export function SkeletonCard({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`relative w-[280px] h-[392px] rounded-2xl bg-[#12151C] border border-[#262B38] overflow-hidden p-5 flex flex-col justify-between shadow-xl animate-pulse ${className}`}
    >
      {/* Top Header Shimmer */}
      <div className="flex items-center justify-between">
        <div className="h-5 w-20 bg-[#1A1E28] rounded-md" />
        <div className="h-5 w-16 bg-[#1A1E28] rounded-full" />
      </div>

      {/* Avatar Center Shimmer */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-24 h-24 rounded-full bg-[#1A1E28] border-2 border-[#262B38]" />
        <div className="h-5 w-32 bg-[#1A1E28] rounded-md" />
        <div className="h-3 w-24 bg-[#1A1E28] rounded-md" />
      </div>

      {/* Bottom Attributes Shimmer */}
      <div className="flex flex-col gap-2 pt-3 border-t border-[#262B38]">
        <div className="flex justify-between">
          <div className="h-3 w-16 bg-[#1A1E28] rounded" />
          <div className="h-3 w-20 bg-[#1A1E28] rounded" />
        </div>
        <div className="flex justify-between">
          <div className="h-3 w-20 bg-[#1A1E28] rounded" />
          <div className="h-3 w-14 bg-[#1A1E28] rounded" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonTableRow({ count = 5 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <tr key={i} className="border-b border-[#262B38]/60 animate-pulse">
          <td className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1A1E28]" />
              <div className="flex flex-col gap-1.5">
                <div className="h-4 w-28 bg-[#1A1E28] rounded" />
                <div className="h-3 w-20 bg-[#1A1E28] rounded" />
              </div>
            </div>
          </td>
          <td className="p-4">
            <div className="h-4 w-24 bg-[#1A1E28] rounded" />
          </td>
          <td className="p-4">
            <div className="h-5 w-20 bg-[#1A1E28] rounded-full" />
          </td>
          <td className="p-4">
            <div className="h-4 w-16 bg-[#1A1E28] rounded" />
          </td>
          <td className="p-4 text-right">
            <div className="h-8 w-16 bg-[#1A1E28] rounded-lg ml-auto" />
          </td>
        </tr>
      ))}
    </>
  );
}

export function SkeletonProfileHeader() {
  return (
    <div className="p-8 rounded-2xl bg-[#12151C] border border-[#262B38] flex flex-col md:flex-row items-center gap-8 animate-pulse shadow-xl">
      <div className="w-32 h-32 rounded-2xl bg-[#1A1E28] shrink-0" />
      <div className="flex-1 flex flex-col gap-3 w-full">
        <div className="flex items-center gap-2">
          <div className="h-5 w-24 bg-[#1A1E28] rounded" />
          <div className="h-5 w-28 bg-[#1A1E28] rounded-full" />
        </div>
        <div className="h-8 w-64 bg-[#1A1E28] rounded" />
        <div className="h-4 w-48 bg-[#1A1E28] rounded" />
        <div className="flex gap-2 pt-2">
          <div className="h-9 w-28 bg-[#1A1E28] rounded-xl" />
          <div className="h-9 w-28 bg-[#1A1E28] rounded-xl" />
        </div>
      </div>
    </div>
  );
}
