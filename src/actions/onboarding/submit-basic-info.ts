"use server";

import { universalApi } from "@/actions/universal-api";

/* ─────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────── */

export interface BasicInfoPayload {
  name: string;
  dob: string;
  address: {
    divisionId: string;
    districtId: string;
    thanaId: string;
  };
  height: string;
  skinTone: string;
  bodyType: string;
  education: {
    level: string;
    universityId: string;
  };
  profession: string;
  maritalStatus: string;
}

/* ─────────────────────────────────────────────────────────
   Submit Basic Info
───────────────────────────────────────────────────────── */

export async function submitBasicInfo(payload: BasicInfoPayload) {
  const res = await universalApi({
    endpoint: "/profile/basic-info",
    method: "POST",
    data: payload,
    requireAuth: true,
  });

  return res;
}
