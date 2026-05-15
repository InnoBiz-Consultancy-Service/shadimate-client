"use server";

import { universalApi } from "@/actions/universal-api";

export interface AlbumPhoto {
  _id: string;
  url: string;
  caption?: string;
}

export interface AlbumData {
  userId: string;
  photos: AlbumPhoto[];
}

/* ── Get My Album (GET /album) ── */
export async function getMyAlbum(): Promise<{
  success: boolean;
  data?: AlbumData;
  message?: string;
}> {
  const res = await universalApi<unknown>({ endpoint: "/album" });
  if (!res.success)
    return { success: false, message: res.message || "Failed to fetch album." };

  const outer = res.data as Record<string, unknown> | undefined;
  const data = (outer?.data as AlbumData) || (outer as unknown as AlbumData);

  return { success: true, data };
}

/* ── Get User Album (GET /album/:userId) ── */
export async function getUserAlbum(userId: string): Promise<{
  success: boolean;
  data?: AlbumData;
  message?: string;
}> {
  console.log("this is user id", userId)
  const res = await universalApi<unknown>({
    endpoint: `/album/${userId}`,
    method: "GET",
    requireAuth: true,
  });
  if (!res.success)
    return {
      success: false,
      message: res.message || "Failed to fetch user album.",
    };

  const outer = res.data as Record<string, unknown> | undefined;
  const data = (outer?.data as AlbumData) || (outer as unknown as AlbumData);

  return { success: true, data };
}

/* ── Add Photo(s) (POST /album/add) ── */
export async function addPhotos(
  photos: Array<{ url: string; caption?: string }>,
): Promise<{
  success: boolean;
  data?: AlbumData;
  message?: string;
}> {
  const body =
    photos.length === 1
      ? { url: photos[0].url, caption: photos[0].caption }
      : { photos };

  const res = await universalApi<unknown>({
    endpoint: "/album/add",
    method: "POST",
    data: body,
    requireAuth: true,
  });

  if (!res.success)
    return {
      success: false,
      message: res.message || "Failed to add photo(s).",
    };

  const outer = res.data as Record<string, unknown> | undefined;
  const data = (outer?.data as AlbumData) || (outer as unknown as AlbumData);

  return { success: true, data };
}

/* ── Update Photo (PATCH /album/:photoId) ── */
export async function updatePhoto(
  photoId: string,
  payload: { url?: string; caption?: string },
): Promise<{
  success: boolean;
  data?: AlbumData;
  message?: string;
}> {
  const res = await universalApi<unknown>({
    endpoint: `/album/${photoId}`,
    method: "PATCH",
    data: payload,
    requireAuth: true,
  });

  if (!res.success)
    return {
      success: false,
      message: res.message || "Failed to update photo.",
    };

  const outer = res.data as Record<string, unknown> | undefined;
  const data = (outer?.data as AlbumData) || (outer as unknown as AlbumData);

  return { success: true, data };
}

/* ── Delete Photo (DELETE /album/delete/:photoId) ── */
export async function deletePhoto(photoId: string): Promise<{
  success: boolean;
  message?: string;
}> {
  const res = await universalApi<unknown>({
    endpoint: `/album/delete/${photoId}`,
    method: "DELETE",
    requireAuth: true,
  });

  if (!res.success)
    return {
      success: false,
      message: res.message || "Failed to delete photo.",
    };

  return { success: true, message: "Photo deleted successfully." };
}
