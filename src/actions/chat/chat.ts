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
  try {
    console.log(`📡 Fetching chat history for user ${userId}, page ${page}, limit ${limit}`);
    
    const res = await universalApi<unknown>({
      endpoint: `/chat/${userId}?page=${page}&limit=${limit}`,
    });

    console.log("📦 Raw API Response:", JSON.stringify(res, null, 2));

    if (!res.success) {
      const isPremiumError =
        res.message?.toLowerCase().includes("premium") ||
        res.unauthorized === false;
      return { success: false, message: res.message, isPremiumError };
    }

    // Your backend returns: { success: true, data: [...messages], meta: {...} }
    // So res.data is directly the messages array or an object with data property?
    const responseData = res.data as Record<string, unknown>;
    
    let messages: Message[] = [];
    let meta: MessageMeta = {
      total: 0,
      page: page,
      limit: limit,
      totalPages: 1,
    };
    
    // Case 1: Direct array response
    if (Array.isArray(responseData)) {
      messages = responseData as Message[];
      meta = {
        total: messages.length,
        page: page,
        limit: limit,
        totalPages: Math.ceil(messages.length / limit) || 1,
      };
    }
    // Case 2: Object with data property (your backend structure)
    else if (responseData && typeof responseData === 'object') {
      if (Array.isArray(responseData.data)) {
        messages = responseData.data as Message[];
      }
      if (responseData.meta) {
        meta = responseData.meta as MessageMeta;
      } else {
        meta = {
          total: messages.length,
          page: page,
          limit: limit,
          totalPages: Math.ceil(messages.length / limit) || 1,
        };
      }
    }
    
    // Case 3: If messages is still empty, try to check if response itself is the messages array
    if (messages.length === 0 && res.data && Array.isArray(res.data)) {
      messages = res.data as Message[];
    }

    console.log(`✅ Successfully loaded ${messages.length} messages`);
    
    if (messages.length > 0) {
      console.log("📝 First message sample:", {
        id: messages[0]._id,
        content: messages[0].content,
        senderId: messages[0].senderId,
        receiverId: messages[0].receiverId,
        createdAt: messages[0].createdAt
      });
    }
    
    return { 
      success: true, 
      data: messages, 
      meta 
    };
  } catch (error) {
    console.error("❌ Error in getChatHistory:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}

export async function checkUserProfile(): Promise<{
  hasProfile: boolean;
  profile?: any;
  message?: string;
}> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    
    if (!token) {
      return { 
        hasProfile: false, 
        message: "Not authenticated. Please login first." 
      };
    }
    
    const baseUrl = process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL;
    
    if (!baseUrl) {
      return { 
        hasProfile: false, 
        message: "API URL not configured" 
      };
    }
    
    const response = await fetch(`${baseUrl}/profile/my`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    
    if (response.status === 404) {
      return { 
        hasProfile: false, 
        message: "Profile not found. Please create your profile first." 
      };
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { 
        hasProfile: false, 
        message: errorData.message || "Failed to fetch profile" 
      };
    }
    
    const data = await response.json();
    
    return { 
      hasProfile: true, 
      profile: data.data,
      message: "Profile found" 
    };
    
  } catch (error) {
    console.error("Error checking user profile:", error);
    return { 
      hasProfile: false, 
      message: error instanceof Error ? error.message : "Network error occurred" 
    };
  }
}
