// "use server";

// import { universalApi } from "@/actions/universal-api";
// import type { DreamPartnerPreference, Profile } from "@/types";

// export async function saveDreamPartner(data: {
//   practiceLevel: string;
//   economicalStatus: string;
//   habits: string[];
// }): Promise<{
//   success: boolean;
//   message: string;
//   data?: DreamPartnerPreference;
// }> {
//   const res = await universalApi<unknown>({
//     endpoint: "/dream-partner",
//     method: "POST",
//     data,
//   });

//   if (!res.success) {
//     return {
//       success: false,
//       message: res.message || "Failed to save preference.",
//     };
//   }

//   const outer = res.data as Record<string, unknown> | undefined;
//   let preference: DreamPartnerPreference | undefined;

//   if (outer?.data && typeof outer.data === "object") {
//     preference = outer.data as DreamPartnerPreference;
//   }

//   return {
//     success: true,
//     message: (outer?.message as string) || "Dream Partner preference saved!",
//     data: preference,
//   };
// }

// export async function fetchDreamPartnerMatches(
//   page = 1,
//   limit = 10,
// ): Promise<{
//   success: boolean;
//   data?: Profile[];
//   message?: string;
// }> {
//   const res = await universalApi<unknown>({
//     endpoint: `/dream-partner?page=${page}&limit=${limit}`,
//   });

//   if (!res.success) {
//     return {
//       success: false,
//       message: res.message || "Failed to fetch matches.",
//     };
//   }

//   const outer = res.data as Record<string, unknown> | undefined;
//   let matches: Profile[] = [];

//   if (outer) {
//     if (Array.isArray(outer.data)) {
//       matches = outer.data as Profile[];
//     } else if (
//       outer.data &&
//       typeof outer.data === "object" &&
//       !Array.isArray(outer.data)
//     ) {
//       const inner = outer.data as Record<string, unknown>;
//       if (Array.isArray(inner.data)) {
//         matches = inner.data as Profile[];
//       }
//     }
//   }

//   return { success: true, data: matches };
// }

"use server";

import { universalApi } from "@/actions/universal-api";
import type { DreamPartnerPreference, Profile } from "@/types";

/* ── Types ── */

export interface DreamPartnerPayload {
  practiceLevel: string;
  economicalStatus: string;
  habits: string[];
  agePreference: { min: number; max: number };
  heightPreference: { min: string; max: string };
  locationPreference?: {
    divisionId: string;
    districtId?: string;
    thanaId?: string;
  };
}

export interface MatchMeta {
  page: number;
  limit: number;
  total: number;
}

export interface MatchesResult {
  success: boolean;
  data?: Profile[];
  meta?: MatchMeta;
  message?: string;
}

/* ── Save Dream Partner Preference ── */
// POST /api/v1/dream-partner
export async function saveDreamPartner(data: DreamPartnerPayload): Promise<{
  success: boolean;
  message: string;
  data?: DreamPartnerPreference;
}> {
  const res = await universalApi<unknown>({
    endpoint: "/dream-partner",
    method: "POST",
    data,
  });

  if (!res.success) {
    return {
      success: false,
      message: res.message || "Failed to save preference.",
    };
  }

  const outer = res.data as Record<string, unknown> | undefined;
  const preference = outer?.data as DreamPartnerPreference | undefined;

  return {
    success: true,
    message: (outer?.message as string) || "Dream Partner preference saved!",
    data: preference,
  };
}

/* ── Fetch Dream Partner Matches ── */
// GET /api/v1/dream-partner/matches?page=1&limit=10
export async function fetchDreamPartnerMatches(
  page = 1,
  limit = 10,
): Promise<MatchesResult> {
  const res = await universalApi<unknown>({
    endpoint: `/dream-partner/matches?page=${page}&limit=${limit}`,
  });

  if (!res.success) {
    return {
      success: false,
      message: res.message || "Failed to fetch matches.",
    };
  }

  const outer = res.data as Record<string, unknown> | undefined;

  // Response shape: { success, data: { data: [...], meta: {...} } }
  let matches: Profile[] = [];
  let meta: MatchMeta | undefined;

  if (
    outer?.data &&
    typeof outer.data === "object" &&
    !Array.isArray(outer.data)
  ) {
    const inner = outer.data as Record<string, unknown>;
    if (Array.isArray(inner.data)) {
      matches = inner.data as Profile[];
    }
    if (inner.meta && typeof inner.meta === "object") {
      meta = inner.meta as MatchMeta;
    }
  } else if (Array.isArray(outer?.data)) {
    matches = outer.data as Profile[];
  }

  return { success: true, data: matches, meta };
}
