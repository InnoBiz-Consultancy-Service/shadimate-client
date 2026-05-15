import {
  fetchMyProfile,
  fetchProfiles,
  fetchOnlineProfiles,
} from "@/actions/profile/profile";
import FeedClient from "./FeedClient";

export const metadata = { title: "Feed – primehalf" };

export default async function FeedPage() {
  const [profileRes, latestRes, onlineRes] = await Promise.all([
    fetchMyProfile().catch(() => ({
      success: false as const,
      data: undefined,
    })),
    fetchProfiles({ page: 1, limit: 12, sort: "-createdAt" }).catch(() => ({
      success: false as const,
      data: undefined,
      meta: undefined,
    })),
    fetchOnlineProfiles(1, 10).catch(() => ({
      success: false as const,
      data: undefined,
      meta: undefined,
    })),
  ]);

  return (
    <FeedClient
      myProfile={profileRes.success && profileRes.data ? profileRes.data : null}
      initialLatestProfiles={
        latestRes.success && latestRes.data ? latestRes.data : []
      }
      initialLatestMeta={
        latestRes.success && latestRes.meta
          ? latestRes.meta
          : { page: 1, limit: 12, total: 0, totalPages: 0 }
      }
      initialOnlineProfiles={
        onlineRes.success && onlineRes.data ? onlineRes.data : []
      }
      initialOnlineMeta={
        onlineRes.success && onlineRes.meta
          ? onlineRes.meta
          : { page: 1, limit: 10, total: 0, totalPages: 0 }
      }
    />
  );
}
