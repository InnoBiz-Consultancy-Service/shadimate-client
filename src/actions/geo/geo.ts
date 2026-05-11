"use server";

import { universalApi } from "@/actions/universal-api";

/* ── Types ── */

export interface Division {
  _id: string;
  name: string;
}

export interface District {
  _id: string;
  name: string;
}

export interface Thana {
  _id: string;
  name: string;
}

export interface University {
  _id: string;
  name: string;
  shortName?: string;
  type: "govt" | "private";
}

interface GeoResponse<T> {
  success: boolean;
  message: string;
  data: T[];
}

/* ── Divisions ── */
export async function fetchDivisions(search = "") {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  const res = await universalApi<GeoResponse<Division>>({
    endpoint: `/geo/divisions${query}`,
    method: "GET",
    requireAuth: false,
  });
  if (res.success && res.data) {
    return (res.data as GeoResponse<Division>).data;
  }
  return [];
}

/* ── Districts (by Division ID) ── */
export async function fetchDistricts(divisionId: string, search = "") {
  if (!divisionId) return [];
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  const res = await universalApi<GeoResponse<District>>({
    endpoint: `/geo/divisions/${divisionId}/districts${query}`,
    method: "GET",
    requireAuth: false,
  });
  if (res.success && res.data) {
    return (res.data as GeoResponse<District>).data;
  }
  return [];
}

/* ── Thanas (by District ID) ── */
export async function fetchThanas(districtId: string, search = "") {
  if (!districtId) return [];
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  const res = await universalApi<GeoResponse<Thana>>({
    endpoint: `/geo/districts/${districtId}/thanas${query}`,
    method: "GET",
    requireAuth: false,
  });
  if (res.success && res.data) {
    return (res.data as GeoResponse<Thana>).data;
  }
  return [];
}

/* ── Universities ── */
export async function fetchUniversities(
  search = "",
  type?: "govt" | "private",
) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (type) params.set("type", type);
  const query = params.toString() ? `?${params.toString()}` : "";
  const res = await universalApi<GeoResponse<University>>({
    endpoint: `/geo/universities${query}`,
    method: "GET",
    requireAuth: false,
  });
  if (res.success && res.data) {
    return (res.data as GeoResponse<University>).data;
  }
  return [];
}

/* ── Countries ── */

export interface Country {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
}

interface CountryResponse {
  success: boolean;
  data: Country[];
}

interface SingleCountryResponse {
  success: boolean;
  data: Country;
}

export async function fetchCountries(search = ""): Promise<Country[]> {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  const res = await universalApi<CountryResponse>({
    endpoint: `/geo/countries${query}`,
    method: "GET",
    requireAuth: false,
  });
  if (res.success && res.data) {
    return (res.data as CountryResponse).data;
  }
  return [];
}

export async function fetchCountryByCode(
  code: string,
): Promise<Country | null> {
  if (!code) return null;
  const res = await universalApi<SingleCountryResponse>({
    endpoint: `/geo/countries/${code.toUpperCase()}`,
    method: "GET",
    requireAuth: false,
  });
  if (res.success && res.data) {
    return (res.data as SingleCountryResponse).data;
  }
  return null;
}
