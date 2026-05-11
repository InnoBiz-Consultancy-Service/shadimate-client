import { cookies } from "next/headers";
import { getConversations } from "@/actions/chat/chat";
import ChatClient from "@/components/chat/ChatClient";

export const metadata = { title: "Messages – primehalf" };

function decodeJwt(token: string): Record<string, unknown> | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

export default async function ChatPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const payload = token ? decodeJwt(token) : null;
  const currentUserId = (payload?.id as string) ?? "";

  const res = await getConversations().catch(() => ({
    success: false as const,
    data: undefined,
  }));

  return (
    <ChatClient
      initialConversations={res.success && res.data ? res.data : []}
      token={token}
      currentUserId={currentUserId}
      // No chatRoomSlot — will show WelcomePanel on desktop right side
    />
  );
}
