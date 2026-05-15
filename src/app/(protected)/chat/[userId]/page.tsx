import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getChatHistory } from "@/actions/chat/chat";
import { fetchProfileById } from "@/actions/profile/profile";
import { getConversations } from "@/actions/chat/chat";
import ChatClient from "@/components/chat/ChatClient";
import ChatRoomClient from "@/components/chat/ChatRoomClient";
import { Message } from "@/types/chat";
import { getBlockStatus, getIgnoreStatus } from "@/actions/report-block-ignore";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const res = await fetchProfileById(userId).catch(() => ({
    success: false,
    data: undefined,
  }));
  const name = res.data?.userId?.name ?? res.data?.user?.name ?? "Chat";
  return { title: `${name} – Messages` };
}

export default async function ChatRoomPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const payload = token ? decodeJwt(token) : null;
  const currentUserId = (payload?.id as string) ?? "";
  const subscription = (payload?.subscription as string) ?? "free";
  const isPremium = subscription === "premium";

  // Fetch all data in parallel
  const [profileRes, convsRes, blockRes, ignoreRes] = await Promise.all([
    fetchProfileById(userId).catch(() => ({ success: false, data: undefined })),
    getConversations().catch(() => ({
      success: false as const,
      data: undefined,
    })),
    getBlockStatus(userId).catch(() => ({ success: false, data: undefined })),
    getIgnoreStatus(userId).catch(() => ({ success: false, data: undefined })),
  ]);

  if (!profileRes.success || !profileRes.data) notFound();

  const profile = profileRes.data;
  const targetName = profile.userId?.name ?? profile.user?.name ?? "Unknown";

  const blockData =
    blockRes.success && blockRes.data
      ? blockRes.data
      : { iBlockedThem: false, theyBlockedMe: false, isBlocked: false };

  const isIgnored =
    ignoreRes.success && ignoreRes.data ? ignoreRes.data.isIgnored : false;

  let initialMessages: Message[] = [];
  let totalPages = 1;

  if (isPremium) {
    const historyRes = await getChatHistory(userId, 1, 30).catch(() => ({
      success: false,
      data: undefined,
      meta: undefined,
    }));
    if (historyRes.success && historyRes.data) {
      initialMessages = historyRes.data;
      totalPages = historyRes.meta?.totalPages ?? 1;
    }
  }

  const chatRoom = (
    <ChatRoomClient
      targetUserId={userId}
      targetName={targetName}
      currentUserId={currentUserId}
      initialMessages={initialMessages}
      totalPages={totalPages}
      token={token}
      isPremium={isPremium}
      initialIsBlocked={blockData.isBlocked}
      initialIBlockedThem={blockData.iBlockedThem}
      initialTheyBlockedMe={blockData.theyBlockedMe}
      initialIsIgnored={isIgnored}
    />
  );

  return (
    /**
     * On desktop: ChatClient renders the two-panel shell
     *   — sidebar on the left, chatRoom injected into the right panel.
     * On mobile: ChatClient hides the sidebar (md:hidden logic),
     *   the right panel fills the screen with the chat room.
     */
    <ChatClient
      initialConversations={
        convsRes.success && convsRes.data ? convsRes.data : []
      }
      token={token}
      currentUserId={currentUserId}
      chatRoomSlot={chatRoom}
    />
  );
}
