"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import Link from "next/link";
import {
  BellOff,
  Bell,
  Trash2,
  MessageCircle,
  Loader2,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import {
  getIgnoredConversations,
  deleteIgnoredMessages,
  toggleIgnore,
} from "@/actions/report-block-ignore";
import type { IgnoredConversation } from "@/actions/report-block-ignore";

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  if (isNaN(date.getTime())) return "";
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "now";
  if (diffMins < 60) return `${diffMins}m`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function IgnoredInboxClient() {
  const [convos, setConvos] = useState<IgnoredConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [unignoringId, setUnignoringId] = useState<string | null>(null);
  const [isPending, startTrans] = useTransition();

  const fetchConvos = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    const res = await getIgnoredConversations();
    if (res.success && Array.isArray(res.data)) {
      setConvos(res.data as IgnoredConversation[]);
    }

    if (isRefresh) setRefreshing(false);
    else setLoading(false);
  }, []);

  useEffect(() => {
    fetchConvos();
  }, [fetchConvos]);

  function handleDelete(userId: string) {
    setDeletingId(userId);
    startTrans(async () => {
      const res = await deleteIgnoredMessages(userId);
      if (res.success) {
        // Auto-update: remove from list immediately
        setConvos((prev) => prev.filter((c) => c.userId !== userId));
      }
      setDeletingId(null);
    });
  }

  function handleUnignore(userId: string) {
    setUnignoringId(userId);
    startTrans(async () => {
      const res = await toggleIgnore(userId);
      if (res.success && res.data?.action === "unignored") {
        // Auto-update: remove from ignored list immediately
        setConvos((prev) => prev.filter((c) => c.userId !== userId));
      }
      setUnignoringId(null);
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-xl border-b border-gray-100 px-4 py-3.5 flex items-center gap-3">
        <Link
          href="/chat"
          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 active:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1">
          <p className="font-syne font-bold text-gray-900 text-base leading-tight">
            Ignored Messages
          </p>
          <p className="text-gray-400 text-[11px] font-outfit">
            {convos.length} conversation{convos.length !== 1 ? "s" : ""}
          </p>
        </div>
        {/* Refresh button */}
        <button
          onClick={() => fetchConvos(true)}
          disabled={refreshing}
          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 active:bg-gray-100 transition-colors disabled:opacity-50"
          aria-label="Refresh"
        >
          <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
        </button>
        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
          <BellOff size={14} className="text-gray-400" />
        </div>
      </div>

      {convos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <BellOff size={26} className="text-gray-300" />
          </div>
          <p className="font-syne font-bold text-gray-700 text-base mb-1">
            No ignored messages
          </p>
          <p className="text-gray-400 text-sm font-outfit">
            Messages from ignored users will appear here.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-50">
          {convos.map((c) => (
            <li
              key={c.userId}
              className="flex items-center gap-3 px-4 py-3.5 bg-white"
            >
              {/* Avatar */}
              <div className="w-11 h-11 rounded-full bg-linear-to-br from-brand/20 to-accent/20 flex items-center justify-center shrink-0 relative">
                <span className="font-syne font-bold text-brand text-base">
                  {c.name?.charAt(0)?.toUpperCase() ?? "?"}
                </span>
                {/* Muted indicator */}
                <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-white flex items-center justify-center border border-gray-100">
                  <BellOff size={9} className="text-gray-400" />
                </span>
              </div>

              {/* Info — tappable to open chat */}
              <Link
                href={`/chat/${c.userId}?ignored=true`}
                className="flex-1 min-w-0"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-outfit font-semibold text-gray-800 text-sm truncate">
                    {c.name}
                  </p>
                  <span className="text-[10px] text-gray-400 shrink-0">
                    {formatTime(c.lastMessageTime)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <MessageCircle size={11} className="text-gray-300 shrink-0" />
                  <p className="text-xs text-gray-400 font-outfit truncate">
                    {c.lastMessage || "No messages"}
                  </p>
                  {c.unreadCount > 0 && (
                    <span className="ml-auto shrink-0 w-4 h-4 rounded-full bg-gray-300 text-white text-[9px] flex items-center justify-center font-semibold">
                      {c.unreadCount > 9 ? "9+" : c.unreadCount}
                    </span>
                  )}
                </div>
              </Link>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                {/* Unignore button */}
                <button
                  onClick={() => handleUnignore(c.userId)}
                  disabled={isPending && unignoringId === c.userId}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 active:bg-green-50 active:text-green-500 transition-colors disabled:opacity-50"
                  aria-label="Unignore user"
                  title="Unignore"
                >
                  {isPending && unignoringId === c.userId ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Bell size={14} />
                  )}
                </button>

                {/* Delete button */}
                <button
                  onClick={() => handleDelete(c.userId)}
                  disabled={isPending && deletingId === c.userId}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-300 active:bg-red-50 active:text-red-400 transition-colors disabled:opacity-50"
                  aria-label="Delete ignored messages"
                  title="Delete messages"
                >
                  {isPending && deletingId === c.userId ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
