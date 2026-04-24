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
  MoreHorizontal,
  X,
  ChevronRight,
  Image as ImageIcon,
  Film,
  Users,
  CheckCircle,
} from "lucide-react";
import LikeButton from "@/components/like/LikeButton";
import ProfileCompletionCard from "@/components/profile/ProfileCompletionCard";

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
  missingFields: Array<{ label: string }>;
  isVerified: boolean;
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
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ProfileClient({
  profileData,
  likeCount,
  viewCount,
  mutualMatches,
  isOwnProfile,
  isLoggedIn,
  hasCurrentUserProfile,
  photos,
}: ProfileClientProps) {
  const [viewAllPhotos, setViewAllPhotos] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<AlbumPhoto | null>(null);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    personal: true,
    education: false,
    religion: false,
    family: false,
    habits: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const displayPhotos = viewAllPhotos ? photos : photos.slice(0, 6);
  const name = profileData.name;
  const targetUserId = profileData.id;

  const getChatLink = () => {
    if (!isLoggedIn) return "/login";
    if (isOwnProfile) return "/profile/edit";
    return hasCurrentUserProfile ? `/chat/${targetUserId}` : "/profile/create";
  };

  const getChatButtonText = () => {
    if (!isLoggedIn) return "Login to Message";
    if (isOwnProfile) return "Edit Profile";
    if (!hasCurrentUserProfile) return "Create Profile to Message";
    return `Message ${name.split(" ")[0]}`;
  };

  const getChatButtonStyle = () => {
    if (!isLoggedIn) return "bg-white border border-gray-200 text-gray-600";
    if (isOwnProfile)
      return "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-sm";
    if (!hasCurrentUserProfile)
      return "bg-brand/10 border border-brand/20 text-brand";
    return "bg-gradient-to-r from-brand to-accent text-white shadow-[0_4px_14px_rgba(232,84,122,0.3)] hover:shadow-[0_6px_20px_rgba(232,84,122,0.4)] active:scale-[0.98] transition-all";
  };

  // Check if sections have content
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

  const hasEducation = !!(profileData.uniName || profileData.educationType);
  const hasReligion = !!profileData.religion;
  const hasFamily = !!(
    profileData.relation ||
    profileData.fatherOccupation ||
    profileData.motherOccupation
  );
  const hasHabits = !!(profileData.habits && profileData.habits.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-6">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 mb-4 backdrop-blur-md border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <Link
            href="/profiles"
            className="flex items-center gap-1.5 text-gray-600 text-sm active:text-gray-900 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="font-outfit">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center active:bg-gray-200 transition-colors">
              <Share2 size={14} className="text-gray-600" />
            </button>
            {!isOwnProfile && (
              <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center active:bg-gray-200 transition-colors">
                <MoreHorizontal size={14} className="text-gray-600" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 max-w-2xl mx-auto">
        {/* Hero Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4 -mt-2">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-linear-to-br from-brand/30 to-accent/30 flex items-center justify-center shadow-sm">
                <span className="font-syne text-brand-dark text-2xl font-bold">
                  {name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white" />
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="font-syne text-gray-900 text-xl font-bold tracking-tight">
                {name}
              </h1>
              <div className="flex flex-wrap items-center gap-1 mt-0.5">
                {profileData.age && (
                  <span className="font-outfit text-gray-500 text-xs">
                    {profileData.age} yrs
                  </span>
                )}
                {profileData.gender && (
                  <>
                    <span className="text-gray-300 text-xs">•</span>
                    <span className="font-outfit text-gray-500 text-xs capitalize">
                      {profileData.gender}
                    </span>
                  </>
                )}
                {profileData.personality && (
                  <>
                    <span className="text-gray-300 text-xs">•</span>
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

              {/* Mutual Matches Indicator */}
              {!isOwnProfile && mutualMatches > 0 && (
                <div className="flex items-center gap-1.5 mt-2">
                  <div className="flex -space-x-1">
                    {[1, 2, 3].slice(0, Math.min(3, mutualMatches)).map((i) => (
                      <div
                        key={i}
                        className="w-5 h-5 rounded-full bg-linear-to-br from-brand/40 to-accent/40 border-2 border-white flex items-center justify-center"
                      >
                        <span className="text-[8px] font-bold text-brand">
                          M
                        </span>
                      </div>
                    ))}
                  </div>
                  <span className="font-outfit text-xs text-gray-500">
                    {mutualMatches} mutual{" "}
                    {mutualMatches === 1 ? "match" : "matches"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* About Me */}
          {profileData.aboutMe && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="font-outfit text-gray-600 text-sm leading-relaxed">
                {profileData.aboutMe}
              </p>
            </div>
          )}

          {/* Stats Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-around py-3 px-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2">
                {!isOwnProfile && (
                  <div className="shrink-0">
                    <LikeButton
                      targetUserId={targetUserId}
                      likeCount={likeCount}
                      showCount
                      size="md"
                    />
                  </div>
                )}
              </div>

              <div className="w-px h-8 bg-gray-200" />

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Users size={16} className="text-blue-500" />
                </div>
                <div className="flex flex-col">
                  <span className="font-outfit font-bold text-gray-800 text-sm">
                    {viewCount}
                  </span>
                  <span className="font-outfit text-[10px] text-gray-400">
                    Views
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <Link
              href={getChatLink()}
              className={`flex-1 no-underline flex items-center justify-center gap-2 py-3 rounded-xl
                text-sm font-semibold font-outfit transition-all duration-200 ${getChatButtonStyle()}`}
            >
              <MessageCircle size={16} />
              {getChatButtonText()}
            </Link>
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

        {/* Profile Completion (only for own profile) */}
        {isOwnProfile &&
          profileData.completionPercentage !== undefined &&
          profileData.completionPercentage < 100 && (
            <div className="mb-4">
              <ProfileCompletionCard
                percentage={profileData.completionPercentage}
                label={profileData.completionLabel || ""}
                missingFields={profileData.missingFields}
              />
            </div>
          )}

        {/* Photo Album Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-3">
          <div className="flex items-center justify-between px-4 py-3.5 bg-gray-50/30">
            <div className="flex items-center gap-2.5">
              <Camera size={18} className="text-brand" />
              <span className="font-syne text-gray-800 text-sm font-bold">
                Photo Album
              </span>
              <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                {photos.length}
              </span>
            </div>
          </div>
          <div className="p-3">
            {photos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <div className="w-14 h-14 rounded-full bg-brand/10 flex items-center justify-center mb-3">
                  <Camera size={24} className="text-brand/50" />
                </div>
                <p className="font-outfit text-gray-500 text-sm">
                  No photos yet
                </p>
                {isOwnProfile && (
                  <Link
                    href="/profile/edit?tab=photos"
                    className="mt-3 px-4 py-2 bg-brand/10 text-brand rounded-xl text-sm font-medium active:bg-brand/20 transition-colors"
                  >
                    Add Photos
                  </Link>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-1.5">
                  {displayPhotos.map((photo, idx) => (
                    <button
                      key={photo.id}
                      onClick={() => setSelectedPhoto(photo)}
                      className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 active:scale-95 transition-transform"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        {photo.type === "video" ? (
                          <Film size={28} className="text-gray-500" />
                        ) : (
                          <ImageIcon size={28} className="text-gray-500" />
                        )}
                      </div>
                      {photo.caption && (
                        <div className="absolute bottom-2 left-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-white text-[10px] font-medium truncate">
                            {photo.caption}
                          </p>
                        </div>
                      )}
                      {idx === 5 && photos.length > 6 && !viewAllPhotos && (
                        <div
                          className="absolute inset-0 bg-black/60 flex items-center justify-center z-20 rounded-xl"
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewAllPhotos(true);
                          }}
                        >
                          <span className="text-white font-bold text-lg">
                            +{photos.length - 5}
                          </span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                {photos.length > 6 && !viewAllPhotos && (
                  <button
                    onClick={() => setViewAllPhotos(true)}
                    className="w-full mt-3 py-2.5 text-center text-sm font-outfit font-medium text-brand bg-brand/5 rounded-xl active:bg-brand/10 transition-colors"
                  >
                    View All {photos.length} Photos
                  </button>
                )}
                {viewAllPhotos && photos.length > 6 && (
                  <button
                    onClick={() => setViewAllPhotos(false)}
                    className="w-full mt-3 py-2.5 text-center text-sm font-outfit text-gray-500 bg-gray-50 rounded-xl active:bg-gray-100 transition-colors"
                  >
                    Show Less
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Photo Modal */}
        {selectedPhoto && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center active:bg-white/20 transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
            <div
              className="max-w-[90vw] max-h-[80vh] bg-gray-900 rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-80 h-80 md:w-96 md:h-96 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                {selectedPhoto.type === "video" ? (
                  <Film size={48} className="text-gray-500" />
                ) : (
                  <ImageIcon size={48} className="text-gray-500" />
                )}
              </div>
              {selectedPhoto.caption && (
                <div className="p-4 bg-gray-900">
                  <p className="text-white text-sm">{selectedPhoto.caption}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Expandable Info Sections */}
        {/* Personal Info */}
        {hasPersonal && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-3">
            <button
              onClick={() => toggleSection("personal")}
              className="w-full flex items-center justify-between px-4 py-3.5 bg-gray-50/30 active:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <User size={18} className="text-brand" />
                <span className="font-syne text-gray-800 text-sm font-bold">
                  Personal Information
                </span>
              </div>
              <ChevronRight
                size={16}
                className={`text-gray-400 transition-transform duration-200 ${
                  expandedSections.personal ? "rotate-90" : ""
                }`}
              />
            </button>
            {expandedSections.personal && (
              <div className="p-4">
                {profileData.profession && (
                  <div className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0">
                    <div className="w-7 h-7 rounded-lg bg-brand/8 flex items-center justify-center shrink-0">
                      <Briefcase size={14} className="text-brand" />
                    </div>
                    <div className="flex-1">
                      <p className="font-outfit text-[10px] font-medium text-gray-400 uppercase">
                        Profession
                      </p>
                      <p className="font-outfit text-sm text-gray-700">
                        {profileData.profession}
                      </p>
                    </div>
                  </div>
                )}
                {profileData.birthDate && (
                  <div className="flex items-center gap-3 py-2.5 border-b border-gray-100">
                    <div className="w-7 h-7 rounded-lg bg-brand/8 flex items-center justify-center shrink-0">
                      <Calendar size={14} className="text-brand" />
                    </div>
                    <div className="flex-1">
                      <p className="font-outfit text-[10px] font-medium text-gray-400 uppercase">
                        Birth Date
                      </p>
                      <p className="font-outfit text-sm text-gray-700">
                        {formatDate(profileData.birthDate)}
                      </p>
                    </div>
                  </div>
                )}
                {profileData.location && (
                  <div className="flex items-center gap-3 py-2.5 border-b border-gray-100">
                    <div className="w-7 h-7 rounded-lg bg-brand/8 flex items-center justify-center shrink-0">
                      <MapPin size={14} className="text-brand" />
                    </div>
                    <div className="flex-1">
                      <p className="font-outfit text-[10px] font-medium text-gray-400 uppercase">
                        Location
                      </p>
                      <p className="font-outfit text-sm text-gray-700">
                        {profileData.location}
                      </p>
                    </div>
                  </div>
                )}
                {profileData.height && (
                  <div className="flex items-center gap-3 py-2.5 border-b border-gray-100">
                    <div className="w-7 h-7 rounded-lg bg-brand/8 flex items-center justify-center shrink-0">
                      <Ruler size={14} className="text-brand" />
                    </div>
                    <div className="flex-1">
                      <p className="font-outfit text-[10px] font-medium text-gray-400 uppercase">
                        Height
                      </p>
                      <p className="font-outfit text-sm text-gray-700">
                        {profileData.height} cm
                      </p>
                    </div>
                  </div>
                )}
                {profileData.weight && (
                  <div className="flex items-center gap-3 py-2.5 border-b border-gray-100">
                    <div className="w-7 h-7 rounded-lg bg-brand/8 flex items-center justify-center shrink-0">
                      <Weight size={14} className="text-brand" />
                    </div>
                    <div className="flex-1">
                      <p className="font-outfit text-[10px] font-medium text-gray-400 uppercase">
                        Weight
                      </p>
                      <p className="font-outfit text-sm text-gray-700">
                        {profileData.weight} kg
                      </p>
                    </div>
                  </div>
                )}
                {profileData.skinTone && (
                  <div className="flex items-center gap-3 py-2.5 border-b border-gray-100">
                    <div className="w-7 h-7 rounded-lg bg-brand/8 flex items-center justify-center shrink-0">
                      <Palette size={14} className="text-brand" />
                    </div>
                    <div className="flex-1">
                      <p className="font-outfit text-[10px] font-medium text-gray-400 uppercase">
                        Skin Tone
                      </p>
                      <p className="font-outfit text-sm text-gray-700">
                        {profileData.skinTone}
                      </p>
                    </div>
                  </div>
                )}
                {profileData.maritalStatus && (
                  <div className="flex items-center gap-3 py-2.5 border-b border-gray-100">
                    <div className="w-7 h-7 rounded-lg bg-brand/8 flex items-center justify-center shrink-0">
                      <Heart size={14} className="text-brand" />
                    </div>
                    <div className="flex-1">
                      <p className="font-outfit text-[10px] font-medium text-gray-400 uppercase">
                        Marital Status
                      </p>
                      <p className="font-outfit text-sm text-gray-700">
                        {profileData.maritalStatus}
                      </p>
                    </div>
                  </div>
                )}
                {profileData.economicalStatus && (
                  <div className="flex items-center gap-3 py-2.5 border-b border-gray-100">
                    <div className="w-7 h-7 rounded-lg bg-brand/8 flex items-center justify-center shrink-0">
                      <Briefcase size={14} className="text-brand" />
                    </div>
                    <div className="flex-1">
                      <p className="font-outfit text-[10px] font-medium text-gray-400 uppercase">
                        Economic Status
                      </p>
                      <p className="font-outfit text-sm text-gray-700">
                        {profileData.economicalStatus}
                      </p>
                    </div>
                  </div>
                )}
                {profileData.salaryRange && (
                  <div className="flex items-center gap-3 py-2.5">
                    <div className="w-7 h-7 rounded-lg bg-brand/8 flex items-center justify-center shrink-0">
                      <Briefcase size={14} className="text-brand" />
                    </div>
                    <div className="flex-1">
                      <p className="font-outfit text-[10px] font-medium text-gray-400 uppercase">
                        Salary Range
                      </p>
                      <p className="font-outfit text-sm text-gray-700">
                        {profileData.salaryRange}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Education */}
        {hasEducation && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-3">
            <button
              onClick={() => toggleSection("education")}
              className="w-full flex items-center justify-between px-4 py-3.5 bg-gray-50/30 active:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <GraduationCap size={18} className="text-brand" />
                <span className="font-syne text-gray-800 text-sm font-bold">
                  Education
                </span>
              </div>
              <ChevronRight
                size={16}
                className={`text-gray-400 transition-transform duration-200 ${
                  expandedSections.education ? "rotate-90" : ""
                }`}
              />
            </button>
            {expandedSections.education && (
              <div className="p-4">
                {profileData.uniName && (
                  <div className="flex items-center gap-3 py-2.5 border-b border-gray-100">
                    <div className="w-7 h-7 rounded-lg bg-brand/8 flex items-center justify-center shrink-0">
                      <GraduationCap size={14} className="text-brand" />
                    </div>
                    <div className="flex-1">
                      <p className="font-outfit text-[10px] font-medium text-gray-400 uppercase">
                        University
                      </p>
                      <p className="font-outfit text-sm text-gray-700">
                        {profileData.uniName}
                      </p>
                    </div>
                  </div>
                )}
                {profileData.educationType && (
                  <div className="flex items-center gap-3 py-2.5 border-b border-gray-100">
                    <div className="w-7 h-7 rounded-lg bg-brand/8 flex items-center justify-center shrink-0">
                      <BookOpen size={14} className="text-brand" />
                    </div>
                    <div className="flex-1">
                      <p className="font-outfit text-[10px] font-medium text-gray-400 uppercase">
                        Education Type
                      </p>
                      <p className="font-outfit text-sm text-gray-700">
                        {profileData.educationType}
                      </p>
                    </div>
                  </div>
                )}
                {profileData.department && (
                  <div className="flex items-center gap-3 py-2.5 border-b border-gray-100">
                    <div className="w-7 h-7 rounded-lg bg-brand/8 flex items-center justify-center shrink-0">
                      <BookOpen size={14} className="text-brand" />
                    </div>
                    <div className="flex-1">
                      <p className="font-outfit text-[10px] font-medium text-gray-400 uppercase">
                        Department
                      </p>
                      <p className="font-outfit text-sm text-gray-700">
                        {profileData.department}
                      </p>
                    </div>
                  </div>
                )}
                {profileData.institution && (
                  <div className="flex items-center gap-3 py-2.5 border-b border-gray-100">
                    <div className="w-7 h-7 rounded-lg bg-brand/8 flex items-center justify-center shrink-0">
                      <BookOpen size={14} className="text-brand" />
                    </div>
                    <div className="flex-1">
                      <p className="font-outfit text-[10px] font-medium text-gray-400 uppercase">
                        Institution
                      </p>
                      <p className="font-outfit text-sm text-gray-700">
                        {profileData.institution}
                      </p>
                    </div>
                  </div>
                )}
                {profileData.passingYear && (
                  <div className="flex items-center gap-3 py-2.5">
                    <div className="w-7 h-7 rounded-lg bg-brand/8 flex items-center justify-center shrink-0">
                      <Calendar size={14} className="text-brand" />
                    </div>
                    <div className="flex-1">
                      <p className="font-outfit text-[10px] font-medium text-gray-400 uppercase">
                        Passing Year
                      </p>
                      <p className="font-outfit text-sm text-gray-700">
                        {profileData.passingYear}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Religion */}
        {hasReligion && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-3">
            <button
              onClick={() => toggleSection("religion")}
              className="w-full flex items-center justify-between px-4 py-3.5 bg-gray-50/30 active:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Heart size={18} className="text-brand" />
                <span className="font-syne text-gray-800 text-sm font-bold">
                  Religious Information
                </span>
              </div>
              <ChevronRight
                size={16}
                className={`text-gray-400 transition-transform duration-200 ${
                  expandedSections.religion ? "rotate-90" : ""
                }`}
              />
            </button>
            {expandedSections.religion && (
              <div className="p-4">
                {profileData.religion && (
                  <div className="flex items-center gap-3 py-2.5 border-b border-gray-100">
                    <div className="w-7 h-7 rounded-lg bg-brand/8 flex items-center justify-center shrink-0">
                      <Heart size={14} className="text-brand" />
                    </div>
                    <div className="flex-1">
                      <p className="font-outfit text-[10px] font-medium text-gray-400 uppercase">
                        Faith
                      </p>
                      <p className="font-outfit text-sm text-gray-700">
                        {profileData.religion}
                      </p>
                    </div>
                  </div>
                )}
                {profileData.practiceLevel && (
                  <div className="flex items-center gap-3 py-2.5 border-b border-gray-100">
                    <div className="w-7 h-7 rounded-lg bg-brand/8 flex items-center justify-center shrink-0">
                      <Heart size={14} className="text-brand" />
                    </div>
                    <div className="flex-1">
                      <p className="font-outfit text-[10px] font-medium text-gray-400 uppercase">
                        Practice Level
                      </p>
                      <p className="font-outfit text-sm text-gray-700">
                        {profileData.practiceLevel}
                      </p>
                    </div>
                  </div>
                )}
                {profileData.sectOrCaste && (
                  <div className="flex items-center gap-3 py-2.5 border-b border-gray-100">
                    <div className="w-7 h-7 rounded-lg bg-brand/8 flex items-center justify-center shrink-0">
                      <Heart size={14} className="text-brand" />
                    </div>
                    <div className="flex-1">
                      <p className="font-outfit text-[10px] font-medium text-gray-400 uppercase">
                        Sect / Caste
                      </p>
                      <p className="font-outfit text-sm text-gray-700">
                        {profileData.sectOrCaste}
                      </p>
                    </div>
                  </div>
                )}
                {profileData.dailyLifeStyleSummary && (
                  <div className="flex items-center gap-3 py-2.5">
                    <div className="w-7 h-7 rounded-lg bg-brand/8 flex items-center justify-center shrink-0">
                      <Heart size={14} className="text-brand" />
                    </div>
                    <div className="flex-1">
                      <p className="font-outfit text-[10px] font-medium text-gray-400 uppercase">
                        Daily Lifestyle
                      </p>
                      <p className="font-outfit text-sm text-gray-700">
                        {profileData.dailyLifeStyleSummary}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Family */}
        {hasFamily && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-3">
            <button
              onClick={() => toggleSection("family")}
              className="w-full flex items-center justify-between px-4 py-3.5 bg-gray-50/30 active:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Users size={18} className="text-brand" />
                <span className="font-syne text-gray-800 text-sm font-bold">
                  Family Information
                </span>
              </div>
              <ChevronRight
                size={16}
                className={`text-gray-400 transition-transform duration-200 ${
                  expandedSections.family ? "rotate-90" : ""
                }`}
              />
            </button>
            {expandedSections.family && (
              <div className="p-4">
                {profileData.relation && (
                  <div className="flex items-center gap-3 py-2.5 border-b border-gray-100">
                    <div className="w-7 h-7 rounded-lg bg-brand/8 flex items-center justify-center shrink-0">
                      <User size={14} className="text-brand" />
                    </div>
                    <div className="flex-1">
                      <p className="font-outfit text-[10px] font-medium text-gray-400 uppercase">
                        Guardian Relation
                      </p>
                      <p className="font-outfit text-sm text-gray-700">
                        {profileData.relation}
                      </p>
                    </div>
                  </div>
                )}
                {profileData.fatherOccupation && (
                  <div className="flex items-center gap-3 py-2.5 border-b border-gray-100">
                    <div className="w-7 h-7 rounded-lg bg-brand/8 flex items-center justify-center shrink-0">
                      <Briefcase size={14} className="text-brand" />
                    </div>
                    <div className="flex-1">
                      <p className="font-outfit text-[10px] font-medium text-gray-400 uppercase">
                        Father&apos;s Occupation
                      </p>
                      <p className="font-outfit text-sm text-gray-700">
                        {profileData.fatherOccupation}
                      </p>
                    </div>
                  </div>
                )}
                {profileData.motherOccupation && (
                  <div className="flex items-center gap-3 py-2.5">
                    <div className="w-7 h-7 rounded-lg bg-brand/8 flex items-center justify-center shrink-0">
                      <Briefcase size={14} className="text-brand" />
                    </div>
                    <div className="flex-1">
                      <p className="font-outfit text-[10px] font-medium text-gray-400 uppercase">
                        Mother&apos;s Occupation
                      </p>
                      <p className="font-outfit text-sm text-gray-700">
                        {profileData.motherOccupation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Habits */}
        {hasHabits && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-3">
            <button
              onClick={() => toggleSection("habits")}
              className="w-full flex items-center justify-between px-4 py-3.5 bg-gray-50/30 active:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Heart size={18} className="text-brand" />
                <span className="font-syne text-gray-800 text-sm font-bold">
                  Habits & Interests
                </span>
              </div>
              <ChevronRight
                size={16}
                className={`text-gray-400 transition-transform duration-200 ${
                  expandedSections.habits ? "rotate-90" : ""
                }`}
              />
            </button>
            {expandedSections.habits && (
              <div className="p-4">
                <div className="flex flex-wrap gap-2">
                  {profileData.habits.map((h: string) => (
                    <span
                      key={h}
                      className="text-xs font-outfit text-brand bg-brand/10 border border-brand/20 rounded-full px-3 py-1.5"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Verification Badge */}
        {profileData.isVerified && (
          <div className="flex items-center justify-center gap-2 py-3 mt-2">
            <CheckCircle size={14} className="text-green-500" />
            <span className="font-outfit text-xs text-gray-500">
              Verified Profile
            </span>
          </div>
        )}
      </div>

      {/* Floating Action Button for Mobile */}
      {!isOwnProfile && (
        <div className="fixed bottom-20 right-4 md:hidden z-30">
          <Link
            href={getChatLink()}
            className={`no-underline flex items-center justify-center w-14 h-14 rounded-full
              transition-all duration-200 shadow-lg
              ${
                !isLoggedIn
                  ? "bg-white border border-gray-200 text-gray-500"
                  : !hasCurrentUserProfile
                    ? "bg-brand/10 border border-brand/30 text-brand"
                    : "bg-gradient-to-br from-brand to-accent text-white shadow-[0_8px_20px_rgba(232,84,122,0.4)]"
              } active:scale-95`}
            aria-label={getChatButtonText()}
          >
            <MessageCircle size={22} />
          </Link>
        </div>
      )}
    </div>
  );
}
