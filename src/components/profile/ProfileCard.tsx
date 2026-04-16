import Link from "next/link";
import { MapPin, GraduationCap, Heart } from "lucide-react";
import type { Profile } from "@/types";
import LikeButton from "@/components/like/LikeButton";

function getAge(birthDate?: string): number | null {
  if (!birthDate) return null;
  const diff = Date.now() - new Date(birthDate).getTime();
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
}

export default function ProfileCard({ profile }: { profile: Profile }) {
  const name = profile.user?.name || profile.userId?.name || "Unknown";
  const age = getAge(profile.birthDate);
  const divisionName = profile.division?.[0]?.name;
  const districtName = profile.district?.[0]?.name;
  const uniName = profile.university?.[0]?.name;
  const location = [districtName, divisionName].filter(Boolean).join(", ");

  return (
    <Link
      href={`/profiles/${profile.userId}`}
      className="no-underline block group"
    >
      <div className="glass-card rounded-2xl p-5 transition-all duration-200 hover:border-brand/30 hover:shadow-(--shadow-brand-xs) group-hover:scale-[1.01]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-full bg-linear-to-br from-brand/30 to-accent/30 flex items-center justify-center shrink-0">
            <span className="font-syne text-white text-sm font-bold">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-outfit text-sm font-semibold text-slate-100 truncate">
              {name}
            </p>
            <p className="font-outfit text-[11px] text-slate-500">
              {age ? `${age} বছর` : ""}
              {profile.personality && ` · ${profile.personality}`}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 text-[12px] font-outfit text-slate-400">
          {location && (
            <span className="flex items-center gap-1.5">
              <MapPin size={12} className="text-brand/60 shrink-0" />
              <span className="truncate">{location}</span>
            </span>
          )}
          {uniName && (
            <span className="flex items-center gap-1.5">
              <GraduationCap size={12} className="text-brand/60 shrink-0" />
              <span className="truncate">{uniName}</span>
            </span>
          )}
        </div>

        {profile.habits && profile.habits.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {profile.habits.slice(0, 3).map((h) => (
              <span
                key={h}
                className="text-[10px] font-outfit font-medium text-slate-400 bg-white/5 border border-white/8 rounded-md px-2 py-0.5"
              >
                {h}
              </span>
            ))}
          </div>
        )}

        {/* Bottom bar — View Profile + Like Button */}
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
          <span className="font-outfit text-[11px] text-brand font-semibold flex items-center gap-1">
            <Heart size={11} className="fill-brand" /> View Profile
          </span>
          {/* Stop click propagating to the Link */}
          <div onClick={(e) => e.preventDefault()}>
            <LikeButton
              targetUserId={
                profile.userId?._id || profile.user?._id || profile._id
              }
              size="sm"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
