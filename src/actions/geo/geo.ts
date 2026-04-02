"use server";

import { universalApi } from "@/actions/universal-api";
import type { GeoItem } from "@/types";

interface GeoResponse {
  success: boolean;
  data: GeoItem[];
}

export async function fetchDivisions(): Promise<GeoItem[]> {
  const res = await universalApi<GeoResponse>({
    endpoint: "/geo/divisions",
    requireAuth: false,
  });
  if (!res.success) return [];
  return (res.data as GeoResponse)?.data ?? [];
}

export async function fetchDistricts(divisionId: string): Promise<GeoItem[]> {
  const res = await universalApi<GeoResponse>({
    endpoint: `/geo/districts?divisionId=${divisionId}`,
    requireAuth: false,
  });
  if (!res.success) return [];
  return (res.data as GeoResponse)?.data ?? [];
}

export async function fetchThanas(districtId: string): Promise<GeoItem[]> {
  const res = await universalApi<GeoResponse>({
    endpoint: `/geo/thanas?districtId=${districtId}`,
    requireAuth: false,
  });
  if (!res.success) return [];
  return (res.data as GeoResponse)?.data ?? [];
}

export async function fetchUniversities(): Promise<GeoItem[]> {
  const res = await universalApi<GeoResponse>({
    endpoint: "/geo/universities",
    requireAuth: false,
  });
  if (!res.success) return [];
  return (res.data as GeoResponse)?.data ?? [];
}
