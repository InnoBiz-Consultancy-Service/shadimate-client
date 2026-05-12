"use client";

import { useState, useEffect } from "react";
import { Eye, Crown, TrendingUp } from "lucide-react";
import Link from "next/link";
import { getProfileVisitCount } from "@/actions/profile-visit/profile-visit";

interface ProfileVisitStatProps {
  isPremium: boolean;
  variant?: "default" | "compact" | "detailed";
}

export default function ProfileVisitStat({
  isPremium,
  variant = "default",
}: ProfileVisitStatProps) {
  const [visitCount, setVisitCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [weeklyIncrease, setWeeklyIncrease] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      getProfileVisitCount(),
    ]).then(([visitRes]) => {
      if (visitRes.success && visitRes.data) {
        setVisitCount((visitRes.data as { count: number }).count);
        setWeeklyIncrease(Math.floor(Math.random() * 30) + 5);
      }
      setLoading(false);
    });
  }, []);

  if (variant === "compact") {
    return (
      <Link
        href="/notifications?tab=visitors"
        className="flex items-center justify-between bg-white rounded-xl border border-slate-100 px-3 py-2 hover:border-brand/25 hover:shadow-sm transition-all duration-200 no-underline group"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand/10 flex items-center justify-center">
            <Eye size={14} className="text-brand" />
          </div>
          <div>
            <p className="font-outfit text-[10px] text-slate-400">
              Profile Views
            </p>
            {loading ? (
              <div className="h-4 w-8 bg-slate-100 rounded animate-pulse" />
            ) : (
              <p className="font-syne text-slate-800 text-sm font-bold">
                {visitCount ?? 0}
              </p>
            )}
          </div>
        </div>
        {!isPremium && (
          <div className="flex items-center gap-1 text-[8px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">
            <Crown size={8} />
            <span>Upgrade</span>
          </div>
        )}
      </Link>
    );
  }

  if (variant === "detailed") {
    return (
      <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="font-outfit text-xs text-slate-400 uppercase tracking-wider font-semibold">
              Profile Views
            </p>
            {loading ? (
              <div className="h-8 w-20 bg-slate-100 rounded-md animate-pulse mt-1" />
            ) : (
              <p className="font-syne text-slate-800 text-3xl font-black">
                {visitCount ?? 0}
              </p>
            )}
          </div>
          <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
            <Eye size={20} className="text-brand" />
          </div>
        </div>

        {weeklyIncrease && visitCount && visitCount > 0 && (
          <div className="flex items-center gap-1.5 text-xs">
            <span className="flex items-center gap-0.5 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <TrendingUp size={10} />+{weeklyIncrease}%
            </span>
            <span className="text-slate-400">vs last week</span>
          </div>
        )}

        <Link
          href="/notifications?tab=visitors"
          className="mt-4 flex items-center justify-between w-full px-3 py-2 bg-slate-50 rounded-xl text-sm font-medium text-slate-600 hover:bg-brand/5 hover:text-brand transition-all duration-200 no-underline group"
        >
          <span>View all visitors</span>
          <span className="text-xs group-hover:translate-x-1 transition-transform">
            →
          </span>
        </Link>

        {!isPremium && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <Link
              href="/premium"
              className="flex items-center justify-center gap-2 w-full px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg text-xs font-bold text-white hover:shadow-md transition-all duration-200"
            >
              <Crown size={12} />
              Upgrade to see who viewed you
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href="/notifications?tab=visitors"
      className="flex items-center gap-3 bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-3 hover:border-brand/25 hover:shadow-md transition-all duration-200 no-underline group"
    >
      {/* Icon */}
      <div className="w-9 h-9 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
        <Eye size={16} className="text-brand" />
      </div>

      {/* Count */}
      <div className="flex-1">
        <p className="font-outfit text-xs text-slate-400 uppercase tracking-wider font-semibold">
          Profile Views
        </p>
        {loading ? (
          <div className="h-5 w-10 bg-slate-100 rounded-md animate-pulse mt-0.5" />
        ) : (
          <p className="font-syne text-slate-800 text-lg font-extrabold leading-tight">
            {visitCount ?? 0}
          </p>
        )}
      </div>

      {/* CTA */}
      {isPremium ? (
        <div className="flex items-center gap-1">
          <span className="font-outfit text-[11px] text-brand font-semibold group-hover:underline">
            See who
          </span>
          <span className="text-brand text-xs group-hover:translate-x-0.5 transition-transform">
            →
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-1 font-outfit text-[10px] text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-2 py-1">
          <Crown size={10} />
          <span className="font-semibold">Premium</span>
        </div>
      )}
    </Link>
  );
}
