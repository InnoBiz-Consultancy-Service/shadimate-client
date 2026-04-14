"use server";

import { universalApi } from "@/actions/universal-api";
import type { Message, Conversation, MessageMeta } from "@/types/chat";

export async function getConversations(): Promise<{
  success: boolean;
  data?: Conversation[];
  message?: string;
}> {
  const res = await universalApi<unknown>({ endpoint: "/chat/conversations" });
  if (!res.success) return { success: false, message: res.message };
  const outer = res.data as Record<string, unknown> | undefined;
  const list = Array.isArray(outer?.data) ? (outer!.data as Conversation[]) : [];
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

  // 403 specifically → premium required
  if (!res.success) {
    const isPremiumError =
      res.message?.toLowerCase().includes("premium") ||
      res.unauthorized === false;
    return { success: false, message: res.message, isPremiumError };
  }

  const outer = res.data as Record<string, unknown> | undefined;
  const messages = Array.isArray(outer?.data) ? (outer!.data as Message[]) : [];
  const meta = (outer?.meta as MessageMeta) ?? {
    total: 0,
    page,
    limit,
    totalPages: 1,
  };

  return { success: true, data: messages, meta };
}