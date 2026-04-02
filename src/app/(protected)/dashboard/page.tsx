import { fetchMyProfile } from "@/actions/profile/profile";
import DashboardClient from "./DashboardClient";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const res = await fetchMyProfile();

  // Profile না থাকলেও dashboard দেখাবে, শুধু empty state দিবে
  return <DashboardClient profile={res.success && res.data ? res.data : null} />;
}