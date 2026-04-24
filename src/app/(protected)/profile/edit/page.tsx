import { fetchMyProfile } from "@/actions/profile/profile";
import ProfileEditClient from "./ProfileEditClient";

export const metadata = { title: "Edit Profile" };

export default async function ProfileEditPage() {
  const res = await fetchMyProfile();
  return (
    <ProfileEditClient
      profile={res.success && res.data ? res.data : undefined}
    />
  );
}
