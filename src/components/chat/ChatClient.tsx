"use client";

import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Lock, Search } from "lucide-react";
import type { Conversation, Message } from "@/types/chat";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

interface Props {
  initialConversations: Conversation[];
  token?: string;
  currentUserId: string;
}

export default function ChatClient({
  initialConversations,
  token,
  currentUserId,
}: Props) {
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);
  const [search, setSearch] = useState("");
  const socketRef = useRef<import("socket.io-client").Socket | null>(null);
  const pathname = usePathname();

  const updateConversation = useCallback(
    (msg: Message, isMine: boolean) => {
      const partnerId = isMine ? msg.receiverId : msg.senderId;

      setConversations((prev) => {
        const idx = prev.findIndex((c) => c.userId === partnerId);

        if (idx === -1) {
          const newConv: Conversation = {
            userId: partnerId,
            name: null,
            lastMessage: msg.content,
            lastMessageType: msg.type,
            lastMessageTime: msg.createdAt,
            unreadCount: isMine ? 0 : 1,
            isLocked: false,
          };
          return [newConv, ...prev];
        }

        const updated = [...prev];
        const openChatUserId = pathname.startsWith("/chat/")
          ? pathname.split("/chat/")[1]
          : null;
        const isCurrentlyOpen = openChatUserId === partnerId;

        updated[idx] = {
          ...updated[idx],
          lastMessage: msg.content,
          lastMessageType: msg.type,
          lastMessageTime: msg.createdAt,
          status: isMine ? "sent" : updated[idx].status,
          unreadCount:
            isMine || isCurrentlyOpen ? 0 : (updated[idx].unreadCount ?? 0) + 1,
        };

        const [entry] = updated.splice(idx, 1);
        return [entry, ...updated];
      });
    },
    [pathname],
  );

  // Unread reset when chat room opens
  useEffect(() => {
    if (!pathname.startsWith("/chat/")) return;
    const openUserId = pathname.split("/chat/")[1];
    if (!openUserId) return;
    setConversations((prev) =>
      prev.map((c) => (c.userId === openUserId ? { ...c, unreadCount: 0 } : c)),
    );
  }, [pathname]);

  // Socket setup
  useEffect(() => {
    if (!token || !currentUserId) return;
    let mounted = true;

    const setup = async () => {
      try {
        const { io } = await import("socket.io-client");
        const serverUrl =
          process.env.NEXT_PUBLIC_SOCKET_URL ||
          process.env.NEXT_PUBLIC_BASE_URL ||
          "";
        if (!serverUrl || !mounted) return;

        const socket = io(serverUrl, {
          query: { token, userId: currentUserId },
          transports: ["websocket", "polling"],
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 10000,
          reconnectionAttempts: Infinity,
        });

        socketRef.current = socket;

        socket.on("receive-message", (msg: Message) => {
          if (!mounted) return;
          updateConversation(msg, false);
        });

        socket.on("message-sent", (msg: Message) => {
          if (!mounted) return;
          updateConversation(msg, true);
        });

        socket.on(
          "message-seen",
          ({
            conversationWith,
          }: {
            messageId: string;
            conversationWith: string;
          }) => {
            if (!mounted) return;
            setConversations((prev) =>
              prev.map((c) =>
                c.userId === conversationWith ? { ...c, status: "seen" } : c,
              ),
            );
          },
        );

        socket.on("pending-notifications", (notifications: unknown[]) => {
          if (!mounted) return;
          const msgNotifs = (
            notifications as Array<{
              type: string;
              metadata?: { conversationWith?: string };
            }>
          ).filter(
            (n) => n.type === "new_message" && n.metadata?.conversationWith,
          );

          if (!msgNotifs.length) return;
          setConversations((prev) => {
            const updated = [...prev];
            for (const notif of msgNotifs) {
              const partnerId = notif.metadata!.conversationWith!;
              const idx = updated.findIndex((c) => c.userId === partnerId);
              if (idx !== -1) {
                updated[idx] = {
                  ...updated[idx],
                  unreadCount: (updated[idx].unreadCount ?? 0) + 1,
                };
              }
            }
            return updated;
          });
        });
      } catch {
        /* socket.io-client unavailable */
      }
    };

    setup();

    return () => {
      mounted = false;
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [token, currentUserId, updateConversation]);

  // ✅ useMemo — search filter re-compute করবে না অন্য state change হলে
  const filtered = useMemo(
    () =>
      conversations.filter((c) =>
        (c.name ?? "").toLowerCase().includes(search.toLowerCase()),
      ),
    [conversations, search],
  );

  return (
    <div className="font-outfit min-h-screen px-4 py-6 md:py-10 max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h1 className="font-syne text-gray-900 text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <MessageCircle size={24} className="text-brand" />
          Messages
        </h1>
        {conversations.length > 0 && (
          <span className="font-outfit text-xs font-medium text-gray-500 bg-gray-100 border border-gray-200 rounded-lg px-2.5 py-1 self-start sm:self-auto">
            {conversations.length}{" "}
            {conversations.length === 1 ? "chat" : "chats"}
          </span>
        )}
      </div>

      {conversations.length > 0 && (
        <div className="relative mb-5">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="font-outfit w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-gray-700 placeholder-gray-400 bg-white border border-gray-200 outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/10 transition-all duration-200"
          />
        </div>
      )}

      {conversations.length === 0 && (
        <div className="relative bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-r from-brand/3 to-accent/3 rounded-2xl pointer-events-none" />
          <div className="relative">
            <MessageCircle size={48} className="text-gray-300 mx-auto mb-4" />
            <h2 className="font-syne text-gray-800 text-xl font-bold mb-2">
              No Messages Yet
            </h2>
            <p className="text-gray-500 text-sm max-w-xs mx-auto mb-6">
              Start a conversation by visiting someone&apos;s profile.
            </p>
            <Link
              href="/profiles"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-linear-to-r from-brand to-accent hover:from-brand/90 hover:to-accent/90 active:scale-[0.98] no-underline transition-all duration-200 shadow-sm"
            >
              Browse Profiles
            </Link>
          </div>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="space-y-2">
          {filtered.map((conv) => (
            <ConversationRow
              key={conv.userId ?? `locked-${conv.lastMessageTime}`}
              conv={conv}
            />
          ))}
        </div>
      )}

      {conversations.length > 0 && filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-sm">
            No conversations match {search}
          </p>
        </div>
      )}
    </div>
  );
}

// ✅ memo — শুধু এই conversation-এর data change হলে re-render হবে
const ConversationRow = memo(
  function ConversationRow({ conv }: { conv: Conversation }) {
    const isLocked = conv.isLocked;

    const inner = (
      <div
        className={`rounded-2xl px-4 py-3.5 flex items-center gap-3.5 transition-all duration-200 border ${
          !isLocked
            ? "border-gray-100 bg-white hover:border-brand/30 hover:bg-brand/5 hover:shadow-sm cursor-pointer"
            : "border-gray-100 bg-white opacity-60"
        }`}
      >
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-brand/20 to-accent/20 border border-gray-200 flex items-center justify-center">
            <span className="font-syne text-gray-700 font-bold text-sm">
              {(conv.name ?? "?").charAt(0).toUpperCase()}
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <p className="font-outfit text-sm font-semibold text-gray-800 truncate">
              {conv.name ?? <span className="text-gray-400 italic text-xs">Loading…</span>}
            </p>
            <span className="font-outfit text-[10px] text-gray-400 shrink-0">
              {timeAgo(conv.lastMessageTime)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {isLocked ? (
              <span className="flex items-center gap-1 text-[11px] text-gray-400">
                <Lock size={10} /> Premium only
              </span>
            ) : conv.lastMessage ? (
              <p
                className={`text-[12px] truncate ${conv.unreadCount > 0 ? "text-gray-700 font-medium" : "text-gray-500"}`}
              >
                {conv.lastMessage}
              </p>
            ) : (
              <p className="text-[12px] text-gray-400 italic">
                No messages yet
              </p>
            )}
          </div>
        </div>

        {!isLocked && conv.status === "seen" && (
          <svg
            width="16"
            height="10"
            viewBox="0 0 16 10"
            fill="none"
            className="shrink-0 text-brand"
          >
            <path
              d="M1 5L4 8L9 2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7 5L10 8L15 2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    );

    if (!conv.userId || isLocked) return <div>{inner}</div>;
    return (
      <Link href={`/chat/${conv.userId}`} className="no-underline block">
        {inner}
      </Link>
    );
  },
  // ✅ Custom comparator — শুধু relevant fields change হলে re-render
  (prev, next) =>
    prev.conv.userId === next.conv.userId &&
    prev.conv.lastMessage === next.conv.lastMessage &&
    prev.conv.unreadCount === next.conv.unreadCount &&
    prev.conv.status === next.conv.status &&
    prev.conv.lastMessageTime === next.conv.lastMessageTime,
);
