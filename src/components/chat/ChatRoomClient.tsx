"use client";

import { useState, useEffect, useRef, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Send,
  Lock,
  Loader2,
  CheckCheck,
  Check,
  Clock,
  MessageCircle,
  WifiOff,
} from "lucide-react";
import { getChatHistory } from "@/actions/chat/chat";
import type { Message } from "@/types/chat";
import { useSocket } from "@/hooks/useSocket";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatWhatsAppTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  if (isNaN(date.getTime())) return "";
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatDateSeparator(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);
  const msgDate = new Date(date);
  msgDate.setHours(0, 0, 0, 0);

  if (msgDate.getTime() === today.getTime()) return "Today";
  if (msgDate.getTime() === yesterday.getTime()) return "Yesterday";
  if (date.getFullYear() === today.getFullYear()) {
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  }
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function groupByDate(
  messages: Message[],
): { label: string; msgs: Message[] }[] {
  const groups = new Map<string, Message[]>();
  const sorted = [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
  for (const msg of sorted) {
    const label = formatDateSeparator(msg.createdAt);
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(msg);
  }
  return Array.from(groups.entries()).map(([label, msgs]) => ({ label, msgs }));
}

// ─── Status Icons ─────────────────────────────────────────────────────────────

function StatusIcon({
  status,
  isMine,
}: {
  status?: Message["status"];
  isMine: boolean;
}) {
  if (!isMine) return null;
  if (status === "seen")
    return <CheckCheck size={16} className="text-[#88d9f9] shrink-0" />;
  if (status === "delivered")
    return <CheckCheck size={14} className="text-[#b08890] shrink-0" />;
  if (status === "error")
    return <Clock size={12} className="text-red-400 shrink-0" />;
  return <Check size={14} className="text-[#b08890] shrink-0" />;
}

// ─── Message Bubble ──────

// MessageBubble Component
function MessageBubble({ msg, isMine }: { msg: Message; isMine: boolean }) {
  if (!msg.content || msg.content.trim() === "") return null;

  const timeString = formatWhatsAppTime(msg.createdAt);

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"} mb-1`}>
      <div className={`relative max-w-[75%]`}>
        <div
          className={`relative px-3 py-2 text-sm leading-relaxed ${
            isMine
              ? "bg-[#7a1d30] text-[#f5e8eb] rounded-tl-2xl rounded-bl-2xl rounded-br-sm rounded-tr-2xl border border-[rgba(232,84,122,0.2)] shadow-sm"
              : "bg-[#1e0c10] text-[#f5e8eb] rounded-tr-2xl rounded-br-2xl rounded-bl-sm rounded-tl-2xl border border-[rgba(232,84,122,0.1)] shadow-sm"
          }`}
        >
          <p className="break-words whitespace-pre-wrap pr-14">{msg.content}</p>
          <div className="absolute bottom-1.5 right-2.5 flex items-center gap-0.5">
            <span className="text-[9px] text-[#b08890]/70">{timeString}</span>
            <StatusIcon status={msg.status} isMine={isMine} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Typing Indicator ─────────────────────────────────────────────────────────

// TypingIndicator Component
const TypingIndicator = ({ name }: { name: string }) => (
  <div className="flex justify-start mb-2">
    <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-3 py-2 shadow-sm">
      <div className="flex items-center gap-1">
        <span
          className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
        <span className="text-xs text-gray-500 ml-1">{name} is typing...</span>
      </div>
    </div>
  </div>
);

// ─── Premium Gate ─────────────────────────────────────────────────────────────

function PremiumGate() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#e8547a]/10 border border-[#e8547a]/20 flex items-center justify-center mb-4 shadow-[0_0_22px_rgba(232,84,122,0.2)]">
        <Lock size={28} className="text-[#e8547a]" />
      </div>
      <h2 className="font-syne text-[#f5e8eb] text-xl font-bold mb-2">
        Premium Required
      </h2>
      <p className="text-[#b08890] text-sm max-w-xs leading-relaxed mb-6">
        Upgrade to Premium to send and receive messages on primehalf.
      </p>
      <Link
        href="/subscription"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white bg-linear-to-r from-[#e8547a] to-[#c04060] no-underline hover:scale-[1.02] transition-all duration-200 shadow-[0_0_22px_rgba(232,84,122,0.35)]"
      >
        Upgrade to Premium
      </Link>
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  targetUserId: string;
  targetName: string;
  currentUserId: string;
  initialMessages: Message[];
  totalPages: number;
  token?: string;
  isPremium: boolean;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ChatRoomClient({
  targetUserId,
  targetName,
  currentUserId,
  initialMessages,
  totalPages,
  token,
  isPremium,
}: Props) {
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>(() => {
    if (!initialMessages || !Array.isArray(initialMessages)) return [];
    return [...initialMessages]
      .filter((m) => m?.content?.trim())
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
  });

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(totalPages > 1);
  const [loadingMore, startLoadMore] = useTransition();
  const [showOffline, setShowOffline] = useState(false);
  const [isPartnerOnline, setIsPartnerOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const bottomRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null); // ✅ scroll anchor için
  const scrollHeightBeforeRef = useRef(0); // ✅ load more scroll fix
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const seenSet = useRef<Set<string>>(new Set());

  // ─── Socket Handlers ───────────────────────────────────────────────────────

  const handleNewMessage = useCallback(
    (msg: Message) => {
      if (!msg.content?.trim()) return;
      if (msg.senderId !== targetUserId && msg.receiverId !== targetUserId)
        return;

      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        const optimisticIndex = prev.findIndex(
          (m) =>
            m._optimistic === true &&
            m.content === msg.content &&
            m.senderId === currentUserId,
        );
        if (optimisticIndex !== -1) {
          const updated = [...prev];
          updated[optimisticIndex] = { ...msg, _optimistic: false };
          return updated;
        }
        return [...prev, msg];
      });

      if (msg.senderId === targetUserId) setPartnerTyping(false);
      setTimeout(
        () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
        100,
      );
    },
    [targetUserId, currentUserId],
  );

  const handleMessageSent = useCallback(
    (msg: Message) => {
      setMessages((prev) => {
        const tempIndex = prev.findIndex(
          (m) =>
            m._optimistic === true &&
            m.content === msg.content &&
            m.senderId === currentUserId,
        );
        if (tempIndex !== -1) {
          const updated = [...prev];
          updated[tempIndex] = { ...msg, _optimistic: false };
          return updated;
        }
        if (!prev.some((m) => m._id === msg._id)) return [...prev, msg];
        return prev;
      });
    },
    [currentUserId],
  );

  const handleMessageSeen = useCallback(
    (payload: { messageId: string; conversationWith: string }) => {
      if (payload.conversationWith !== targetUserId) return;
      setMessages((prev) =>
        prev.map((m) =>
          m._id === payload.messageId && m.senderId === currentUserId
            ? { ...m, status: "seen" as const }
            : m,
        ),
      );
    },
    [targetUserId, currentUserId],
  );

  const handleMessageDelivered = useCallback(
    (payload: { messageId: string; conversationWith: string }) => {
      if (payload.conversationWith !== targetUserId) return;
      setMessages((prev) =>
        prev.map((m) =>
          m._id === payload.messageId &&
          m.senderId === currentUserId &&
          m.status !== "seen"
            ? { ...m, status: "delivered" as const }
            : m,
        ),
      );
    },
    [targetUserId, currentUserId],
  );

  const handleTyping = useCallback(
    (fromUserId: string) => {
      if (fromUserId === targetUserId) setPartnerTyping(true);
    },
    [targetUserId],
  );

  const handleStopTyping = useCallback(
    (fromUserId: string) => {
      if (fromUserId === targetUserId) setPartnerTyping(false);
    },
    [targetUserId],
  );

  const handleUserOnline = useCallback(
    (userId: string) => {
      if (userId === targetUserId) {
        setIsPartnerOnline(true);
        setLastSeen(null);
      }
    },
    [targetUserId],
  );

  const handleUserOffline = useCallback(
    (payload: { userId: string; lastSeen: string }) => {
      if (payload.userId === targetUserId) {
        setIsPartnerOnline(false);
        setLastSeen(new Date(payload.lastSeen));
      }
    },
    [targetUserId],
  );

  const { connected, sendMessage, markSeen, emitTyping, emitStopTyping } =
    useSocket({
      token,
      myUserId: currentUserId,
      onNewMessage: handleNewMessage,
      onMessageSent: handleMessageSent,
      onMessageSeen: handleMessageSeen,
      onMessageDelivered: handleMessageDelivered,
      onTyping: handleTyping,
      onStopTyping: handleStopTyping,
      onUserOnline: handleUserOnline,
      onUserOffline: handleUserOffline,
    });

  // ─── Effects ───────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!connected) {
      const timer = setTimeout(() => {
        setShowOffline(true);
        setTimeout(() => setShowOffline(false), 3000);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [connected]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  // ✅ Mark as seen — chat room খোলার 500ms পরে
  useEffect(() => {
    if (!connected || !token) return;
    const timer = setTimeout(() => {
      const unseenMessages = messages.filter(
        (m) =>
          m.senderId === targetUserId &&
          m.status !== "seen" &&
          !m._optimistic &&
          !seenSet.current.has(m._id),
      );
      unseenMessages.forEach((m) => {
        seenSet.current.add(m._id);
        markSeen(m._id);
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [messages, connected, targetUserId, markSeen, token]);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text || !connected) {
      if (!connected) {
        setShowOffline(true);
        setTimeout(() => setShowOffline(false), 3000);
      }
      return;
    }

    const optimistic: Message = {
      _id: `temp-${Date.now()}-${Math.random()}`,
      senderId: currentUserId,
      receiverId: targetUserId,
      content: text,
      type: "text",
      status: "sent",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      _optimistic: true,
    };

    setMessages((prev) => [...prev, optimistic]);
    setInput("");

    if (typingTimer.current) clearTimeout(typingTimer.current);
    emitStopTyping(targetUserId);
    setIsTyping(false);

    if (inputRef.current) inputRef.current.style.height = "auto";

    sendMessage(targetUserId, text);
    setTimeout(
      () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
      100,
    );
  }, [
    input,
    connected,
    currentUserId,
    targetUserId,
    sendMessage,
    emitStopTyping,
  ]);

  // ✅ Typing indicator fix — 3s timeout, debounce 300ms
  const TYPING_TIMEOUT_MS = 3000;

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setInput(value);
      e.target.style.height = "auto";
      e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;

      if (typingTimer.current) clearTimeout(typingTimer.current);

      if (!isTyping && value.trim()) {
        setIsTyping(true);
        emitTyping(targetUserId);
      }

      typingTimer.current = setTimeout(() => {
        setIsTyping(false);
        emitStopTyping(targetUserId);
      }, TYPING_TIMEOUT_MS);
    },
    [isTyping, targetUserId, emitTyping, emitStopTyping],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  // ✅ Load more — scroll position fix
  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    const container = messageContainerRef.current;

    // ✅ Load করার আগে scroll height save করো
    if (container) {
      scrollHeightBeforeRef.current = container.scrollHeight;
    }

    startLoadMore(async () => {
      const res = await getChatHistory(targetUserId, nextPage, 30);

      if (res.success && res.data && res.data.length > 0) {
        const filtered = res.data
          .filter((m) => m?.content?.trim())
          .sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          );

        setMessages((prev) => [...filtered, ...prev]);
        setPage(nextPage);
        setHasMore(nextPage < (res.meta?.totalPages ?? 1));

        // ✅ DOM update পরে scroll position restore করো
        requestAnimationFrame(() => {
          if (container) {
            const newHeight = container.scrollHeight;
            container.scrollTop = newHeight - scrollHeightBeforeRef.current;
          }
        });
      } else {
        setHasMore(false);
      }
    });
  }, [page, targetUserId]);

  // ─── Status Text ───────────────────────────────────────────────────────────

  const getStatusText = () => {
    if (partnerTyping) return "typing...";
    if (isPartnerOnline) return "online";
    if (lastSeen) {
      const diffMinutes = Math.floor(
        (currentTime.getTime() - lastSeen.getTime()) / 60000,
      );
      if (diffMinutes < 1) return "online";
      if (diffMinutes < 5) return "last seen recently";
      if (diffMinutes < 60) return `last seen ${diffMinutes}m ago`;
      if (diffMinutes < 1440)
        return `last seen ${Math.floor(diffMinutes / 60)}h ago`;
      return `last seen ${lastSeen.toLocaleDateString()}`;
    }
    return "offline";
  };

  const groups = groupByDate(messages);

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="font-outfit flex flex-col h-[100dvh] md:h-[calc(100vh-4rem)] max-w-2xl mx-auto bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-2 bg-white border-b border-gray-100 shrink-0 z-10">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-all cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand/20 to-accent/20 flex items-center justify-center shrink-0 relative">
          <span className="font-syne text-gray-700 font-bold text-sm">
            {targetName?.charAt(0)?.toUpperCase() || "?"}
          </span>
          {isPartnerOnline && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-gray-800 font-semibold text-sm truncate">
            {targetName}
          </p>
          <p
            className={`text-[11px] truncate transition-colors duration-300 ${
              partnerTyping
                ? "text-brand"
                : isPartnerOnline
                  ? "text-green-500"
                  : "text-gray-400"
            }`}
          >
            {getStatusText()}
          </p>
        </div>
      </div>

      {/* Offline Toast */}
      {showOffline && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded-full text-xs flex items-center gap-2 z-50 shadow-lg">
          <WifiOff size={12} className="text-brand" />
          <span>Connecting...</span>
        </div>
      )}

      {/* Body */}
      {!isPremium ? (
        <PremiumGate />
      ) : (
        <>
          {/* Message Container */}
          <div
            ref={messageContainerRef}
            className="flex-1 overflow-y-auto px-4 py-3 overscroll-contain bg-gray-50"
          >
            {hasMore && (
              <div className="flex justify-center py-3">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="text-brand text-xs hover:text-brand/70 transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Loading...
                    </>
                  ) : (
                    "Load older messages"
                  )}
                </button>
              </div>
            )}

            {groups.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-14 h-14 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center mb-3">
                  <MessageCircle size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-700 font-medium text-sm mb-1">
                  No messages yet
                </p>
                <p className="text-gray-400 text-xs">
                  Say hello to {targetName}!
                </p>
              </div>
            )}

            {groups.map(({ label, msgs }) => (
              <div key={label} className="mb-3">
                <div className="flex items-center justify-center py-2">
                  <span className="text-[10px] text-gray-500 bg-gray-100 border border-gray-200 rounded-full px-3 py-1">
                    {label}
                  </span>
                </div>
                {msgs.map((msg) => (
                  <MessageBubble
                    key={msg._id}
                    msg={msg}
                    isMine={msg.senderId === currentUserId}
                  />
                ))}
              </div>
            ))}

            {partnerTyping && <TypingIndicator name={targetName} />}

            <div ref={bottomRef} />
          </div>

          {/* Input Bar */}
          <div className="px-3 py-2.5 bg-white border-t border-gray-100 shrink-0">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                disabled={!connected}
                className="flex-1 px-4 py-2.5 rounded-2xl text-sm text-gray-700 placeholder-gray-400 bg-gray-50 border border-gray-200 outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/10 resize-none disabled:opacity-50 leading-relaxed transition-all duration-200"
                style={{ minHeight: "42px", maxHeight: "120px" }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || !connected}
                aria-label="Send message"
                className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r from-brand to-accent hover:from-brand/90 hover:to-accent/90 text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shrink-0 cursor-pointer shadow-sm active:scale-[0.95]"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
