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
    score: number;
  }[];
}

export interface QuestionsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Question[];
}

export interface SubmitAnswer {
  questionId: string;
  score: number;
}

export interface SubmitState {
  success: boolean;
  message: string;
  testId?: string;
}

export interface PatchInfoState {
  success: boolean;
  message: string;
}

export interface TestResult {
  _id: string;
  name?: string;
  email?: string;
  gender?: string;
  totalScore?: number;
  maxScore?: number;
  percentage?: number;
  category?: string;
  [key: string]: unknown;
}

export interface ResultResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: TestResult;
}

/* ── Fetch Questions ── */
export async function fetchQuestions(): Promise<{
  success: boolean;
  data?: Question[];
  message?: string;
}> {
  const res = await universalApi<QuestionsResponse>({
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

  const raw = res.data as QuestionsResponse;
  return {
    success: true,
    data: raw.data,
  };
}

/* ── Submit Answers ── */
export async function submitAnswers(
  answers: SubmitAnswer[],
): Promise<SubmitState> {
  const res = await universalApi<{
    statusCode: number;
    success: boolean;
    message: string;
    data: { _id: string };
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
    statusCode: number;
    success: boolean;
    message: string;
    data: { _id: string };
  };

  return {
    success: true,
    message: raw.message || "Submitted successfully!",
    testId: raw.data?._id,
  };
}

/* ── Patch User Info ── */
export async function patchUserInfo(
  testId: string,
  info: { name: string; email: string; gender: string },
): Promise<PatchInfoState> {
  const res = await universalApi<{ message?: string }>({
    endpoint: `/personality-test/${testId}`,
    method: "PATCH",
    data: info,
    requireAuth: false,
  });

  if (!res.success) {
    return {
      success: false,
      message: res.message || "Failed to save info.",
    };
  }

  return {
    success: true,
    message: "Info saved successfully!",
  };
}

/* ── Get Result ── */
export async function fetchResult(testId: string): Promise<{
  success: boolean;
  data?: TestResult;
  message?: string;
}> {
  const res = await universalApi<ResultResponse>({
    endpoint: `/personality-test/${testId}`,
    method: "GET",
    requireAuth: false,
  });

  if (!res.success) {
    return {
      success: false,
      message: res.message || "Failed to fetch result.",
    };
  }

  const raw = res.data as ResultResponse;
  return {
    success: true,
    data: raw.data,
  };
}
