import { fetchMyProfile } from "@/actions/profile/profile";
import ProfileEditClient from "./ProfileEditClient";

export const metadata = { title: "Edit Profile" };

export default async function ProfileEditPage() {
  const res = await fetchMyProfile();

  // Profile না থাকলেও edit page দেখাবে — empty form দিয়ে create করবে
  return (
    <ProfileEditClient
      profile={res.success && res.data ? res.data : undefined}
    />
  );
}
