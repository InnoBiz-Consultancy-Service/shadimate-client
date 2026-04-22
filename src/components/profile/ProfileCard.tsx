// import Link from "next/link";
// import { MapPin, GraduationCap, Heart } from "lucide-react";
// import type { Profile } from "@/types";
// import LikeButton from "@/components/like/LikeButton";

// function getAge(birthDate?: string): number | null {
//   if (!birthDate) return null;
//   const diff = Date.now() - new Date(birthDate).getTime();
//   return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
// }

// export default function ProfileCard({ profile }: { profile: Profile }) {
//   const userData = Array.isArray(profile.user) ? profile.user[0] : profile.user;

//   const name = userData?.name || profile.userId?.name || "Unknown";
//   const userId = userData?._id || profile.userId?._id;

//   const age = getAge(profile.birthDate);
//   const divisionName = profile.division?.[0]?.name;
//   const districtName = profile.district?.[0]?.name;
//   const uniName = profile.university?.[0]?.name;
//   const location = [districtName, divisionName].filter(Boolean).join(", ");

//   return (
//     <Link
//       href={`/profiles/${profile.userId}`}
//       className="no-underline block group"
//     >
//       <div className="bg-white rounded-2xl p-5 border border-slate-100 transition-all duration-200 hover:border-brand/20 hover:shadow-md group-hover:scale-[1.01] shadow-sm">
//         <div className="flex items-center gap-3 mb-3">
//           <div className="w-11 h-11 rounded-full bg-linear-to-br from-brand/20 to-accent/20 flex items-center justify-center shrink-0">
//             <span className="font-syne text-brand text-sm font-bold">
//               {name.charAt(0).toUpperCase()}
//             </span>
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className="font-outfit text-sm font-semibold text-slate-800 truncate">
//               {name}
//             </p>
//             <p className="font-outfit text-[11px] text-slate-400">
//               {age ? `${age} years old` : ""}
//               {profile.personality && ` · ${profile.personality}`}
//             </p>
//           </div>
//         </div>

//         <div className="flex flex-col gap-1.5 text-[12px] font-outfit text-slate-500">
//           {location && (
//             <span className="flex items-center gap-1.5">
//               <MapPin size={12} className="text-brand/60 shrink-0" />
//               <span className="truncate">{location}</span>
//             </span>
//           )}
//           {uniName && (
//             <span className="flex items-center gap-1.5">
//               <GraduationCap size={12} className="text-brand/60 shrink-0" />
//               <span className="truncate">{uniName}</span>
//             </span>
//           )}
//         </div>

//         {profile.habits && profile.habits.length > 0 && (
//           <div className="flex flex-wrap gap-1 mt-3">
//             {profile.habits.slice(0, 3).map((h) => (
//               <span
//                 key={h}
//                 className="text-[10px] font-outfit font-medium text-slate-500 bg-slate-100 border border-slate-200 rounded-md px-2 py-0.5"
//               >
//                 {h}
//               </span>
//             ))}
//           </div>
//         )}

//         {/* Bottom bar — View Profile + Like Button */}
//         <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
//           <span className="font-outfit text-[11px] text-brand font-semibold flex items-center gap-1">
//             <Heart size={11} className="fill-brand" /> View Profile
//           </span>
//           {/* Stop click propagating to the Link */}
//           <div onClick={(e) => e.preventDefault()}>
//             {userId && (
//               <LikeButton
//                 targetUserId={userId}
//                 size="sm"
//                 showCount={true}
//                 initialLiked={profile.isLiked || false}
//                 likeCount={profile.likeCount || 0}
//               />
//             )}
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// }
import Link from "next/link";
import Image from "next/image";
import { MapPin, GraduationCap, Heart, User } from "lucide-react";
import type { Profile } from "@/types";
import LikeButton from "@/components/like/LikeButton";

function getAge(birthDate?: string): number | null {
  if (!birthDate) return null;
  const diff = Date.now() - new Date(birthDate).getTime();
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
}

export default function ProfileCard({ profile }: { profile: Profile }) {
  const userData = Array.isArray(profile.user) ? profile.user[0] : profile.user;

  const name = userData?.name || profile.userId?.name || "Unknown";
  const userId = userData?._id || profile.userId?._id;
  const profileImage =
    userData?.profileImage || profile.userId?.profileImage || null;

  const age = getAge(profile.birthDate);
  const divisionName = profile.division?.[0]?.name;
  const districtName = profile.district?.[0]?.name;
  const uniName = profile.university?.[0]?.name;
  const location = [districtName, divisionName].filter(Boolean).join(", ");

  return (
    <Link
      href={`/profiles/${profile.userId}`}
      className="no-underline block group h-full"
    >
      <div className="bg-white rounded-2xl border border-gray-100 transition-all duration-200 hover:border-brand/30 hover:shadow-md group-hover:scale-[1.01] shadow-sm h-full flex flex-col overflow-hidden">
        {/* Top Section - Profile Image Area (Cover Style) */}
        <div className="relative bg-linear-to-br from-brand/5 to-accent/5 pt-8 pb-6 flex items-center justify-center">
          {profileImage ? (
            <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <Image
                src={profileImage}
                alt={name}
                fill
                className="object-cover object-center"
                sizes="112px"
              />
            </div>
          ) : (
            <div className="w-28 h-28 rounded-full bg-white/90 border-4 border-white shadow-lg flex items-center justify-center">
              <User size={44} className="text-brand/50" />
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-5 pt-3 flex flex-col flex-1">
          {/* Name & Details */}
          <div className="text-center mb-3">
            <p className="font-outfit text-lg font-semibold text-gray-800">
              {name}
            </p>
            <p className="font-outfit text-xs text-gray-500">
              {age ? `${age} years old` : ""}
              {profile.personality && ` · ${profile.personality}`}
            </p>
          </div>

          {/* Location & Education */}
          <div className="flex flex-col gap-1.5 text-[12px] font-outfit text-gray-600 shrink-0 mb-3">
            {location && (
              <span className="flex items-center gap-1.5 min-h-5">
                <MapPin size={12} className="text-brand shrink-0 mt-0.5" />
                <span className="truncate line-clamp-1">{location}</span>
              </span>
            )}
            {uniName && (
              <span className="flex items-center gap-1.5 min-h-5">
                <GraduationCap
                  size={12}
                  className="text-brand shrink-0 mt-0.5"
                />
                <span className="truncate line-clamp-1">{uniName}</span>
              </span>
            )}
          </div>

          {/* Habits */}
          <div className="min-h-13 mb-3">
            {profile.habits && profile.habits.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {profile.habits.slice(0, 3).map((h) => (
                  <span
                    key={h}
                    className="text-[10px] font-outfit font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md px-2 py-0.5"
                  >
                    {h}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Bottom bar */}
          <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between shrink-0">
            <span className="font-outfit text-[11px] text-brand font-semibold flex items-center gap-1">
              <Heart size={11} className="fill-brand/80" /> View Profile
            </span>
            <div onClick={(e) => e.preventDefault()}>
              {userId && (
                <LikeButton
                  targetUserId={userId}
                  size="sm"
                  showCount={true}
                  initialLiked={profile.isLiked || false}
                  likeCount={profile.likeCount || 0}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
