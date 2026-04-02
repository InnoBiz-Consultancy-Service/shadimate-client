"use client";

import { useState, useTransition } from "react";
import { Loader2, SearchX } from "lucide-react";
import { fetchProfiles } from "@/actions/profile/profile";
import { Logo } from "@/components/ui";
import ProfileCard from "@/components/profile/ProfileCard";
import ProfileFiltersUI from "@/components/profile/ProfileFilters";
import Pagination from "@/components/profile/Pagination";
import type { Profile, ProfileListMeta, ProfileFilters } from "@/types";

interface Props {
  initialProfiles: Profile[];
  initialMeta: ProfileListMeta;
}

export default function ProfilesClient({
  initialProfiles,
  initialMeta,
}: Props) {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [meta, setMeta] = useState(initialMeta);
  const [filters, setFilters] = useState<ProfileFilters>({
    page: 1,
    limit: 12,
    sort: "-createdAt",
  });
  const [isPending, startTransition] = useTransition();

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
    <div className="font-outfit min-h-screen px-5 py-8 md:py-12 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Logo size="small" />
        <span className="text-slate-500 text-sm">
          {meta.total > 0 ? `${meta.total} profiles found` : ""}
        </span>
      </div>

      <h1 className="font-syne text-white text-2xl font-extrabold tracking-tight mb-5">
        Find Your Match
      </h1>

      <ProfileFiltersUI onApply={doFetch} isPending={isPending} />

      {isPending && (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={24} className="animate-spin text-brand" />
        </div>
      )}

      {!isPending && profiles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <SearchX size={40} className="text-slate-600 mb-4" />
          <h3 className="font-syne text-white text-lg font-bold mb-1">
            No profiles found
          </h3>
          <p className="text-slate-500 text-sm">
            Try adjusting your filters and search again
          </p>
        </div>
      )}

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
