import { fetchMyProfile } from "@/actions/profile/profile";
import { getMyAlbum } from "@/actions/album/album";
import ProfileViewClient from "./ProfileViewClient";
import Link from "next/link";

export const metadata = { title: "My Profile" };

export default async function ProfilePage() {
  const [profileRes, albumRes] = await Promise.all([
    fetchMyProfile(),
    getMyAlbum(),
  ]);

  if (!profileRes.success || !profileRes.data) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center mb-5">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="13" r="7" stroke="#E8547A" strokeWidth="2" />
            <path
              d="M4 32c0-7.732 6.268-14 14-14s14 6.268 14 14"
              stroke="#E8547A"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h1 className="font-syne text-white text-2xl font-extrabold mb-2">
          No Profile Yet
        </h1>
        <p className="font-outfit text-slate-400 text-sm mb-6 max-w-xs">
          Create your biodata to start getting matched with compatible partners.
        </p>
        <Link
          href="/profile/edit"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-outfit font-bold text-sm text-on-brand bg-linear-to-r from-brand to-accent shadow-(--shadow-brand-sm) hover:scale-[1.02] transition-transform duration-200 no-underline"
        >
          Create Profile
        </Link>
      </div>
    );
  }

  const initialPhotos = albumRes.success ? (albumRes.data?.photos ?? []) : [];

  return (
    <ProfileViewClient
      profile={profileRes.data}
      initialPhotos={initialPhotos}
    />
  );
}
