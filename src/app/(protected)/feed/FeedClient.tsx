"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Loader2,
  SearchX,
  AlertTriangle,
  ArrowRight,
  UserCog,
} from "lucide-react";
import { fetchProfiles } from "@/actions/profile/profile";
import ProfileCard from "@/components/profile/ProfileCard";
import ProfileFiltersUI from "@/components/profile/ProfileFilters";
import Pagination from "@/components/profile/Pagination";
import type { Profile, ProfileListMeta, ProfileFilters } from "@/types";

export default function FeedClient({
  myProfile,
  initialProfiles,
  initialMeta,
}: {
  myProfile: Profile | null;
  initialProfiles: Profile[];
  initialMeta: ProfileListMeta;
}) {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [meta, setMeta] = useState(initialMeta);
  const [filters, setFilters] = useState<ProfileFilters>({
    page: 1,
    limit: 12,
    sort: "-createdAt",
  });
  const [isPending, startTransition] = useTransition();

  const hasProfile = !!myProfile;
  const completionPct = myProfile?.completionPercentage ?? 0;
  const isIncomplete = hasProfile && completionPct < 70;

  const doFetch = (newFilters: ProfileFilters) => {
    const merged = { ...filters, ...newFilters };
    setFilters(merged);
    startTransition(async () => {
      const res = await fetchProfiles(merged);
      if (res.success) {
        setProfiles(res.data || []);
        setMeta(res.meta || { page: 1, limit: 12, total: 0, totalPages: 0 });
      }
    });
  };

  const handlePageChange = (page: number) => {
    doFetch({ page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="font-outfit min-h-screen px-5 py-6 md:py-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          {meta.total > 0 && (
            <span className="text-gray-600 text-xs hidden sm:block">
              {meta.total} found
            </span>
          )}
          <Link
            href="/profile/edit"
            className="flex items-center gap-1.5 text-sm text-brand transition-colors no-underline"
          >
            <UserCog size={14} />
            <span className="hidden sm:inline">
              {hasProfile ? "Edit Profile" : "Create Profile"}
            </span>
          </Link>
        </div>
      </div>

      {/* WARNING — no profile */}
      {!hasProfile && (
        <div className="mb-5 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3.5 flex items-center gap-3">
          <AlertTriangle size={18} className="text-amber-500 shrink-0" />
          <p className="text-slate-700 text-sm flex-1">
            Your profile hasn&apos;t been created yet. Creating a profile will help
            others find you.
          </p>
          <Link
            href="/profile/edit"
            className="shrink-0 px-4 py-2 rounded-xl text-xs font-bold text-white bg-linear-to-r from-brand to-accent no-underline hover:scale-[1.02] transition-transform"
          >
            Create
          </Link>
        </div>
      )}

      {/* WARNING — incomplete profile */}
      {isIncomplete && (
        <div className="mb-5 rounded-2xl border border-brand/20 bg-brand/5 px-4 py-3.5 flex items-center gap-3">
          <div className="shrink-0 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full border-2 border-brand/40 flex items-center justify-center">
              <span className="text-brand text-xs font-bold">
                {completionPct}%
              </span>
            </div>
          </div>
          <p className="text-slate-700 text-sm flex-1">
            Your profile is {completionPct}% complete. Adding more information
            will help you get better matches.
          </p>
          <Link
            href="/profile/edit"
            className="shrink-0 px-4 py-2 rounded-xl text-xs font-bold text-brand border border-brand/30 bg-brand/10 no-underline hover:bg-brand/15 transition-colors flex items-center gap-1"
          >
            Complete <ArrowRight size={12} />
          </Link>
        </div>
      )}

      {/* Filters */}
      <ProfileFiltersUI onApply={doFetch} isPending={isPending} />

      {/* Loading */}
      {isPending && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="animate-spin text-brand" />
        </div>
      )}

      {/* Empty */}
      {!isPending && profiles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <SearchX size={44} className="text-slate-300 mb-4" />
          <h3 className="font-syne text-slate-800 text-lg font-bold mb-1">
            No profiles found
          </h3>
          <p className="text-slate-400 text-sm">Try changing your filters</p>
        </div>
      )}

      {/* Profiles grid */}
      {!isPending && profiles.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {profiles.map((p) => (
              <ProfileCard key={p._id} profile={p} />
            ))}
          </div>
          <Pagination
            page={meta.page}
            totalPages={meta.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
