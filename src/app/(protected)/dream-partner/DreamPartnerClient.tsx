// "use client";

// import { useState, useTransition, useCallback, useEffect } from "react";
// import {
//   Heart,
//   Sparkles,
//   Loader2,
//   SearchX,
//   ChevronDown,
//   MapPin,
//   Ruler,
//   CalendarDays,
//   CheckCircle2,
// } from "lucide-react";
// import {
//   saveDreamPartner,
//   fetchDreamPartnerMatches,
// } from "@/actions/dream-partner/dream-partner";
// import { fetchDivisions, fetchDistricts, fetchThanas } from "@/actions/geo/geo";
// import type { Division, District, Thana } from "@/actions/geo/geo";
// import { Toast, GradientButton } from "@/components/ui";
// import ProfileCard from "@/components/profile/ProfileCard";
// import {
//   PRACTICE_LEVEL_OPTIONS,
//   ECONOMICAL_STATUS_OPTIONS,
//   DREAM_PARTNER_HABIT_OPTIONS,
// } from "@/constants/profile";
// import type { Profile, ToastData } from "@/types";

// /* ── Helpers ── */

// const TOTAL_CRITERIA = 6;

// function matchBadgeColor(score: number): string {
//   if (score >= 6) return "bg-emerald-100 text-emerald-700 border-emerald-200";
//   if (score >= 5) return "bg-brand/10 text-brand border-brand/20";
//   if (score >= 4) return "bg-blue-100 text-blue-700 border-blue-200";
//   if (score >= 3) return "bg-amber-100 text-amber-700 border-amber-200";
//   return "bg-gray-100 text-gray-500 border-gray-200";
// }

// function MatchBadge({ score }: { score?: number }) {
//   if (score === undefined) return null;
//   const pct = Math.round((score / TOTAL_CRITERIA) * 100);
//   return (
//     <span
//       className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${matchBadgeColor(score)}`}
//     >
//       <CheckCircle2 size={10} />
//       {score}/{TOTAL_CRITERIA} match · {pct}%
//     </span>
//   );
// }

// /* ── Label Component ── */
// function FieldLabel({
//   children,
//   required,
// }: {
//   children: React.ReactNode;
//   required?: boolean;
// }) {
//   return (
//     <label className="font-outfit text-gray-500 text-[10px] font-semibold tracking-[0.12em] uppercase mb-1.5 block">
//       {children} {required && <span className="text-brand">*</span>}
//     </label>
//   );
// }

// /* ── Select ── */
// function SelectField({
//   value,
//   onChange,
//   disabled,
//   children,
// }: {
//   value: string;
//   onChange: (v: string) => void;
//   disabled?: boolean;
//   children: React.ReactNode;
// }) {
//   return (
//     <select
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       disabled={disabled}
//       className="font-outfit w-full text-sm text-gray-700 bg-white border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/10 transition-all duration-200 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//     >
//       {children}
//     </select>
//   );
// }

// /* ── Range Input ── */
// function RangeInput({
//   label,
//   value,
//   onChange,
//   min,
//   max,
//   step = 1,
//   unit = "",
// }: {
//   label: string;
//   value: number;
//   onChange: (v: number) => void;
//   min: number;
//   max: number;
//   step?: number;
//   unit?: string;
// }) {
//   return (
//     <div className="flex flex-col gap-1">
//       <div className="flex items-center justify-between">
//         <span className="text-gray-400 text-[11px] font-medium">{label}</span>
//         <span className="text-brand text-xs font-bold">
//           {value}
//           {unit}
//         </span>
//       </div>
//       <input
//         type="range"
//         min={min}
//         max={max}
//         step={step}
//         value={value}
//         onChange={(e) => onChange(Number(e.target.value))}
//         className="w-full h-1.5 rounded-full accent-(--brand) cursor-pointer"
//       />
//       <div className="flex justify-between text-gray-300 text-[10px]">
//         <span>
//           {min}
//           {unit}
//         </span>
//         <span>
//           {max}
//           {unit}
//         </span>
//       </div>
//     </div>
//   );
// }

// /* ── Main Component ── */

// export default function DreamPartnerClient({
//   initialMatches,
//   hasExistingPreference,
// }: {
//   initialMatches: Profile[];
//   hasExistingPreference: boolean;
// }) {
//   /* Basic prefs */
//   const [practiceLevel, setPracticeLevel] = useState("");
//   const [economicalStatus, setEconomicalStatus] = useState("");
//   const [habits, setHabits] = useState<string[]>([]);

//   /* Age preference */
//   const [minAge, setMinAge] = useState(22);
//   const [maxAge, setMaxAge] = useState(35);

//   /* Height preference (feet format: 4.0 – 7.0) */
//   const [minHeight, setMinHeight] = useState(5.0);
//   const [maxHeight, setMaxHeight] = useState(6.0);

//   /* Location preference */
//   const [divisions, setDivisions] = useState<Division[]>([]);
//   const [districts, setDistricts] = useState<District[]>([]);
//   const [thanas, setThanas] = useState<Thana[]>([]);
//   const [divisionId, setDivisionId] = useState("");
//   const [districtId, setDistrictId] = useState("");
//   const [thanaId, setThanaId] = useState("");
//   const [geoLoading, setGeoLoading] = useState(false);

//   /* UI state */
//   const [saving, setSaving] = useState(false);
//   const [matches, setMatches] = useState<Profile[]>(initialMatches);
//   const [totalMatches, setTotalMatches] = useState(initialMatches.length);
//   const [showForm, setShowForm] = useState(!hasExistingPreference);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(initialMatches.length >= 10);
//   const [loadingMore, startLoadMore] = useTransition();
//   const [toast, setToast] = useState<ToastData | null>(null);
//   const hideToast = useCallback(() => setToast(null), []);

//   /* Load divisions on mount */
//   useEffect(() => {
//     fetchDivisions().then(setDivisions);
//   }, []);

//   /* Load districts when division changes */
//   useEffect(() => {
//     if (!divisionId) {
//       setDistricts([]);
//       setDistrictId("");
//       setThanas([]);
//       setThanaId("");
//       return;
//     }
//     setGeoLoading(true);
//     fetchDistricts(divisionId)
//       .then((d) => {
//         setDistricts(d);
//         setDistrictId("");
//         setThanas([]);
//         setThanaId("");
//       })
//       .finally(() => setGeoLoading(false));
//   }, [divisionId]);

//   /* Load thanas when district changes */
//   useEffect(() => {
//     if (!districtId) {
//       setThanas([]);
//       setThanaId("");
//       return;
//     }
//     fetchThanas(districtId).then((t) => {
//       setThanas(t);
//       setThanaId("");
//     });
//   }, [districtId]);

//   const toggleHabit = (h: string) => {
//     setHabits((prev) => {
//       if (prev.includes(h)) return prev.filter((x) => x !== h);
//       if (prev.length >= 5) return prev;
//       return [...prev, h];
//     });
//   };

//   /* ── Validation ── */
//   const validate = () => {
//     if (!practiceLevel) {
//       setToast({ message: "Please select a practice level.", type: "error" });
//       return false;
//     }
//     if (!economicalStatus) {
//       setToast({ message: "Please select an economic status.", type: "error" });
//       return false;
//     }
//     if (habits.length === 0) {
//       setToast({ message: "Please select at least 1 habit.", type: "error" });
//       return false;
//     }
//     if (minAge >= maxAge) {
//       setToast({
//         message: "Minimum age must be less than maximum age.",
//         type: "error",
//       });
//       return false;
//     }
//     if (minHeight >= maxHeight) {
//       setToast({
//         message: "Minimum height must be less than maximum height.",
//         type: "error",
//       });
//       return false;
//     }
//     return true;
//   };

//   /* ── Save Preferences ── */
//   const handleSave = async () => {
//     if (!validate()) return;
//     setSaving(true);

//     const payload = {
//       practiceLevel,
//       economicalStatus,
//       habits,
//       agePreference: { min: minAge, max: maxAge },
//       heightPreference: {
//         min: minHeight.toFixed(1),
//         max: maxHeight.toFixed(1),
//       },
//       ...(divisionId && {
//         locationPreference: {
//           divisionId,
//           ...(districtId && { districtId }),
//           ...(thanaId && { thanaId }),
//         },
//       }),
//     };

//     const res = await saveDreamPartner(payload);
//     setSaving(false);

//     if (!res.success) {
//       setToast({ message: res.message, type: "error" });
//       return;
//     }

//     setToast({
//       message: "Preferences saved! Finding your matches...",
//       type: "success",
//     });

//     const matchRes = await fetchDreamPartnerMatches(1, 10);
//     if (matchRes.success && matchRes.data) {
//       setMatches(matchRes.data);
//       setTotalMatches(matchRes.meta?.total ?? matchRes.data.length);
//       setPage(1);
//       setHasMore(matchRes.data.length >= 10);
//     }
//     setShowForm(false);
//   };

//   /* ── Load More ── */
//   const loadMore = () => {
//     const nextPage = page + 1;
//     startLoadMore(async () => {
//       const res = await fetchDreamPartnerMatches(nextPage, 10);
//       if (res.success && res.data) {
//         setMatches((prev) => [...prev, ...res.data!]);
//         setPage(nextPage);
//         setHasMore(res.data.length >= 10);
//       }
//     });
//   };

//   return (
//     <>
//       {toast && (
//         <Toast message={toast.message} type={toast.type} onClose={hideToast} />
//       )}

//       <div className="font-outfit min-h-screen px-4 py-6 md:py-10 max-w-5xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
//           <div>
//             <h1 className="text-gray-900 text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
//               <Sparkles size={24} className="text-accent" /> Dream Partner
//             </h1>
//             <p className="text-gray-500 text-sm mt-1">
//               Find the best matches based on your preferences
//             </p>
//           </div>
//           {!showForm && matches.length > 0 && (
//             <button
//               onClick={() => setShowForm(true)}
//               className="font-outfit flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-brand border border-brand/30 bg-brand/10 hover:bg-brand/15 active:scale-[0.98] cursor-pointer transition-all duration-200 w-full sm:w-auto"
//             >
//               Update Preferences
//             </button>
//           )}
//         </div>

//         {/* ── FORM ── */}
//         {showForm && (
//           <div className="relative bg-white rounded-2xl p-5 md:p-7 mb-6 animate-[fadeUp_0.3s_ease] border border-gray-200 shadow-sm overflow-hidden">
//             <div className="absolute inset-0 bg-linear-to-r from-brand/3 to-accent/3 pointer-events-none" />
//             <div className="relative space-y-6">
//               {/* Title */}
//               <div className="flex items-center gap-2">
//                 <Heart size={18} className="text-brand fill-brand/80" />
//                 <h2 className="font-syne text-gray-800 text-base font-bold">
//                   Tell us your preferences
//                 </h2>
//               </div>

//               {/* ── Section 1: Basic ── */}
//               <div>
//                 <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-widest mb-3">
//                   Basic Preferences
//                 </p>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <FieldLabel required>Practice Level</FieldLabel>
//                     <SelectField
//                       value={practiceLevel}
//                       onChange={setPracticeLevel}
//                     >
//                       <option value="">Select</option>
//                       {PRACTICE_LEVEL_OPTIONS.map((o) => (
//                         <option key={o} value={o}>
//                           {o}
//                         </option>
//                       ))}
//                     </SelectField>
//                   </div>
//                   <div>
//                     <FieldLabel required>Economic Status</FieldLabel>
//                     <SelectField
//                       value={economicalStatus}
//                       onChange={setEconomicalStatus}
//                     >
//                       <option value="">Select</option>
//                       {ECONOMICAL_STATUS_OPTIONS.map((o) => (
//                         <option key={o} value={o}>
//                           {o}
//                         </option>
//                       ))}
//                     </SelectField>
//                   </div>
//                 </div>
//               </div>

//               {/* Habits */}
//               <div>
//                 <FieldLabel required>Habits (max 5)</FieldLabel>
//                 <div className="flex flex-wrap gap-2">
//                   {DREAM_PARTNER_HABIT_OPTIONS.map((h) => {
//                     const active = habits.includes(h);
//                     const disabled = !active && habits.length >= 5;
//                     return (
//                       <button
//                         key={h}
//                         type="button"
//                         onClick={() => !disabled && toggleHabit(h)}
//                         disabled={disabled}
//                         className={`font-outfit text-xs font-medium px-3 py-2 rounded-xl border cursor-pointer transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97] ${
//                           active
//                             ? "bg-brand/10 border-brand/40 text-brand"
//                             : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300"
//                         }`}
//                       >
//                         {active && "✓ "}
//                         {h}
//                       </button>
//                     );
//                   })}
//                 </div>
//                 {habits.length > 0 && (
//                   <p className="text-gray-400 text-[11px] mt-2">
//                     {habits.length}/5 selected
//                   </p>
//                 )}
//               </div>

//               {/* ── Section 2: Age ── */}
//               <div>
//                 <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-widest mb-3 flex items-center gap-1.5">
//                   <CalendarDays size={12} /> Age Preference
//                 </p>
//                 <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-5">
//                   <RangeInput
//                     label="Minimum Age"
//                     value={minAge}
//                     onChange={(v) => {
//                       setMinAge(v);
//                       if (v >= maxAge) setMaxAge(v + 1);
//                     }}
//                     min={18}
//                     max={99}
//                     unit=" yrs"
//                   />
//                   <RangeInput
//                     label="Maximum Age"
//                     value={maxAge}
//                     onChange={(v) => {
//                       setMaxAge(v);
//                       if (v <= minAge) setMinAge(v - 1);
//                     }}
//                     min={19}
//                     max={100}
//                     unit=" yrs"
//                   />
//                 </div>
//                 <p className="text-gray-400 text-[11px] mt-1.5">
//                   Range: {minAge} – {maxAge} years old
//                 </p>
//               </div>

//               {/* ── Section 3: Height ── */}
//               <div>
//                 <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-widest mb-3 flex items-center gap-1.5">
//                   <Ruler size={12} /> Height Preference
//                 </p>
//                 <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-5">
//                   <RangeInput
//                     label="Minimum Height"
//                     value={minHeight}
//                     onChange={(v) => {
//                       setMinHeight(v);
//                       if (v >= maxHeight)
//                         setMaxHeight(Number((v + 0.1).toFixed(1)));
//                     }}
//                     min={4.0}
//                     max={6.9}
//                     step={0.1}
//                     unit=" ft"
//                   />
//                   <RangeInput
//                     label="Maximum Height"
//                     value={maxHeight}
//                     onChange={(v) => {
//                       setMaxHeight(v);
//                       if (v <= minHeight)
//                         setMinHeight(Number((v - 0.1).toFixed(1)));
//                     }}
//                     min={4.1}
//                     max={7.0}
//                     step={0.1}
//                     unit=" ft"
//                   />
//                 </div>
//                 <p className="text-gray-400 text-[11px] mt-1.5">
//                   Range: {minHeight.toFixed(1)} – {maxHeight.toFixed(1)} ft
//                 </p>
//               </div>

//               {/* ── Section 4: Location ── */}
//               <div>
//                 <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-widest mb-3 flex items-center gap-1.5">
//                   <MapPin size={12} /> Location Preference
//                   <span className="text-gray-300 normal-case tracking-normal font-normal">
//                     (optional)
//                   </span>
//                 </p>
//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//                   <div>
//                     <FieldLabel>Division</FieldLabel>
//                     <SelectField
//                       value={divisionId}
//                       onChange={setDivisionId}
//                       disabled={geoLoading}
//                     >
//                       <option value="">Any Division</option>
//                       {divisions.map((d) => (
//                         <option key={d._id} value={d._id}>
//                           {d.name}
//                         </option>
//                       ))}
//                     </SelectField>
//                   </div>
//                   <div>
//                     <FieldLabel>District</FieldLabel>
//                     <SelectField
//                       value={districtId}
//                       onChange={setDistrictId}
//                       disabled={!divisionId || geoLoading}
//                     >
//                       <option value="">Any District</option>
//                       {districts.map((d) => (
//                         <option key={d._id} value={d._id}>
//                           {d.name}
//                         </option>
//                       ))}
//                     </SelectField>
//                   </div>
//                   <div>
//                     <FieldLabel>
//                       Thana{" "}
//                       <span className="text-gray-300 font-normal normal-case tracking-normal">
//                         (optional)
//                       </span>
//                     </FieldLabel>
//                     <SelectField
//                       value={thanaId}
//                       onChange={setThanaId}
//                       disabled={!districtId || geoLoading}
//                     >
//                       <option value="">Any Thana</option>
//                       {thanas.map((t) => (
//                         <option key={t._id} value={t._id}>
//                           {t.name}
//                         </option>
//                       ))}
//                     </SelectField>
//                   </div>
//                 </div>
//               </div>

//               {/* Save Button */}
//               <GradientButton
//                 onClick={handleSave}
//                 disabled={saving}
//                 className="w-full"
//               >
//                 {saving ? (
//                   <>
//                     <Loader2 size={16} className="animate-spin" /> Saving...
//                   </>
//                 ) : (
//                   <>
//                     <Sparkles size={16} /> Find My Dream Partner
//                   </>
//                 )}
//               </GradientButton>
//             </div>
//           </div>
//         )}

//         {/* ── EMPTY STATE ── */}
//         {!showForm && matches.length === 0 && (
//           <div className="relative bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center overflow-hidden">
//             <div className="absolute inset-0 bg-linear-to-r from-brand/3 to-accent/3 pointer-events-none" />
//             <div className="relative">
//               <SearchX size={44} className="text-gray-400 mx-auto mb-4" />
//               <h3 className="font-syne text-gray-800 text-lg font-bold mb-1">
//                 No matches found
//               </h3>
//               <p className="text-gray-500 text-sm mb-5">
//                 Try adjusting your preferences to see more matches
//               </p>
//               <button
//                 onClick={() => setShowForm(true)}
//                 className="font-outfit inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-brand border border-brand/30 bg-brand/10 hover:bg-brand/15 active:scale-[0.98] transition-all duration-200"
//               >
//                 Change Preferences
//               </button>
//             </div>
//           </div>
//         )}

//         {/* ── MATCHES ── */}
//         {!showForm && matches.length > 0 && (
//           <>
//             <div className="flex items-center justify-between mb-4">
//               <p className="text-gray-500 text-sm">
//                 <span className="text-gray-900 font-semibold">
//                   {totalMatches}
//                 </span>{" "}
//                 {totalMatches === 1 ? "match" : "matches"} found
//               </p>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
//               {matches.map((p) => (
//                 <div key={p._id} className="relative">
//                   {/* Match score badge overlay */}
//                   {(p as Profile & { matchScore?: number }).matchScore !==
//                     undefined && (
//                     <div className="absolute top-3 right-3 z-10">
//                       <MatchBadge
//                         score={
//                           (p as Profile & { matchScore?: number }).matchScore
//                         }
//                       />
//                     </div>
//                   )}
//                   <ProfileCard profile={p} />
//                 </div>
//               ))}
//             </div>

//             {hasMore && (
//               <div className="flex justify-center mt-8">
//                 <button
//                   onClick={loadMore}
//                   disabled={loadingMore}
//                   className="font-outfit flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98] cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {loadingMore ? (
//                     <>
//                       <Loader2 size={14} className="animate-spin" /> Loading...
//                     </>
//                   ) : (
//                     <>
//                       View More <ChevronDown size={14} />
//                     </>
//                   )}
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </>
//   );
// }

"use client";

import { useState, useTransition, useCallback, useEffect } from "react";
import {
  Heart,
  Sparkles,
  Loader2,
  SearchX,
  ChevronDown,
  MapPin,
  Ruler,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";
import {
  saveDreamPartner,
  fetchDreamPartnerMatches,
} from "@/actions/dream-partner/dream-partner";
import { fetchDivisions, fetchDistricts, fetchThanas } from "@/actions/geo/geo";
import type { Division, District, Thana } from "@/actions/geo/geo";
import { Toast, GradientButton } from "@/components/ui";
import ProfileCard from "@/components/profile/ProfileCard";
import {
  PRACTICE_LEVEL_OPTIONS,
  ECONOMICAL_STATUS_OPTIONS,
  DREAM_PARTNER_HABIT_OPTIONS,
} from "@/constants/profile";
import type { Profile, ToastData } from "@/types";

/* ── Helpers ── */

const TOTAL_CRITERIA = 6;

function matchBadgeColor(score: number): string {
  if (score >= 6) return "bg-emerald-100 text-emerald-700 border-emerald-200";
  if (score >= 5) return "bg-brand/10 text-brand border-brand/20";
  if (score >= 4) return "bg-blue-100 text-blue-700 border-blue-200";
  if (score >= 3) return "bg-amber-100 text-amber-700 border-amber-200";
  return "bg-gray-100 text-gray-500 border-gray-200";
}

function MatchBadge({ score }: { score?: number }) {
  if (score === undefined) return null;
  const pct = Math.round((score / TOTAL_CRITERIA) * 100);
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${matchBadgeColor(score)}`}
    >
      <CheckCircle2 size={10} />
      {score}/{TOTAL_CRITERIA} match · {pct}%
    </span>
  );
}

/* ── Label Component ── */
function FieldLabel({
  children,
  required,
  optional,
}: {
  children: React.ReactNode;
  required?: boolean;
  optional?: boolean;
}) {
  return (
    <label className="font-outfit text-gray-600 text-[10px] font-bold tracking-[0.12em] uppercase mb-1.5 flex items-center gap-1.5">
      {children}
      {/* FIX: required star uses brand color */}
      {required && <span className="text-brand font-bold">*</span>}
      {/* FIX: Optional tag — clearly visible, not faded out */}
      {optional && (
        <span className="normal-case tracking-normal font-semibold text-[10px] text-gray-400 bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded-md">
          optional
        </span>
      )}
    </label>
  );
}

/* ── Select ── */
function SelectField({
  value,
  onChange,
  disabled,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="font-outfit w-full text-sm text-gray-800 bg-white border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/10 transition-all duration-200 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 1rem center",
        backgroundSize: "14px",
      }}
    >
      {children}
    </select>
  );
}

/* ── Range Input ──
   FIX: slider value label uses strong brand color + bold weight
        min/max labels are dark gray (not near-invisible gray-300)
        label text is readable gray-600                              */
function RangeInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = "",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        {/* FIX: label text improved from text-gray-400 → text-gray-600 */}
        <span className="text-gray-600 text-[11px] font-semibold">{label}</span>
        {/* FIX: current value is prominent */}
        <span className="text-brand text-sm font-extrabold tabular-nums">
          {unit.startsWith(" ft") ? value.toFixed(1) : value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full accent-(--brand) cursor-pointer"
      />
      {/* FIX: min/max boundary labels changed from text-gray-300 → text-gray-500 */}
      <div className="flex justify-between text-gray-500 text-[10px] font-medium">
        <span>
          {unit.startsWith(" ft") ? min.toFixed(1) : min}
          {unit}
        </span>
        <span>
          {unit.startsWith(" ft") ? max.toFixed(1) : max}
          {unit}
        </span>
      </div>
    </div>
  );
}

/* ── Section Header ──
   FIX: section divider icons use brand-tinted color, not plain gray   */
function SectionHeader({
  icon: Icon,
  label,
  optional,
}: {
  icon: React.ElementType;
  label: string;
  optional?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      {/* FIX: icon background uses brand/10 to match primary theme */}
      <div className="w-6 h-6 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
        <Icon size={13} className="text-brand" />
      </div>
      <p className="text-gray-700 text-[11px] font-bold uppercase tracking-widest">
        {label}
      </p>
      {optional && (
        <span className="text-gray-400 text-[10px] font-semibold bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded-md normal-case tracking-normal">
          optional
        </span>
      )}
    </div>
  );
}

/* ── Main Component ── */

export default function DreamPartnerClient({
  initialMatches,
  hasExistingPreference,
}: {
  initialMatches: Profile[];
  hasExistingPreference: boolean;
}) {
  /* Basic prefs */
  const [practiceLevel, setPracticeLevel] = useState("");
  const [economicalStatus, setEconomicalStatus] = useState("");
  const [habits, setHabits] = useState<string[]>([]);

  /* Age preference */
  const [minAge, setMinAge] = useState(22);
  const [maxAge, setMaxAge] = useState(35);

  /* Height preference (feet format: 4.0 – 7.0) */
  const [minHeight, setMinHeight] = useState(5.0);
  const [maxHeight, setMaxHeight] = useState(6.0);

  /* Location preference */
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [thanas, setThanas] = useState<Thana[]>([]);
  const [divisionId, setDivisionId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [thanaId, setThanaId] = useState("");
  const [geoLoading, setGeoLoading] = useState(false);

  /* UI state */
  const [saving, setSaving] = useState(false);
  const [matches, setMatches] = useState<Profile[]>(initialMatches);
  const [totalMatches, setTotalMatches] = useState(initialMatches.length);
  const [showForm, setShowForm] = useState(!hasExistingPreference);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialMatches.length >= 10);
  const [loadingMore, startLoadMore] = useTransition();
  const [toast, setToast] = useState<ToastData | null>(null);
  const hideToast = useCallback(() => setToast(null), []);

  /* Load divisions on mount */
  useEffect(() => {
    fetchDivisions().then(setDivisions);
  }, []);

  /* Load districts when division changes */
  useEffect(() => {
    if (!divisionId) {
      setDistricts([]);
      setDistrictId("");
      setThanas([]);
      setThanaId("");
      return;
    }
    setGeoLoading(true);
    fetchDistricts(divisionId)
      .then((d) => {
        setDistricts(d);
        setDistrictId("");
        setThanas([]);
        setThanaId("");
      })
      .finally(() => setGeoLoading(false));
  }, [divisionId]);

  /* Load thanas when district changes */
  useEffect(() => {
    if (!districtId) {
      setThanas([]);
      setThanaId("");
      return;
    }
    fetchThanas(districtId).then((t) => {
      setThanas(t);
      setThanaId("");
    });
  }, [districtId]);

  const toggleHabit = (h: string) => {
    setHabits((prev) => {
      if (prev.includes(h)) return prev.filter((x) => x !== h);
      if (prev.length >= 5) return prev;
      return [...prev, h];
    });
  };

  /* ── Validation ── */
  const validate = () => {
    if (!practiceLevel) {
      setToast({
        message: "Please select a religious practice level.",
        type: "error",
      });
      return false;
    }
    if (!economicalStatus) {
      setToast({ message: "Please select an economic status.", type: "error" });
      return false;
    }
    if (habits.length === 0) {
      setToast({ message: "Please select at least 1 habit.", type: "error" });
      return false;
    }
    if (minAge >= maxAge) {
      setToast({
        message: "Minimum age must be less than maximum age.",
        type: "error",
      });
      return false;
    }
    if (minHeight >= maxHeight) {
      setToast({
        message: "Minimum height must be less than maximum height.",
        type: "error",
      });
      return false;
    }
    return true;
  };

  /* ── Save Preferences ── */
  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);

    const payload = {
      practiceLevel,
      economicalStatus,
      habits,
      agePreference: { min: minAge, max: maxAge },
      heightPreference: {
        min: minHeight.toFixed(1),
        max: maxHeight.toFixed(1),
      },
      ...(divisionId && {
        locationPreference: {
          divisionId,
          ...(districtId && { districtId }),
          ...(thanaId && { thanaId }),
        },
      }),
    };

    const res = await saveDreamPartner(payload);
    setSaving(false);

    if (!res.success) {
      setToast({ message: res.message, type: "error" });
      return;
    }

    setToast({
      message: "Preferences saved! Finding your matches...",
      type: "success",
    });

    const matchRes = await fetchDreamPartnerMatches(1, 10);
    if (matchRes.success && matchRes.data) {
      setMatches(matchRes.data);
      setTotalMatches(matchRes.meta?.total ?? matchRes.data.length);
      setPage(1);
      setHasMore(matchRes.data.length >= 10);
    }
    setShowForm(false);
  };

  /* ── Load More ── */
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

  return (
    <>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      <div className="font-outfit min-h-screen px-4 py-6 md:py-10 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-gray-900 text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
              {/* FIX: header icon uses theme accent color */}
              <Sparkles size={24} className="text-brand" /> Dream Partner
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Find the best matches based on your preferences
            </p>
          </div>
          {!showForm && matches.length > 0 && (
            <button
              onClick={() => setShowForm(true)}
              className="font-outfit flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-brand border border-brand/30 bg-brand/10 hover:bg-brand/15 active:scale-[0.98] cursor-pointer transition-all duration-200 w-full sm:w-auto"
            >
              Update Preferences
            </button>
          )}
        </div>

        {/* ── FORM ── */}
        {showForm && (
          <div className="relative bg-white rounded-2xl p-5 md:p-7 mb-6 animate-[fadeUp_0.3s_ease] border border-gray-200 shadow-sm overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-brand/3 to-accent/3 pointer-events-none" />
            <div className="relative space-y-7">
              {/* Title */}
              <div className="flex items-center gap-2">
                <Heart size={18} className="text-brand fill-brand/80" />
                <h2 className="font-syne text-gray-800 text-base font-bold">
                  Tell us your preferences
                </h2>
              </div>

              {/* ── Section 1: Basic ── */}
              <div>
                <SectionHeader icon={Sparkles} label="Basic Preferences" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    {/* FIX: renamed from "Practice Level" → "Religious Practice Level" */}
                    <FieldLabel required>Religious Practice Level</FieldLabel>
                    <SelectField
                      value={practiceLevel}
                      onChange={setPracticeLevel}
                    >
                      <option value="">Select</option>
                      {PRACTICE_LEVEL_OPTIONS.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </SelectField>
                  </div>
                  <div>
                    <FieldLabel required>Economic Status</FieldLabel>
                    <SelectField
                      value={economicalStatus}
                      onChange={setEconomicalStatus}
                    >
                      <option value="">Select</option>
                      {ECONOMICAL_STATUS_OPTIONS.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </SelectField>
                  </div>
                </div>
              </div>

              {/* Habits */}
              <div>
                <FieldLabel required>Habits (max 5)</FieldLabel>
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
                        className={`font-outfit text-xs font-semibold px-3 py-2 rounded-xl border cursor-pointer transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97] ${
                          active
                            ? "bg-brand/10 border-brand/40 text-brand"
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                        }`}
                      >
                        {active && "✓ "}
                        {h}
                      </button>
                    );
                  })}
                </div>
                {habits.length > 0 && (
                  <p className="text-gray-500 text-[11px] font-medium mt-2">
                    {habits.length}/5 selected
                  </p>
                )}
              </div>

              {/* ── Section 2: Age ── */}
              <div>
                <SectionHeader icon={CalendarDays} label="Age Preference" />
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <RangeInput
                    label="Minimum Age"
                    value={minAge}
                    onChange={(v) => {
                      setMinAge(v);
                      if (v >= maxAge) setMaxAge(v + 1);
                    }}
                    min={18}
                    max={99}
                    unit=" yrs"
                  />
                  <RangeInput
                    label="Maximum Age"
                    value={maxAge}
                    onChange={(v) => {
                      setMaxAge(v);
                      if (v <= minAge) setMinAge(v - 1);
                    }}
                    min={19}
                    max={100}
                    unit=" yrs"
                  />
                </div>
                {/* FIX: range summary text is readable */}
                <p className="text-gray-600 text-[11px] font-medium mt-1.5">
                  Range:{" "}
                  <span className="text-brand font-bold">
                    {minAge} – {maxAge} years old
                  </span>
                </p>
              </div>

              {/* ── Section 3: Height ── */}
              <div>
                <SectionHeader icon={Ruler} label="Height Preference" />
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <RangeInput
                    label="Minimum Height"
                    value={minHeight}
                    onChange={(v) => {
                      setMinHeight(v);
                      if (v >= maxHeight)
                        setMaxHeight(Number((v + 0.1).toFixed(1)));
                    }}
                    min={4.0}
                    max={6.9}
                    step={0.1}
                    unit=" ft"
                  />
                  <RangeInput
                    label="Maximum Height"
                    value={maxHeight}
                    onChange={(v) => {
                      setMaxHeight(v);
                      if (v <= minHeight)
                        setMinHeight(Number((v - 0.1).toFixed(1)));
                    }}
                    min={4.1}
                    max={7.0}
                    step={0.1}
                    unit=" ft"
                  />
                </div>
                {/* FIX: range summary text is readable */}
                <p className="text-gray-600 text-[11px] font-medium mt-1.5">
                  Range:{" "}
                  <span className="text-brand font-bold">
                    {minHeight.toFixed(1)} – {maxHeight.toFixed(1)} ft
                  </span>
                </p>
              </div>

              {/* ── Section 4: Location ── */}
              <div>
                <SectionHeader
                  icon={MapPin}
                  label="Location Preference"
                  optional
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <FieldLabel optional>Division</FieldLabel>
                    <SelectField
                      value={divisionId}
                      onChange={setDivisionId}
                      disabled={geoLoading}
                    >
                      <option value="">Any Division</option>
                      {divisions.map((d) => (
                        <option key={d._id} value={d._id}>
                          {d.name}
                        </option>
                      ))}
                    </SelectField>
                  </div>
                  <div>
                    <FieldLabel optional>District</FieldLabel>
                    <SelectField
                      value={districtId}
                      onChange={setDistrictId}
                      disabled={!divisionId || geoLoading}
                    >
                      <option value="">Any District</option>
                      {districts.map((d) => (
                        <option key={d._id} value={d._id}>
                          {d.name}
                        </option>
                      ))}
                    </SelectField>
                  </div>
                  <div>
                    <FieldLabel optional>Thana</FieldLabel>
                    <SelectField
                      value={thanaId}
                      onChange={setThanaId}
                      disabled={!districtId || geoLoading}
                    >
                      <option value="">Any Thana</option>
                      {thanas.map((t) => (
                        <option key={t._id} value={t._id}>
                          {t.name}
                        </option>
                      ))}
                    </SelectField>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <GradientButton
                onClick={handleSave}
                disabled={saving}
                className="w-full"
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} /> Find My Dream Partner
                  </>
                )}
              </GradientButton>
            </div>
          </div>
        )}

        {/* ── EMPTY STATE ── */}
        {!showForm && matches.length === 0 && (
          <div className="relative bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-brand/3 to-accent/3 pointer-events-none" />
            <div className="relative">
              <SearchX size={44} className="text-gray-400 mx-auto mb-4" />
              <h3 className="font-syne text-gray-800 text-lg font-bold mb-1">
                No matches found
              </h3>
              <p className="text-gray-500 text-sm mb-5">
                Try adjusting your preferences to see more matches
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="font-outfit inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-brand border border-brand/30 bg-brand/10 hover:bg-brand/15 active:scale-[0.98] transition-all duration-200"
              >
                Change Preferences
              </button>
            </div>
          </div>
        )}

        {/* ── MATCHES ── */}
        {!showForm && matches.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-500 text-sm">
                <span className="text-gray-900 font-semibold">
                  {totalMatches}
                </span>{" "}
                {totalMatches === 1 ? "match" : "matches"} found
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {matches.map((p) => (
                <div key={p._id} className="relative">
                  {(p as Profile & { matchScore?: number }).matchScore !==
                    undefined && (
                    <div className="absolute top-3 right-3 z-10">
                      <MatchBadge
                        score={
                          (p as Profile & { matchScore?: number }).matchScore
                        }
                      />
                    </div>
                  )}
                  <ProfileCard profile={p} />
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="font-outfit flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98] cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
