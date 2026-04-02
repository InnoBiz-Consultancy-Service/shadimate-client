"use server";

import { universalApi } from "@/actions/universal-api";
import type { Profile, ProfileListMeta, ProfileFilters } from "@/types";

interface SingleProfileResponse {
  success: boolean;
  data: Profile;
}

interface ProfileListResponse {
  success: boolean;
  data: Profile[];
  meta: ProfileListMeta;
}

export async function createProfile(
  data: Record<string, unknown>,
): Promise<{ success: boolean; message: string }> {
  const res = await universalApi<{ success: boolean; message: string }>({
    endpoint: "/profile",
    method: "POST",
    data,
  });
  if (!res.success)
    return {
      success: false,
      message: res.message || "Failed to create profile.",
    };
  return { success: true, message: "Profile created successfully!" };
}

export async function updateProfile(
  data: Record<string, unknown>,
): Promise<{ success: boolean; message: string }> {
  const res = await universalApi<{ success: boolean; message: string }>({
    endpoint: "/profile",
    method: "PATCH",
    data,
  });
  if (!res.success)
    return {
      success: false,
      message: res.message || "Failed to update profile.",
    };
  return { success: true, message: "Profile updated successfully!" };
}

export async function fetchMyProfile(): Promise<{
  success: boolean;
  data?: Profile;
  message?: string;
}> {
  const res = await universalApi<SingleProfileResponse>({
    endpoint: "/profile/my",
  });
  if (!res.success)
    return {
      success: false,
      message: res.message || "Failed to fetch profile.",
    };
  const raw = res.data as SingleProfileResponse;
  return { success: true, data: raw.data };
}

export async function fetchProfileById(id: string): Promise<{
  success: boolean;
  data?: Profile;
  message?: string;
}> {
  const res = await universalApi<SingleProfileResponse>({
    endpoint: `/profile/${id}`,
  });
  if (!res.success)
    return {
      success: false,
      message: res.message || "Failed to fetch profile.",
    };
  const raw = res.data as SingleProfileResponse;
  return { success: true, data: raw.data };
}

export async function fetchProfiles(filters: ProfileFilters = {}): Promise<{
  success: boolean;
  data?: Profile[];
  meta?: ProfileListMeta;
  message?: string;
}> {
  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);
  if (filters.gender) params.set("gender", filters.gender);
  if (filters.minAge) params.set("minAge", String(filters.minAge));
  if (filters.maxAge) params.set("maxAge", String(filters.maxAge));
  if (filters.division) params.set("division", filters.division);
  if (filters.district) params.set("district", filters.district);
  if (filters.thana) params.set("thana", filters.thana);
  if (filters.university) params.set("university", filters.university);
  if (filters.faith) params.set("faith", filters.faith);
  if (filters.practiceLevel) params.set("practiceLevel", filters.practiceLevel);
  if (filters.educationVariety)
    params.set("educationVariety", filters.educationVariety);
  if (filters.personality) params.set("personality", filters.personality);
  if (filters.habits?.length)
    filters.habits.forEach((h) => params.append("habits", h));
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.sort) params.set("sort", filters.sort);

  const query = params.toString();
  const endpoint = query ? `/profile?${query}` : "/profile";

  const res = await universalApi<ProfileListResponse>({ endpoint });
  if (!res.success)
    return {
      success: false,
      message: res.message || "Failed to fetch profiles.",
    };

  const raw = res.data as ProfileListResponse;
  return { success: true, data: raw.data, meta: raw.meta };
}
