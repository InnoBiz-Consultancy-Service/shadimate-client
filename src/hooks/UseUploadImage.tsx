"use client";

import { useState, useCallback } from "react";

export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  thumbnailUrl: string;
}

export interface UseCloudinaryUploadReturn {
  upload: (file: File) => Promise<UploadResult | null>;
  uploading: boolean;
  progress: number;
  error: string | null;
  reset: () => void;
}

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
const UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "primehalf_profiles";

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
        setError("Cloudinary not configured");
        return null;
      }
      if (!UPLOAD_PRESET) {
        setError("Upload preset not configured");
        return null;
      }

      setUploading(true);
      setProgress(0);
      setError(null);

      return new Promise((resolve) => {
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
          if (xhr.status === 200) {
            try {
              const data = JSON.parse(xhr.responseText);
              const thumbnailUrl = data.secure_url.replace(
                "/upload/",
                "/upload/c_fill,w_200,h_200,g_face,q_auto,f_auto/"
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
              setError("Failed to parse response");
              setUploading(false);
              resolve(null);
            }
          } else {
            setError("Upload failed");
            setUploading(false);
            resolve(null);
          }
        });

        xhr.addEventListener("error", () => {
          setError("Network error");
          setUploading(false);
          resolve(null);
        });

        xhr.open(
          "POST",
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
        );
        xhr.send(formData);
      });
    },
    []
  );

  return { upload, uploading, progress, error, reset };
}