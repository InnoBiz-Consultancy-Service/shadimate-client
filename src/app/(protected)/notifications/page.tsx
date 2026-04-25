"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Bell, Heart, MessageCircle, User, CheckCheck, Trash2, Loader2 } from "lucide-react";
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
  if (mins < 60) return `${mins} minutes ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hours ago`;
  return `${Math.floor(hrs / 24)} days ago`;
}

function senderName(n: NotificationItem): string {
  if (n.senderName) return n.senderName;
  if (typeof n.senderId === "object" && n.senderId !== null)
    return (n.senderId as { name: string }).name;
  return "Someone";
}

function NotifIcon({ type }: { type: string }) {
  if (type === "new_message") {
    return (
      <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 mt-0.5">
        <MessageCircle size={16} className="text-blue-500" />
      </div>
    );
  }
  if (type === "profile_visit") {
    return (
      <div className="w-10 h-10 rounded-full bg-purple-50 border border-purple-200 flex items-center justify-center shrink-0 mt-0.5">
        <User size={15} className="text-purple-500" />
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0 mt-0.5">
      <Heart size={14} className="text-brand fill-brand" />
    </div>
  );
}

function notifText(n: NotificationItem): { main: string; sub?: string } {
  const name = senderName(n);
  if (n.type === "new_message") {
    return {
      main: `${name} sent you a message`,
      sub: "Tap to open chat",
    };
  }
  if (n.type === "profile_visit") {
    return { main: `${name} visited your profile` };
  }
  return { main: `${name} liked your profile` };
}

function getNotifLink(n: NotificationItem): string {
  if (n.type === "new_message" && n.metadata?.conversationWith) {
    return `/chat/${n.metadata.conversationWith}`;
  }
  return "#";
}

// ── Tab types ────────────────────────────────────────────────────────────────
type Tab = "all" | "messages" | "likes" | "visits";

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "all", label: "All", icon: Bell },
  { key: "messages", label: "Messages", icon: MessageCircle },
  { key: "likes", label: "Likes", icon: Heart },
  { key: "visits", label: "Visits", icon: User },
];

function filterByTab(notifs: NotificationItem[], tab: Tab): NotificationItem[] {
  if (tab === "messages") return notifs.filter((n) => n.type === "new_message");
  if (tab === "likes") return notifs.filter((n) => n.type === "like");
  if (tab === "visits") return notifs.filter((n) => n.type === "profile_visit");
  return notifs;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("all");

  const unread = notifications.filter((n) => !n.isRead).length;
  const filtered = filterByTab(notifications, activeTab);

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
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleDelete = async (id: string) => {
    await deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n._id !== id));
  };

  return (
    <div className="font-outfit min-h-screen px-5 py-8 md:py-12 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-syne text-slate-900 text-2xl font-extrabold tracking-tight">
            Notifications
          </h1>
          {!loading && unread > 0 && (
            <p className="text-slate-400 text-sm mt-0.5">{unread} unread</p>
          )}
        </div>
        {unread > 0 && (
          <button
            onClick={handleMarkAll}
            disabled={markingAll}
            className="flex items-center gap-1.5 font-outfit text-xs text-brand hover:text-brand/70 transition-colors cursor-pointer disabled:opacity-50"
          >
            <CheckCheck size={14} />
            {markingAll ? "Marking..." : "Mark all read"}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-slate-100 p-1 rounded-2xl">
        {TABS.map(({ key, label, icon: Icon }) => {
          const count =
            key === "all"
              ? notifications.length
              : filterByTab(notifications, key).length;
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Icon size={13} />
              <span className="hidden sm:inline">{label}</span>
              {count > 0 && (
                <span
                  className={`text-[9px] font-bold px-1 py-0.5 rounded-full ${
                    isActive ? "bg-brand/10 text-brand" : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center gap-2 py-20 text-slate-400">
          <Loader2 size={18} className="animate-spin" />
          <span className="text-sm">Loading...</span>
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
          <Bell size={36} className="text-slate-200 mx-auto mb-3" />
          <h2 className="font-syne text-slate-700 text-base font-bold mb-1">
            No {activeTab === "all" ? "" : activeTab} notifications
          </h2>
          <p className="text-slate-400 text-sm">
            {activeTab === "messages"
              ? "No messages yet. Start a conversation!"
              : activeTab === "likes"
                ? "No likes yet. Complete your profile to attract matches."
                : activeTab === "visits"
                  ? "No profile visits yet."
                  : "You're all caught up!"}
          </p>
          {activeTab === "messages" && (
            <Link
              href="/profiles"
              className="inline-block mt-4 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-linear-to-r from-brand to-accent no-underline hover:scale-[1.02] transition-transform shadow-sm"
            >
              Browse Profiles
            </Link>
          )}
        </div>
      )}

      {/* Notification list */}
      {!loading && filtered.length > 0 && (
        <div className="space-y-2">
          {filtered.map((n) => {
            const { main, sub } = notifText(n);
            const link = getNotifLink(n);
            const isClickable = link !== "#";

            const inner = (
              <div
                className={`bg-white rounded-2xl border p-4 flex items-start gap-3 transition-all duration-200 shadow-sm ${
                  !n.isRead
                    ? "border-brand/20 bg-brand/[0.02]"
                    : "border-slate-100 opacity-80"
                } ${isClickable ? "cursor-pointer hover:border-brand/30 hover:shadow-md" : ""}`}
              >
                <NotifIcon type={n.type} />

                <div className="flex-1 min-w-0">
                  <p className="font-outfit text-sm text-slate-700 leading-relaxed">
                    {main}
                  </p>
                  {sub && (
                    <p className="font-outfit text-[11px] text-slate-400 mt-0.5">
                      {sub}
                    </p>
                  )}
                  <p className="font-outfit text-[11px] text-slate-400 mt-1">
                    {timeAgo(n.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!n.isRead && (
                    <div
                      className="w-2 h-2 rounded-full bg-brand"
                      style={{ boxShadow: "var(--shadow-brand-dot)" }}
                    />
                  )}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDelete(n._id);
                    }}
                    className="text-slate-300 hover:text-red-400 transition-colors cursor-pointer"
                    aria-label="Delete notification"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );

            if (isClickable) {
              return (
                <Link
                  key={n._id}
                  href={link}
                  onClick={() => !n.isRead && handleMarkOne(n._id)}
                  className="no-underline block"
                >
                  {inner}
                </Link>
              );
            }

            return (
              <div
                key={n._id}
                onClick={() => !n.isRead && handleMarkOne(n._id)}
              >
                {inner}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}