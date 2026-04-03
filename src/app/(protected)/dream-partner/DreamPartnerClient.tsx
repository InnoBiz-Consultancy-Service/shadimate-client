"use client";

import { useState, useTransition, useCallback } from "react";
import { Heart, Sparkles, Loader2, SearchX, ChevronDown } from "lucide-react";
import {
  saveDreamPartner,
  fetchDreamPartnerMatches,
} from "@/actions/dream-partner/dream-partner";
import { Toast, GlassCard, GradientButton } from "@/components/ui";
import ProfileCard from "@/components/profile/ProfileCard";
import {
  PRACTICE_LEVEL_OPTIONS,
  ECONOMICAL_STATUS_OPTIONS,
  DREAM_PARTNER_HABIT_OPTIONS,
} from "@/constants/profile";
import type { Profile, ToastData } from "@/types";

export default function DreamPartnerClient({
  initialMatches,
  hasExistingPreference,
}: {
  initialMatches: Profile[];
  hasExistingPreference: boolean;
}) {
  const [practiceLevel, setPracticeLevel] = useState("");
  const [economicalStatus, setEconomicalStatus] = useState("");
  const [habits, setHabits] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const [matches, setMatches] = useState<Profile[]>(initialMatches);
  const [showForm, setShowForm] = useState(!hasExistingPreference);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialMatches.length >= 10);
  const [loadingMore, startLoadMore] = useTransition();

  const [toast, setToast] = useState<ToastData | null>(null);
  const hideToast = useCallback(() => setToast(null), []);

  const toggleHabit = (h: string) => {
    setHabits((prev) => {
      if (prev.includes(h)) return prev.filter((x) => x !== h);
      if (prev.length >= 5) return prev;
      return [...prev, h];
    });
  };

  const handleSave = async () => {
    if (!practiceLevel) {
      setToast({ message: "Please select practice level", type: "error" });
      return;
    }
    if (!economicalStatus) {
      setToast({ message: "Please select economic status", type: "error" });
      return;
    }
    if (habits.length === 0) {
      setToast({ message: "Please select at least 1 habit", type: "error" });
      return;
    }

    setSaving(true);
    const res = await saveDreamPartner({
      practiceLevel,
      economicalStatus,
      habits,
    });
    setSaving(false);

    if (!res.success) {
      setToast({ message: res.message, type: "error" });
      return;
    }

    setToast({
      message: "Preference saved! Finding matches...",
      type: "success",
    });

    const matchRes = await fetchDreamPartnerMatches(1, 10);
    if (matchRes.success && matchRes.data) {
      setMatches(matchRes.data);
      setPage(1);
      setHasMore(matchRes.data.length >= 10);
    }
    setShowForm(false);
  };

  const loadMore = () => {
    const nextPage = page + 1;
    startLoadMore(async () => {
      const res = await fetchDreamPartnerMatches(nextPage, 10);
      if (res.success && res.data) {
        setMatches((prev) => [...prev, ...res.data!]);
        setPage(nextPage);
        setHasMore(res.data.length >= 10);
      }
    });
  };

  const sc =
    "font-outfit w-full px-3 py-3 rounded-xl text-sm text-slate-100 bg-white/5 border border-white/10 outline-none focus:border-brand/50 transition-all duration-200 appearance-none";

  return (
    <>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      <div className="font-outfit min-h-screen px-5 py-8 md:py-12 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-syne text-white text-2xl font-extrabold tracking-tight flex items-center gap-2">
              <Sparkles size={24} className="text-accent" /> Dream Partner
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Find the best matches according to your preferences
            </p>
          </div>
          {!showForm && matches.length > 0 && (
            <button
              onClick={() => setShowForm(true)}
              className="font-outfit flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-brand border border-brand/30 bg-brand/10 cursor-pointer hover:bg-brand/15 transition-colors"
            >
              Update Preference
            </button>
          )}
        </div>

        {/* FORM */}
        {showForm && (
          <GlassCard className="p-5 md:p-6 mb-6 animate-[fadeUp_0.3s_ease]">
            <div className="flex items-center gap-2 mb-5">
              <Heart size={18} className="text-brand fill-brand" />
              <h2 className="font-syne text-white text-base font-bold">
                Tell us your preference
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div className="flex flex-col gap-1.5">
                <label className="font-outfit text-slate-400 text-[10px] font-semibold tracking-[0.12em] uppercase">
                  Practice Level *
                </label>
                <select
                  value={practiceLevel}
                  onChange={(e) => setPracticeLevel(e.target.value)}
                  className={sc}
                >
                  <option value="">Select</option>
                  {PRACTICE_LEVEL_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-outfit text-slate-400 text-[10px] font-semibold tracking-[0.12em] uppercase">
                  Economic Status *
                </label>
                <select
                  value={economicalStatus}
                  onChange={(e) => setEconomicalStatus(e.target.value)}
                  className={sc}
                >
                  <option value="">Select</option>
                  {ECONOMICAL_STATUS_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-5">
              <label className="font-outfit text-slate-400 text-[10px] font-semibold tracking-[0.12em] uppercase mb-2.5 block">
                Habits * (Max 5)
              </label>
              <div className="flex flex-wrap gap-2">
                {DREAM_PARTNER_HABIT_OPTIONS.map((h) => {
                  const active = habits.includes(h);
                  const disabled = !active && habits.length >= 5;
                  return (
                    <button
                      key={h}
                      type="button"
                      onClick={() => !disabled && toggleHabit(h)}
                      disabled={disabled}
                      className={`font-outfit text-xs font-medium px-3 py-2 rounded-xl border cursor-pointer transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed ${
                        active
                          ? "bg-brand/15 border-brand/50 text-brand"
                          : "bg-white/3 border-white/10 text-slate-400 hover:bg-white/5"
                      }`}
                    >
                      {active ? "✓ " : ""}
                      {h}
                    </button>
                  );
                })}
              </div>
              {habits.length > 0 && (
                <p className="text-slate-600 text-[11px] mt-1.5">
                  {habits.length}/5 selected
                </p>
              )}
            </div>

            <GradientButton
              fullWidth
              loading={saving}
              loadingText="Saving..."
              onClick={handleSave}
            >
              <Sparkles size={16} /> Find My Dream Partner
            </GradientButton>
          </GlassCard>
        )}

        {/* EMPTY */}
        {!showForm && matches.length === 0 && (
          <GlassCard className="p-10 text-center">
            <SearchX size={44} className="text-slate-600 mx-auto mb-4" />
            <h3 className="font-syne text-white text-lg font-bold mb-1">
              No matches found
            </h3>
            <p className="text-slate-500 text-sm mb-4">
              Try changing your preferences
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="font-outfit inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-brand border border-brand/30 bg-brand/10 cursor-pointer hover:bg-brand/15 transition-colors"
            >
              Change Preference
            </button>
          </GlassCard>
        )}

        {/* MATCHES */}
        {matches.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-400 text-sm">
                <span className="text-white font-semibold">
                  {matches.length}
                </span>{" "}
                matches found
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {matches.map((p) => (
                <ProfileCard key={p._id} profile={p} />
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="font-outfit flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-slate-300 border border-white/10 bg-white/3 hover:bg-white/5 cursor-pointer transition-all duration-200 disabled:opacity-50"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Loading...
                    </>
                  ) : (
                    <>
                      View More <ChevronDown size={14} />
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
