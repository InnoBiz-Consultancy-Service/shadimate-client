"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useCloudinaryUpload } from "@/hooks/UseUploadImage";


interface Props {
  currentImageUrl: string | null;
  name: string;
  onUploadSuccess: (url: string) => void;
  size?: "avatar" | "cover";
  className?: string;
}

export default function ProfileImageUploader({
  currentImageUrl,
  name,
  onUploadSuccess,
  size = "avatar",
  className = "",
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { upload } = useCloudinaryUpload();

  // Cleanup blob URLs when component unmounts or preview changes
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Update preview when currentImageUrl changes from props
  useEffect(() => {
    if (currentImageUrl && !currentImageUrl.startsWith('blob:')) {
      setPreviewUrl(currentImageUrl);
    }
  }, [currentImageUrl]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setError(null);
    setUploading(true);

    // Create local preview
    const localPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(localPreviewUrl);

    try {
      // Upload to Cloudinary
      const result = await upload(file);
      
      if (result && result.url) {
        // Replace local blob URL with actual Cloudinary URL
        setPreviewUrl(result.url);
        onUploadSuccess(result.url);
      } else {
        // Upload failed, revert to original
        setPreviewUrl(currentImageUrl);
        setError('Failed to upload image. Please try again.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setPreviewUrl(currentImageUrl);
      setError('Something went wrong. Please try again.');
    } finally {
      setUploading(false);
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getSizeClasses = () => {
    if (size === "avatar") {
      return "w-20 h-20 md:w-24 md:h-24";
    }
    return "w-full h-full";
  };

  const getButtonClasses = () => {
    if (size === "avatar") {
      return "absolute bottom-0 right-0 w-7 h-7 rounded-full bg-brand text-white flex items-center justify-center shadow-lg hover:bg-brand/90 transition-colors";
    }
    return "absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors";
  };

  return (
    <div className={`relative ${getSizeClasses()} ${className}`}>
      {previewUrl ? (
        <div className="relative w-full h-full">
          {previewUrl.startsWith('blob:') ? (
            <img
              src={previewUrl}
              alt={name}
              className="w-full h-full object-cover rounded-full"
              onError={() => {
                setPreviewUrl(null);
                setError('Image failed to load');
              }}
            />
          ) : (
            <Image
              src={previewUrl}
              alt={name}
              fill
              className="object-cover rounded-full"
              sizes={size === "avatar" ? "96px" : "100vw"}
              onError={() => {
                setPreviewUrl(null);
                setError('Image failed to load');
              }}
            />
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
              <Loader2 className="animate-spin text-white" size={24} />
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-full rounded-full bg-gradient-to-br from-brand/20 to-accent/20 flex items-center justify-center">
          <span className="font-syne text-brand-dark text-2xl font-bold">
            {name.charAt(0).toUpperCase()}
          </span>
        </div>
      )}

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className={getButtonClasses()}
        type="button"
      >
        {uploading ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Camera size={14} />
        )}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && (
        <div className="absolute -bottom-8 left-0 right-0 text-center">
          <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded">
            {error}
          </span>
        </div>
      )}
    </div>
  );
}