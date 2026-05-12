"use server";

import { universalApi } from "@/actions/universal-api";
import type { Profile, ProfileListMeta, ProfileFilters } from "@/types";

/* ── Create Profile (POST /profile) ── */
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

/* ── Update Profile (PATCH /profile) ── */
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

/* ── Get My Profile (GET /profile/my) ── */
export async function fetchMyProfile(): Promise<{
  success: boolean;
  data?: Profile;
  message?: string;
}> {
  const res = await universalApi<unknown>({ endpoint: "/profile/my" });
  if (!res.success)
    return {
      success: false,
      message: res.message || "Failed to fetch profile.",
    };

  const outer = res.data as Record<string, unknown> | undefined;
  let profile: Profile | undefined;

  if (outer?.data && typeof outer.data === "object") {
    const inner = outer.data as Record<string, unknown>;
    if (
      inner.data &&
      typeof inner.data === "object" &&
      "_id" in (inner.data as Record<string, unknown>)
    ) {
      profile = inner.data as Profile;
    } else if ("_id" in inner) {
      profile = inner as unknown as Profile;
    }
  }

  if (!profile && outer && "_id" in outer) {
    profile = outer as unknown as Profile;
  }

  return profile
    ? { success: true, data: profile }
    : { success: false, message: "Profile not found." };
}

/* ── Get Profile by ID (GET /profile/:id) ── */
export async function fetchProfileById(id: string): Promise<{
  success: boolean;
  data?: Profile;
  message?: string;
}> {
  const res = await universalApi<unknown>({ endpoint: `/profile/${id}` });
  if (!res.success)
    return {
      success: false,
      message: res.message || "Failed to fetch profile.",
    };

  const outer = res.data as Record<string, unknown> | undefined;
  let profile: Profile | undefined;

  if (outer?.data && typeof outer.data === "object") {
    const inner = outer.data as Record<string, unknown>;
    if (
      inner.data &&
      typeof inner.data === "object" &&
      "_id" in (inner.data as Record<string, unknown>)
    ) {
      profile = inner.data as Profile;
    } else if ("_id" in inner) {
      profile = inner as unknown as Profile;
    }
  }

  if (!profile && outer && "_id" in outer) {
    profile = outer as unknown as Profile;
  }

  return profile
    ? { success: true, data: profile }
    : { success: false, message: "Profile not found." };
}

/* ── Get Profiles List (GET /profile) with filters ── */
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

  const res = await universalApi<unknown>({ endpoint });
  if (!res.success)
    return {
      success: false,
      message: res.message || "Failed to fetch profiles.",
    };
  // Parse nested: res.data = { success, data: { data: [...], meta: {...} } }
  const outer = res.data as Record<string, unknown> | undefined;
  let profiles: Profile[] = [];
  let meta: ProfileListMeta = { page: 1, limit: 12, total: 0, totalPages: 0 };

  if (outer) {
    let container: Record<string, unknown> = outer;

    // Dig through nested "data" until we find the array
    if (
      outer.data &&
      typeof outer.data === "object" &&
      !Array.isArray(outer.data)
    ) {
      container = outer.data as Record<string, unknown>;
    }

    // container should now be { data: [...], meta: {...} }
    if (Array.isArray(container.data)) {
      profiles = container.data as Profile[];
    } else if (Array.isArray(container)) {
      profiles = container as unknown as Profile[];
    }

    if (container.meta && typeof container.meta === "object") {
      meta = container.meta as ProfileListMeta;
    }

    // Fallback: outer itself might have data as array
    if (!profiles.length && Array.isArray(outer.data)) {
      profiles = outer.data as Profile[];
    }
    if (outer.meta && typeof outer.meta === "object" && !meta.total) {
      meta = outer.meta as ProfileListMeta;
    }
  }

  return { success: true, data: profiles, meta };
}

/* ── Online Profiles ── */

export async function fetchOnlineProfiles(
  page = 1,
  limit = 10,
): Promise<{
  success: boolean;
  data?: Profile[];
  meta?: ProfileListMeta;
  message?: string;
}> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));

  const outer = await universalApi<unknown>({
    endpoint: `/profile/online?${params.toString()}`,
    method: "GET",
    requireAuth: true,
  });

  if (!outer.success) {
    return { success: false, message: outer.message };
  }

  let profiles: Profile[] = [];
  let meta: ProfileListMeta = { page: 1, limit, total: 0, totalPages: 0 };

  let container: Record<string, unknown> = outer as Record<string, unknown>;

  if (
    outer.data &&
    typeof outer.data === "object" &&
    !Array.isArray(outer.data)
  ) {
    container = outer.data as Record<string, unknown>;
  }

  if (Array.isArray(container.data)) {
    profiles = container.data as Profile[];
  } else if (Array.isArray(container)) {
    profiles = container as unknown as Profile[];
  }

  if (container.meta && typeof container.meta === "object") {
    meta = container.meta as ProfileListMeta;
  }

  if (!profiles.length && Array.isArray(outer.data)) {
    profiles = outer.data as Profile[];
  }
  if (outer.meta && typeof outer.meta === "object" && !meta.total) {
    meta = outer.meta as ProfileListMeta;
  }

  return { success: true, data: profiles, meta };
}
