import { fetchMyProfile } from "@/actions/profile/profile";
import ProfileEditClient from "./ProfileEditClient";

export const metadata = { title: "Edit Profile" };

export default async function ProfileEditPage({ searchParams }: { searchParams: Promise<{ step?: string }> }) {
  const searchParamsData = await searchParams;
  const res = await fetchMyProfile();
  const step = searchParamsData.step ? Number(searchParamsData.step) : 1;
  return (
    <ProfileEditClient
      profile={res.success && res.data ? res.data : undefined}
      initialStep={step}
    />
  );
}
