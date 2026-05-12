"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  GraduationCap,
  Briefcase,
  Heart,
  BookOpen,
  User,
  Calendar,
  Ruler,
  Weight,
  Palette,
  MessageCircle,
  Camera,
  Share2,
  ChevronDown,
  Users,
  CheckCircle,
  ShieldOff,
  BellOff,
  Eye,
  Moon,
  Languages,
  Sparkles,
} from "lucide-react";
import LikeButton from "@/components/like/LikeButton";
import ProfileCompletionCard from "@/components/profile/ProfileCompletionCard";
import AlbumGallery from "@/components/album/AlbumGallery";
import type { MissingField } from "@/types";
import UserActionMenu from "@/components/report-block-ignore/UserActionMenu";
import BlockConfirmModal from "@/components/report-block-ignore/BlockConfirmModal";

interface AlbumPhoto {
  id: string;
  url: string;
  caption?: string;
  type: "image" | "video";
  createdAt?: string;
}

interface ProfileData {
  id: string;
  name: string;
  gender?: string;
  age: number | null;
  location: string;
  uniName: string;
  personality?: string;
  aboutMe?: string;
  profession?: string;
  birthDate?: string;
  maritalStatus?: string;
  economicalStatus?: string;
  salaryRange?: string;
  height?: string;
  weight?: string;
  skinTone?: string;
  addressDetails?: string;
  educationType?: string;
  department?: string;
  institution?: string;
  passingYear?: string;
  religion?: string;
  practiceLevel?: string;
  sectOrCaste?: string;
  dailyLifeStyleSummary?: string;
  relation?: string;
  fatherOccupation?: string;
  motherOccupation?: string;
  habits: string[];
  completionPercentage?: number;
  completionLabel?: string;
  missingFields: MissingField[];
  isVerified?: boolean;
}

interface ProfileClientProps {
  profileData: ProfileData;
  likeCount: number;
  viewCount: number;
  mutualMatches: number;
  isOwnProfile: boolean;
  isLoggedIn: boolean;
  hasCurrentUserProfile: boolean;
  photos: AlbumPhoto[];
  blockStatus?: {
    iBlockedThem: boolean;
    theyBlockedMe: boolean;
    isBlocked: boolean;
  };
  isIgnored?: boolean;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ── small helpers ──────────────────────────────────────────────────────────────

interface InfoRowProps {
  label: string;
  value?: string | null;
}
function InfoRow({ label, value }: InfoRowProps) {
  if (!value) return null;
  return (
    <div className="py-2.5 border-b border-gray-100 last:border-0">
      <p className="font-outfit text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-0.5">
        {label}
      </p>
      <p className="font-outfit text-sm text-gray-700">{value}</p>
    </div>
  );
}

interface InfoGridCellProps {
  label: string;
  value?: string | null;
  accent?: string; // tailwind bg class for the dot, e.g. "bg-[#1a1a1a]"
}
function InfoGridCell({ label, value, accent }: InfoGridCellProps) {
  if (!value) return null;
  return (
    <div className="p-3 flex flex-col gap-0.5">
      <p className="font-outfit text-[10px] font-medium text-gray-400 uppercase tracking-wide">
        {label}
      </p>
      <div className="flex items-center gap-1.5">
        {accent && (
          <span
            className={`w-3 h-3 rounded-full border border-gray-200 shrink-0 ${accent}`}
          />
        )}
        <p className="font-outfit text-sm font-medium text-gray-800">{value}</p>
      </div>
    </div>
  );
}

interface SectionCardProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  collapsible?: boolean;
}
function SectionCard({
  icon,
  iconBg,
  title,
  children,
  defaultOpen = false,
  collapsible = true,
}: SectionCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-3">
      <button
        onClick={() => collapsible && setOpen((p) => !p)}
        className={`w-full flex items-center justify-between px-4 py-3.5 ${
          collapsible ? "cursor-pointer active:bg-gray-50" : "cursor-default"
        } transition-colors`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}
          >
            {icon}
          </div>
          <span className="font-syne text-gray-900 text-sm font-bold">
            {title}
          </span>
        </div>
        {collapsible && (
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        )}
      </button>
      {(!collapsible || open) && (
        <div className="border-t border-gray-100">{children}</div>
      )}
    </div>
  );
}

// ── stat mini-card ─────────────────────────────────────────────────────────────
interface StatCardProps {
  icon: React.ReactNode;
  iconBg: string;
  value: number | string;
  label: string;
}
function StatCard({ icon, iconBg, value, label }: StatCardProps) {
  return (
    <div
      className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl ${iconBg}`}
    >
      {icon}
      <span className="font-syne font-bold text-base leading-none">
        {value}
      </span>
      <span className="font-outfit text-[10px]">{label}</span>
    </div>
  );
}

// ── main component ─────────────────────────────────────────────────────────────
export default function ProfileClient({
  profileData,
  likeCount,
  viewCount,
  mutualMatches,
  isOwnProfile,
  isLoggedIn,
  hasCurrentUserProfile,
  photos,
  blockStatus,
  isIgnored: initialIgnored = false,
}: ProfileClientProps) {
  const [iBlockedThem, setIBlockedThem] = useState(
    blockStatus?.iBlockedThem ?? false,
  );
  const [theyBlockedMe] = useState(blockStatus?.theyBlockedMe ?? false);
  const [isBlocked, setIsBlocked] = useState(blockStatus?.isBlocked ?? false);
  const [isIgnored, setIsIgnored] = useState(initialIgnored);
  const [showUnblockModal, setShowUnblockModal] = useState(false);
console.log(profileData)
  const name = profileData.name;
  const targetUserId = profileData.id;

  const getChatLink = () => {
    if (!isLoggedIn) return "/login";
    if (isOwnProfile) return "/profile/edit";
    if (isBlocked) return "#";
    return hasCurrentUserProfile ? `/chat/${targetUserId}` : "/profile/edit";
  };

  const getChatButtonText = () => {
    if (!isLoggedIn) return "Login to Message";
    if (isOwnProfile) return "Edit Profile";
    if (!hasCurrentUserProfile) return "Create Profile to Message";
    if (isBlocked) return theyBlockedMe ? "Blocked" : "Unblock to Message";
    return "Send Message";
  };
console.log(profileData)
  // ── section visibility guards ──────────────────────────────────────────────
  const hasPersonal = !!(
    profileData.profession ||
    profileData.birthDate ||
    profileData.location ||
    profileData.height ||
    profileData.weight ||
    profileData.skinTone ||
    profileData.maritalStatus ||
    profileData.economicalStatus ||
    profileData.salaryRange
  );

  const hasEducation = !!(
    profileData.uniName ||
    profileData.educationType ||
    profileData.department ||
    profileData.institution ||
    profileData.passingYear
  );

  const hasReligion = !!(
    profileData.religion ||
    profileData.practiceLevel ||
    profileData.sectOrCaste ||
    profileData.dailyLifeStyleSummary
  );

  const hasFamily = !!(
    profileData.relation ||
    profileData.fatherOccupation ||
    profileData.motherOccupation
  );

  const hasHabits = !!(profileData.habits && profileData.habits.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">
      {/* ── sticky header ── */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 mb-3">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <Link
            href="/feed"
            className="flex items-center gap-1.5 text-gray-600 text-sm transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="font-outfit">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-colors cursor-pointer">
              <Share2 size={14} className="text-gray-600" />
            </button>
            {isLoggedIn && !isOwnProfile && (
              <UserActionMenu
                targetUserId={targetUserId}
                targetName={name}
                iBlockedThem={iBlockedThem}
                isIgnored={isIgnored}
                onBlockChange={(action) => {
                  const blocked = action === "blocked";
                  setIBlockedThem(blocked);
                  setIsBlocked(blocked || theyBlockedMe);
                }}
                onIgnoreChange={(action) => setIsIgnored(action === "ignored")}
              />
            )}
          </div>
        </div>
      </div>

      <div className="px-4 max-w-2xl mx-auto">
        {/* ── hero card ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-3">
          {/* avatar + name row */}
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand/30 to-accent/30 flex items-center justify-center shadow-sm">
                <span className="font-syne text-brand-dark text-2xl font-bold">
                  {name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-syne text-gray-900 text-xl font-bold tracking-tight">
                  {name}
                </h1>
                {profileData.isVerified && (
                  <CheckCircle size={16} className="text-green-500 shrink-0" />
                )}
              </div>

              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                {profileData.age && (
                  <span className="font-outfit text-gray-500 text-xs">
                    {profileData.age} yrs
                  </span>
                )}
                {profileData.gender && (
                  <>
                    <span className="text-gray-300 text-xs">·</span>
                    <span className="font-outfit text-gray-500 text-xs capitalize">
                      {profileData.gender}
                    </span>
                  </>
                )}
                {profileData.personality && (
                  <>
                    <span className="text-gray-300 text-xs">·</span>
                    <span className="font-outfit text-[10px] font-medium text-brand bg-brand/10 px-2 py-0.5 rounded-full">
                      {profileData.personality}
                    </span>
                  </>
                )}
              </div>

              {profileData.location && (
                <p className="flex items-center gap-1 font-outfit text-gray-400 text-xs mt-1.5">
                  <MapPin size={10} className="text-brand/50" />
                  {profileData.location}
                </p>
              )}
            </div>
          </div>

          {/* about me */}
          {profileData.aboutMe && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="font-outfit text-gray-600 text-sm leading-relaxed">
                {profileData.aboutMe}
              </p>
            </div>
          )}

          {/* stat strip */}
          <div className="flex gap-2.5 mt-4">
            {!isOwnProfile && (
              <StatCard
                icon={
                  <LikeButton
                    targetUserId={targetUserId}
                    likeCount={likeCount}
                    showCount={false}
                    size="md"
                  />
                }
                iconBg="bg-rose-50"
                value={likeCount}
                label="Likes"
              />
            )}
            <StatCard
              icon={<Eye size={18} className="text-blue-500" />}
              iconBg="bg-blue-50"
              value={viewCount}
              label="Views"
            />
          </div>

          {/* CTA button */}
          <div className="flex gap-2 mt-4">
            {isBlocked ? (
              <button
                onClick={() => iBlockedThem && setShowUnblockModal(true)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  iBlockedThem
                    ? "bg-orange-50 border border-orange-200 text-orange-500"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <ShieldOff size={16} />
                {iBlockedThem ? "Unblock to Message" : "Blocked"}
              </button>
            ) : (
              <Link
                href={getChatLink()}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold bg-gradient-to-r from-brand to-accent text-white shadow-sm transition-all"
              >
                <MessageCircle size={16} />
                {getChatButtonText()}
                {isIgnored && <BellOff size={13} className="opacity-60" />}
              </Link>
            )}
          </div>

          {isLoggedIn && !hasCurrentUserProfile && !isOwnProfile && (
            <p className="text-[10px] text-gray-400 text-center mt-2">
              Complete your profile first to start messaging
            </p>
          )}
          {!isLoggedIn && (
            <p className="text-[10px] text-gray-400 text-center mt-2">
              Login to send messages
            </p>
          )}
        </div>

        {/* ── profile completion ── */}
        {isOwnProfile &&
          profileData.completionPercentage !== undefined &&
          profileData.completionPercentage < 100 && (
            <div className="mb-3">
              <ProfileCompletionCard
                percentage={profileData.completionPercentage}
                label={profileData.completionLabel ?? ""}
                missingFields={profileData.missingFields}
              />
            </div>
          )}

        {/* ── photo album ── */}
        <SectionCard
          icon={<Camera size={16} className="text-pink-500" />}
          iconBg="bg-pink-50"
          title="Photo Album"
          defaultOpen
          collapsible
        >
          <div className="p-3">
            <div className="flex items-center gap-1.5 mb-2 px-1">
              <span className="font-outfit text-xs text-gray-400">
                {photos.length} photo{photos.length !== 1 ? "s" : ""}
              </span>
            </div>
            <AlbumGallery
              photos={photos.map((p) => ({
                _id: p.id,
                url: p.url,
                caption: p.caption,
              }))}
              isOwnProfile={isOwnProfile}
            />
          </div>
        </SectionCard>

        {/* ── personal information ── */}
        {hasPersonal && (
          <SectionCard
            icon={<User size={16} className="text-brand" />}
            iconBg="bg-brand/10"
            title="Personal Information"
            defaultOpen
          >
            {/* 2-col grid for compact fields */}
            <div className="grid grid-cols-2 divide-x divide-y divide-gray-100">
              {profileData.profession && (
                <InfoGridCell
                  label="Profession"
                  value={profileData.profession}
                />
              )}
              {profileData.maritalStatus && (
                <InfoGridCell
                  label="Marital Status"
                  value={profileData.maritalStatus}
                />
              )}
              {profileData.birthDate && (
                <InfoGridCell
                  label="Birth Date"
                  value={formatDate(profileData.birthDate)}
                />
              )}
              {profileData.economicalStatus && (
                <InfoGridCell
                  label="Economic Status"
                  value={profileData.economicalStatus}
                />
              )}
              {profileData.height && (
                <InfoGridCell
                  label="Height"
                  value={`${profileData.height} cm`}
                />
              )}
              {profileData.weight && (
                <InfoGridCell
                  label="Weight"
                  value={`${profileData.weight} kg`}
                />
              )}
              {profileData.skinTone && (
                <InfoGridCell label="Skin Tone" value={profileData.skinTone} />
              )}
              {profileData.salaryRange && (
                <InfoGridCell
                  label="Salary Range"
                  value={profileData.salaryRange}
                />
              )}
            </div>
          </SectionCard>
        )}

        {/* ── education ── */}
        {hasEducation && (
          <SectionCard
            icon={<GraduationCap size={16} className="text-green-600" />}
            iconBg="bg-green-50"
            title="Education"
          >
            <div className="px-4 py-1">
              <InfoRow label="University" value={profileData.uniName} />
              <InfoRow
                label="Education Type"
                value={profileData.educationType}
              />
              <InfoRow label="Department" value={profileData.department} />
              <InfoRow label="Institution" value={profileData.institution} />
              <InfoRow label="Passing Year" value={profileData.passingYear} />
            </div>
          </SectionCard>
        )}

        {/* ── religion ── */}
        {hasReligion && (
          <SectionCard
            icon={<Moon size={16} className="text-violet-500" />}
            iconBg="bg-violet-50"
            title="Religious Information"
          >
            {/* pill row for quick overview */}
            <div className="flex flex-wrap gap-2 px-4 pt-3 pb-2">
              {profileData.religion && (
                <span className="font-outfit text-xs font-medium bg-violet-50 text-violet-700 border border-violet-100 px-3 py-1 rounded-full">
                  {profileData.religion}
                </span>
              )}
              {profileData.sectOrCaste && (
                <span className="font-outfit text-xs font-medium bg-violet-50 text-violet-700 border border-violet-100 px-3 py-1 rounded-full">
                  {profileData.sectOrCaste}
                </span>
              )}
              {profileData.practiceLevel && (
                <span className="font-outfit text-xs font-medium bg-violet-50 text-violet-700 border border-violet-100 px-3 py-1 rounded-full">
                  {profileData.practiceLevel}
                </span>
              )}
            </div>
            {profileData.dailyLifeStyleSummary && (
              <div className="px-4 pb-3 border-t border-gray-100 pt-2">
                <p className="font-outfit text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-1">
                  Daily Lifestyle
                </p>
                <p className="font-outfit text-sm text-gray-700 leading-relaxed">
                  {profileData.dailyLifeStyleSummary}
                </p>
              </div>
            )}
          </SectionCard>
        )}

        {/* ── family ── */}
        {hasFamily && (
          <SectionCard
            icon={<Users size={16} className="text-amber-500" />}
            iconBg="bg-amber-50"
            title="Family Information"
          >
            <div className="px-4 py-1">
              <InfoRow label="Guardian Relation" value={profileData.relation} />
              <InfoRow
                label="Father's Occupation"
                value={profileData.fatherOccupation}
              />
              <InfoRow
                label="Mother's Occupation"
                value={profileData.motherOccupation}
              />
            </div>
          </SectionCard>
        )}

        {/* ── habits ── */}
        {hasHabits && (
          <SectionCard
            icon={<Sparkles size={16} className="text-rose-500" />}
            iconBg="bg-rose-50"
            title="Habits & Interests"
          >
            <div className="flex flex-wrap gap-2 p-4">
              {profileData.habits.map((h: string) => (
                <span
                  key={h}
                  className="text-xs font-outfit font-medium text-brand bg-brand/10 border border-brand/20 rounded-full px-3 py-1.5"
                >
                  {h}
                </span>
              ))}
            </div>
          </SectionCard>
        )}

        {/* ── verified badge ── */}
        {profileData.isVerified && (
          <div className="flex items-center justify-center gap-2 py-4">
            <CheckCircle size={14} className="text-green-500" />
            <span className="font-outfit text-xs text-gray-500">
              Verified Profile
            </span>
          </div>
        )}
      </div>

      {/* ── floating message button (mobile) ── */}
      {!isOwnProfile && (
        <div className="fixed bottom-20 right-4 md:hidden z-30">
          <Link
            href={getChatLink()}
            className={`no-underline flex items-center justify-center w-14 h-14 rounded-full transition-all duration-200 shadow-lg active:scale-95 ${
              !isLoggedIn
                ? "bg-white border border-gray-200 text-gray-500"
                : !hasCurrentUserProfile
                  ? "bg-brand/10 border border-brand/30 text-brand"
                  : "bg-gradient-to-br from-brand to-accent text-white shadow-[0_8px_20px_rgba(232,84,122,0.4)]"
            }`}
            aria-label={getChatButtonText()}
          >
            <MessageCircle size={22} />
          </Link>
        </div>
      )}

      {/* ── unblock modal ── */}
      {showUnblockModal && (
        <BlockConfirmModal
          targetUserId={targetUserId}
          targetName={name}
          isCurrentlyBlocked={true}
          onClose={() => setShowUnblockModal(false)}
          onSuccess={(action) => {
            if (action === "unblocked") {
              setIBlockedThem(false);
              setIsBlocked(theyBlockedMe);
            }
            setShowUnblockModal(false);
          }}
        />
      )}
    </div>
  );
}
