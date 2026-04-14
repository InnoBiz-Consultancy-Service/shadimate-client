import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getChatHistory } from "@/actions/chat/chat";
import { fetchProfileById } from "@/actions/profile/profile";
import ChatRoomClient from "@/components/chat/ChatRoomClient";
import { Message } from "@/types/chat";

function decodeJwt(token: string): Record<string, unknown> | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
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
  const res = await fetchProfileById(userId).catch(() => ({ success: false, data: undefined }));
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

  // currentUserId — JWT decode, server-side, stable
  const payload = token ? decodeJwt(token) : null;
  const currentUserId = (payload?.id as string) ?? "";
  // subscription — isPremium check এখানেই করি, client-এ prop pass
  const subscription = (payload?.subscription as string) ?? "free";
  const isPremium = subscription === "premium";

  // Profile fetch — header-এ নাম দেখাতে
  const profileRes = await fetchProfileById(userId).catch(() => ({
    success: false,
    data: undefined,
  }));

  if (!profileRes.success || !profileRes.data) notFound();

  const profile = profileRes.data;
  const targetName = profile.userId?.name ?? profile.user?.name ?? "Unknown";

  // Initial messages — premium না হলে empty pass করব, ChatRoomClient gate দেখাবে
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

  return (
    <ChatRoomClient
      targetUserId={userId}
      targetName={targetName}
      currentUserId={currentUserId}
      initialMessages={initialMessages}
      totalPages={totalPages}
      token={token}
      isPremium={isPremium}
    />
  );
}