"use client";

import Link from "next/link";
import { Users, UserCog, Heart, UserPlus } from "lucide-react";
import { Logo, GlassCard } from "@/components/ui";
import ProfileCompletionCard from "@/components/profile/ProfileCompletionCard";
import type { Profile } from "@/types";

export default function DashboardClient({
  profile,
}: {
  profile: Profile | null;
}) {
  const name = profile?.userId?.name || "User";

  return (
    <div className="font-outfit min-h-screen px-5 py-8 md:py-12 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Logo size="small" />
        <Link
          href="/profile/edit"
          className="font-outfit flex items-center gap-1.5 text-sm text-slate-400 hover:text-brand transition-colors no-underline"
        >
          <UserCog size={14} /> Edit Profile
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="font-syne text-white text-2xl md:text-3xl font-extrabold tracking-tight mb-1">
          স্বাগতম, {name.split(" ")[0]}!
        </h1>
        <p className="text-slate-500 text-sm">আপনার ড্যাশবোর্ড</p>
      </div>

      {/* No profile yet — prompt to create */}
      {!profile && (
        <GlassCard className="p-6 mb-6 text-center">
          <UserPlus size={32} className="text-brand mx-auto mb-3" />
          <h2 className="font-syne text-white text-lg font-bold mb-2">
            প্রোফাইল তৈরি করুন
          </h2>
          <p className="text-slate-400 text-sm mb-4">
            ম্যাচ খুঁজতে আগে আপনার প্রোফাইল সম্পূর্ণ করুন
          </p>
          <Link
            href="/profile/edit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-on-brand bg-linear-to-r from-brand to-accent no-underline hover:scale-[1.02] transition-transform duration-200"
          >
            <UserPlus size={14} /> প্রোফাইল তৈরি করুন
          </Link>
        </GlassCard>
      )}

      {/* Has profile — show completion card */}
      {profile && profile.completionPercentage !== undefined && (
        <div className="mb-6">
          <ProfileCompletionCard
            percentage={profile.completionPercentage}
            label={profile.completionLabel || ""}
            missingFields={profile.missingFields || []}
          />
        </div>
      )}

      {/* Quick info */}
      {profile && (
        <GlassCard className="p-5 md:p-6 mb-6">
          <h2 className="font-syne text-white text-lg font-bold mb-4">
            আপনার তথ্য
          </h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {profile.profession && (
              <div>
                <span className="text-slate-500 text-xs block mb-0.5">
                  পেশা
                </span>
                <span className="text-slate-200 font-medium">
                  {profile.profession}
                </span>
              </div>
            )}
            {profile.personality && (
              <div>
                <span className="text-slate-500 text-xs block mb-0.5">
                  ব্যক্তিত্ব
                </span>
                <span className="text-slate-200 font-medium">
                  {profile.personality}
                </span>
              </div>
            )}
            {profile.religion?.faith && (
              <div>
                <span className="text-slate-500 text-xs block mb-0.5">
                  ধর্ম
                </span>
                <span className="text-slate-200 font-medium">
                  {profile.religion.faith}
                </span>
              </div>
            )}
            {profile.economicalStatus && (
              <div>
                <span className="text-slate-500 text-xs block mb-0.5">
                  আর্থিক অবস্থা
                </span>
                <span className="text-slate-200 font-medium">
                  {profile.economicalStatus}
                </span>
              </div>
            )}
          </div>
        </GlassCard>
      )}

      {/* Action cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/profiles" className="no-underline">
          <GlassCard className="p-5 hover:border-brand/30 hover:shadow-[var(--shadow-brand-xs)] transition-all duration-200 cursor-pointer">
            <Users size={24} className="text-brand mb-3" />
            <h3 className="font-syne text-white font-bold text-base mb-1">
              ম্যাচ খুঁজুন
            </h3>
            <p className="text-slate-500 text-xs">
              ফিল্টার করে আপনার জন্য সেরা ম্যাচ খুঁজুন
            </p>
          </GlassCard>
        </Link>

        <Link href="/profile/edit" className="no-underline">
          <GlassCard className="p-5 hover:border-brand/30 hover:shadow-[var(--shadow-brand-xs)] transition-all duration-200 cursor-pointer">
            <Heart size={24} className="text-accent mb-3" />
            <h3 className="font-syne text-white font-bold text-base mb-1">
              প্রোফাইল আপডেট
            </h3>
            <p className="text-slate-500 text-xs">
              আরো তথ্য যোগ করে ভালো ম্যাচ পান
            </p>
          </GlassCard>
        </Link>
      </div>
    </div>
  );
}
