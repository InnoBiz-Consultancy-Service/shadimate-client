"use client";

import { useState, useRef, useCallback } from "react";
import {
  Camera,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  ImageIcon,
  Loader2,
} from "lucide-react";
import { useCloudinaryUpload } from "@/hooks/UseUploadImage";
import Image from "next/image";

/* ── Lazy Image with blur placeholder (Facebook style) ── */
export function LazyProfileImage({
  src,
  alt,
  className = "",
  fallbackInitial = "?",
}: {
  src?: string | null;
  alt?: string;
  className?: string;
  fallbackInitial?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-linear-to-br from-brand/30 to-accent/20 ${className}`}
        aria-label={alt}
      >
        <span className="font-syne text-white font-extrabold text-2xl md:text-3xl select-none">
          {fallbackInitial.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Shimmer placeholder — visible while loading */}
      {!loaded && (
        <div className="absolute inset-0 bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
      )}
      {/* Actual image */}
      <Image
        width={300}
        height={300}
        src={src}
        alt={alt || "Profile photo"}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        draggable={false}
      />
    </div>
  );
}

/* ── Upload progress ring ── */
function ProgressRing({ progress }: { progress: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width="72" height="72" className="absolute inset-0 m-auto">
      <circle
        cx="36"
        cy="36"
        r={radius}
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="4"
        fill="none"
      />
      <circle
        cx="36"
        cy="36"
        r={radius}
        stroke="white"
        strokeWidth="4"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{
          transform: "rotate(-90deg)",
          transformOrigin: "36px 36px",
          transition: "stroke-dashoffset 0.3s ease",
        }}
      />
      <text
        x="36"
        y="40"
        textAnchor="middle"
        className="font-outfit"
        style={{ fill: "white", fontSize: "11px", fontWeight: 700 }}
      >
        {progress}%
      </text>
    </svg>
  );
}

/* ── Main Component ── */
interface ProfileImageUploaderProps {
  /** Current image URL (from profile) */
  currentImageUrl?: string | null;
  /** User's name initial for fallback */
  name?: string;
  /** Called when upload succeeds — pass the Cloudinary URL to parent */
  onUploadSuccess: (url: string) => void;
  /** Size variant */
  size?: "avatar" | "cover";
  /** Additional className for the container */
  className?: string;
}

export default function ProfileImageUploader({
  currentImageUrl,
  name = "U",
  onUploadSuccess,
  size = "avatar",
  className = "",
}: ProfileImageUploaderProps) {
  const { upload, uploading, progress, error, reset } = useCloudinaryUpload();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadDone, setUploadDone] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const effectiveUrl = previewUrl || currentImageUrl;
  const isAvatar = size === "avatar";

  const processFile = useCallback(
    async (file: File) => {
      // Show local preview immediately (Facebook UX)
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setUploadDone(false);
      reset();

      const result = await upload(file);
      URL.revokeObjectURL(objectUrl); // cleanup blob URL

      if (result) {
        setPreviewUrl(result.url); // replace with Cloudinary URL
        setUploadDone(true);
        onUploadSuccess(result.url);
        // Auto-clear success state after 3s
        setTimeout(() => setUploadDone(false), 3000);
      } else {
        // Revert preview on failure
        setPreviewUrl(null);
      }
    },
    [upload, reset, onUploadSuccess],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    // Reset input value so same file can be re-selected
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl(null);
    setUploadDone(false);
    reset();
    // Optionally call onUploadSuccess("") to clear on server too
  };

  /* ── AVATAR mode ── */
  if (isAvatar) {
    return (
      <div className={`relative ${className}`}>
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload profile photo"
          onClick={() => !uploading && fileInputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg
            cursor-pointer group transition-all duration-300
            ${dragOver ? "ring-4 ring-brand ring-offset-2 scale-105" : ""}
            ${uploading ? "cursor-wait" : ""}
          `}
        >
          {/* Photo / Fallback */}
          <LazyProfileImage
            src={effectiveUrl}
            alt="Profile"
            fallbackInitial={name}
            className="w-full h-full rounded-full"
          />

          {/* Overlay: idle hover */}
          {!uploading && !uploadDone && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center rounded-full">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center gap-1">
                <Camera size={20} className="text-white" />
                <span className="font-outfit text-white text-[10px] font-semibold">
                  {effectiveUrl ? "Change" : "Upload"}
                </span>
              </div>
            </div>
          )}

          {/* Overlay: uploading */}
          {uploading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-full">
              <ProgressRing progress={progress} />
            </div>
          )}

          {/* Overlay: success */}
          {uploadDone && (
            <div className="absolute inset-0 bg-green-500/70 flex items-center justify-center rounded-full animate-in fade-in duration-300">
              <CheckCircle size={28} className="text-white" />
            </div>
          )}

          {/* Online indicator spot */}
          <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white z-10" />
        </div>

        {/* Remove button — only if has custom image */}
        {effectiveUrl && !uploading && (
          <button
            onClick={clearImage}
            title="Remove photo"
            className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 active:scale-95 transition-all z-10"
          >
            <X size={11} />
          </button>
        )}

        {/* Camera badge — bottom edit button */}
        <button
          onClick={() => !uploading && fileInputRef.current?.click()}
          className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center hover:bg-brand/5 active:scale-95 transition-all z-10"
          title="Change photo"
          disabled={uploading}
        >
          <Camera size={14} className="text-gray-600" />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    );
  }

  /* ── COVER mode ── */
  return (
    <div className={`relative ${className}`}>
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload cover photo"
        onClick={() => !uploading && fileInputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative w-full h-full overflow-hidden cursor-pointer group transition-all duration-300
          ${dragOver ? "ring-4 ring-brand ring-offset-2" : ""}
          ${uploading ? "cursor-wait" : ""}
        `}
      >
        {effectiveUrl ? (
          <LazyProfileImage
            src={effectiveUrl}
            alt="Cover"
            className="w-full h-full"
          />
        ) : (
          /* Empty cover placeholder */
          <div className="w-full h-full bg-linear-to-br from-brand/20 via-accent/10 to-brand/5 flex items-center justify-center">
            <div className="flex flex-col items-center gap-1 text-brand/50">
              <ImageIcon size={24} />
              <span className="font-outfit text-xs font-medium">
                Add cover photo
              </span>
            </div>
          </div>
        )}

        {/* Hover overlay */}
        {!uploading && !uploadDone && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-end justify-end p-2">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-lg px-2.5 py-1.5 text-white">
                <Camera size={12} />
                <span className="font-outfit text-[11px] font-semibold">
                  {effectiveUrl ? "Edit cover" : "Add cover photo"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Upload progress overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2">
            <Loader2 size={24} className="text-white animate-spin" />
            <div className="w-32 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="font-outfit text-white text-xs font-medium">
              Uploading {progress}%...
            </span>
          </div>
        )}

        {/* Success overlay */}
        {uploadDone && (
          <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center">
            <div className="bg-green-500 rounded-full p-2">
              <CheckCircle size={20} className="text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Remove cover button */}
      {effectiveUrl && !uploading && (
        <button
          onClick={clearImage}
          title="Remove cover photo"
          className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white rounded-lg px-2 py-1 text-xs font-outfit hover:bg-black/80 active:scale-95 transition-all"
        >
          <X size={11} /> Remove
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}

/* ── Step 1 Image Upload Panel (for ProfileEditClient) ── */
export function StepImageUploadPanel({
  currentImageUrl,
  name,
  onUploadSuccess,
}: {
  currentImageUrl?: string | null;
  name?: string;
  onUploadSuccess: (url: string) => void;
}) {
  const [uploaded, setUploaded] = useState(false);

  const handleSuccess = (url: string) => {
    onUploadSuccess(url);
    setUploaded(true);
  };

  return (
    <div className="mb-6">
      <div
        className="relative rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-5 flex flex-col items-center gap-4 transition-colors duration-200 hover:border-brand/30 hover:bg-brand/2"
        style={{ background: uploaded ? "rgba(232,84,122,0.02)" : undefined }}
      >
        {/* Label */}
        <div className="text-center">
          <p className="font-outfit text-gray-400 text-[10px] font-semibold tracking-[0.12em] uppercase mb-0.5">
            Profile Photo
          </p>
          <p className="font-outfit text-gray-500 text-xs">
            {currentImageUrl
              ? "Tap your photo to change it"
              : "Add a photo so others can recognise you"}
          </p>
        </div>

        {/* Uploader */}
        <ProfileImageUploader
          currentImageUrl={currentImageUrl}
          name={name}
          onUploadSuccess={handleSuccess}
          size="avatar"
        />

        {/* Tips */}
        <div className="flex items-center gap-4 text-[10px] font-outfit text-gray-400">
          <span className="flex items-center gap-1">
            <Upload size={10} /> JPG, PNG, WebP, GIF
          </span>
          <span>•</span>
          <span>Max 10MB</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <CheckCircle size={10} className="text-green-500" /> Auto-saved
          </span>
        </div>

        {/* Drag hint */}
        <p className="font-outfit text-[10px] text-gray-300 -mt-2">
          or drag &amp; drop a photo anywhere on the circle
        </p>

        {/* Success banner */}
        {uploaded && (
          <div className="absolute bottom-2 left-2 right-2 bg-green-500 text-white rounded-xl px-3 py-2 flex items-center gap-2 text-xs font-outfit font-medium animate-in slide-in-from-bottom-2 duration-300">
            <CheckCircle size={13} /> Photo uploaded! It will be saved with your
            profile.
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Error Toast for upload errors ── */
export function UploadErrorBanner({
  error,
  onDismiss,
}: {
  error: string;
  onDismiss: () => void;
}) {
  return (
    <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm font-outfit text-red-600">
      <AlertCircle size={15} className="shrink-0 mt-0.5" />
      <span className="flex-1">{error}</span>
      <button
        onClick={onDismiss}
        className="text-red-400 hover:text-red-600 transition-colors"
      >
        <X size={13} />
      </button>
    </div>
  );
}
