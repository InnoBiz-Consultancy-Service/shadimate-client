"use server";

import { cookies } from "next/headers";
import { universalApi } from "../universal-api";
import { isValidEmail, isValidPhone } from "@/lib/validators";

export interface LoginState {
  success: boolean;
  message: string;
  errors?: {
    identifier?: string;
    password?: string;
  };
}

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const identifier = (formData.get("identifier") as string)?.trim() ?? "";
  const password = (formData.get("password") as string) ?? "";
  const errors: LoginState["errors"] = {};

  if (!identifier) {
    errors.identifier = "Email or phone number is required.";
  } else if (!isValidEmail(identifier) && !isValidPhone(identifier)) {
    errors.identifier = "Please enter a valid email or phone number.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, message: "", errors };
  }

  const res = await universalApi<{ accessToken?: string; message?: string }>({
    endpoint: "/auth/login",
    method: "POST",
    data: { identifier, password },
    requireAuth: false,
  });

  if (!res.success) {
    return {
      success: false,
      message: res.message || "Login failed. Please check your credentials.",
    };
  }

  const rawData = res.data as Record<string, unknown> | undefined;
  const token =
    rawData?.accessToken ??
    (rawData?.data as Record<string, unknown> | undefined)?.token;

  if (!token || typeof token !== "string") {
    return { success: false, message: "Login failed. No token received." };
  }

  const cookieStore = await cookies();
  cookieStore.set("accessToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return { success: true, message: "Login successful! Redirecting..." };
}
