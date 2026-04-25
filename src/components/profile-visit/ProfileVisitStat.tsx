"use client";

import { useState, useEffect } from "react";
import { Eye, Crown } from "lucide-react";
import Link from "next/link";
import { getProfileVisitCount } from "@/actions/profile-visit/profile-visit";

interface ProfileVisitStatProps {
  isPremium: boolean;
}

export default function ProfileVisitStat({ isPremium }: ProfileVisitStatProps) {
  const [visitCount, setVisitCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfileVisitCount().then((res) => {
      if (res.success && res.data) {
        setVisitCount((res.data as { count: number }).count);
      }
      setLoading(false);
    });
  }, []);

  return (
    <Link
      href="/profile/visitors"
      className="flex items-center gap-3 bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-3 hover:border-brand/25 hover:shadow-md transition-all duration-200 no-underline group"
    >
      {/* Icon */}
      <div className="w-9 h-9 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0">
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
        <span className="font-outfit text-[11px] text-brand font-semibold group-hover:underline">
          See who →
        </span>
      ) : (
        <div className="flex items-center gap-1 font-outfit text-[10px] text-slate-400 border border-slate-200 rounded-lg px-2 py-1">
          <Crown size={10} />
          Premium
        </div>
      )}
    </Link>
  );
}
