"use server";

import { universalApi } from "../universal-api";

/* ── Types ── */
export interface RegisterState {
  success: boolean;
  message: string;
  phone?: string;
  errors?: {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    gender?: string;
  };
}

/* ── Validation helpers ── */
function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidBDPhone(value: string): boolean {
  // Supports: 01XXXXXXXXX (11 digits starting with 01)
  return /^01[3-9]\d{8}$/.test(value.replace(/[\s()-]/g, ""));
}

/* ── Server Action ── */
export async function registerAction(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const name = (formData.get("name") as string)?.trim() ?? "";
  const email = (formData.get("email") as string)?.trim() ?? "";
  const phone = (formData.get("phone") as string)?.trim() ?? "";
  const password = (formData.get("password") as string) ?? "";
  const gender = (formData.get("gender") as string) ?? "";

  /* ── Validation ── */
  const errors: RegisterState["errors"] = {};

  if (!name || name.length < 2) {
    errors.name = "Full name is required (min. 2 characters).";
  }

  if (!email) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!phone) {
    errors.phone = "Phone number is required.";
  } else if (!isValidBDPhone(phone)) {
    errors.phone = "Enter a valid BD phone number (01XXXXXXXXX).";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  if (!gender || !["male", "female"].includes(gender)) {
    errors.gender = "Please select a gender.";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, message: "", errors };
  }

  /* ── Call API ── */
  const res = await universalApi<{
    message?: string;
  }>({
    endpoint: "/auth",
    method: "POST",
    data: { name, email, phone, password, gender },
    requireAuth: false,
  });
  console.log(res)
  if (!res.success) {
    return {
      success: false,
      message: res.message || "Registration failed. Please try again.",
    };
  }

  return {
    success: true,
    message: "Registration successful! Verifying your phone...",
    phone,
  };
}
