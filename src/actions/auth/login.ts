"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { universalApi } from "../universal-api";
import { isValidEmail, isValidPhone } from "@/lib/validators";

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
}

// ─── Logout Action ────────────────────────────────────────────────────────────
export async function logoutAction() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const userId = cookieStore.get("userId")?.value;

  if (accessToken) {
    await universalApi({
      endpoint: "/auth/logout",
      method: "POST",
      requireAuth: true,
    }).catch(() => {}); 
  }

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");

  redirect("/login");
}

// ─── Login Action ─────────────────────────────────────────────────────────────
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

  const res = await universalApi<{
    data?: { accessToken?: string; user?: { _id?: string } };
  }>({
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

  const accessToken = res.data?.data?.accessToken;

  if (!accessToken || typeof accessToken !== "string") {
    return { success: false, message: "Login failed. No token received." };
  }

  const cookieStore = await cookies();

  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 2,
  });

  return { success: true, message: "Login successful! Redirecting..." };
}