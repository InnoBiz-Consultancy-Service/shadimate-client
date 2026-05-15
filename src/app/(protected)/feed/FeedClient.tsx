"use client";

import { useState, useTransition, useCallback } from "react";
import Link from "next/link";
import {
  Loader2,
  SearchX,
  AlertTriangle,
  ArrowRight,
  UserCog,
  Clock,
  Wifi,
} from "lucide-react";
import { fetchProfiles, fetchOnlineProfiles } from "@/actions/profile/profile";
import ProfileCard from "@/components/profile/ProfileCard";
import Pagination from "@/components/profile/Pagination";
import type { Profile, ProfileListMeta, ProfileFilters } from "@/types";

type Tab = "latest" | "online";

export default function FeedClient({
  myProfile,
  initialLatestProfiles,
  initialLatestMeta,
  initialOnlineProfiles,
  initialOnlineMeta,
}: {
  myProfile: Profile | null;
  initialLatestProfiles: Profile[];
  initialLatestMeta: ProfileListMeta;
  initialOnlineProfiles: Profile[];
  initialOnlineMeta: ProfileListMeta;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("latest");

  // ── Latest tab state ──
  const [latestProfiles, setLatestProfiles] = useState(initialLatestProfiles);
  const [latestMeta, setLatestMeta] = useState(initialLatestMeta);
  const [latestFilters, setLatestFilters] = useState<ProfileFilters>({
    page: 1,
    limit: 20,
    sort: "-createdAt",
  });
  const [latestPending, startLatestTransition] = useTransition();

  // ── Online tab state ──
  const [onlineProfiles, setOnlineProfiles] = useState(initialOnlineProfiles);
  const [onlineMeta, setOnlineMeta] = useState(initialOnlineMeta);
  const [onlineFetched, setOnlineFetched] = useState(true);
  const [onlinePending, startOnlineTransition] = useTransition();

  // ── Profile completion ──
  const hasProfile = !!myProfile;
  const completionPct = myProfile?.completionPercentage ?? 0;
  const isIncomplete = hasProfile && completionPct < 70;

  // ── Latest handlers ──
  const doLatestFetch = useCallback(
    (newFilters: ProfileFilters) => {
      const merged = { ...latestFilters, ...newFilters };
      setLatestFilters(merged);
      startLatestTransition(async () => {
        const res = await fetchProfiles(merged);
        console.log(res)
        if (res.success) {
          setLatestProfiles(res.data || []);
          setLatestMeta(
            res.meta || { page: 1, limit: 20, total: 0, totalPages: 0 }
          );
        }
      });
    },
    [latestFilters]
  );

  const handleLatestPageChange = useCallback(
    (page: number) => {
      doLatestFetch({ page } as ProfileFilters);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [doLatestFetch]
  );

  // ── Online handlers ──
  const handleOnlinePageChange = useCallback((page: number) => {
    startOnlineTransition(async () => {
      const res = await fetchOnlineProfiles(page, 20);
      if (res.success) {
        setOnlineProfiles(res.data || []);
        setOnlineMeta(
          res.meta || { page: 1, limit: 20, total: 0, totalPages: 0 }
        );
      }
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // ── Tab switch ──
  const handleTabChange = useCallback(
    (tab: Tab) => {
      setActiveTab(tab);
      if (tab === "online" && !onlineFetched) {
        setOnlineFetched(true);
        startOnlineTransition(async () => {
          const res = await fetchOnlineProfiles(1, 20);
          if (res.success) {
            setOnlineProfiles(res.data || []);
            setOnlineMeta(
              res.meta || { page: 1, limit: 20, total: 0, totalPages: 0 }
            );
          }
        });
      }
    },
    [onlineFetched]
  );

  const isPending = activeTab === "latest" ? latestPending : onlinePending;
  const profiles = activeTab === "latest" ? latestProfiles : onlineProfiles;
  const meta = activeTab === "latest" ? latestMeta : onlineMeta;

  console.log(profiles)

  return (
    <div className="font-outfit min-h-screen px-3 py-4 md:py-8 max-w-5xl mx-auto">
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {meta.total > 0 && (
            <span className="text-gray-400 text-xs">
              {meta.total} profiles
            </span>
          )}
        </div>
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

      {/* ── Banners ── */}
      {!hasProfile && (
        <div className="mb-4 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3.5 flex items-center gap-3">
          <AlertTriangle size={18} className="text-amber-500 shrink-0" />
          <p className="text-slate-700 text-sm flex-1">
            Your profile hasn&apos;t been created yet.
          </p>
          <Link
            href="/profile/edit"
            className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand to-accent no-underline"
          >
            Create
          </Link>
        </div>
      )}

      {isIncomplete && (
        <div className="mb-4 rounded-2xl border border-brand/20 bg-brand/5 px-4 py-3 flex items-center gap-3">
          <div className="shrink-0 w-8 h-8 rounded-full border-2 border-brand/40 flex items-center justify-center">
            <span className="text-brand text-xs font-bold">{completionPct}%</span>
          </div>
          <p className="text-slate-700 text-sm flex-1">
            Profile {completionPct}% complete.
          </p>
          <Link
            href="/profile/edit"
            className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold text-brand border border-brand/30 bg-brand/10 no-underline flex items-center gap-1"
          >
            Complete <ArrowRight size={12} />
          </Link>
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="flex items-center gap-1 mb-4 p-1 rounded-2xl bg-gray-100 w-fit">
        <TabButton
          active={activeTab === "latest"}
          onClick={() => handleTabChange("latest")}
          icon={<Clock size={14} />}
          label="Latest"
          count={activeTab === "latest" ? meta.total : initialLatestMeta.total}
        />
        <TabButton
          active={activeTab === "online"}
          onClick={() => handleTabChange("online")}
          icon={
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
          }
          label="Online"
          count={activeTab === "online" ? meta.total : initialOnlineMeta.total}
          countColor="text-green-600"
        />
      </div>

      {/* ── Online sub-header ── */}
      {activeTab === "online" && !isPending && onlineProfiles.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <Wifi size={14} className="text-green-500" />
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-green-600">{onlineMeta.total}</span>{" "}
            people online now
          </p>
        </div>
      )}

      {/* ── Loading ── */}
      {isPending && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="animate-spin text-brand" />
        </div>
      )}

      {/* ── Empty ── */}
      {!isPending && profiles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <SearchX size={44} className="text-slate-300 mb-4" />
          <h3 className="font-syne text-slate-800 text-lg font-bold mb-1">
            {activeTab === "online" ? "No one online right now" : "No profiles found"}
          </h3>
          <p className="text-slate-400 text-sm">
            {activeTab === "online"
              ? "Check back later"
              : "Try searching with different filters"}
          </p>
        </div>
      )}

      {/* ── Pinterest 2-col masonry grid ── */}
      {!isPending && profiles.length > 0 && (
        <>
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-0">
            {profiles.map((p) => (
              <div key={p._id} className="break-inside-avoid mb-3">
                <ProfileCard profile={p} />
              </div>
            ))}
          </div>
          <Pagination
            page={meta.page}
            totalPages={meta.totalPages}
            onPageChange={
              activeTab === "latest"
                ? handleLatestPageChange
                : handleOnlinePageChange
            }
          />
        </>
      )}
    </div>
  );
}

// ── Tab Button ──
function TabButton({
  active,
  onClick,
  icon,
  label,
  count,
  countColor = "text-gray-500",
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count: number;
  countColor?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
        active
          ? "bg-white text-brand shadow-sm"
          : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {icon}
      <span>{label}</span>
      {count > 0 && (
        <span
          className={`text-[11px] font-bold tabular-nums ${
            active ? "text-brand" : countColor
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
