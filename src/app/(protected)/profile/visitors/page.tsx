import { cookies } from "next/headers";
import { getProfileVisitCount } from "@/actions/profile-visit/profile-visit";
import { fetchMyProfile } from "@/actions/profile/profile";
import ProfileViewClient from "./ProfileVisitorsClient";

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

  const [countRes, profileRes] = await Promise.all([
    getProfileVisitCount(),
    fetchMyProfile(),
  ]);

  const visitCount =
    countRes.success && countRes.data
      ? (countRes.data as { count: number }).count
      : 0;

  if (!profileRes.success || !profileRes.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-outfit text-gray-500">Failed to load profile.</p>
      </div>
    );
  }

  return (
    <ProfileViewClient
      profile={profileRes.data}
      isPremium={isPremium}
      visitCount={visitCount}
    />
  );
}
