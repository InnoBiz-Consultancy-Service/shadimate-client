"use server";

import { universalApi } from "@/actions/universal-api";
import type {
  ProfileVisitCountResponse,
  ProfileVisitor,
} from "@/types/profile-visit";

/* ── GET /api/v1/profile-visits/count ── */
export async function getProfileVisitCount() {
  return universalApi<ProfileVisitCountResponse>({
    endpoint: "/profile-visits/count",
    method: "GET",
    requireAuth: true,
  });
}

/* ── GET /api/v1/profile-visits?page=&limit= (Premium only) ── */
export async function getProfileVisitors(page = 1, limit = 20) {
  return universalApi<{
    visitors: never[];
    data: ProfileVisitor[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }>({
    endpoint: `/profile-visits?page=${page}&limit=${limit}`,
    method: "GET",
    requireAuth: true,
  });
}
