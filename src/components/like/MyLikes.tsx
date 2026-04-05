"use client";

import Link from "next/link";
import { Heart, MapPin, GraduationCap, Briefcase } from "lucide-react";
import { GlassCard } from "@/components/ui";
import type { MyLikesItem } from "@/types/like";

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

function LikedCard({ item }: { item: MyLikesItem }) {
  const profile = item.profile;
  const name = profile?.userId?.name || "Unknown";
  const age = getAge(profile?.birthDate);
  const location = [
    profile?.address?.districtId?.name,
    profile?.address?.divisionId?.name,
  ]
    .filter(Boolean)
    .join(", ");

  const inner = (
    <div className="glass-card rounded-2xl p-4 flex items-center gap-3 hover:border-brand/25 transition-all duration-200 group">
      <div className="w-10 h-10 rounded-full bg-linear-to-br from-brand/30 to-accent/30 flex items-center justify-center shrink-0">
        <span className="font-syne text-white text-sm font-bold">
          {name.charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-outfit text-sm font-semibold text-slate-100 truncate group-hover:text-brand transition-colors">
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

  if (!item.userId) return inner;
  return (
    <Link href={`/profiles/${item.userId}`} className="no-underline block">
      {inner}
    </Link>
  );
}

export default function MyLikes({ items }: { items: MyLikesItem[] }) {
  return (
    <GlassCard className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-syne text-white text-base font-bold flex items-center gap-2">
          <Heart size={15} className="text-accent" />
          আমার দেওয়া Like
        </h2>
        {items.length > 0 && (
          <span className="font-outfit text-xs text-slate-400 bg-white/5 border border-white/8 rounded-lg px-2.5 py-0.5">
            {items.length} টি
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8">
          <Heart size={28} className="text-slate-600 mx-auto mb-2" />
          <p className="font-outfit text-slate-500 text-sm">
            আপনি এখনো কাউকে like করেননি
          </p>
          <Link
            href="/feed"
            className="inline-block mt-3 font-outfit text-xs text-brand hover:underline no-underline"
          >
            Profiles দেখুন →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) =>
            item.profile ? (
              <LikedCard key={item.userId} item={item} />
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
