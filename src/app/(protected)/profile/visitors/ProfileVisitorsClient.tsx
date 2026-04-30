// "use client";

// import { useState, useEffect, useCallback } from "react";
// import {
//   Eye,
//   Lock,
//   ChevronLeft,
//   ChevronRight,
//   Crown,
//   User,
// } from "lucide-react";
// import Link from "next/link";
// import { getProfileVisitors } from "@/actions/profile-visit/profile-visit";
// import type { ProfileVisitor } from "@/types/profile-visit";

// /* ── Helpers ── */
// function timeAgo(dateStr: string): string {
//   const diff = Date.now() - new Date(dateStr).getTime();
//   const mins = Math.floor(diff / 60000);
//   if (mins < 1) return "just now";
//   if (mins < 60) return `${mins} minutes ago`;
//   const hrs = Math.floor(mins / 60);
//   if (hrs < 24) return `${hrs} hours ago`;
//   return `${Math.floor(hrs / 24)} days ago`;
// }

// /* ── Visitor Card ── */
// function VisitorCard({ visitor }: { visitor: ProfileVisitor }) {
//   return (
//     <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3 hover:border-brand/25 hover:shadow-md transition-all duration-200">
//       {/* Avatar */}
//       <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand/20 to-accent/20 flex items-center justify-center shrink-0">
//         <span className="font-syne text-gray-700 text-sm font-bold">
//           {visitor.name.charAt(0).toUpperCase()}
//         </span>
//       </div>

//       {/* Info */}
//       <div className="flex-1 min-w-0">
//         <p className="font-outfit text-sm font-semibold text-gray-800 truncate">
//           {visitor.name}
//         </p>
//         <p className="font-outfit text-[11px] text-gray-400 mt-0.5">
//           {timeAgo(visitor.visitedAt)}
//         </p>
//       </div>

//       {/* Visit count badge */}
//       <div className="flex items-center gap-2 shrink-0">
//         {visitor.visitCount > 1 && (
//           <span className="font-outfit text-[10px] font-semibold text-brand bg-brand/10 border border-brand/20 rounded-full px-2 py-0.5">
//             {visitor.visitCount}x
//           </span>
//         )}
//         <Eye size={14} className="text-gray-400" />
//       </div>
//     </div>
//   );
// }

// /* ── Locked UI for Free Users ── */
// function LockedVisitors({ visitCount }: { visitCount: number }) {
//   return (
//     <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
//       {/* Blurred preview */}
//       <div className="relative">
//         <div className="blur-sm pointer-events-none select-none space-y-px">
//           {["Fatima K.", "Rakibul I.", "Sumaiya A.", "Mehedi H."].map(
//             (name) => (
//               <div
//                 key={name}
//                 className="px-4 py-3 flex items-center gap-3 border-b border-gray-50"
//               >
//                 <div className="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
//                   <User size={14} className="text-brand/60" />
//                 </div>
//                 <div className="flex-1">
//                   <div className="h-3 w-24 bg-gray-200 rounded-full mb-1.5" />
//                   <div className="h-2.5 w-16 bg-gray-100 rounded-full" />
//                 </div>
//                 <div className="h-2.5 w-10 bg-gray-100 rounded-full" />
//               </div>
//             ),
//           )}
//         </div>

//         {/* Lock overlay */}
//         <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
//           <div className="w-12 h-12 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center mb-3">
//             <Lock size={20} className="text-brand" />
//           </div>
//           <p className="font-syne text-gray-800 text-sm font-bold mb-1">
//             {visitCount} {visitCount === 1 ? "person" : "people"} viewed your
//             profile
//           </p>
//           <p className="font-outfit text-gray-500 text-xs mb-4 text-center px-8">
//             Upgrade to Premium to see who visited your profile.
//           </p>
//           <Link
//             href="/subscription"
//             className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-outfit font-bold text-xs text-white bg-gradient-to-r from-brand to-accent shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 no-underline"
//           >
//             <Crown size={13} />
//             Upgrade to Premium
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ── Pagination ── */
// function Pagination({
//   page,
//   totalPages,
//   onPrev,
//   onNext,
// }: {
//   page: number;
//   totalPages: number;
//   onPrev: () => void;
//   onNext: () => void;
// }) {
//   if (totalPages <= 1) return null;
//   return (
//     <div className="flex items-center justify-center gap-4 mt-6">
//       <button
//         onClick={onPrev}
//         disabled={page === 1}
//         className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-outfit text-sm font-semibold text-gray-600 border border-gray-200 hover:border-brand/30 hover:text-brand disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
//       >
//         <ChevronLeft size={15} /> Previous
//       </button>
//       <span className="font-outfit text-sm text-gray-500">
//         {page} / {totalPages}
//       </span>
//       <button
//         onClick={onNext}
//         disabled={page === totalPages}
//         className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-outfit text-sm font-semibold text-gray-600 border border-gray-200 hover:border-brand/30 hover:text-brand disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
//       >
//         Next <ChevronRight size={15} />
//       </button>
//     </div>
//   );
// }

// /* ── Main Component ── */
// interface ProfileVisitorsClientProps {
//   isPremium: boolean;
//   visitCount: number;
// }

// export default function ProfileVisitorsClient({
//   isPremium,
//   visitCount,
// }: ProfileVisitorsClientProps) {
//   const [visitors, setVisitors] = useState<ProfileVisitor[]>([]);
//   const [total, setTotal] = useState(0);
//   const [totalPages, setTotalPages] = useState(1);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchVisitors = useCallback(async (p: number) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await getProfileVisitors(p, 20);
//       if (res.success && res.data) {
//         const d = res.data as {
//           data?: ProfileVisitor[];
//           meta?: { total: number; totalPages: number };
//         };
//         setVisitors(d.data ?? []);
//         setTotal(d.meta?.total ?? 0);
//         setTotalPages(d.meta?.totalPages ?? 1);
//       } else {
//         setError(res.message ?? "Failed to load visitors.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     if (!isPremium) return;
//     fetchVisitors(page);
//   }, [isPremium, page, fetchVisitors]);

//   return (
//     <div className="font-outfit min-h-screen px-4 py-8 md:py-12 max-w-2xl mx-auto">
//       {/* Header */}
//       <div className="flex items-center gap-3 mb-6">
//         <Link
//           href="/profile"
//           className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:text-brand hover:border-brand/30 transition-all duration-200 no-underline"
//         >
//           <ChevronLeft size={16} />
//         </Link>
//         <div>
//           <h1 className="font-syne text-gray-900 text-2xl font-extrabold tracking-tight">
//             Profile Visitors
//           </h1>
//           <p className="font-outfit text-gray-500 text-xs mt-0.5">
//             {visitCount} {visitCount === 1 ? "person" : "people"} viewed your
//             profile
//           </p>
//         </div>
//       </div>

//       {/* Free user — locked */}
//       {!isPremium && <LockedVisitors visitCount={visitCount} />}

//       {/* Premium user */}
//       {isPremium && (
//         <>
//           {loading && (
//             <div className="flex items-center justify-center py-20">
//               <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
//             </div>
//           )}

//           {!loading && error && (
//             <div className="bg-red-50/50 border border-red-200 rounded-2xl p-5 text-center">
//               <p className="font-outfit text-sm text-red-600">{error}</p>
//               <button
//                 onClick={() => fetchVisitors(page)}
//                 className="mt-3 font-outfit text-xs text-red-500 underline cursor-pointer hover:text-red-600"
//               >
//                 Try again
//               </button>
//             </div>
//           )}

//           {!loading && !error && visitors.length === 0 && (
//             <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
//               <div className="w-14 h-14 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center mx-auto mb-4">
//                 <Eye size={24} className="text-brand" />
//               </div>
//               <h2 className="font-syne text-gray-800 text-lg font-bold mb-2">
//                 No Visitors Yet
//               </h2>
//               <p className="font-outfit text-gray-500 text-sm max-w-xs mx-auto">
//                 When someone views your profile, they will appear here.
//               </p>
//             </div>
//           )}

//           {!loading && !error && visitors.length > 0 && (
//             <>
//               <p className="font-outfit text-xs text-gray-500 mb-3">
//                 Showing {visitors.length} of {total} visitors
//               </p>
//               <div className="space-y-3">
//                 {visitors.map((v) => (
//                   <VisitorCard key={v.userId} visitor={v} />
//                 ))}
//               </div>
//               <Pagination
//                 page={page}
//                 totalPages={totalPages}
//                 onPrev={() => setPage((p) => p - 1)}
//                 onNext={() => setPage((p) => p + 1)}
//               />
//             </>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import { useState } from "react";
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
  Camera,
  Eye,
  ThumbsUp,
  MessageCircle,
  MoreHorizontal,
  Share2,
  Settings,
  X,
} from "lucide-react";
import type { Profile } from "@/types";
import ProfileImageUploader, {
  LazyProfileImage,
} from "@/components/shared/ProfileImageUploader";
import { updateProfile } from "@/actions/profile/profile";

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

/* ── Types ── */
interface SocialStats {
  likes: number;
  views: number;
}

interface AlbumPhoto {
  id: string;
  url: string;
  thumbnail?: string;
  caption?: string;
  type: "image" | "video";
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
  children,
}: {
  title: string;
  icon: React.ElementType;
  empty?: boolean;
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
          href="/profile/edit"
          className="flex items-center gap-1 text-[11px] font-outfit font-medium text-brand/80 hover:text-brand transition-colors"
        >
          <Pencil size={10} />
          Edit
        </Link>
      </div>

      <div className="px-4 py-2">
        {empty ? (
          <Link
            href="/profile/edit"
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

// Photo Album Component - Mobile First
function PhotoAlbum({ photos }: { photos: AlbumPhoto[] }) {
  const [viewAll, setViewAll] = useState(false);
  const displayPhotos = viewAll ? photos : photos.slice(0, 6);

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
        <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center mb-2">
          <Camera size={22} className="text-brand/60" />
        </div>
        <p className="font-outfit text-gray-500 text-sm">No photos yet</p>
        <Link
          href="/profile/edit?tab=photos"
          className="mt-3 px-4 py-2 bg-brand/10 text-brand rounded-xl text-sm font-medium active:bg-brand/20 transition-colors"
        >
          Add Photos
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-1.5">
        {displayPhotos.map((photo, idx) => (
          <Link
            key={photo.id}
            href={`/profile/photo/${photo.id}`}
            className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100 active:opacity-90 transition-opacity"
          >
            <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
            <div className="w-full h-full bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              {photo.type === "video" ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-400 text-xs">Video</span>
                </div>
              ) : photo.url ? (
                <LazyProfileImage
                  src={photo.url}
                  alt={photo.caption || "Photo"}
                  className="w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <Camera size={20} className="text-gray-400" />
                </div>
              )}
            </div>
            {photo.caption && (
              <div className="absolute bottom-1 left-1 right-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-[10px] font-medium truncate px-1">
                  {photo.caption}
                </p>
              </div>
            )}
            {idx === 5 && photos.length > 6 && !viewAll && (
              <div
                className="absolute inset-0 bg-black/60 flex items-center justify-center z-20 rounded-lg cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  setViewAll(true);
                }}
              >
                <span className="text-white font-bold text-lg">
                  +{photos.length - 5}
                </span>
              </div>
            )}
          </Link>
        ))}
      </div>
      {photos.length > 6 && !viewAll && (
        <button
          onClick={() => setViewAll(true)}
          className="w-full mt-3 py-2 text-center text-sm font-outfit text-brand bg-brand/5 rounded-lg active:bg-brand/10 transition-colors"
        >
          View All {photos.length} Photos
        </button>
      )}
      {viewAll && photos.length > 6 && (
        <button
          onClick={() => setViewAll(false)}
          className="w-full mt-3 py-2 text-center text-sm font-outfit text-gray-500 bg-gray-50 rounded-lg active:bg-gray-100 transition-colors"
        >
          Show Less
        </button>
      )}
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

// Action Buttons Component - Mobile Optimized
function ProfileActionButtons() {
  return (
    <div className="flex gap-2 mb-3">
      <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-linear-to-r from-brand to-accent text-white font-outfit font-semibold text-sm active:scale-[0.98] transition-transform shadow-sm">
        <MessageCircle size={16} />
        Message
      </button>
      <button className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center active:bg-gray-50 transition-colors">
        <Share2 size={16} className="text-gray-600" />
      </button>
      <button className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center active:bg-gray-50 transition-colors">
        <MoreHorizontal size={16} className="text-gray-600" />
      </button>
    </div>
  );
}

// Bottom Navigation for Mobile
function MobileBottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-2 px-4 flex items-center justify-around md:hidden z-50">
      <Link
        href="/"
        className="flex flex-col items-center gap-0.5 text-gray-400 active:text-brand transition-colors"
      >
        <User size={20} />
        <span className="text-[10px] font-outfit">Profile</span>
      </Link>
      <Link
        href="/matches"
        className="flex flex-col items-center gap-0.5 text-gray-400 active:text-brand transition-colors"
      >
        <Heart size={20} />
        <span className="text-[10px] font-outfit">Matches</span>
      </Link>
      <Link
        href="/messages"
        className="flex flex-col items-center gap-0.5 text-gray-400 active:text-brand transition-colors"
      >
        <MessageCircle size={20} />
        <span className="text-[10px] font-outfit">Messages</span>
      </Link>
      <Link
        href="/settings"
        className="flex flex-col items-center gap-0.5 text-gray-400 active:text-brand transition-colors"
      >
        <Settings size={20} />
        <span className="text-[10px] font-outfit">Settings</span>
      </Link>
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
export default function ProfileViewClient({ profile, isPremium, visitCount }: { profile: Profile, isPremium: boolean, visitCount: number }) {
  const [showLikeModal, setShowLikeModal] = useState(false);
  const [showViewerModal, setShowViewerModal] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(
    profile.profileImage || "",
  );
  const [savingImage, setSavingImage] = useState(false);

  // Avatar upload করার পর server এ save করব
  const handleProfileImageUpload = async (url: string) => {
    setProfileImageUrl(url);
    setSavingImage(true);
    await updateProfile({ profileImage: url });
    setSavingImage(false);
  };

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

  const mockPhotos: AlbumPhoto[] = [
    { id: "1", url: "", type: "image", caption: "Summer vibes" },
    { id: "2", url: "", type: "image", caption: "Weekend getaway" },
    { id: "3", url: "", type: "video", caption: "My hobby" },
    { id: "4", url: "", type: "image", caption: "With friends" },
    { id: "5", url: "", type: "image", caption: "Travel memories" },
    { id: "6", url: "", type: "image", caption: "Celebration" },
    { id: "7", url: "", type: "image", caption: "Nature" },
  ];

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
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-6">
      {/* ── COVER + AVATAR HEADER ── */}
      <div className="relative">
        {/* Cover */}
        <div className="h-32 md:h-48 w-full relative overflow-hidden">
          <ProfileImageUploader
            currentImageUrl={null}
            name={name}
            onUploadSuccess={(url) => updateProfile({ coverImage: url })}
            size="cover"
            className="w-full h-full"
          />
          {/* Decorative blobs (shown when no cover) */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-brand/30 via-transparent to-accent/20" />
          <div className="absolute top-4 left-8 w-20 h-20 rounded-full bg-brand/20 blur-2xl pointer-events-none" />
          <div className="absolute bottom-2 right-12 w-28 h-28 rounded-full bg-accent/15 blur-3xl pointer-events-none" />
        </div>

        {/* Avatar + name */}
        <div className="px-4">
          <div className="flex items-end justify-between -mt-10 mb-3">
            <div className="relative">
              <ProfileImageUploader
                currentImageUrl={profileImageUrl || null}
                name={name}
                onUploadSuccess={handleProfileImageUpload}
                size="avatar"
              />
              {/* Saving indicator */}
              {savingImage && (
                <span className="absolute -bottom-5 left-0 right-0 text-center font-outfit text-[9px] text-brand font-semibold animate-pulse">
                  Saving...
                </span>
              )}
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
            <Link
              href="/profile/photos"
              className="text-xs font-outfit text-brand/80 hover:text-brand"
            >
              View All
            </Link>
          </div>
          <div className="p-3">
            <PhotoAlbum photos={mockPhotos} />
          </div>
        </div>

        {/* Info Sections - Collapsible? Can be added later */}
        <div className="space-y-3">
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
          <SectionCard title="Physical" icon={Ruler} empty={!hasPhysical}>
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
          <SectionCard title="Religion" icon={BookOpen} empty={!hasReligion}>
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
          <SectionCard title="Family" icon={Users} empty={!hasFamily}>
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
          <SectionCard title="Interests" icon={Sparkles} empty={!hasHabits}>
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
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

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
