import { Suspense } from "react";
import { fetchProfileById } from "@/actions/profile/profile";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getLikeCount } from "@/actions/profile-like/like";
import { getUserAlbum } from "@/actions/album/album";
import Loading from "@/app/loading";
import ProfileClient from "./ProfileClient";
import { getBlockStatus, getIgnoreStatus } from "@/actions/report-block-ignore";

// Helper functions
function geoName(val: unknown): string {
  if (!val) return "";
  if (typeof val === "object" && val !== null && "name" in val)
    return (val as { name: string }).name;
  return "";
}

function getAge(birthDate?: string): number | null {
  if (!birthDate) return null;
  const diff = Date.now() - new Date(birthDate).getTime();
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
}

async function getCurrentUserProfileStatus() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) return { hasProfile: false, token: null, isLoggedIn: false };

  try {
    const baseUrl = process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL;
    const res = await fetch(`${baseUrl}/profile/my`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      return { hasProfile: true, profile: data.data, token, isLoggedIn: true };
    }

    if (res.status === 404) {
      return { hasProfile: false, token, isLoggedIn: true };
    }

    return { hasProfile: false, token, isLoggedIn: true };
  } catch {
    return { hasProfile: false, token: null, isLoggedIn: false };
  }
}

export const metadata = { title: "Profile" };

async function ProfileContent({ id }: { id: string }) {
  const [res, currentUserProfileStatus] = await Promise.all([
    fetchProfileById(id),
    getCurrentUserProfileStatus(),
  ]);

  if (!res.success || !res.data) notFound();

  const p = res.data;
  const targetUserId = p.userId?._id || p.user?._id || id;

  const isLoggedIn = currentUserProfileStatus.isLoggedIn;
  const currentUserId =
    currentUserProfileStatus.profile?.userId?._id ||
    currentUserProfileStatus.profile?.userId;
  const isOwnProfile = isLoggedIn && currentUserId === targetUserId;

  // Fetch block/ignore status only if logged in and not own profile
  const [likeCountRes, albumRes, blockStatusRes, ignoreStatusRes] =
    await Promise.all([
      getLikeCount(targetUserId).catch(() => ({
        success: false,
        data: undefined,
      })),
      getUserAlbum(targetUserId).catch(() => ({
        success: false,
        data: undefined,
      })),
      isLoggedIn && !isOwnProfile
        ? getBlockStatus(targetUserId).catch(() => ({
            success: false,
            data: undefined,
          }))
        : Promise.resolve({ success: false, data: undefined }),
      isLoggedIn && !isOwnProfile
        ? getIgnoreStatus(targetUserId).catch(() => ({
            success: false,
            data: undefined,
          }))
        : Promise.resolve({ success: false, data: undefined }),
    ]);

  const likeCount =
    likeCountRes.success && likeCountRes.data
      ? (likeCountRes.data as { count: number }).count
      : 0;

  const albumPhotos =
    albumRes.success && albumRes.data?.photos ? albumRes.data.photos : [];

  const photos = albumPhotos.map((photo) => ({
    id: photo._id,
    url: photo.url,
    caption: photo.caption,
    type: "image" as const,
  }));

  // Block / Ignore initial states
  const blockData =
    blockStatusRes.success && blockStatusRes.data
      ? (blockStatusRes.data as {
          iBlockedThem: boolean;
          theyBlockedMe: boolean;
          isBlocked: boolean;
        })
      : { iBlockedThem: false, theyBlockedMe: false, isBlocked: false };

  const isIgnored =
    ignoreStatusRes.success && ignoreStatusRes.data
      ? (ignoreStatusRes.data as { isIgnored: boolean }).isIgnored
      : false;

  const name = p.userId?.name || p.user?.name || "Unknown";
  const gender = p.userId?.gender || p.user?.gender || p.gender;
  const age = getAge(p.birthDate);
  const divName = geoName(p.address?.divisionId) || p.division?.[0]?.name;
  const distName = geoName(p.address?.districtId) || p.district?.[0]?.name;
  const thanaName = geoName(p.address?.thanaId) || p.thana?.[0]?.name;
  const location = [thanaName, distName, divName].filter(Boolean).join(", ");
  const uniName =
    geoName(p.education?.graduation?.universityId) ||
    p.university?.[0]?.name ||
    "";

  const profileData = {
    id: targetUserId,
    name,
    gender,
    age,
    location,
    uniName,
    personality: p.personality,
    aboutMe: p.aboutMe,
    profession: p.profession,
    birthDate: p.birthDate,
    maritalStatus: p.maritalStatus,
    economicalStatus: p.economicalStatus,
    salaryRange: p.salaryRange,
    height: p.height,
    weight: p.weight,
    skinTone: p.skinTone,
    addressDetails: p.address?.details,
    educationType: p.education?.graduation?.variety,
    department: p.education?.graduation?.department,
    institution: p.education?.graduation?.institution,
    passingYear: p.education?.graduation?.passingYear,
    religion: p.religion?.faith,
    practiceLevel: p.religion?.practiceLevel,
    sectOrCaste: p.religion?.sectOrCaste,
    dailyLifeStyleSummary: p.religion?.dailyLifeStyleSummary,
    relation: p.relation,
    fatherOccupation: p.fatherOccupation,
    motherOccupation: p.motherOccupation,
    habits: p.habits || [],
    completionPercentage: p.completionPercentage,
    completionLabel: p.completionLabel,
    missingFields: p.missingFields || [],
    image: p.image
  };

  return (
    <ProfileClient
      profileData={profileData}
      likeCount={likeCount}
      viewCount={1234}
      mutualMatches={5}
      isOwnProfile={isOwnProfile}
      isLoggedIn={isLoggedIn}
      hasCurrentUserProfile={currentUserProfileStatus.hasProfile}
      photos={photos}
      // ↓ New props
      blockStatus={blockData}
      isIgnored={isIgnored}
    />
  );
}

export default async function ProfileViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<Loading />}>
      <ProfileContent id={id} />
    </Suspense>
  );
}
