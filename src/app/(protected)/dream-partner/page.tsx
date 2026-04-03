import { fetchDreamPartnerMatches } from "@/actions/dream-partner/dream-partner";
import DreamPartnerClient from "./DreamPartnerClient";

export const metadata = { title: "Dream Partner – ShadiMate" };

export default async function DreamPartnerPage() {
  const res = await fetchDreamPartnerMatches().catch(() => ({
    success: false as const,
    data: undefined,
  }));

  return (
    <DreamPartnerClient
      initialMatches={res.success && res.data ? res.data : []}
      hasExistingPreference={res.success && !!res.data && res.data.length > 0}
    />
  );
}
