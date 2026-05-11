"use server";

import { universalApi } from "../universal-api";
import { isValidEmail, isValidPhone } from "@/lib/validators";

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
    country?: string;
  };
  retryAfter?: number;
}

export async function registerAction(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const name = (formData.get("name") as string)?.trim() ?? "";
  const email = (formData.get("email") as string)?.trim() ?? "";
  const phone = (formData.get("phone") as string)?.trim() ?? "";
  const password = (formData.get("password") as string) ?? "";
  const gender = (formData.get("gender") as string) ?? "";
  const country = (formData.get("country") as string)?.trim() ?? "";

  const errors: RegisterState["errors"] = {};

  if (!name || name.length < 2)
    errors.name = "Full name is required (min. 2 characters).";

  if (!email) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!country) {
    errors.country = "Please select a country.";
  }

  if (!phone) {
    errors.phone = "Phone number is required.";
  } else if (!isValidPhone(phone)) {
    errors.phone = "Enter a valid phone number.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  if (!gender || !["male", "female"].includes(gender))
    errors.gender = "Please select a gender.";

  if (Object.keys(errors).length > 0)
    return { success: false, message: "", errors };

  const res = await universalApi<{ message?: string }>({
    endpoint: "/auth",
    method: "POST",
    // Backend resolves dialCode from country name and prefixes the phone
    data: { name, email, phone, password, gender, country },
    requireAuth: false,
  });
  console.log(res);

  if (!res.success) {
    return {
      success: false,
      message: res.message || "Registration failed. Please try again.",
      retryAfter: res.retryAfter,
    };
  }

  return { success: true, message: "Registration successful!", phone };
}
