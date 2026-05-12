import { fetchProfiles } from "@/actions/profile/profile";
import SearchClient from "./SearchClient";

export const metadata = { title: "Search – primehalf" };

export default async function SearchPage() {
  const res = await fetchProfiles({ page: 1, limit: 20, sort: "-createdAt" }).catch(() => ({
    success: false as const,
    data: undefined,
    meta: undefined,
  }));

  return (
    <SearchClient
      initialProfiles={res.success && res.data ? res.data : []}
      initialMeta={
        res.success && res.meta
          ? res.meta
          : { page: 1, limit: 20, total: 0, totalPages: 0 }
      }
    />
  );
}
