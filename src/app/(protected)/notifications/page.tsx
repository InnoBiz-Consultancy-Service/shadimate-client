"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, Heart, CheckCheck, Trash2 } from "lucide-react";
import { GlassCard } from "@/components/ui";
import type { NotificationItem } from "@/types/like";
import {
  deleteNotification,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/actions/profile-like/like";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} মিনিট আগে`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ঘণ্টা আগে`;
  return `${Math.floor(hrs / 24)} দিন আগে`;
}

function senderName(n: NotificationItem): string {
  if (n.senderName) return n.senderName;
  if (typeof n.senderId === "object" && n.senderId !== null)
    return (n.senderId as { name: string }).name;
  return "কেউ";
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);
  const unread = notifications.filter((n) => !n.isRead).length;

  const fetch = useCallback(async () => {
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

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleMarkAll = async () => {
    setMarkingAll(true);
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setMarkingAll(false);
  };

  const handleMarkOne = async (id: string) => {
    await markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
    );
  };

  const handleDelete = async (id: string) => {
    await deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n._id !== id));
  };

  return (
    <div className="font-outfit min-h-screen px-5 py-8 md:py-12 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-syne text-white text-2xl font-extrabold tracking-tight">
          Notifications
        </h1>
        {unread > 0 && (
          <button
            onClick={handleMarkAll}
            disabled={markingAll}
            className="flex items-center gap-1.5 font-outfit text-xs text-brand hover:text-accent transition-colors cursor-pointer disabled:opacity-50"
          >
            <CheckCheck size={14} />
            সব পড়া ({unread})
          </button>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && notifications.length === 0 && (
        <GlassCard className="p-10 text-center">
          <Bell size={44} className="text-slate-600 mx-auto mb-4" />
          <h2 className="font-syne text-white text-lg font-bold mb-2">
            কোনো Notification নেই
          </h2>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">
            নতুন like পেলে এখানে দেখাবে।
          </p>
        </GlassCard>
      )}

      {!loading && notifications.length > 0 && (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`glass-card rounded-2xl p-4 flex items-start gap-3 transition-all duration-200 ${
                !n.isRead ? "border-brand/20 bg-brand/3" : "opacity-70"
              }`}
            >
              {/* Icon */}
              <div className="w-9 h-9 rounded-full bg-brand/15 border border-brand/20 flex items-center justify-center shrink-0 mt-0.5">
                <Heart size={14} className="text-brand fill-brand" />
              </div>

              {/* Content */}
              <div
                className="flex-1 min-w-0 cursor-pointer"
                onClick={() => !n.isRead && handleMarkOne(n._id)}
              >
                <p className="font-outfit text-sm text-slate-200 leading-relaxed">
                  <span className="font-semibold text-white">
                    {senderName(n)}
                  </span>{" "}
                  তোমার profile like করেছে
                </p>
                <p className="font-outfit text-[11px] text-slate-500 mt-0.5">
                  {timeAgo(n.createdAt)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {!n.isRead && (
                  <div
                    className="w-2 h-2 rounded-full bg-brand"
                    style={{ boxShadow: "var(--shadow-brand-dot)" }}
                  />
                )}
                <button
                  onClick={() => handleDelete(n._id)}
                  className="text-slate-600 hover:text-red-400 transition-colors cursor-pointer"
                  aria-label="Delete notification"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
