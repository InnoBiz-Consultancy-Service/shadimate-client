"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Shield, ArrowLeft, Loader2, UserX, RefreshCw } from "lucide-react";
import { getBlockList } from "@/actions/report-block-ignore";
import type { BlockedUser } from "@/actions/report-block-ignore";
import BlockConfirmModal from "./BlockConfirmModal";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlockListClient() {
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unblockTarget, setUnblockTarget] = useState<BlockedUser | null>(null);

  const fetchBlockList = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    const res = await getBlockList();

    // Handle both array response and nested { data: [] } structure
    if (res.success) {
      let users: BlockedUser[] = [];
      if (Array.isArray(res.data)) {
        users = res.data as BlockedUser[];
      } else if (
        res.data &&
        Array.isArray((res.data as { data?: BlockedUser[] }).data)
      ) {
        users = (res.data as { data: BlockedUser[] }).data;
      }
      setBlockedUsers(users);
    }

    if (isRefresh) setRefreshing(false);
    else setLoading(false);
  }, []);

  useEffect(() => {
    fetchBlockList();
  }, [fetchBlockList]);

  function handleUnblockSuccess(action: "blocked" | "unblocked") {
    if (action === "unblocked" && unblockTarget) {
      // Optimistically remove from list immediately — no reload needed
      setBlockedUsers((prev) =>
        prev.filter((u) => u.userId !== unblockTarget.userId),
      );
      setUnblockTarget(null);
    }
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
          href="/profile"
          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 active:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1">
          <p className="font-syne font-bold text-gray-900 text-base leading-tight">
            Blocked Users
          </p>
          <p className="text-gray-400 text-[11px] font-outfit">
            {blockedUsers.length} user{blockedUsers.length !== 1 ? "s" : ""}
          </p>
        </div>
        {/* Refresh button */}
        <button
          onClick={() => fetchBlockList(true)}
          disabled={refreshing}
          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 active:bg-gray-100 transition-colors disabled:opacity-50"
          aria-label="Refresh list"
        >
          <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
        </button>
      </div>

      {blockedUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
            <Shield size={26} className="text-green-400" />
          </div>
          <p className="font-syne font-bold text-gray-700 text-base mb-1">
            No blocked users
          </p>
          <p className="text-gray-400 text-sm font-outfit">
            Users you block will appear here.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-50 mt-1">
          {blockedUsers.map((u) => (
            <li
              key={u.userId}
              className="flex items-center gap-3 px-4 py-3.5 bg-white"
            >
              {/* Avatar */}
              <div className="w-11 h-11 rounded-full bg-linear-to-br from-orange-100 to-amber-100 flex items-center justify-center shrink-0">
                <UserX size={18} className="text-orange-400" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-outfit font-semibold text-gray-800 text-sm truncate">
                  {u.name}
                </p>
                <p className="text-[11px] text-gray-400 font-outfit mt-0.5">
                  Blocked on {formatDate(u.blockedAt)}
                </p>
              </div>

              {/* Unblock button */}
              <button
                onClick={() => setUnblockTarget(u)}
                className="px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-orange-500 text-xs font-semibold font-outfit active:bg-orange-100 transition-colors"
              >
                Unblock
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Unblock confirm modal */}
      {unblockTarget && (
        <BlockConfirmModal
          targetUserId={unblockTarget.userId}
          targetName={unblockTarget.name}
          isCurrentlyBlocked={true}
          onClose={() => setUnblockTarget(null)}
          onSuccess={handleUnblockSuccess}
        />
      )}
    </div>
  );
}
