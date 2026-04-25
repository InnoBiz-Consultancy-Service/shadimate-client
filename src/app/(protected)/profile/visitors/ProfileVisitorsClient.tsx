"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Eye,
  Lock,
  ChevronLeft,
  ChevronRight,
  Crown,
  User,
} from "lucide-react";
import Link from "next/link";
import { getProfileVisitors } from "@/actions/profile-visit/profile-visit";
import type { ProfileVisitor } from "@/types/profile-visit";

/* ── Helpers ── */
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} minutes ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hours ago`;
  return `${Math.floor(hrs / 24)} days ago`;
}

/* ── Visitor Card ── */
function VisitorCard({ visitor }: { visitor: ProfileVisitor }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3 hover:border-brand/25 hover:shadow-md transition-all duration-200">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand/20 to-accent/20 flex items-center justify-center shrink-0">
        <span className="font-syne text-gray-700 text-sm font-bold">
          {visitor.name.charAt(0).toUpperCase()}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-outfit text-sm font-semibold text-gray-800 truncate">
          {visitor.name}
        </p>
        <p className="font-outfit text-[11px] text-gray-400 mt-0.5">
          {timeAgo(visitor.visitedAt)}
        </p>
      </div>

      {/* Visit count badge */}
      <div className="flex items-center gap-2 shrink-0">
        {visitor.visitCount > 1 && (
          <span className="font-outfit text-[10px] font-semibold text-brand bg-brand/10 border border-brand/20 rounded-full px-2 py-0.5">
            {visitor.visitCount}x
          </span>
        )}
        <Eye size={14} className="text-gray-400" />
      </div>
    </div>
  );
}

/* ── Locked UI for Free Users ── */
function LockedVisitors({ visitCount }: { visitCount: number }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Blurred preview */}
      <div className="relative">
        <div className="blur-sm pointer-events-none select-none space-y-px">
          {["Fatima K.", "Rakibul I.", "Sumaiya A.", "Mehedi H."].map(
            (name) => (
              <div
                key={name}
                className="px-4 py-3 flex items-center gap-3 border-b border-gray-50"
              >
                <div className="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                  <User size={14} className="text-brand/60" />
                </div>
                <div className="flex-1">
                  <div className="h-3 w-24 bg-gray-200 rounded-full mb-1.5" />
                  <div className="h-2.5 w-16 bg-gray-100 rounded-full" />
                </div>
                <div className="h-2.5 w-10 bg-gray-100 rounded-full" />
              </div>
            ),
          )}
        </div>

        {/* Lock overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
          <div className="w-12 h-12 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center mb-3">
            <Lock size={20} className="text-brand" />
          </div>
          <p className="font-syne text-gray-800 text-sm font-bold mb-1">
            {visitCount} {visitCount === 1 ? "person" : "people"} viewed your
            profile
          </p>
          <p className="font-outfit text-gray-500 text-xs mb-4 text-center px-8">
            Upgrade to Premium to see who visited your profile.
          </p>
          <Link
            href="/subscription"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-outfit font-bold text-xs text-white bg-gradient-to-r from-brand to-accent shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 no-underline"
          >
            <Crown size={13} />
            Upgrade to Premium
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Pagination ── */
function Pagination({
  page,
  totalPages,
  onPrev,
  onNext,
}: {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-4 mt-6">
      <button
        onClick={onPrev}
        disabled={page === 1}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-outfit text-sm font-semibold text-gray-600 border border-gray-200 hover:border-brand/30 hover:text-brand disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
      >
        <ChevronLeft size={15} /> Previous
      </button>
      <span className="font-outfit text-sm text-gray-500">
        {page} / {totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={page === totalPages}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-outfit text-sm font-semibold text-gray-600 border border-gray-200 hover:border-brand/30 hover:text-brand disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
      >
        Next <ChevronRight size={15} />
      </button>
    </div>
  );
}

/* ── Main Component ── */
interface ProfileVisitorsClientProps {
  isPremium: boolean;
  visitCount: number;
}

export default function ProfileVisitorsClient({
  isPremium,
  visitCount,
}: ProfileVisitorsClientProps) {
  const [visitors, setVisitors] = useState<ProfileVisitor[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVisitors = useCallback(async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getProfileVisitors(p, 20);
      if (res.success && res.data) {
        const d = res.data as {
          data?: ProfileVisitor[];
          meta?: { total: number; totalPages: number };
        };
        setVisitors(d.data ?? []);
        setTotal(d.meta?.total ?? 0);
        setTotalPages(d.meta?.totalPages ?? 1);
      } else {
        setError(res.message ?? "Failed to load visitors.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isPremium) return;
    fetchVisitors(page);
  }, [isPremium, page, fetchVisitors]);

  return (
    <div className="font-outfit min-h-screen px-4 py-8 md:py-12 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/profile"
          className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:text-brand hover:border-brand/30 transition-all duration-200 no-underline"
        >
          <ChevronLeft size={16} />
        </Link>
        <div>
          <h1 className="font-syne text-gray-900 text-2xl font-extrabold tracking-tight">
            Profile Visitors
          </h1>
          <p className="font-outfit text-gray-500 text-xs mt-0.5">
            {visitCount} {visitCount === 1 ? "person" : "people"} viewed your
            profile
          </p>
        </div>
      </div>

      {/* Free user — locked */}
      {!isPremium && <LockedVisitors visitCount={visitCount} />}

      {/* Premium user */}
      {isPremium && (
        <>
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && error && (
            <div className="bg-red-50/50 border border-red-200 rounded-2xl p-5 text-center">
              <p className="font-outfit text-sm text-red-600">{error}</p>
              <button
                onClick={() => fetchVisitors(page)}
                className="mt-3 font-outfit text-xs text-red-500 underline cursor-pointer hover:text-red-600"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && visitors.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
              <div className="w-14 h-14 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center mx-auto mb-4">
                <Eye size={24} className="text-brand" />
              </div>
              <h2 className="font-syne text-gray-800 text-lg font-bold mb-2">
                No Visitors Yet
              </h2>
              <p className="font-outfit text-gray-500 text-sm max-w-xs mx-auto">
                When someone views your profile, they will appear here.
              </p>
            </div>
          )}

          {!loading && !error && visitors.length > 0 && (
            <>
              <p className="font-outfit text-xs text-gray-500 mb-3">
                Showing {visitors.length} of {total} visitors
              </p>
              <div className="space-y-3">
                {visitors.map((v) => (
                  <VisitorCard key={v.userId} visitor={v} />
                ))}
              </div>
              <Pagination
                page={page}
                totalPages={totalPages}
                onPrev={() => setPage((p) => p - 1)}
                onNext={() => setPage((p) => p + 1)}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
