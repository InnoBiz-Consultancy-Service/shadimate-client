import { fetchProfileById } from "@/actions/profile/profile";
import { notFound } from "next/navigation";
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
} from "lucide-react";
import { Logo, GlassCard } from "@/components/ui";
import ProfileCompletionCard from "@/components/profile/ProfileCompletionCard";
import LikeButton from "@/components/like/LikeButton";
import { getLikeCount } from "@/actions/profile-like/like";

export const metadata = { title: "Profile" };

function getAge(birthDate?: string): number | null {
  if (!birthDate) return null;
  const diff = Date.now() - new Date(birthDate).getTime();
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
}

function geoName(val: unknown): string {
  if (!val) return "";
  if (typeof val === "object" && val !== null && "name" in val)
    return (val as { name: string }).name;
  return "";
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value?: string;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-white/5 last:border-0">
      <Icon size={15} className="text-brand/60 mt-0.5 shrink-0" />
      <div>
        <p className="font-outfit text-[10px] text-slate-500 uppercase tracking-wider">
          {label}
        </p>
        <p className="font-outfit text-sm text-slate-200">{value}</p>
      </div>
    </div>
  );
}

export default async function ProfileViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [res] = await Promise.all([fetchProfileById(id)]);

  if (!res.success || !res.data) notFound();

  const p = res.data;
  const targetUserId = p.userId?._id || p.user?._id || id;

  const [likeCountRes] = await Promise.all([
    getLikeCount(targetUserId).catch(() => ({
      success: false,
      data: undefined,
    })),
  ]);

  const likeCount =
    likeCountRes.success && likeCountRes.data
      ? (likeCountRes.data as { count: number }).count
      : 0;

  const name = p.userId?.name || p.user?.name || "Unknown";
  const gender = p.userId?.gender || p.user?.gender || p.gender;
  const age = getAge(p.birthDate);
  const divName = geoName(p.address?.divisionId) || p.division?.[0]?.name;
  const distName = geoName(p.address?.districtId) || p.district?.[0]?.name;
  const thanaName = geoName(p.address?.thanaId) || p.thana?.[0]?.name;
  const location = [thanaName, distName, divName].filter(Boolean).join(", ");
  const uniName =
    geoName(p.education?.graduation?.universityId) || p.university?.[0]?.name;

  return (
    <div className="font-outfit min-h-screen px-5 py-8 md:py-12 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/profiles"
          className="flex items-center gap-1.5 text-slate-400 text-sm hover:text-white no-underline transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </Link>
        <Logo size="small" />
      </div>

      <GlassCard className="p-6 mb-5">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-linear-to-br from-brand/30 to-accent/30 flex items-center justify-center shrink-0">
            <span className="font-syne text-white text-2xl font-bold">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="font-syne text-white text-xl font-extrabold tracking-tight">
                  {name}
                </h1>
                <p className="text-slate-400 text-sm mt-0.5">
                  {age ? `${age} years` : ""}
                  {gender ? ` · ${gender === "male" ? "Male" : "Female"}` : ""}
                  {p.personality ? ` · ${p.personality}` : ""}
                </p>
              </div>
              <div className="shrink-0">
                <LikeButton
                  targetUserId={targetUserId}
                  likeCount={likeCount}
                  showCount
                  size="md"
                />
              </div>
            </div>
          </div>
        </div>
        {p.aboutMe && (
          <p className="text-slate-300 text-sm leading-relaxed border-t border-white/5 pt-3">
            {p.aboutMe}
          </p>
        )}
      </GlassCard>

      {p.completionPercentage !== undefined && (
        <div className="mb-5">
          <ProfileCompletionCard
            percentage={p.completionPercentage}
            label={p.completionLabel || ""}
            missingFields={p.missingFields || []}
          />
        </div>
      )}

      <GlassCard className="p-5 mb-4">
        <h2 className="font-syne text-white text-base font-bold mb-3">
          Personal Information
        </h2>
        <InfoRow icon={Briefcase} label="Profession" value={p.profession} />
        <InfoRow
          icon={Calendar}
          label="Date of Birth"
          value={p.birthDate?.split("T")[0]}
        />
        <InfoRow
          icon={MapPin}
          label="Address"
          value={location || p.address?.details}
        />
        <InfoRow icon={Ruler} label="Height" value={p.height} />
        <InfoRow icon={Weight} label="Weight" value={p.weight} />
        <InfoRow icon={Palette} label="Skin Tone" value={p.skinTone} />
        <InfoRow icon={User} label="Marital Status" value={p.maritalStatus} />
        <InfoRow
          icon={Briefcase}
          label="Economic Status"
          value={p.economicalStatus}
        />
        <InfoRow icon={Briefcase} label="Salary Range" value={p.salaryRange} />
      </GlassCard>

      {(uniName || p.education?.graduation?.variety) && (
        <GlassCard className="p-5 mb-4">
          <h2 className="font-syne text-white text-base font-bold mb-3">
            Education
          </h2>
          <InfoRow icon={GraduationCap} label="University" value={uniName} />
          <InfoRow
            icon={BookOpen}
            label="Education Type"
            value={p.education?.graduation?.variety}
          />
          <InfoRow
            icon={BookOpen}
            label="Department"
            value={p.education?.graduation?.department}
          />
          <InfoRow
            icon={BookOpen}
            label="Institution"
            value={p.education?.graduation?.institution}
          />
          <InfoRow
            icon={Calendar}
            label="Passing Year"
            value={p.education?.graduation?.passingYear}
          />
        </GlassCard>
      )}

      {p.religion?.faith && (
        <GlassCard className="p-5 mb-4">
          <h2 className="font-syne text-white text-base font-bold mb-3">
            Religious Information
          </h2>
          <InfoRow icon={Heart} label="Religion" value={p.religion.faith} />
          <InfoRow
            icon={Heart}
            label="Religious Practice"
            value={p.religion.practiceLevel}
          />
          <InfoRow
            icon={Heart}
            label="Sect/Clan"
            value={p.religion.sectOrCaste}
          />
          <InfoRow
            icon={Heart}
            label="Daily Lifestyle"
            value={p.religion.dailyLifeStyleSummary}
          />
        </GlassCard>
      )}

      {(p.relation || p.fatherOccupation || p.motherOccupation) && (
        <GlassCard className="p-5 mb-4">
          <h2 className="font-syne text-white text-base font-bold mb-3">
            Family Information
          </h2>
          <InfoRow icon={User} label="Guardian Relation" value={p.relation} />
          <InfoRow
            icon={Briefcase}
            label="Father's Occupation"
            value={p.fatherOccupation}
          />
          <InfoRow
            icon={Briefcase}
            label="Mother's Occupation"
            value={p.motherOccupation}
          />
        </GlassCard>
      )}

      {p.habits && p.habits.length > 0 && (
        <GlassCard className="p-5 mb-4">
          <h2 className="font-syne text-white text-base font-bold mb-3">
            Habits & Hobbies
          </h2>
          <div className="flex flex-wrap gap-2">
            {p.habits.map((h) => (
              <span
                key={h}
                className="text-xs font-outfit font-medium text-brand bg-brand/10 border border-brand/20 rounded-xl px-3 py-1.5"
              >
                {h}
              </span>
            ))}
          </div>
        </GlassCard>
      )}

      <div className="h-8" />
    </div>
  );
}
