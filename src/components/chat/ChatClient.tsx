"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Lock, Search } from "lucide-react";
import { GlassCard } from "@/components/ui";
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

export default function ChatClient({ initialConversations, token, currentUserId }: Props) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [search, setSearch] = useState("");
  const socketRef = useRef<import("socket.io-client").Socket | null>(null);
  const pathname = usePathname();

  // ── Conversation update helper ─────────────────────────────────────────────
  // senderId = কে পাঠিয়েছে, isMine = আমি পাঠিয়েছি কিনা
  const updateConversation = useCallback(
    (msg: Message, isMine: boolean) => {
      const partnerId = isMine ? msg.receiverId : msg.senderId;

      setConversations((prev) => {
        const idx = prev.findIndex((c) => c.userId === partnerId);

        // ── নতুন conversation — এখনো list-এ নেই ────────────────────────────
        if (idx === -1) {
          const newConv: Conversation = {
            userId:          partnerId,
            name:            null,   // নাম জানা নেই, পরে reload-এ আসবে
            lastMessage:     msg.content,
            lastMessageType: msg.type,
            lastMessageTime: msg.createdAt,
            unreadCount:     isMine ? 0 : 1,  // নিজের message-এ unread নয়
            isLocked:        false,
          };
          return [newConv, ...prev];
        }

        // ── Existing conversation update ──────────────────────────────────────
        const updated = [...prev];
        const openChatUserId = pathname.startsWith("/chat/")
          ? pathname.split("/chat/")[1]
          : null;

        // Chat room এখন open আছে কিনা check — open থাকলে unread বাড়াব না
        const isCurrentlyOpen = openChatUserId === partnerId;

        updated[idx] = {
          ...updated[idx],
          lastMessage:     msg.content,
          lastMessageType: msg.type,
          lastMessageTime: msg.createdAt,
          status:          isMine ? "sent" : updated[idx].status,
          // নিজের message বা chat open থাকলে unread বাড়াব না
          unreadCount: isMine || isCurrentlyOpen
            ? 0
            : (updated[idx].unreadCount ?? 0) + 1,
        };

        // সবচেয়ে নতুন message → conversation উপরে নিয়ে যাও
        const [entry] = updated.splice(idx, 1);
        return [entry, ...updated];
      });
    },
    [pathname],
  );

  // ── Unread reset — chat room-এ ঢুকলে ─────────────────────────────────────
  // pathname /chat/:userId হলে ওই conversation-এর unreadCount 0 করো
  useEffect(() => {
    if (!pathname.startsWith("/chat/")) return;
    const openUserId = pathname.split("/chat/")[1];
    if (!openUserId) return;

    setConversations((prev) =>
      prev.map((c) =>
        c.userId === openUserId ? { ...c, unreadCount: 0 } : c,
      ),
    );
  }, [pathname]);

  // ── Socket setup ───────────────────────────────────────────────────────────
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
          query:           { token, userId: currentUserId },
          transports:      ["websocket"],
          reconnection:    true,
          reconnectionDelay:     1500,
          reconnectionAttempts:  5,
        });

        socketRef.current = socket;

        // ── অন্যজনের পাঠানো message ────────────────────────────────────────
        socket.on("receive-message", (msg: Message) => {
          if (!mounted) return;
          updateConversation(msg, false);
        });

        // ── আমার পাঠানো message server confirm করেছে ───────────────────────
        socket.on("message-sent", (msg: Message) => {
          if (!mounted) return;
          updateConversation(msg, true);
        });

        // ── Message seen হলে conversation status update ─────────────────────
        socket.on(
          "message-seen",
          ({ conversationWith }: { messageId: string; conversationWith: string }) => {
            if (!mounted) return;
            setConversations((prev) =>
              prev.map((c) =>
                c.userId === conversationWith
                  ? { ...c, status: "seen" }
                  : c,
              ),
            );
          },
        );

        // ── Offline থাকার সময়ের pending notifications ──────────────────────
        // socket/index.ts এ emit হয় connect-এ
        socket.on("pending-notifications", (notifications: unknown[]) => {
          if (!mounted) return;
          // new_message type notification থেকে unread count বাড়াও
          const msgNotifs = (notifications as Array<{
            type: string;
            metadata?: { conversationWith?: string };
          }>).filter((n) => n.type === "new_message" && n.metadata?.conversationWith);

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

      } catch { /* socket.io-client unavailable */ }
    };

    setup();

    return () => {
      mounted = false;
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [token, currentUserId, updateConversation]);

  // ── Filtered list ──────────────────────────────────────────────────────────
  const filtered = conversations.filter((c) =>
    (c.name ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="font-outfit min-h-screen px-4 py-6 md:py-10 max-w-2xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-syne text-white text-2xl font-extrabold tracking-tight flex items-center gap-2">
          <MessageCircle size={22} className="text-brand" />
          Messages
        </h1>
        {conversations.length > 0 && (
          <span className="font-outfit text-xs text-slate-500 bg-white/5 border border-white/8 rounded-lg px-2.5 py-1">
            {conversations.length} chats
          </span>
        )}
      </div>

      {/* Search */}
      {conversations.length > 0 && (
        <div className="relative mb-5">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="font-outfit w-full pl-10 pr-4 py-3 rounded-2xl text-sm text-slate-200 placeholder-slate-600 bg-white/5 border border-white/10 outline-none focus:border-brand/40 transition-all duration-200"
          />
        </div>
      )}

      {/* Empty state */}
      {conversations.length === 0 && (
        <GlassCard className="p-10 text-center">
          <MessageCircle size={44} className="text-slate-600 mx-auto mb-4" />
          <h2 className="font-syne text-white text-lg font-bold mb-2">
            No Messages Yet
          </h2>
          <p className="text-slate-500 text-sm max-w-xs mx-auto mb-5">
            Start a conversation by visiting someone&apos;s profile.
          </p>
          <Link
            href="/profiles"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-on-brand bg-gradient-to-r from-brand to-accent no-underline hover:scale-[1.02] transition-all duration-200"
          >
            Browse Profiles
          </Link>
        </GlassCard>
      )}

      {/* Conversation list */}
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

      {/* No search results */}
      {conversations.length > 0 && filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 text-sm">
            No conversations match &ldquo;{search}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}

// ─── ConversationRow ──────────────────────────────────────────────────────────
function ConversationRow({ conv }: { conv: Conversation }) {
  const isLocked = conv.isLocked;

  const inner = (
    <div
      className={`glass-card rounded-2xl px-4 py-3.5 flex items-center gap-3.5
        transition-all duration-200
        ${!isLocked
          ? "hover:border-brand/30 hover:bg-brand/3 cursor-pointer"
          : "opacity-60"
        }`}
    >
      {/* Avatar + unread badge */}
      <div className="relative shrink-0">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand/40 to-accent/30 border border-white/10 flex items-center justify-center">
          <span className="font-syne text-white font-bold text-sm">
            {conv.name?.charAt(0).toUpperCase() ?? "?"}
          </span>
        </div>
        {conv.unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-brand text-on-brand text-[9px] font-bold rounded-full px-1 shadow-[0_0_6px_rgba(232,84,122,0.8)]">
            {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
          </span>
        )}
      </div>

      {/* Name + last message */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <p className="font-outfit text-sm font-semibold text-slate-100 truncate">
            {conv.name ?? "Unknown"}
          </p>
          <span className="font-outfit text-[10px] text-slate-600 shrink-0">
            {timeAgo(conv.lastMessageTime)}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {isLocked ? (
            <span className="flex items-center gap-1 text-[11px] text-slate-600">
              <Lock size={10} /> Premium only
            </span>
          ) : conv.lastMessage ? (
            <p
              className={`text-[12px] truncate ${
                conv.unreadCount > 0
                  ? "text-slate-300 font-medium"
                  : "text-slate-500"
              }`}
            >
              {conv.lastMessage}
            </p>
          ) : (
            <p className="text-[12px] text-slate-600 italic">No messages yet</p>
          )}
        </div>
      </div>

      {/* Seen double-tick */}
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
}