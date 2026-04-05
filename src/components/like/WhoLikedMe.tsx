"use client";

import { useState } from "react";
import {
  Lock,
  Heart,
  MapPin,
  GraduationCap,
  Briefcase,
  ChevronRight,
} from "lucide-react";
import { GlassCard } from "@/components/ui";
import type { WhoLikedMeItem } from "@/types/like";

function getAge(birthDate?: string): number | null {
  if (!birthDate) return null;
  const diff = Date.now() - new Date(birthDate).getTime();
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function LikerCard({ item }: { item: WhoLikedMeItem }) {
  const profile = item.profile;
  const name = profile?.userId?.name || "Unknown";
  const age = getAge(profile?.birthDate);
  const location = [
    profile?.address?.districtId?.name,
    profile?.address?.divisionId?.name,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="glass-card rounded-2xl p-4 flex items-center gap-3 hover:border-brand/25 transition-all duration-200">
      <div className="w-10 h-10 rounded-full bg-linear-to-br from-brand/30 to-accent/30 flex items-center justify-center shrink-0">
        <span className="font-syne text-white text-sm font-bold">
          {name.charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-outfit text-sm font-semibold text-slate-100 truncate">
          {name}
        </p>
        <div className="flex flex-wrap gap-x-2.5 mt-0.5">
          {age && (
            <span className="font-outfit text-[11px] text-slate-500">
              {age} বছর
            </span>
          )}
          {profile?.profession && (
            <span className="font-outfit text-[11px] text-slate-500 flex items-center gap-0.5">
              <Briefcase size={9} /> {profile.profession}
            </span>
          )}
          {location && (
            <span className="font-outfit text-[11px] text-slate-500 flex items-center gap-0.5">
              <MapPin size={9} /> {location}
            </span>
          )}
          {profile?.education?.graduation?.institution && (
            <span className="font-outfit text-[11px] text-slate-500 flex items-center gap-0.5">
              <GraduationCap size={9} />{" "}
              {profile.education.graduation.institution}
            </span>
          )}
        </div>
      </div>
      <div className="text-right shrink-0">
        <span className="font-outfit text-[10px] text-slate-600 block">
          {timeAgo(item.likedAt)}
        </span>
        <Heart size={12} className="text-brand fill-brand mt-1 ml-auto" />
      </div>
    </div>
  );
}

interface WhoLikedMeProps {
  isPremium: boolean;
  likeCount: number;
  items?: WhoLikedMeItem[];
}

export default function WhoLikedMe({
  isPremium,
  likeCount,
  items = [],
}: WhoLikedMeProps) {
  const [showHint, setShowHint] = useState(false);

  if (!isPremium) {
    return (
      <GlassCard className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-syne text-white text-base font-bold flex items-center gap-2">
            <Heart size={15} className="text-brand fill-brand" />
            কে আপনাকে Like করেছে
          </h2>
          <span className="font-outfit text-[10px] text-slate-500 bg-white/5 border border-white/8 rounded-lg px-2 py-0.5">
            Premium Only
          </span>
        </div>

        {/* Blurred preview rows */}
        <div className="relative">
          <div
            className="space-y-3 blur-sm pointer-events-none select-none"
            aria-hidden
          >
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-4 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-brand/20" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-white/10 rounded w-2/3" />
                  <div className="h-2 bg-white/5 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>

          {/* Lock overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <div
              className="w-11 h-11 rounded-full bg-brand/15 border border-brand/30 flex items-center justify-center mb-3"
              style={{ boxShadow: "var(--shadow-brand-sm)" }}
            >
              <Lock size={18} className="text-brand" />
            </div>
            <p className="font-syne text-white text-sm font-bold mb-1">
              {likeCount > 0
                ? `${likeCount} জন আপনাকে like করেছে`
                : "Like দেখতে Premium নিন"}
            </p>
            <p className="font-outfit text-slate-400 text-xs mb-4">
              Premium-এ upgrade করুন
            </p>
            <button
              onClick={() => setShowHint(true)}
              className="font-outfit flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-on-brand bg-linear-to-r from-brand to-accent cursor-pointer border-0"
              style={{ boxShadow: "var(--shadow-brand-md)" }}
            >
              Upgrade করুন <ChevronRight size={13} />
            </button>
            {showHint && (
              <p className="mt-3 font-outfit text-xs text-brand/70">
                🚀 Coming soon — stay tuned!
              </p>
            )}
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-syne text-white text-base font-bold flex items-center gap-2">
          <Heart size={15} className="text-brand fill-brand" />
          কে আপনাকে Like করেছে
        </h2>
        {items.length > 0 && (
          <span className="font-outfit text-xs text-brand bg-brand/10 border border-brand/20 rounded-lg px-2.5 py-0.5">
            {items.length} জন
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8">
          <Heart size={28} className="text-slate-600 mx-auto mb-2" />
          <p className="font-outfit text-slate-500 text-sm">
            এখনো কেউ like করেনি
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) =>
            item.profile ? (
              <LikerCard key={item.userId} item={item} />
            ) : (
              <div
                key={item.userId}
                className="glass-card rounded-2xl p-4 flex items-center gap-3 opacity-50"
              >
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <span className="text-slate-500">?</span>
                </div>
                <div className="flex-1">
                  <p className="font-outfit text-xs text-slate-400">
                    প্রোফাইল এখনো তৈরি হয়নি
                  </p>
                  <p className="font-outfit text-[10px] text-slate-600">
                    {timeAgo(item.likedAt)}
                  </p>
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </GlassCard>
  );
}
