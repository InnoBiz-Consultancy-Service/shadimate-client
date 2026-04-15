"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, Heart, CheckCheck, X } from "lucide-react";
import type { NotificationItem } from "@/types/like";
import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/actions/profile-like/like";

interface NotificationBellProps {
  userId?: string;
  token?: string;
  /** When used as a mobile nav item — renders just the bell icon with badge */
  asNavItem?: boolean;
  active?: boolean;
}

export default function NotificationBell({
  userId,
  token,
  asNavItem = false,
  active = false,
}: NotificationBellProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch unread count on mount
  useEffect(() => {
    getUnreadNotificationCount().then((res) => {
      if (res.success && res.data) {
        setUnreadCount((res.data as { unreadCount: number }).unreadCount ?? 0);
      }
    });
  }, []);

  // Socket.io — dynamic import for SSR safety
  useEffect(() => {
    if (!userId || !token) return;
    let cleanup: (() => void) | null = null;

    const setup = async () => {
      try {
        const { io } = await import("socket.io-client");
        const serverUrl =
          process.env.NEXT_PUBLIC_SOCKET_URL ||
          process.env.NEXT_PUBLIC_BASE_URL ||
          "";
        if (!serverUrl) return;

        const socket = io(serverUrl, {
          query: { token, userId },
          transports: ["websocket"],
        });

        const onNew = (n: unknown) => {
          const notif = n as NotificationItem;
          if (notif.type === "like") {
            setNotifications((prev) => [notif, ...prev]);
            setUnreadCount((prev) => prev + 1);
          }
        };

        const onPending = (arr: unknown) => {
          const notifs = arr as NotificationItem[];
          const likeNotifs = notifs.filter((n) => n.type === "like");
          if (likeNotifs.length)
            setNotifications((prev) => [...likeNotifs, ...prev]);
          setUnreadCount(notifs.length);
        };

        socket.on("new-notification", onNew);
        socket.on("pending-notifications", onPending);
        cleanup = () => {
          socket.off("new-notification", onNew);
          socket.off("pending-notifications", onPending);
          socket.disconnect();
        };
      } catch {
        // socket.io-client not installed — REST only
      }
    };

    setup();
    return () => cleanup?.();
  }, [userId, token]);

  const fetchNotifs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getNotifications();
      if (res.success && res.data) {
        const d = res.data as { data?: NotificationItem[] };
        setNotifications(d.data || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleOpen = () => {
    const next = !open;
    setOpen(next);
    if (next && notifications.length === 0) fetchNotifs();
  };

  const handleMarkAll = async () => {
    await markAllNotificationsRead();
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleMarkOne = async (id: string) => {
    await markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const senderName = (n: NotificationItem) => {
    if (n.senderName) return n.senderName;
    if (typeof n.senderId === "object" && n.senderId !== null)
      return (n.senderId as { name: string }).name;
    return "Someone";
  };

  const timeAgo = (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "just now";
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h`;
    return `${Math.floor(h / 24)}d`;
  };

  // ── Nav item mode (mobile bottom bar) ──
  // Just shows a bell icon with badge, no dropdown
  if (asNavItem) {
    return (
      <div className="relative">
        <Bell
          size={22}
          className={`transition-colors duration-200 ${active ? "text-brand" : "text-slate-500"}`}
        />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1.5 min-w-3.75 h-3.75 flex items-center justify-center bg-brand text-on-brand text-[8px] font-outfit font-bold rounded-full px-0.5"
            style={{ boxShadow: "var(--shadow-brand-dot)" }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </div>
    );
  }

  // ── Full dropdown mode (desktop) ──
  return (
    <div className="relative">
      <button
        onClick={handleOpen}
        aria-label="Notifications"
        className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:bg-brand/10 hover:border-brand/30 transition-all duration-200 cursor-pointer"
      >
        <Bell
          size={16}
          className={unreadCount > 0 ? "text-brand" : "text-slate-400"}
        />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 min-w-4.25 h-4.25 flex items-center justify-center bg-brand text-on-brand text-[9px] font-outfit font-bold rounded-full px-1"
            style={{ boxShadow: "var(--shadow-brand-dot)" }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-11 z-50 w-80 rounded-2xl glass-card overflow-hidden animate-[fadeUp_0.2s_ease]">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <span className="font-syne text-white text-sm font-bold">
                Notifications
              </span>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAll}
                    className="font-outfit text-[11px] text-brand hover:text-accent transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <CheckCheck size={11} /> Marks all read
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="text-slate-500 hover:text-white cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto">
              {loading && (
                <div className="py-8 text-center">
                  <div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
              )}

              {!loading && notifications.length === 0 && (
                <div className="py-8 text-center">
                  <Bell size={22} className="text-slate-600 mx-auto mb-2" />
                  <p className="font-outfit text-slate-500 text-xs">
                    No notification
                  </p>
                </div>
              )}

              {!loading &&
                notifications.map((n) => (
                  <div
                    key={n._id}
                    onClick={() => !n.isRead && handleMarkOne(n._id)}
                    className={`flex items-start gap-3 px-4 py-3 border-b border-white/5 last:border-0 cursor-pointer transition-colors duration-150 ${
                      n.isRead ? "opacity-60" : "hover:bg-brand/5"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-brand/15 border border-brand/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Heart size={12} className="text-brand fill-brand" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-outfit text-xs text-slate-200 leading-relaxed">
                        <span className="font-semibold text-white">
                          {senderName(n)}
                        </span>{" "}
                        liked your profile
                      </p>
                      <p className="font-outfit text-[10px] text-slate-600 mt-0.5">
                        {timeAgo(n.createdAt)}
                      </p>
                    </div>
                    {!n.isRead && (
                      <div
                        className="w-2 h-2 rounded-full bg-brand shrink-0 mt-1.5"
                        style={{ boxShadow: "var(--shadow-brand-dot)" }}
                      />
                    )}
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
