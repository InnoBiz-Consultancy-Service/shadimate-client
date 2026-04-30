"use server";

import { cookies } from "next/headers";
import { universalApi } from "../universal-api";

export interface VerifyOtpState {
  success: boolean;
  message: string;
  errors?: { otp?: string };
  retryAfter?: number;
}

export interface ResendOtpState {
  success: boolean;
  message: string;
  retryAfter?: number;
}

export async function verifyOtpAction(
  _prevState: VerifyOtpState,
  formData: FormData,
): Promise<VerifyOtpState> {
  const phone = (formData.get("phone") as string)?.trim() ?? "";
  const otp = (formData.get("otp") as string)?.trim() ?? "";

  if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
    return {
      success: false,
      message: "",
      errors: { otp: "Please enter the complete 6-digit code." },
    };
  }

  if (!phone) {
    return {
      success: false,
      message: "Phone number is missing. Please go back and register again.",
    };
  }

  const res = await universalApi<{
    accessToken?: string;
    token?: string;
    message?: string;
  }>({
    endpoint: "/auth/verify-otp",
    method: "POST",
    data: { phone, otp },
    requireAuth: false,
  });

  if (!res.success) {
    return {
      success: false,
      message: res.message || "Invalid OTP. Please try again.",
      retryAfter: res.retryAfter,
    };
  }

  const token =
    (res.data as Record<string, unknown>)?.accessToken ??
    (res.data as Record<string, unknown>)?.token;

  if (token && typeof token === "string") {
    const cookieStore = await cookies();
    cookieStore.set("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  return { success: true, message: "Phone verified successfully!" };
}

export async function resendOtpAction(phone: string): Promise<ResendOtpState> {
  if (!phone) return { success: false, message: "Phone number is missing." };

  const res = await universalApi<{ message?: string }>({
    endpoint: "/resend-otp",
    method: "POST",
    data: { phone },
    requireAuth: false,
  });

  if (!res.success) {
    return {
      success: false,
      message: res.message || "Failed to resend OTP. Please try again.",
      retryAfter: res.retryAfter,
    };
  }

  return { success: true, message: "OTP sent successfully!" };
}
