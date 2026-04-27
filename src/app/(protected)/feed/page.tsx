import { fetchMyProfile, fetchProfiles } from "@/actions/profile/profile";
import FeedClient from "./FeedClient";

export const metadata = { title: "Feed – primehalf" };

export default async function FeedPage() {
  const [profileRes, profilesRes] = await Promise.all([
    fetchMyProfile().catch(() => ({
      success: false as const,
      data: undefined,
    })),
    fetchProfiles({ page: 1, limit: 12, sort: "-createdAt" }).catch(() => ({
      success: false as const,
      data: undefined,
      meta: undefined,
    })),
  ]);

  return (
    <FeedClient
      myProfile={profileRes.success && profileRes.data ? profileRes.data : null}
      initialProfiles={
        profilesRes.success && profilesRes.data ? profilesRes.data : []
      }
      initialMeta={
        profilesRes.success && profilesRes.meta
          ? profilesRes.meta
          : { page: 1, limit: 12, total: 0, totalPages: 0 }
      }
    />
  );
}
