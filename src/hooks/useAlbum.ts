// "use client";

// import { useState, useCallback } from "react";
// import { useCloudinaryUpload } from "@/hooks/UseUploadImage";
// import {
//   getMyAlbum,
//   getUserAlbum,
//   addPhotos,
//   updatePhoto,
//   deletePhoto,
//   type AlbumPhoto,
// } from "@/actions/album/album";

// export interface UseAlbumReturn {
//   photos: AlbumPhoto[];
//   loading: boolean;
//   uploading: boolean;
//   uploadProgress: number;
//   error: string | null;
//   fetchMyAlbum: () => Promise<void>;
//   fetchUserAlbum: (userId: string) => Promise<void>;
//   uploadAndAddPhoto: (file: File, caption?: string) => Promise<boolean>;
//   editPhoto: (
//     photoId: string,
//     payload: { url?: string; caption?: string },
//   ) => Promise<boolean>;
//   removePhoto: (photoId: string) => Promise<boolean>;
//   clearError: () => void;
// }

// export function useAlbum(initialPhotos?: AlbumPhoto[]): UseAlbumReturn {
//   const [photos, setPhotos] = useState<AlbumPhoto[]>(initialPhotos || []);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const { upload, uploading, progress: uploadProgress } = useCloudinaryUpload();

//   /* ── fetch my album ── */
//   const fetchMyAlbum = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await getMyAlbum();
//       if (res.success && res.data) {
//         setPhotos(res.data.photos || []);
//       } else {
//         setError(res.message || "Failed to load album.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   /* ── fetch another user's album ── */
//   const fetchUserAlbum = useCallback(async (userId: string) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await getUserAlbum(userId);
//       if (res.success && res.data) {
//         setPhotos(res.data.photos || []);
//       } else {
//         setError(res.message || "Failed to load album.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   /* ── upload to cloudinary → then add to album API ── */
//   const uploadAndAddPhoto = useCallback(
//     async (file: File, caption?: string): Promise<boolean> => {
//       setError(null);

//       if (photos.length >= 10) {
//         setError("Maximum 10 photos allowed per album.");
//         return false;
//       }

//       const uploaded = await upload(file);
//       if (!uploaded) {
//         setError("Image upload to Cloudinary failed.");
//         return false;
//       }

//       const res = await addPhotos([{ url: uploaded.url, caption }]);
//       if (!res.success) {
//         setError(res.message || "Failed to save photo.");
//         return false;
//       }

//       if (res.data?.photos) {
//         setPhotos(res.data.photos);
//       }
//       return true;
//     },
//     [upload, photos.length],
//   );

//   /* ── edit ── */
//   const editPhoto = useCallback(
//     async (
//       photoId: string,
//       payload: { url?: string; caption?: string },
//     ): Promise<boolean> => {
//       setError(null);
//       const res = await updatePhoto(photoId, payload);
//       if (!res.success) {
//         setError(res.message || "Failed to update photo.");
//         return false;
//       }
//       if (res.data?.photos) {
//         setPhotos(res.data.photos);
//       }
//       return true;
//     },
//     [],
//   );

//   /* ── delete ── */
//   const removePhoto = useCallback(async (photoId: string): Promise<boolean> => {
//     setError(null);
//     const res = await deletePhoto(photoId);
//     if (!res.success) {
//       setError(res.message || "Failed to delete photo.");
//       return false;
//     }
//     setPhotos((prev) => prev.filter((p) => p._id !== photoId));
//     return true;
//   }, []);

//   const clearError = useCallback(() => setError(null), []);

//   return {
//     photos,
//     loading,
//     uploading,
//     uploadProgress,
//     error,
//     fetchMyAlbum,
//     fetchUserAlbum,
//     uploadAndAddPhoto,
//     editPhoto,
//     removePhoto,
//     clearError,
//   };
// }

"use client";

import { useState, useCallback, useEffect } from "react";
import { useCloudinaryUpload } from "@/hooks/UseUploadImage";
import {
  getMyAlbum,
  addPhotos,
  updatePhoto,
  deletePhoto,
  type AlbumPhoto,
} from "@/actions/album/album";

export interface UseAlbumReturn {
  photos: AlbumPhoto[];
  loading: boolean;
  uploading: boolean;
  uploadProgress: number;
  error: string | null;
  fetchMyAlbum: () => Promise<void>;
  uploadAndAddPhoto: (file: File, caption?: string) => Promise<boolean>;
  editPhoto: (
    photoId: string,
    payload: { url?: string; caption?: string },
  ) => Promise<boolean>;
  removePhoto: (photoId: string) => Promise<boolean>;
  clearError: () => void;
}

export function useAlbum(initialPhotos?: AlbumPhoto[]): UseAlbumReturn {
  const [photos, setPhotos] = useState<AlbumPhoto[]>(initialPhotos || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // initialPhotos server থেকে আসে — mount এ একবার sync করো
  const [hydrated, setHydrated] = useState(false);

  const { upload, uploading, progress: uploadProgress } = useCloudinaryUpload();

  /* ── Mount এ server initialPhotos না থাকলে fetch করো ── */
  useEffect(() => {
    if (hydrated) return;
    setHydrated(true);

    // Server থেকে initialPhotos এসেছে — use it directly, no extra fetch needed
    if (initialPhotos && initialPhotos.length > 0) {
      setPhotos(initialPhotos);
      return;
    }

    // initialPhotos empty — server side fetch হয়নি বা album নেই, fresh fetch করো
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getMyAlbum();
        if (res.success && res.data) {
          setPhotos(res.data.photos || []);
        }
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── manual refetch ── */
  const fetchMyAlbum = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMyAlbum();
      if (res.success && res.data) {
        setPhotos(res.data.photos || []);
      } else {
        setError(res.message || "Failed to load album.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── upload to cloudinary → then add to album API ── */
  const uploadAndAddPhoto = useCallback(
    async (file: File, caption?: string): Promise<boolean> => {
      setError(null);

      // Max 10 photos check — functional update দিয়ে stale closure এড়াও
      const currentCount = await new Promise<number>((resolve) => {
        setPhotos((prev) => {
          resolve(prev.length);
          return prev;
        });
      });

      if (currentCount >= 10) {
        setError("Maximum 10 photos allowed per album.");
        return false;
      }

      // Upload to Cloudinary first
      const uploaded = await upload(file);
      if (!uploaded) {
        setError("Image upload to Cloudinary failed.");
        return false;
      }

      // Now call album API
      const res = await addPhotos([{ url: uploaded.url, caption }]);
      if (!res.success) {
        setError(res.message || "Failed to save photo.");
        return false;
      }

      if (res.data?.photos) {
        setPhotos(res.data.photos);
      }
      return true;
    },
    [upload],
  );

  /* ── edit ── */
  const editPhoto = useCallback(
    async (
      photoId: string,
      payload: { url?: string; caption?: string },
    ): Promise<boolean> => {
      setError(null);
      const res = await updatePhoto(photoId, payload);
      if (!res.success) {
        setError(res.message || "Failed to update photo.");
        return false;
      }
      if (res.data?.photos) {
        setPhotos(res.data.photos);
      }
      return true;
    },
    [],
  );

  /* ── delete ── */
  const removePhoto = useCallback(async (photoId: string): Promise<boolean> => {
    setError(null);
    const res = await deletePhoto(photoId);
    if (!res.success) {
      setError(res.message || "Failed to delete photo.");
      return false;
    }
    // Optimistically remove from state
    setPhotos((prev) => prev.filter((p) => p._id !== photoId));
    return true;
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    photos,
    loading,
    uploading,
    uploadProgress,
    error,
    fetchMyAlbum,
    uploadAndAddPhoto,
    editPhoto,
    removePhoto,
    clearError,
  };
}
