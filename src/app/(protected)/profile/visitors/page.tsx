import { cookies } from "next/headers";
import { getProfileVisitCount } from "@/actions/profile-visit/profile-visit";
import ProfileVisitorsClient from "./ProfileVisitorsClient";

export const metadata = { title: "Profile Visitors" };

function isPremiumUser(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );
    const payload = JSON.parse(atob(padded)) as Record<string, unknown>;
    // ⚠️ Check what field your backend uses — update if needed
    return (
      payload["subscription"] === "premium" || payload["isPremium"] === true
    );
  } catch {
    return false;
  }
}

export default async function ProfileVisitorsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value ?? "";

  const isPremium = isPremiumUser(token);

  const countRes = await getProfileVisitCount();
  const visitCount =
    countRes.success && countRes.data
      ? (countRes.data as { count: number }).count
      : 0;

  return (
    <ProfileVisitorsClient isPremium={isPremium} visitCount={visitCount} />
  );
}
