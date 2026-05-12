"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Camera,
  X,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  Lock,
  Sparkles,
} from "lucide-react";
import type { AlbumPhoto } from "@/actions/album/album";
import Link from "next/link";

/* ── Cookie helper ── */
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

/* ── JWT decode (client-side only, no verification) ── */
function decodeJWT(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(
      base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "="),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/* ── Premium check — subscription: "premium" হলে true ── */
function checkIsPremium(): boolean {
  const token = getCookie("accessToken");
  if (!token) return false;
  const payload = decodeJWT(token);
  if (!payload) return false;
  return payload.subscription === "premium";
}

/* ──────────────────────────────────────────
   Non-premium blur grid
   Backend photos পাঠায় না free users দের,
   তাই hardcoded 6টা mock blurred card দেখাই
────────────────────────────────────────── */
const MOCK_GRADIENTS = [
  "from-rose-300 via-pink-200 to-purple-300",
  "from-sky-300 via-blue-200 to-indigo-300",
  "from-amber-300 via-orange-200 to-red-300",
  "from-emerald-300 via-teal-200 to-cyan-300",
  "from-violet-300 via-purple-200 to-fuchsia-300",
  "from-lime-300 via-green-200 to-teal-300",
];

function BlurredPhotoCard({ index }: { index: number }) {
  const gradient = MOCK_GRADIENTS[index % MOCK_GRADIENTS.length];
  return (
    <div className="relative aspect-square rounded-lg overflow-hidden select-none">
      {/* Fake content — silhouette যেন real photo মনে হয় */}
      <div className={`absolute inset-0 bg-linear-to-br ${gradient}`}>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-white/25" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-8 h-10 bg-white/20 rounded-t-full" />
        <div className="absolute top-4 left-3 w-14 h-2 rounded-full bg-white/20" />
        <div className="absolute top-8 left-3 w-9 h-1.5 rounded-full bg-white/15" />
      </div>

      {/* Strong blur */}
      <div className="absolute inset-0 backdrop-blur-xl bg-white/10" />

      {/* Lock */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-9 h-9 rounded-full bg-black/30 border border-white/30 flex items-center justify-center">
          <Lock size={15} className="text-white" />
        </div>
      </div>
    </div>
  );
}

/* ── Premium Banner ── */
function PremiumBanner() {
  return (
    <div className="mt-3 rounded-xl border border-amber-200 bg-linear-to-r from-amber-50 to-orange-50 px-4 py-3 flex items-center gap-3">
      <div className="shrink-0 w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
        <Sparkles size={16} className="text-amber-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-outfit text-sm font-semibold text-amber-800">
          Premium Members Only
        </p>
        <p className="font-outfit text-xs text-amber-600 mt-0.5">
          Upgrade to unlock this member&apos;s photos
        </p>
      </div>
      <Link href={"/subscription"}>
        <button className="shrink-0 cursor-pointer px-3 py-1.5 rounded-lg bg-amber-500 text-white text-xs font-outfit font-semibold active:bg-amber-600 transition-colors">
          Upgrade
        </button>
      </Link>
    </div>
  );
}

/* ── Lightbox ── */
function Lightbox({
  photos,
  startIndex,
  onClose,
}: {
  photos: AlbumPhoto[];
  startIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIndex);
  const current = photos[idx];

  const prev = () => setIdx((i) => (i > 0 ? i - 1 : photos.length - 1));
  const next = () => setIdx((i) => (i < photos.length - 1 ? i + 1 : 0));

  return (
    <div
      className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center active:bg-white/20 transition-colors z-10"
      >
        <X size={20} className="text-white" />
      </button>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 font-outfit text-white/60 text-sm">
        {idx + 1} / {photos.length}
      </div>

      <div
        className="relative max-w-[90vw] max-h-[75vh] w-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {photos.length > 1 && (
          <button
            onClick={prev}
            className="absolute left-2 z-10 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center active:bg-white/20"
          >
            <ChevronLeft size={20} className="text-white" />
          </button>
        )}

        <div className="relative w-[75vw] h-[65vh] rounded-xl overflow-hidden bg-gray-900">
          {current.url ? (
            <Image
              src={current.url}
              alt={current.caption || "Photo"}
              fill
              className="object-contain"
              sizes="75vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon size={48} className="text-gray-600" />
            </div>
          )}
        </div>

        {photos.length > 1 && (
          <button
            onClick={next}
            className="absolute right-2 z-10 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center active:bg-white/20"
          >
            <ChevronRight size={20} className="text-white" />
          </button>
        )}
      </div>

      {current.caption && (
        <div className="mt-4 px-6 text-center">
          <p className="font-outfit text-white/80 text-sm">{current.caption}</p>
        </div>
      )}

      {photos.length > 1 && (
        <div className="flex gap-2 mt-5 px-4 overflow-x-auto max-w-[90vw] pb-1">
          {photos.map((p, i) => (
            <button
              key={p._id}
              onClick={(e) => {
                e.stopPropagation();
                setIdx(i);
              }}
              className={`shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                i === idx ? "border-brand scale-110" : "border-white/20"
              }`}
            >
              {p.url ? (
                <Image
                  src={p.url}
                  alt=""
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <ImageIcon size={14} className="text-gray-500" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main AlbumGallery ── */
interface AlbumGalleryProps {
  photos: AlbumPhoto[]; // free user হলে backend [] পাঠাবে
  isOwnProfile?: boolean;
}

export default function AlbumGallery({
  photos,
  isOwnProfile = false,
}: AlbumGalleryProps) {
  const [viewAll, setViewAll] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [isPremium, setIsPremium] = useState<boolean | null>(null);

  useEffect(() => {
    setIsPremium(checkIsPremium());
  }, []);

  // Loading skeleton
  if (isPremium === null) {
    return (
      <div className="grid grid-cols-3 gap-1.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-lg bg-gray-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  // Non-premium: backend photos নেই, mock blur দেখাও
  if (!isPremium) {
    return (
      <>
        <div className="grid grid-cols-3 gap-1.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <BlurredPhotoCard key={i} index={i} />
          ))}
        </div>
        <PremiumBanner />
      </>
    );
  }

  // Premium + কোনো photo নেই
  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
        <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center mb-2">
          <Camera size={22} className="text-brand/60" />
        </div>
        <p className="font-outfit text-gray-500 text-sm">No photos yet</p>
        {isOwnProfile && (
          <p className="font-outfit text-gray-400 text-xs mt-1">
            Go to Edit Profile to add photos
          </p>
        )}
      </div>
    );
  }

  // Premium: normal gallery
  const displayPhotos = viewAll ? photos : photos.slice(0, 6);

  return (
    <>
      <div className="grid grid-cols-3 gap-1.5">
        {displayPhotos.map((photo, idx) => (
          <button
            key={photo._id}
            onClick={() => setLightboxIdx(idx)}
            className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100 active:scale-95 transition-transform"
          >
            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />

            {photo.url ? (
              <Image
                src={photo.url}
                alt={photo.caption || "Album photo"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 33vw, 200px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <ImageIcon size={24} className="text-gray-400" />
              </div>
            )}

            {photo.caption && (
              <div className="absolute bottom-1 left-1 right-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-[10px] font-medium truncate px-1">
                  {photo.caption}
                </p>
              </div>
            )}

            {idx === 5 && photos.length > 6 && !viewAll && (
              <div
                className="absolute inset-0 bg-black/60 flex items-center justify-center z-20 rounded-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  setViewAll(true);
                }}
              >
                <span className="text-white font-bold text-lg">
                  +{photos.length - 5}
                </span>
              </div>
            )}
          </button>
        ))}
      </div>

      {photos.length > 6 && !viewAll && (
        <button
          onClick={() => setViewAll(true)}
          className="w-full mt-3 py-2 text-center text-sm font-outfit text-brand bg-brand/5 rounded-lg active:bg-brand/10 transition-colors"
        >
          View All {photos.length} Photos
        </button>
      )}
      {viewAll && photos.length > 6 && (
        <button
          onClick={() => setViewAll(false)}
          className="w-full mt-3 py-2 text-center text-sm font-outfit text-gray-500 bg-gray-50 rounded-lg active:bg-gray-100 transition-colors"
        >
          Show Less
        </button>
      )}

      {lightboxIdx !== null && (
        <Lightbox
          photos={photos}
          startIndex={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </>
  );
}
