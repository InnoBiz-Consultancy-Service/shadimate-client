"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, X, ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import type { AlbumPhoto } from "@/actions/album/album";

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
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center active:bg-white/20 transition-colors z-10"
      >
        <X size={20} className="text-white" />
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 font-outfit text-white/60 text-sm">
        {idx + 1} / {photos.length}
      </div>

      {/* Image */}
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

      {/* Caption */}
      {current.caption && (
        <div className="mt-4 px-6 text-center">
          <p className="font-outfit text-white/80 text-sm">{current.caption}</p>
        </div>
      )}

      {/* Thumbnail strip */}
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
  photos: AlbumPhoto[];
  isOwnProfile?: boolean;
}

export default function AlbumGallery({
  photos,
  isOwnProfile = false,
}: AlbumGalleryProps) {
  const [viewAll, setViewAll] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const displayPhotos = viewAll ? photos : photos.slice(0, 6);

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

  return (
    <>
      <div className="grid grid-cols-3 gap-1.5">
        {displayPhotos.map((photo, idx) => (
          <button
            key={photo._id}
            onClick={() => setLightboxIdx(idx)}
            className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100 active:scale-95 transition-transform"
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />

            {/* Image */}
            {photo.url ? (
              <Image
                width={300}
                height={300}
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

            {/* Caption */}
            {photo.caption && (
              <div className="absolute bottom-1 left-1 right-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-[10px] font-medium truncate px-1">
                  {photo.caption}
                </p>
              </div>
            )}

            {/* +N overlay on 6th photo */}
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

      {/* Lightbox */}
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
