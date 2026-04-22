"use client";

import Link from "next/link";
import {
  User,
  Ruler,
  MapPin,
  GraduationCap,
  BookOpen,
  Users,
  Sparkles,
  Pencil,
  Calendar,
  Briefcase,
  DollarSign,
  Heart,
  ChevronRight,
} from "lucide-react";
import type { Profile } from "@/types";

/* ── Helpers ── */
function getAge(birthDate?: string): number | null {
  if (!birthDate) return null;
  const diff = Date.now() - new Date(birthDate).getTime();
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
}

function geoName(
  val: string | { _id: string; name: string } | undefined,
): string {
  if (!val) return "";
  return typeof val === "string" ? "" : val.name;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getCompletionColor(pct: number): string {
  if (pct >= 90) return "#22c55e";
  if (pct >= 70) return "#3b82f6";
  if (pct >= 50) return "#f59e0b";
  return "#E8547A";
}

/* ── Sub-components ── */
function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon?: React.ElementType;
  label: string;
  value?: string | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-100 last:border-0">
      {Icon && (
        <div className="w-7 h-7 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0 mt-0.5">
          <Icon size={14} className="text-brand" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-outfit text-[11px] font-semibold tracking-widest uppercase text-gray-400 mb-1">
          {label}
        </p>
        <p className="font-outfit text-sm text-gray-800 leading-relaxed">
          {value}
        </p>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  empty,
  children,
}: {
  title: string;
  icon: React.ElementType;
  editStep?: number;
  empty?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      {/* header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/6 bg-white/2">
        <div className="flex items-center gap-2.5">
          <span className="font-syne text-black text-base font-bold">
            {title}
          </span>
        </div>
        <Link
          href="/profile/edit"
          className="flex items-center gap-1 text-[11px] font-outfit font-semibold text-brand/80 hover:text-brand transition-colors bg-brand/8 hover:bg-brand/15 border border-brand/20 px-2.5 py-1 rounded-lg no-underline"
        >
          <Pencil size={10} />
          Edit
        </Link>
      </div>

      {/* body */}
      <div className="px-4 py-1">
        {empty ? (
          <Link
            href="/profile/edit"
            className="flex items-center justify-between py-3 no-underline group"
          >
            <span className="font-outfit text-slate-500 text-sm italic">
              No info added yet
            </span>
            <ChevronRight
              size={15}
              className="text-slate-600 group-hover:text-brand transition-colors"
            />
          </Link>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function ProfileViewClient({ profile }: { profile: Profile }) {
  const userData = Array.isArray(profile.user) ? profile.user[0] : profile.user;
  const name = userData?.name || profile.userId?.name || "User";
  const age = getAge(profile.birthDate);
  const completion = profile.completionPercentage ?? 0;
  const completionColor = getCompletionColor(completion);

  /* derived values */
  const divName =
    geoName(profile.address?.divisionId) || profile.division?.[0]?.name;
  const distName =
    geoName(profile.address?.districtId) || profile.district?.[0]?.name;
  const thanaName =
    geoName(profile.address?.thanaId) || profile.thana?.[0]?.name;
  const location = [thanaName, distName, divName].filter(Boolean).join(", ");

  const uniName =
    geoName(profile.education?.graduation?.universityId) ||
    profile.university?.[0]?.name;

  /* section empty checks */
  const hasBasic = !!(
    profile.profession ||
    profile.birthDate ||
    profile.maritalStatus ||
    profile.aboutMe ||
    profile.personality
  );
  const hasPhysical = !!(profile.height || profile.weight || profile.skinTone);
  const hasAddress = !!profile.address?.divisionId;
  const hasEducation = !!(
    profile.education?.graduation?.variety ||
    uniName ||
    profile.education?.graduation?.department
  );
  const hasReligion = !!(
    profile.religion?.faith || profile.religion?.practiceLevel
  );
  const hasFamily = !!(
    profile.relation ||
    profile.fatherOccupation ||
    profile.motherOccupation
  );
  const hasHabits = !!(profile.habits && profile.habits.length > 0);

  return (
    <div className="min-h-screen">
      {/* ── COVER + AVATAR HEADER ── */}
      <div className="relative">
        {/* Cover */}
        <div
          className="h-36 md:h-48 w-full relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(232,84,122,0.35) 0%, rgba(18,8,16,0.6) 40%, rgba(240,192,112,0.25) 100%)",
          }}
        >
          {/* Decorative bokeh blobs */}
          <div className="absolute top-4 left-8 w-20 h-20 rounded-full bg-brand/20 blur-2xl" />
          <div className="absolute bottom-2 right-12 w-28 h-28 rounded-full bg-accent/15 blur-3xl" />
          <div className="absolute top-8 right-1/3 w-16 h-16 rounded-full bg-brand/10 blur-xl" />
        </div>

        {/* Avatar + name row */}
        <div className="px-4 md:px-6">
          <div className="flex items-end justify-between -mt-12 md:-mt-16 mb-4">
            {/* Avatar */}
            <div className="relative">
              <div
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-bg-base flex items-center justify-center shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(232,84,122,0.5) 0%, rgba(240,192,112,0.4) 100%)",
                  boxShadow: "0 0 30px rgba(232,84,122,0.4)",
                }}
              >
                <span className="font-syne text-white font-extrabold text-3xl md:text-4xl">
                  {name.charAt(0).toUpperCase()}
                </span>
              </div>
              {/* Online dot */}
              <span className="absolute bottom-1.5 right-1.5 w-4 h-4 rounded-full bg-green-500 border-2 border-bg-base" />
            </div>

            {/* Edit Profile button */}
            <Link
              href="/profile/edit"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-outfit font-bold text-sm text-on-brand bg-linear-to-r from-brand to-accent no-underline hover:scale-[1.02] active:scale-95 transition-transform duration-200 shadow-(--shadow-brand-sm) mb-1"
            >
              <Pencil size={14} />
              Edit Profile
            </Link>
          </div>

          {/* Name + meta */}
          <div className="mb-4">
            <h1 className="font-syne text-gray-900 text-2xl md:text-3xl font-extrabold tracking-tight">
              {name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              {age && (
                <span className="font-outfit text-gray-500 text-sm">
                  {age} years old
                </span>
              )}
              {profile.gender && (
                <>
                  <span className="text-gray-400">·</span>
                  <span className="font-outfit text-gray-500 text-sm capitalize">
                    {profile.gender}
                  </span>
                </>
              )}
              {profile.personality && (
                <>
                  <span className="text-gray-400">·</span>
                  <span className="font-outfit text-xs font-semibold text-brand bg-brand/10 border border-brand/20 px-2.5 py-0.5 rounded-full">
                    {profile.personality}
                  </span>
                </>
              )}
            </div>
            {location && (
              <p className="flex items-center gap-1.5 font-outfit text-gray-500 text-xs mt-1.5">
                <MapPin size={11} className="text-brand/70" />
                {location}
              </p>
            )}
          </div>

          {/* Profile Completion Bar */}
          {completion > 0 && (
            <div className="glass-card rounded-xl px-4 py-3 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-outfit text-gray-500 text-xs font-medium">
                  Profile Completion
                </span>
                <span
                  className="font-outfit text-sm font-bold"
                  style={{ color: completionColor }}
                >
                  {completion}%
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${completion}%`,
                    backgroundColor: completionColor,
                  }}
                />
              </div>
              {profile.completionLabel && (
                <p
                  className="font-outfit text-[10px] font-semibold tracking-wider uppercase mt-1.5"
                  style={{ color: completionColor }}
                >
                  {profile.completionLabel}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── SECTION CARDS ── */}
      <div className="px-4 md:px-6 pb-6 space-y-3">
        {/* About Me (standalone if available) */}
        {profile.aboutMe && (
          <div className="glass-card rounded-2xl px-4 py-4">
            <p className="font-outfit text-[10px] font-semibold tracking-widest uppercase text-slate-500 mb-2">
              About Me
            </p>
            <p className="font-outfit text-sm text-gray-500 leading-relaxed">
              {profile.aboutMe}
            </p>
          </div>
        )}

        {/* Basic Info */}
        <SectionCard title="Basic Info" icon={User} empty={!hasBasic}>
          <InfoRow
            icon={Briefcase}
            label="Profession"
            value={profile.profession}
          />
          <InfoRow
            icon={Calendar}
            label="Date of Birth"
            value={formatDate(profile.birthDate)}
          />
          <InfoRow
            icon={Heart}
            label="Marital Status"
            value={profile.maritalStatus}
          />
          <InfoRow
            icon={User}
            label="Personality Type"
            value={profile.personality}
          />
          <InfoRow
            icon={DollarSign}
            label="Economic Status"
            value={profile.economicalStatus}
          />
          <InfoRow
            icon={DollarSign}
            label="Salary Range"
            value={profile.salaryRange}
          />
        </SectionCard>

        {/* Physical */}
        <SectionCard
          title="Physical Attributes"
          icon={Ruler}
          empty={!hasPhysical}
        >
          <InfoRow
            icon={Ruler}
            label="Height"
            value={profile.height ? `${profile.height} cm` : null}
          />
          <InfoRow
            icon={Ruler}
            label="Weight"
            value={profile.weight ? `${profile.weight} kg` : null}
          />
          <InfoRow icon={User} label="Skin Tone" value={profile.skinTone} />
        </SectionCard>

        {/* Location */}
        <SectionCard title="Location" icon={MapPin} empty={!hasAddress}>
          <InfoRow icon={MapPin} label="Division" value={divName} />
          <InfoRow icon={MapPin} label="District" value={distName} />
          <InfoRow icon={MapPin} label="Thana / Upazila" value={thanaName} />
          <InfoRow
            icon={MapPin}
            label="Address Details"
            value={profile.address?.details}
          />
        </SectionCard>

        {/* Education */}
        <SectionCard
          title="Education"
          icon={GraduationCap}
          empty={!hasEducation}
        >
          <InfoRow
            icon={GraduationCap}
            label="Education Type"
            value={profile.education?.graduation?.variety}
          />
          <InfoRow icon={GraduationCap} label="University" value={uniName} />
          <InfoRow
            icon={GraduationCap}
            label="Department"
            value={profile.education?.graduation?.department}
          />
          <InfoRow
            icon={GraduationCap}
            label="Institution"
            value={profile.education?.graduation?.institution}
          />
          <InfoRow
            icon={Calendar}
            label="Passing Year"
            value={profile.education?.graduation?.passingYear}
          />
          <InfoRow
            icon={GraduationCap}
            label="College"
            value={profile.education?.graduation?.collegeName}
          />
        </SectionCard>

        {/* Religion */}
        <SectionCard
          title="Religious Info"
          icon={BookOpen}
          empty={!hasReligion}
        >
          <InfoRow
            icon={BookOpen}
            label="Faith"
            value={profile.religion?.faith}
          />
          <InfoRow
            icon={BookOpen}
            label="Practice Level"
            value={profile.religion?.practiceLevel}
          />
          <InfoRow
            icon={BookOpen}
            label="Sect / Caste"
            value={profile.religion?.sectOrCaste}
          />
          <InfoRow
            icon={BookOpen}
            label="Daily Lifestyle"
            value={profile.religion?.dailyLifeStyleSummary}
          />
          {profile.religion?.religiousLifestyleDetails && (
            <div className="py-2.5 border-t border-white/5">
              <p className="font-outfit text-[10px] font-semibold tracking-widest uppercase text-slate-500 mb-1">
                Religious Lifestyle Details
              </p>
              <p className="font-outfit text-sm text-slate-300 leading-relaxed">
                {profile.religion.religiousLifestyleDetails}
              </p>
            </div>
          )}
        </SectionCard>

        {/* Family */}
        <SectionCard title="Family" icon={Users} empty={!hasFamily}>
          <InfoRow
            icon={Users}
            label="Guardian Relation"
            value={profile.relation}
          />
          <InfoRow
            icon={Briefcase}
            label="Father's Occupation"
            value={profile.fatherOccupation}
          />
          <InfoRow
            icon={Briefcase}
            label="Mother's Occupation"
            value={profile.motherOccupation}
          />
        </SectionCard>

        {/* Interests & Habits */}
        <SectionCard
          title="Interests & Habits"
          icon={Sparkles}
          empty={!hasHabits}
        >
          {hasHabits && (
            <div className="pt-3 pb-2">
              <div className="flex flex-wrap gap-2">
                {profile.habits!.map((h) => (
                  <span
                    key={h}
                    className="font-outfit text-xs font-semibold px-3 py-1.5 rounded-lg bg-brand/12 border border-brand/25 text-brand"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>
          )}
        </SectionCard>

        {/* Missing fields nudge */}
        {profile.missingFields && profile.missingFields.length > 0 && (
          <Link
            href="/profile/edit"
            className="glass-card rounded-2xl px-4 py-4 flex items-center justify-between no-underline border border-brand/15 hover:border-brand/30 transition-colors group"
          >
            <div>
              <p className="font-syne text-white text-sm font-bold mb-1">
                Complete your profile
              </p>
              <p className="font-outfit text-slate-400 text-xs">
                Add{" "}
                {profile.missingFields
                  .slice(0, 3)
                  .map((f) => f.label)
                  .join(", ")}
                {profile.missingFields.length > 3
                  ? ` and ${profile.missingFields.length - 3} more…`
                  : ""}
              </p>
            </div>
            <ChevronRight
              size={18}
              className="text-brand shrink-0 group-hover:translate-x-0.5 transition-transform"
            />
          </Link>
        )}
      </div>
    </div>
  );
}
