"use server";

import { universalApi } from "@/actions/universal-api";
import type { Message, Conversation, MessageMeta } from "@/types/chat";
import { cookies } from "next/headers";

export async function getConversations(): Promise<{
  success: boolean;
  data?: Conversation[];
  message?: string;
}> {
  const res = await universalApi<unknown>({ endpoint: "/chat/conversations" });
  if (!res.success) return { success: false, message: res.message };
  const outer = res.data as Record<string, unknown> | undefined;
  const list = Array.isArray(outer?.data)
    ? (outer!.data as Conversation[])
    : [];
  return { success: true, data: list };
}

export async function getChatHistory(
  userId: string,
  page = 1,
  limit = 30,
): Promise<{
  success: boolean;
  data?: Message[];
  meta?: MessageMeta;
  message?: string;
  isPremiumError?: boolean;
}> {
  const res = await universalApi<unknown>({
    endpoint: `/chat/${userId}?page=${page}&limit=${limit}`,
  });

  if (!res.success) {
    const isPremiumError =
      res.message?.toLowerCase().includes("premium") ||
      res.unauthorized === false;
    return { success: false, message: res.message, isPremiumError };
  }

  // ✅ Backend একটাই format return করে: { success, data: [...], meta: {...} }
  // universalApi এর পর res.data = backend এর পুরো response body
  const body = res.data as Record<string, unknown> | undefined;

  let messages: Message[] = [];
  let meta: MessageMeta = { total: 0, page, limit, totalPages: 1 };

  if (body) {
    // Case 1: body.data is array (most common — { data: [], meta: {} })
    if (Array.isArray(body.data)) {
      messages = body.data as Message[];
      meta = (body.meta as MessageMeta) ?? {
        total: messages.length,
        page,
        limit,
        totalPages: 1,
      };
    }
    // Case 2: body itself is array
    else if (Array.isArray(body)) {
      messages = body as unknown as Message[];
    }
  }

  // ✅ Empty content message filter করো
  messages = messages.filter(
    (m) =>
      m &&
      m.content &&
      typeof m.content === "string" &&
      m.content.trim() !== "",
  );

  return { success: true, data: messages, meta };
}

export async function checkUserProfile(): Promise<{
  hasProfile: boolean;
  profile?: unknown;
  message?: string;
}> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return { hasProfile: false, message: "Not authenticated." };
    }

    const baseUrl = process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl)
      return { hasProfile: false, message: "API URL not configured" };

    const response = await fetch(`${baseUrl}/profile/my`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (response.status === 404) {
      return { hasProfile: false, message: "Profile not found." };
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        hasProfile: false,
        message: errorData.message || "Failed to fetch profile",
      };
    }

    const data = await response.json();
    return { hasProfile: true, profile: data.data };
  } catch (error) {
    return {
      hasProfile: false,
      message: error instanceof Error ? error.message : "Network error",
    };
  }
}
