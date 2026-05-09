"use server";

import { universalApi } from "@/actions/universal-api";

/* ── Types ── */
export interface Question {
  _id: string;
  text: string;
  order: number;
  options: {
    label: string;
    text: string;
  }[];
}

export interface SubmitAnswer {
  questionId: string;
  selectedOption: "agree" | "sometimes" | "disagree";
}

export interface SuggestedProfile {
  _id: string;
  userId: {
    name: string;
    gender: string;
  };
  personality: string;
}

export interface SubmitResult {
  type: string;
  message: string;
}

export interface SubmitResponse {
  success: boolean;
  result?: SubmitResult;
  suggestions?: SuggestedProfile[];
  total?: number;
  message?: string;
}

export interface SaveInfoResponse {
  success: boolean;
  message?: string;
  data?: {
    type?: string;
    message?: string;
    email?: string;
    name?: string;
    gender?: string;
  };
}

/* ── Fetch Questions ── */
export async function fetchQuestions(): Promise<{
  success: boolean;
  data?: Question[];
  message?: string;
}> {
  const res = await universalApi<{ success: boolean; data: Question[] }>({
    endpoint: "/personality-test/questions",
    method: "GET",
    requireAuth: false,
  });

  if (!res.success) {
    return {
      success: false,
      message: res.message || "Failed to fetch questions.",
    };
  }

  const raw = res.data as { success: boolean; data: Question[] };
  return { success: true, data: raw.data };
}

/* ── Submit Answers ── */

export async function submitAnswers(
  answers: SubmitAnswer[],
): Promise<SubmitResponse> {
  const res = await universalApi<{
    success: boolean;
    data: {
      result: SubmitResult;
      suggestions: SuggestedProfile[];
      total: number;
    };
  }>({
    endpoint: "/personality-test/submit",
    method: "POST",
    data: { answers },
    requireAuth: false,
  });

  if (!res.success) {
    return {
      success: false,
      message: res.message || "Failed to submit answers.",
    };
  }

  const raw = res.data as {
    success: boolean;
    data: {
      result: SubmitResult;
      suggestions: SuggestedProfile[];
      total: number;
    };
  };

  return {
    success: true,
    result: raw.data?.result,
    suggestions: raw.data?.suggestions,
    total: raw.data?.total,
  };
}

/* ── Save User Info after result ── */
// PATCH /personality-test/:id  (id = profile _id from suggestions[0])
export async function saveUserInfo(
  profileId: string,
  info: { name: string; email: string; gender: string },
): Promise<SaveInfoResponse> {
  const res = await universalApi<{
    type?: string;
    message?: string;
    email?: string;
    name?: string;
    gender?: string;
  }>({
    endpoint: `/personality-test/${profileId}`,
    method: "PATCH",
    data: info,
    requireAuth: false,
  });

  if (!res.success) {
    return { success: false, message: res.message || "Failed to save info." };
  }

  return { success: true, data: res.data as SaveInfoResponse["data"] };
}
