"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
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
  Eye,
  ThumbsUp,
  Share2,
  X,
  Camera,
  ShieldOff,
  BellOff,
} from "lucide-react";
import type { Profile } from "@/types";
import AlbumManager from "@/components/album/AlbumManager";
import type { AlbumPhoto } from "@/actions/album/album";
import ProfileImageUploader from "@/components/shared/ProfileImageUploader";
import { updateProfile } from "@/actions/profile/profile";

/* ── Helpers ── */
function getAge(birthDate?: string): number | null {
  if (!birthDate) return null;
  const diff = Date.now() - new Date(birthDate).getTime();
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
}

function cmToFeetIn(cm: number): string {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet} ft ${inches} in`;
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

/* ── Types ── */
interface SocialStats {
  likes: number;
  views: number;
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
        <p className="font-outfit text-[10px] font-semibold tracking-wider uppercase text-gray-400 mb-0.5">
          {label}
        </p>
        <p className="font-outfit text-sm text-gray-700 leading-relaxed wrap-break-word">
          {value}
        </p>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  icon: Icon,
  empty,
  step,
  children,
}: {
  title: string;
  icon: React.ElementType;
  empty?: boolean;
  step?: number;
  children?: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50/50">
        <div className="flex items-center gap-2">
          <Icon size={16} className="text-brand" />
          <span className="font-syne text-gray-800 text-base font-bold">
            {title}
          </span>
        </div>
        <Link
          href={step ? `/profile/edit?step=${step}` : "/profile/edit"}
          className="flex items-center gap-1 text-[11px] font-outfit font-medium text-brand/80 hover:text-brand transition-colors"
        >
          <Pencil size={10} />
          Edit
        </Link>
      </div>

      <div className="px-4 py-2">
        {empty ? (
          <Link
            href={step ? `/profile/edit?step=${step}` : "/profile/edit"}
            className="flex items-center justify-between py-3 no-underline group"
          >
            <span className="font-outfit text-gray-400 text-sm">
              No info added yet
            </span>
            <ChevronRight
              size={15}
              className="text-gray-400 group-hover:text-brand transition-colors"
            />
          </Link>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

// Social Stats Bar - Mobile Optimized
function SocialStatsBar({
  stats,
  onLikeClick,
  onViewersClick,
}: {
  stats: SocialStats;
  onLikeClick: () => void;
  onViewersClick: () => void;
}) {
  return (
    <div className="flex items-center justify-around py-2.5 px-4 bg-white rounded-xl shadow-sm border border-gray-100 mb-3">
      <button
        onClick={onLikeClick}
        className="flex items-center gap-2 group active:scale-95 transition-transform"
      >
        <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center">
          <ThumbsUp size={16} className="text-brand" />
        </div>
        <div className="flex flex-col items-start">
          <span className="font-outfit font-bold text-gray-800 text-sm">
            {stats.likes}
          </span>
          <span className="font-outfit text-[10px] text-gray-400">Likes</span>
        </div>
      </button>

      <div className="w-px h-8 bg-gray-100" />

      <button
        onClick={onViewersClick}
        className="flex items-center gap-2 group active:scale-95 transition-transform"
      >
        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
          <Eye size={16} className="text-blue-500" />
        </div>
        <div className="flex flex-col items-start">
          <span className="font-outfit font-bold text-gray-800 text-sm">
            {stats.views}
          </span>
          <span className="font-outfit text-[10px] text-gray-400">Views</span>
        </div>
      </button>
    </div>
  );
}

// Action Buttons — own profile: no Message button
function ProfileActionButtons() {
  return (
    <div className="flex gap-2 mb-3">
      <button className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center active:bg-gray-50 transition-colors">
        <Share2 size={16} className="text-gray-600" />
      </button>
    </div>
  );
}

// Modal Component
function Modal({
  title,
  isOpen,
  onClose,
  children,
}: {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-2xl md:rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white p-4 border-b flex items-center justify-between">
          <h3 className="font-syne font-bold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center active:bg-gray-200 transition-colors"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-60px)]">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function ProfileViewClient({
  profile,
  initialPhotos = [],
}: {
  profile: Profile;
  initialPhotos?: AlbumPhoto[];
}) {
  const [showLikeModal, setShowLikeModal] = useState(false);
  const [showViewerModal, setShowViewerModal] = useState(false);
 const [avatarUrl, setAvatarUrl] = useState<string | null>(
  (profile as unknown as Record<string, string>)?.image || null,
);
const [coverUrl, setCoverUrl] = useState<string | null>(
  (profile as unknown as Record<string, string>)?.coverImage || null,
);
  const userData = Array.isArray(profile.user) ? profile.user[0] : profile.user;
  const name = userData?.name || profile.userId?.name || "User";
  const age = getAge(profile.birthDate);
  const completion = profile.completionPercentage ?? 0;
  const completionColor = getCompletionColor(completion);

  // Mock data - replace with real API data
  const socialStats: SocialStats = {
    likes: 128,
    views: 1034,
  };

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
console.log(profile)
  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-6">
      {/* ── COVER + AVATAR HEADER ── */}
      <div className="relative">
        {/* Cover */}
        <div className="h-32 md:h-48 w-full relative overflow-hidden">
          <ProfileImageUploader
            currentImageUrl={coverUrl}
            name={name}
            onUploadSuccess={async (url) => {
              setCoverUrl(url);
              await updateProfile({ coverImage: url });
            }}
            size="cover"
            className="w-full h-full"
          />
        </div>

        {/* Avatar + name */}
        <div className="px-4">
          <div className="flex items-end justify-between -mt-10 mb-3">
            <div className="relative">
              <ProfileImageUploader
                currentImageUrl={avatarUrl}
                name={name}
                onUploadSuccess={async (url) => {
                  setAvatarUrl(url);
              await updateProfile({ image: url });
                }}
                size="avatar"
              />
            </div>

            <Link
              href="/profile/edit"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-outfit font-semibold text-xs text-on-brand bg-linear-to-r from-brand to-accent no-underline active:scale-95 transition-transform shadow-sm"
            >
              <Pencil size={12} />
              Edit
            </Link>
          </div>

          {/* Name & basic info */}
          <div className="mb-3">
            <h1 className="font-syne text-gray-900 text-xl md:text-2xl font-bold tracking-tight">
              {name}
            </h1>
            <div className="flex flex-wrap items-center gap-1.5 mt-1">
              {age && (
                <span className="font-outfit text-gray-500 text-xs">
                  {age} years
                </span>
              )}
              {profile.gender && (
                <>
                  <span className="text-gray-300 text-xs">•</span>
                  <span className="font-outfit text-gray-500 text-xs capitalize">
                    {profile.gender}
                  </span>
                </>
              )}
              {profile.personality && (
                <>
                  <span className="text-gray-300 text-xs">•</span>
                  <span className="font-outfit text-[10px] font-medium text-brand bg-brand/10 px-2 py-0.5 rounded-full">
                    {profile.personality}
                  </span>
                </>
              )}
            </div>
            {location && (
              <p className="flex items-center gap-1 font-outfit text-gray-400 text-xs mt-1">
                <MapPin size={10} className="text-brand/70" />
                {location}
              </p>
            )}
          </div>

          {/* Profile Completion Bar - Mobile Optimized */}
          {completion > 0 && completion < 100 && (
            <div className="bg-white rounded-xl px-3 py-2 mb-3 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-1">
                <span className="font-outfit text-gray-500 text-[10px] font-medium">
                  Profile Completion
                </span>
                <span
                  className="font-outfit text-xs font-bold"
                  style={{ color: completionColor }}
                >
                  {completion}%
                </span>
              </div>
              <div className="w-full h-1 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${completion}%`,
                    backgroundColor: completionColor,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="px-4">
        {/* Social Stats Bar */}
        <SocialStatsBar
          stats={socialStats}
          onLikeClick={() => setShowLikeModal(true)}
          onViewersClick={() => setShowViewerModal(true)}
        />

        {/* Action Buttons */}
        <ProfileActionButtons />

        {/* About Me - Mobile First */}
        {profile.aboutMe && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3 mb-3">
            <p className="font-outfit text-[10px] font-semibold tracking-wider uppercase text-gray-400 mb-1">
              About Me
            </p>
            <p className="font-outfit text-sm text-gray-600 leading-relaxed">
              {profile.aboutMe}
            </p>
          </div>
        )}

        {/* Photo Album Section - Shows first on mobile */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-3">
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50/50">
            <div className="flex items-center gap-2">
              <Camera size={16} className="text-brand" />
              <span className="font-syne text-gray-800 text-base font-bold">
                Photo Album
              </span>
            </div>
            <span className="text-xs font-outfit text-gray-400">
              {initialPhotos.length}/10
            </span>
          </div>
          <div className="p-3">
            <AlbumManager initialPhotos={initialPhotos} />
          </div>
        </div>

        {/* Info Sections - Collapsible? Can be added later */}
        <div className="space-y-3">
          {/* Basic Info */}
          <SectionCard
            title="Basic Info"
            icon={User}
            empty={!hasBasic}
            step={1}
          >
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
              label="Personality"
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
            title="Physical"
            icon={Ruler}
            empty={!hasPhysical}
            step={2}
          >
            <InfoRow
              icon={Ruler}
              label="Height"
              value={
                profile.height
                  ? `${profile.height} cm (${cmToFeetIn(Number(profile.height))})`
                  : null
              }
            />
            <InfoRow
              icon={Ruler}
              label="Weight"
              value={profile.weight ? `${profile.weight} kg` : null}
            />
            <InfoRow icon={User} label="Skin Tone" value={profile.skinTone} />
          </SectionCard>

          {/* Location */}
          <SectionCard
            title="Location"
            icon={MapPin}
            empty={!hasAddress}
            step={3}
          >
            <InfoRow icon={MapPin} label="Division" value={divName} />
            <InfoRow icon={MapPin} label="District" value={distName} />
            <InfoRow icon={MapPin} label="Thana" value={thanaName} />
            <InfoRow
              icon={MapPin}
              label="Address"
              value={profile.address?.details}
            />
          </SectionCard>

          {/* Education */}
          <SectionCard
            title="Education"
            icon={GraduationCap}
            empty={!hasEducation}
            step={4}
          >
            <InfoRow
              icon={GraduationCap}
              label="Type"
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
          </SectionCard>

          {/* Religion */}
          <SectionCard
            title="Religion"
            icon={BookOpen}
            empty={!hasReligion}
            step={5}
          >
            <InfoRow
              icon={BookOpen}
              label="Faith"
              value={profile.religion?.faith}
            />
            <InfoRow
              icon={BookOpen}
              label="Practice"
              value={profile.religion?.practiceLevel}
            />
            <InfoRow
              icon={BookOpen}
              label="Sect/Caste"
              value={profile.religion?.sectOrCaste}
            />
            <InfoRow
              icon={BookOpen}
              label="Lifestyle"
              value={profile.religion?.dailyLifeStyleSummary}
            />
          </SectionCard>

          {/* Family */}
          <SectionCard title="Family" icon={Users} empty={!hasFamily} step={6}>
            <InfoRow icon={Users} label="Guardian" value={profile.relation} />
            <InfoRow
              icon={Briefcase}
              label="Father"
              value={profile.fatherOccupation}
            />
            <InfoRow
              icon={Briefcase}
              label="Mother"
              value={profile.motherOccupation}
            />
          </SectionCard>

          {/* Interests & Habits */}
          <SectionCard
            title="Interests"
            icon={Sparkles}
            empty={!hasHabits}
            step={7}
          >
            {hasHabits && (
              <div className="pt-2 pb-1">
                <div className="flex flex-wrap gap-1.5">
                  {profile.habits!.map((h) => (
                    <span
                      key={h}
                      className="font-outfit text-xs px-2.5 py-1 rounded-full bg-brand/10 text-brand"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </SectionCard>
        </div>

        {/* Missing fields nudge */}
        {profile.missingFields && profile.missingFields.length > 0 && (
          <Link
            href="/profile/edit"
            className="bg-white rounded-xl px-4 py-3 flex items-center justify-between no-underline border border-brand/20 hover:border-brand/40 transition-colors group mt-3"
          >
            <div>
              <p className="font-syne text-gray-800 text-sm font-bold mb-0.5">
                Complete your profile
              </p>
              <p className="font-outfit text-gray-400 text-[11px]">
                Add{" "}
                {profile.missingFields
                  .slice(0, 2)
                  .map((f) => f.label)
                  .join(", ")}
                {profile.missingFields.length > 2 &&
                  ` +${profile.missingFields.length - 2}`}
              </p>
            </div>
            <ChevronRight
              size={16}
              className="text-brand shrink-0 group-hover:translate-x-0.5 transition-transform"
            />
          </Link>
        )}

        {/* ── Privacy & Safety ── */}
        <div className="mt-3 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100">
            <p className="font-syne text-gray-800 text-base font-bold">
              Privacy &amp; Safety
            </p>
          </div>

          {/* Blocked Users */}
          <Link
            href="/blocked"
            className="flex items-center gap-3 px-4 py-3.5 no-underline border-b border-gray-50 active:bg-gray-50 transition-colors group"
          >
            <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
              <ShieldOff size={16} className="text-orange-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-outfit font-semibold text-gray-800 text-sm leading-tight">
                Blocked Users
              </p>
              <p className="font-outfit text-gray-400 text-[11px] mt-0.5">
                Manage people you&apos;ve blocked
              </p>
            </div>
            <ChevronRight
              size={15}
              className="text-gray-300 shrink-0 group-active:translate-x-0.5 transition-transform"
            />
          </Link>

          {/* Ignored Users */}
          <Link
            href="/ignored"
            className="flex items-center gap-3 px-4 py-3.5 no-underline active:bg-gray-50 transition-colors group"
          >
            <div className="w-9 h-9 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
              <BellOff size={16} className="text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-outfit font-semibold text-gray-800 text-sm leading-tight">
                Ignored Messages
              </p>
              <p className="font-outfit text-gray-400 text-[11px] mt-0.5">
                View messages you&apos;ve silently muted
              </p>
            </div>
            <ChevronRight
              size={15}
              className="text-gray-300 shrink-0 group-active:translate-x-0.5 transition-transform"
            />
          </Link>
        </div>
      </div>

      {/* Modals */}
      <Modal
        title="People who liked you"
        isOpen={showLikeModal}
        onClose={() => setShowLikeModal(false)}
      >
        <div className="space-y-3">
          <p className="text-center text-gray-400 text-sm py-6">No likes yet</p>
        </div>
      </Modal>

      <Modal
        title="Profile Views"
        isOpen={showViewerModal}
        onClose={() => setShowViewerModal(false)}
      >
        <div className="space-y-3">
          <p className="text-center text-gray-400 text-sm py-6">No views yet</p>
        </div>
      </Modal>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}