"use client";

import { useState, useCallback } from "react";

export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  thumbnailUrl: string; // 200x200 crop
}

export interface UseCloudinaryUploadReturn {
  upload: (file: File) => Promise<UploadResult | null>;
  uploading: boolean;
  progress: number; // 0–100
  error: string | null;
  reset: () => void;
}

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
const UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "primehalf_profiles";

/**
 * useCloudinaryUpload
 *
 * Reusable hook — Cloudinary unsigned upload.
 * Required env vars:
 *   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
 *   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
 *
 * Usage:
 *   const { upload, uploading, progress, error } = useCloudinaryUpload();
 *   const result = await upload(file);
 *   if (result) console.log(result.url);
 */
export function useCloudinaryUpload(): UseCloudinaryUploadReturn {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setUploading(false);
    setProgress(0);
    setError(null);
  }, []);

  const upload = useCallback(
    async (file: File): Promise<UploadResult | null> => {
      if (!CLOUD_NAME) {
        setError(
          "Cloudinary cloud name not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME.",
        );
        return null;
      }
      if (!UPLOAD_PRESET) {
        setError(
          "Cloudinary upload preset not configured. Set NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.",
        );
        return null;
      }

      // Validate file
      const MAX_SIZE_MB = 10;
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`File too large. Maximum size is ${MAX_SIZE_MB}MB.`);
        return null;
      }
      const ALLOWED_TYPES = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError("Invalid file type. Please upload JPEG, PNG, WebP or GIF.");
        return null;
      }

      setUploading(true);
      setProgress(0);
      setError(null);

      return new Promise<UploadResult | null>((resolve) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);
        formData.append("folder", "primehalf/profiles");

        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            setProgress(pct);
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              const thumbnailUrl = data.secure_url.replace(
                "/upload/",
                "/upload/c_fill,w_200,h_200,g_face,q_auto,f_auto/",
              );
              const result: UploadResult = {
                url: data.secure_url,
                publicId: data.public_id,
                width: data.width,
                height: data.height,
                format: data.format,
                thumbnailUrl,
              };
              setProgress(100);
              setUploading(false);
              resolve(result);
            } catch {
              setError("Failed to parse upload response.");
              setUploading(false);
              resolve(null);
            }
          } else {
            try {
              const err = JSON.parse(xhr.responseText);
              setError(
                err.error?.message || "Upload failed. Please try again.",
              );
            } catch {
              setError("Upload failed. Please try again.");
            }
            setUploading(false);
            resolve(null);
          }
        });

        xhr.addEventListener("error", () => {
          setError("Network error. Please check your connection.");
          setUploading(false);
          resolve(null);
        });

        xhr.addEventListener("abort", () => {
          setError("Upload was cancelled.");
          setUploading(false);
          resolve(null);
        });

        xhr.open(
          "POST",
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        );
        xhr.send(formData);
      });
    },
    [],
  );

  return { upload, uploading, progress, error, reset };
}
