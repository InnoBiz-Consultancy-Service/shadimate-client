"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useTransition,
} from "react";
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

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
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

function groupByDate(messages: Message[]): { label: string; msgs: Message[] }[] {
  const groups = new Map<string, Message[]>();

  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  for (const msg of sortedMessages) {
    const label = formatDateSeparator(msg.createdAt);
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(msg);
  }

  return Array.from(groups.entries()).map(([label, msgs]) => ({ label, msgs }));
}

// ─── Status Icons ─────────────────────────────────────────────────────────────

function StatusIcon({ status, isMine }: { status: Message["status"] | undefined; isMine: boolean }) {
  if (!isMine) return null;

  if (status === "seen")
    return <CheckCheck size={16} className="text-[#88d9f9] shrink-0" />;
  if (status === "delivered")
    return <CheckCheck size={14} className="text-[#b08890] shrink-0" />;
  if (status === "error")
    return <Clock size={12} className="text-red-400 shrink-0" />;

  return <Check size={14} className="text-[#b08890] shrink-0" />;
}

// ─── Message Bubble ───────────────────────────────────────────────────────────

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

function TypingIndicator({ name }: { name: string }) {
  return (
    <div className="flex justify-start items-center gap-2 mb-1">
      <div className="bg-[#1e0c10] border border-[rgba(232,84,122,0.1)] rounded-tr-2xl rounded-br-2xl rounded-bl-sm rounded-tl-2xl px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1">
          {[0, 200, 400].map((delay) => (
            <div
              key={delay}
              className="w-1.5 h-1.5 rounded-full bg-[#b08890] animate-bounce"
              style={{ animationDelay: `${delay}ms`, animationDuration: "1s" }}
            />
          ))}
        </div>
      </div>
      <span className="text-[10px] text-[#b08890]">{name} is typing...</span>
    </div>
  );
}

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
        Upgrade to Premium to send and receive messages on ShadiMate.
      </p>
      <Link
        href="/subscription"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-[#e8547a] to-[#c04060] no-underline hover:scale-[1.02] transition-all duration-200 shadow-[0_0_22px_rgba(232,84,122,0.35)]"
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

    const validMessages = initialMessages.filter(
      (msg) => msg && msg.content && typeof msg.content === "string" && msg.content.trim() !== ""
    );

    return [...validMessages].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
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
  const [isLoading, setIsLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const topAnchorRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const seenSet = useRef<Set<string>>(new Set());

  // ─── Socket Handlers ───────────────────────────────────────────────────────

  const handleNewMessage = useCallback(
    (msg: Message) => {
      if (!msg.content || msg.content.trim() === "") return;
      if (msg.senderId !== targetUserId && msg.receiverId !== targetUserId) return;

      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;

        const optimisticIndex = prev.findIndex(
          (m) => m._optimistic === true && m.content === msg.content && m.senderId === currentUserId
        );

        if (optimisticIndex !== -1) {
          const updated = [...prev];
          updated[optimisticIndex] = { ...msg, _optimistic: false };
          return updated;
        }

        return [...prev, msg];
      });

      if (msg.senderId === targetUserId) setPartnerTyping(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    },
    [targetUserId, currentUserId]
  );

  const handleMessageSent = useCallback(
    (msg: Message) => {
      setMessages((prev) => {
        const tempIndex = prev.findIndex(
          (m) => m._optimistic === true && m.content === msg.content && m.senderId === currentUserId
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
    [currentUserId]
  );

  const handleMessageSeen = useCallback(
    (payload: { messageId: string; conversationWith: string }) => {
      if (payload.conversationWith !== targetUserId) return;
      setMessages((prev) =>
        prev.map((m) =>
          m._id === payload.messageId && m.senderId === currentUserId
            ? { ...m, status: "seen" as const }
            : m
        )
      );
    },
    [targetUserId, currentUserId]
  );

  const handleMessageDelivered = useCallback(
    (payload: { messageId: string; conversationWith: string }) => {
      if (payload.conversationWith !== targetUserId) return;
      setMessages((prev) =>
        prev.map((m) =>
          m._id === payload.messageId && m.senderId === currentUserId && m.status !== "seen"
            ? { ...m, status: "delivered" as const }
            : m
        )
      );
    },
    [targetUserId, currentUserId]
  );

  const handleTyping = useCallback(
    (fromUserId: string) => {
      if (fromUserId === targetUserId) {
        setPartnerTyping(true);
        const timer = setTimeout(() => setPartnerTyping(false), 3000);
        return () => clearTimeout(timer);
      }
    },
    [targetUserId]
  );

  const handleStopTyping = useCallback(
    (fromUserId: string) => {
      if (fromUserId === targetUserId) setPartnerTyping(false);
    },
    [targetUserId]
  );

  const handleUserOnline = useCallback(
    (userId: string) => {
      if (userId === targetUserId) {
        setIsPartnerOnline(true);
        setLastSeen(null);
      }
    },
    [targetUserId]
  );

  const handleUserOffline = useCallback(
    (payload: { userId: string; lastSeen: string }) => {
      if (payload.userId === targetUserId) {
        setIsPartnerOnline(false);
        setLastSeen(new Date(payload.lastSeen));
      }
    },
    [targetUserId]
  );

  const { connected, sendMessage, markSeen, emitTyping, emitStopTyping } = useSocket({
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
      setShowOffline(true);
      const timer = setTimeout(() => setShowOffline(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [connected]);

  useEffect(() => {
    if (messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  useEffect(() => {
    if (!connected) return;
    const unseenMessages = messages.filter(
      (m) =>
        m.senderId === targetUserId &&
        m.status !== "seen" &&
        !m._optimistic &&
        !seenSet.current.has(m._id)
    );
    unseenMessages.forEach((m) => {
      seenSet.current.add(m._id);
      markSeen(m._id);
    });
  }, [messages, connected, targetUserId, markSeen]);

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
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }, [input, connected, currentUserId, targetUserId, sendMessage, emitStopTyping]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setInput(value);
      e.target.style.height = "auto";
      e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;

      if (!isTyping && value.trim()) {
        setIsTyping(true);
        emitTyping(targetUserId);
      }

      if (typingTimer.current) clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => {
        setIsTyping(false);
        emitStopTyping(targetUserId);
      }, 2000);
    },
    [isTyping, targetUserId, emitTyping, emitStopTyping]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    const anchor = topAnchorRef.current;

    startLoadMore(async () => {
      setIsLoading(true);
      try {
        const res = await getChatHistory(targetUserId, nextPage, 30);

        if (res.success && res.data && res.data.length > 0) {
          const filtered = res.data
            .filter(
              (msg) =>
                msg && msg.content && typeof msg.content === "string" && msg.content.trim() !== ""
            )
            .sort(
              (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );

          setMessages((prev) => [...filtered, ...prev]);
          setPage(nextPage);
          setHasMore(nextPage < (res.meta?.totalPages ?? 1));
          requestAnimationFrame(() => anchor?.scrollIntoView({ block: "start" }));
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error loading messages:", error);
      } finally {
        setIsLoading(false);
      }
    });
  }, [page, targetUserId]);

  // ─── Status Text ───────────────────────────────────────────────────────────

  const getStatusText = () => {
    if (partnerTyping) return "typing...";
    if (isPartnerOnline) return "online";
    if (lastSeen) {
      const diffMinutes = Math.floor(
        (new Date().getTime() - lastSeen.getTime()) / (1000 * 60)
      );
      if (diffMinutes < 1) return "online";
      if (diffMinutes < 5) return "last seen recently";
      if (diffMinutes < 60) return `last seen ${diffMinutes}m ago`;
      if (diffMinutes < 1440) return `last seen ${Math.floor(diffMinutes / 60)}h ago`;
      return `last seen ${lastSeen.toLocaleDateString()}`;
    }
    return "offline";
  };

  const groups = groupByDate(messages);

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="font-outfit flex flex-col h-[100dvh] md:h-[calc(100vh-4rem)] max-w-2xl mx-auto bg-gradient-to-b from-[#110608] via-[#160a0c] to-[#110608]">

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-2 bg-[#1c0c10] border-b border-[rgba(232,84,122,0.15)] shrink-0 z-10">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full flex items-center justify-center text-[#b08890] hover:bg-[#240e13] transition-all cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#e8547a] to-[#8b1a2e] flex items-center justify-center shrink-0 relative">
          <span className="font-syne text-white font-bold text-sm">
            {targetName?.charAt(0)?.toUpperCase() || "?"}
          </span>
          {isPartnerOnline && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#25d366] rounded-full border-2 border-[#1c0c10]" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[#f5e8eb] font-semibold text-sm truncate">{targetName}</p>
          <p
            className={`text-[11px] truncate transition-colors duration-300 ${
              partnerTyping
                ? "text-[#e8547a]"
                : isPartnerOnline
                ? "text-[#25d366]"
                : "text-[#b08890]"
            }`}
          >
            {getStatusText()}
          </p>
        </div>
      </div>

      {/* Offline Toast */}
      {showOffline && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-[#240e13] border border-[rgba(232,84,122,0.2)] text-[#f5e8eb] px-4 py-2 rounded-full text-xs flex items-center gap-2 z-50 shadow-lg">
          <WifiOff size={12} className="text-[#e8547a]" />
          <span>Connecting...</span>
        </div>
      )}

      {/* Body */}
      {!isPremium ? (
        <PremiumGate />
      ) : (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 overscroll-contain bg-gradient-to-b from-[#110608] via-[#160a0c] to-[#110608]">

            {hasMore && (
              <div className="flex justify-center py-3">
                <button
                  onClick={loadMore}
                  disabled={loadingMore || isLoading}
                  className="text-[#e8547a] text-xs hover:text-[#c04060] transition-colors disabled:opacity-50"
                >
                  {loadingMore || isLoading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    "Load older messages"
                  )}
                </button>
              </div>
            )}

            <div ref={topAnchorRef} />

            {groups.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-14 h-14 rounded-full bg-[#240e13] border border-[rgba(232,84,122,0.15)] flex items-center justify-center mb-3">
                  <MessageCircle size={24} className="text-[#b08890]" />
                </div>
                <p className="text-[#f5e8eb] font-medium text-sm mb-1">No messages yet</p>
                <p className="text-[#b08890] text-xs">Say hello to {targetName}!</p>
              </div>
            )}

            {groups.map(({ label, msgs }) => (
              <div key={label} className="mb-3">
                <div className="flex items-center justify-center py-2">
                  <span className="text-[10px] text-[#b08890] bg-[#240e13] border border-[rgba(232,84,122,0.12)] rounded-full px-3 py-1">
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
          <div className="px-3 py-2.5 bg-[#1c0c10] border-t border-[rgba(232,84,122,0.15)] shrink-0">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                disabled={!connected}
                className="flex-1 px-4 py-2.5 rounded-full text-sm text-[#f5e8eb] placeholder-[#6e4450] bg-[#240e13] border border-[rgba(232,84,122,0.2)] outline-none focus:border-[rgba(232,84,122,0.45)] resize-none disabled:opacity-50 leading-relaxed transition-colors duration-150"
                style={{ minHeight: "42px", maxHeight: "120px" }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || !connected}
                aria-label="Send message"
                className="w-10 h-10 rounded-full flex items-center justify-center bg-[#e8547a] hover:bg-[#c04060] text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#e8547a] shrink-0 cursor-pointer shadow-[0_0_14px_rgba(232,84,122,0.35)]"
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