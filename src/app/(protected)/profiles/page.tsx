import { fetchProfiles } from "@/actions/profile/profile";
import ProfilesClient from "./ProfilesClient";

export const metadata = { title: "Find Matches" };

export default async function ProfilesPage() {
  const res = await fetchProfiles({ page: 1, limit: 12, sort: "-createdAt" });

  return (
    <ProfilesClient
      initialProfiles={res.data || []}
      initialMeta={res.meta || { page: 1, limit: 12, total: 0, totalPages: 0 }}
    />
  );
}