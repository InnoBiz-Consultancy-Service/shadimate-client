"use client";

import { useState, useTransition, useCallback } from "react";
import { Loader2, SearchX, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { fetchProfiles } from "@/actions/profile/profile";
import ProfileCard from "@/components/profile/ProfileCard";
import ProfileFiltersUI from "@/components/profile/ProfileFilters";
import Pagination from "@/components/profile/Pagination";
import type { Profile, ProfileListMeta, ProfileFilters } from "@/types";

interface Props {
  initialProfiles: Profile[];
  initialMeta: ProfileListMeta;
}

export default function SearchClient({ initialProfiles, initialMeta }: Props) {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [meta, setMeta] = useState(initialMeta);
  const [filters, setFilters] = useState<ProfileFilters>({
    page: 1,
    limit: 20,
    sort: "-createdAt",
  });
  const [isPending, startTransition] = useTransition();
  const [hasSearched, setHasSearched] = useState(false);

  const doFetch = useCallback(
    (newFilters: ProfileFilters) => {
      const merged = { ...filters, ...newFilters };
      setFilters(merged);
      setHasSearched(true);
      startTransition(async () => {
        const res = await fetchProfiles(merged);
        if (res.success) {
          setProfiles(res.data || []);
          setMeta(res.meta || { page: 1, limit: 20, total: 0, totalPages: 0 });
        }
      });
    },
    [filters]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      doFetch({ page } as ProfileFilters);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [doFetch]
  );

  return (
    <div className="font-outfit min-h-screen px-3 py-4 md:py-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <Link
          href="/feed"
          className="flex items-center justify-center w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors no-underline text-gray-600"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="font-syne text-gray-900 text-xl font-extrabold leading-tight">
            Search Profiles
          </h1>
          {meta.total > 0 && hasSearched && (
            <p className="text-xs text-gray-400 mt-0.5">{meta.total} results found</p>
          )}
        </div>
      </div>

      {/* Filters */}
      <ProfileFiltersUI onApply={doFetch} isPending={isPending} />

      {/* Loading */}
      {isPending && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="animate-spin text-brand" />
        </div>
      )}

      {/* Empty */}
      {!isPending && hasSearched && profiles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <SearchX size={44} className="text-slate-300 mb-4" />
          <h3 className="font-syne text-slate-800 text-lg font-bold mb-1">
            No profiles found
          </h3>
          <p className="text-slate-400 text-sm">Try changing your filters</p>
        </div>
      )}

      {!isPending && profiles.length > 0 && (
        <>
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-3">
            {profiles.map((p) => (
              <div key={p._id} className="break-inside-avoid mb-3">
                <ProfileCard profile={p} />
              </div>
            ))}
          </div>
          <Pagination
            page={meta.page}
            totalPages={meta.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Initial state before searching
      {!isPending && !hasSearched && profiles.length > 0 && (
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3">
          {profiles.map((p) => (
            <div key={p._id} className="break-inside-avoid mb-3">
              <ProfileCard profile={p} />
            </div>
          ))}
        </div>
      )} */}
    </div>
  );
}
