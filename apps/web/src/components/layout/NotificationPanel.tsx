"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ShieldCheck,
  Network,
  X,
  ExternalLink,
  Check,
} from "lucide-react";
import { Button, StatusBadge } from "@esport-sumbar/ui";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "verification" | "relation" | "system" | "security";
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

export function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const panelRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/me/notifications?limit=20");
      if (res.ok) {
        const data = await res.json();
        if (data.notifications && Array.isArray(data.notifications)) {
          const items: NotificationItem[] = data.notifications.map((n: any) => ({
            id: n.id,
            title: n.title,
            message: n.content || n.message,
            type: n.type || "system",
            isRead: n.is_read ?? n.isRead ?? false,
            createdAt: n.created_at || n.createdAt,
            actionUrl: n.action_url || n.actionUrl,
          }));
          setNotifications(items);
          setUnreadCount(items.filter((i) => !i.isRead).length);
        }
      }
    } catch {
      // Quiet fallback when offline or in test mock
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const markAsRead = async (id: string) => {
    try {
      await fetch("/api/me/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id, isRead: true }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.isRead);
    for (const item of unread) {
      markAsRead(item.id);
    }
  };

  const displayedNotifications =
    filter === "unread" ? notifications.filter((n) => !n.isRead) : notifications;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "verification":
        return <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />;
      case "relation":
        return <Network className="w-4 h-4 text-[#2BB673]" />;
      case "security":
        return <AlertTriangle className="w-4 h-4 text-[#FF1752]" />;
      default:
        return <Clock className="w-4 h-4 text-white/50" />;
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Pemberitahuan Akun"
        className="relative p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/80 hover:text-white transition-all cursor-pointer focus:outline-none focus:border-[#FF1752]/50"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#FF1752] text-white text-[10px] font-mono font-bold flex items-center justify-center border-2 border-[#05051A] animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0C0C26] border border-white/10 shadow-[0_16px_40px_rgba(0,0,20,0.6)] backdrop-blur-xl z-50 overflow-hidden flex flex-col max-h-[480px]">
          {/* Header */}
          <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-white">Notifikasi</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#FF1752]/20 text-[#FF1752] text-[10px] font-mono font-bold">
                  {unreadCount} baru
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-[11px] text-white/50 hover:text-white transition-colors cursor-pointer"
                >
                  Tandai semua dibaca
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="px-4 py-2 border-b border-white/[0.06] flex items-center gap-2 bg-white/[0.02]">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                filter === "all"
                  ? "bg-white/10 text-white"
                  : "text-white/40 hover:text-white"
              }`}
            >
              Semua ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("unread")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                filter === "unread"
                  ? "bg-white/10 text-white"
                  : "text-white/40 hover:text-white"
              }`}
            >
              Belum Dibaca ({unreadCount})
            </button>
          </div>

          {/* Notification List */}
          <div className="overflow-y-auto divide-y divide-white/[0.04]">
            {displayedNotifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-white/40 flex flex-col items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-white/20" />
                <span>Tidak ada pemberitahuan {filter === "unread" ? "baru" : ""}.</span>
              </div>
            ) : (
              displayedNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.isRead && markAsRead(n.id)}
                  className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                    n.isRead
                      ? "hover:bg-white/[0.02] opacity-75"
                      : "bg-[#FF1752]/[0.03] hover:bg-[#FF1752]/[0.06]"
                  }`}
                >
                  <div className="mt-0.5 shrink-0 p-2 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                    {getTypeIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="text-xs font-bold text-white truncate">
                        {n.title}
                      </span>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#FF1752] shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-white/60 leading-relaxed line-clamp-2">
                      {n.message}
                    </p>
                    <span className="text-[10px] text-white/30 font-mono mt-1 block">
                      {n.createdAt ? new Date(n.createdAt).toLocaleDateString("id-ID") : ""}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
