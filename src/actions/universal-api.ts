"use server";

import { cookies } from "next/headers";

interface ApiOptions {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  data?: unknown;
  requireAuth?: boolean;
}
export async function universalApi<T = unknown>({
  endpoint,
  method = "GET",
  data,
  requireAuth = true,
}: ApiOptions): Promise<{ success: boolean; data?: T; message?: string }> {
  const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!apiUrl) throw new Error("NEXT_PUBLIC_BASE_URL is not set");

  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (requireAuth && accessToken) {
      headers["Authorization"] = `${accessToken}`;
    }

    const url = `${apiUrl}${endpoint}`;

    const options: RequestInit = {
      method,
      headers,
      cache: "no-store",
    };

    if (data && ["POST", "PUT", "PATCH"].includes(method)) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      if (response.status === 401) {
        cookieStore.delete("accessToken");
        return {
          success: false,
          message: errorData.message || "Unauthorized. Please login again.",
        };
      }

      return {
        success: false,
        message: errorData.message || `Error: ${response.statusText}`,
      };
    }

    const responseData = await response.json();

    return {
      success: true,
      data: responseData,
    };
  } catch (error) {
    console.error("API Error:", error);
    return {
      success: false,
      message: "Network error. Please try again.",
    };
  }
}
