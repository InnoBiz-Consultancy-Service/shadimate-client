"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import {
  FAITH_OPTIONS,
  PRACTICE_LEVEL_OPTIONS,
  PERSONALITY_OPTIONS,
  EDUCATION_VARIETY_OPTIONS,
} from "@/constants/profile";
import type { ProfileFilters as Filters } from "@/types";

interface Props {
  onApply: (filters: Filters) => void;
  isPending?: boolean;
}

export default function ProfileFilters({ onApply, isPending }: Props) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [faith, setFaith] = useState("");
  const [practiceLevel, setPracticeLevel] = useState("");
  const [personality, setPersonality] = useState("");
  const [educationVariety, setEducationVariety] = useState("");

  const handleApply = () => {
    const f: Filters = {};
    if (search.trim()) f.search = search.trim();
    if (gender) f.gender = gender;
    if (minAge) f.minAge = Number(minAge);
    if (maxAge) f.maxAge = Number(maxAge);
    if (faith) f.faith = faith;
    if (practiceLevel) f.practiceLevel = practiceLevel;
    if (personality) f.personality = personality;
    if (educationVariety) f.educationVariety = educationVariety;
    f.page = 1;
    onApply(f);
  };

  const handleReset = () => {
    setSearch("");
    setGender("");
    setMinAge("");
    setMaxAge("");
    setFaith("");
    setPracticeLevel("");
    setPersonality("");
    setEducationVariety("");
    onApply({ page: 1 });
  };

  const sc =
    "font-outfit w-full px-3 py-2.5 rounded-xl text-sm text-slate-700 bg-white border border-slate-200 outline-none transition-all duration-200 focus:border-brand/50 focus:ring-2 focus:ring-brand/8 appearance-none";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5 mb-6">
      <div className="flex flex-col sm:flex-row gap-3 mb-3">
        <div className="flex-1 relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by name, university or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
            className="font-outfit w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-gray-800 placeholder-gray-400 bg-white border border-gray-200 outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/10 transition-all duration-200"
          />
        </div>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className={`${sc} sm:w-36 font-outfit text-sm text-gray-700 bg-white border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/10 appearance-none cursor-pointer`}
        >
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="font-outfit flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 active:scale-[0.98] cursor-pointer transition-all duration-200 sm:w-auto"
        >
          <SlidersHorizontal
            size={14}
            className={showAdvanced ? "text-brand" : "text-gray-500"}
          />
          <span className={showAdvanced ? "text-brand" : ""}>Filter</span>
        </button>
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-100 animate-[fadeUp_0.25s_ease]">
          <div>
            <label className="font-outfit text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">
              Min Age
            </label>
            <input
              type="number"
              placeholder="18"
              value={minAge}
              onChange={(e) => setMinAge(e.target.value)}
              className="font-outfit w-full text-sm text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/10 transition-all duration-200"
            />
          </div>
          <div>
            <label className="font-outfit text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">
              Max Age
            </label>
            <input
              type="number"
              placeholder="35"
              value={maxAge}
              onChange={(e) => setMaxAge(e.target.value)}
              className="font-outfit w-full text-sm text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/10 transition-all duration-200"
            />
          </div>
          <div>
            <label className="font-outfit text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">
              Religion
            </label>
            <select
              value={faith}
              onChange={(e) => setFaith(e.target.value)}
              className="font-outfit w-full text-sm text-gray-700 bg-white border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/10 appearance-none cursor-pointer"
            >
              <option value="">All</option>
              {FAITH_OPTIONS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-outfit text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">
              Practice Level
            </label>
            <select
              value={practiceLevel}
              onChange={(e) => setPracticeLevel(e.target.value)}
              className="font-outfit w-full text-sm text-gray-700 bg-white border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/10 appearance-none cursor-pointer"
            >
              <option value="">All</option>
              {PRACTICE_LEVEL_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-outfit text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">
              Personality
            </label>
            <select
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              className="font-outfit w-full text-sm text-gray-700 bg-white border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/10 appearance-none cursor-pointer"
            >
              <option value="">All</option>
              {PERSONALITY_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-outfit text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">
              Education
            </label>
            <select
              value={educationVariety}
              onChange={(e) => setEducationVariety(e.target.value)}
              className="font-outfit w-full text-sm text-gray-700 bg-white border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/10 appearance-none cursor-pointer"
            >
              <option value="">All</option>
              {EDUCATION_VARIETY_OPTIONS.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2 mt-4">
        <button
          onClick={handleApply}
          disabled={isPending}
          className="font-outfit flex-1 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand to-accent hover:from-brand/90 hover:to-accent/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Searching...
            </span>
          ) : (
            "Search"
          )}
        </button>
        <button
          onClick={handleReset}
          className="font-outfit flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98] transition-all duration-200"
        >
          <X size={14} /> Reset
        </button>
      </div>

      {/* Active Filters Display - Good for mobile UX */}
      {(search ||
        gender ||
        minAge ||
        maxAge ||
        faith ||
        practiceLevel ||
        personality ||
        educationVariety) && (
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-100">
          <span className="font-outfit text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            Active Filters:
          </span>
          {search && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-brand bg-brand/10">
              Search: {search}
              <button
                onClick={() => setSearch("")}
                className="hover:text-brand/70"
              >
                <X size={10} />
              </button>
            </span>
          )}
          {gender && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-brand bg-brand/10">
              {gender}
              <button
                onClick={() => setGender("")}
                className="hover:text-brand/70"
              >
                <X size={10} />
              </button>
            </span>
          )}
          {(minAge || maxAge) && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-brand bg-brand/10">
              Age: {minAge || "18"} - {maxAge || "35"}
              <button
                onClick={() => {
                  setMinAge("");
                  setMaxAge("");
                }}
                className="hover:text-brand/70"
              >
                <X size={10} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
