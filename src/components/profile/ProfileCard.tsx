import Link from "next/link";
import Image from "next/image";
import { User } from "lucide-react";
import type { Profile } from "@/types";

function getAge(birthDate?: string): number | null {
  if (!birthDate) return null;
  const diff = Date.now() - new Date(birthDate).getTime();
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
}

function countryFlag(country?: string): string {
  if (!country) return "";
  const map: Record<string, string> = {
    Bangladesh: "🇧🇩",
    India: "🇮🇳",
    Pakistan: "🇵🇰",
    USA: "🇺🇸",
    UK: "🇬🇧",
    Canada: "🇨🇦",
    Australia: "🇦🇺",
    Germany: "🇩🇪",
    France: "🇫🇷",
    UAE: "🇦🇪",
    Malaysia: "🇲🇾",
    Qatar: "🇶🇦",
    "Saudi Arabia": "🇸🇦",
  };
  return map[country] ?? "🌍";
}

function gradientForId(id: string): string {
  const gradients = [
    "from-rose-100 to-pink-200",
    "from-violet-100 to-purple-200",
    "from-sky-100 to-blue-200",
    "from-emerald-100 to-teal-200",
    "from-amber-100 to-orange-200",
    "from-fuchsia-100 to-pink-200",
    "from-indigo-100 to-violet-200",
    "from-cyan-100 to-sky-200",
  ];
  const idx = id.charCodeAt(id.length - 1) % gradients.length;
  return gradients[idx];
}

export default function ProfileCard({ profile }: { profile: Profile }) {
  const userData = Array.isArray(profile.user) ? profile.user[0] : profile.user;

  const name = userData?.name || profile.userId?.name || "Unknown";
  const profileImage = profile.image || null;
  const age = getAge(profile.birthDate);
  const profession = profile.profession || null;
  // All profiles are Bangladesh-based per the app context
  const hasLocation = !!(profile.division?.[0]?.name);
  const flag = hasLocation ? countryFlag("Bangladesh") : "";
  const gradient = gradientForId(profile._id);

  return (
    <Link
      href={`/profiles/${profile.userId}`}
      className="no-underline block group"
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md hover:border-brand/20 hover:scale-[1.015]">
        {/* Profile Image */}
        <div className={`relative bg-linear-to-br ${gradient} overflow-hidden`}>
          {profileImage ? (
            <div className="relative w-full aspect-3/4">
              <Image
                src={profileImage}
                alt={name}
                fill
                className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/40 to-transparent pointer-events-none" />
            </div>
          ) : (
            <div className="relative w-full aspect-3/4 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2 opacity-40">
                <User size={48} className="text-brand" />
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="px-3 py-2.5">
          <p className="font-outfit font-semibold text-gray-800 text-sm leading-tight truncate">
            {name}
          </p>
          <div className="flex items-center justify-between mt-0.5 gap-1">
            <p className="font-outfit text-[11px] text-gray-500 truncate flex-1">
              {profession ?? (age ? `${age} yrs` : "—")}
            </p>
            <div className="flex items-center gap-1 shrink-0">
              {age && profession && (
                <span className="font-outfit text-[11px] text-gray-400">{age}</span>
              )}
              {flag && (
                <span className="text-sm leading-none">{flag}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
