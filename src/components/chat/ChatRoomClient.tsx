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
import BlockedBanner from "../report-block-ignore/BlokedBanner";
import IgnoredMessagesBanner from "../report-block-ignore/IgnoredMessagesBanner";
import BlockConfirmModal from "../report-block-ignore/BlockConfirmModal";
import UserActionMenu from "../report-block-ignore/UserActionMenu";

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
    return (
      <CheckCheck size={14} style={{ color: "#B07A1E" }} className="shrink-0" />
    );
  if (status === "delivered")
    return (
      <CheckCheck
        size={14}
        style={{ color: "rgba(184,92,110,0.5)" }}
        className="shrink-0"
      />
    );
  if (status === "error")
    return <Clock size={12} className="text-red-400 shrink-0" />;
  return (
    <Check
      size={14}
      style={{ color: "rgba(184,92,110,0.4)" }}
      className="shrink-0"
    />
  );
}

function MessageBubble({ msg, isMine }: { msg: Message; isMine: boolean }) {
  if (!msg.content || msg.content.trim() === "") return null;
  const timeString = formatWhatsAppTime(msg.createdAt);
  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"} mb-0.5`}>
      <div className="relative max-w-[78%] sm:max-w-[70%]">
        <div
          className="relative px-3.5 py-2.5 text-[14px] leading-relaxed"
          style={{
            background: isMine
              ? "linear-gradient(135deg, #B85C6E 0%, #9A4F5E 100%)"
              : "#ffffff",
            color: isMine ? "#ffffff" : "#2E1A14",
            borderRadius: isMine ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
            border: isMine ? "none" : "1px solid rgba(184,92,110,0.12)",
            boxShadow: isMine
              ? "0 2px 8px rgba(184,92,110,0.30)"
              : "0 1px 4px rgba(46,26,20,0.06)",
          }}
        >
          <p className="whitespace-pre-wrap break-words pr-14">{msg.content}</p>
          <div className="absolute bottom-1.5 right-2.5 flex items-center gap-0.5">
            <span
              className="text-[10px]"
              style={{ color: isMine ? "rgba(255,255,255,0.65)" : "#A8896C" }}
            >
              {timeString}
            </span>
            <StatusIcon status={msg.status} isMine={isMine} />
          </div>
        </div>
      </div>
    </div>
  );
}

const TypingIndicator = ({ name }: { name: string }) => (
  <div className="flex justify-start mb-2">
    <div
      className="flex items-center gap-1.5 px-4 py-2.5"
      style={{
        background: "#ffffff",
        borderRadius: "4px 18px 18px 18px",
        border: "1px solid rgba(184,92,110,0.12)",
        boxShadow: "0 1px 4px rgba(46,26,20,0.06)",
      }}
    >
      {[0, 150, 300].map((d) => (
        <span
          key={d}
          className="w-1.5 h-1.5 rounded-full animate-bounce"
          style={{
            background: "#B85C6E",
            animationDelay: `${d}ms`,
            opacity: 0.75,
          }}
        />
      ))}
      <span className="text-[11px] ml-1" style={{ color: "#8C5A3C" }}>
        {name} is typing...
      </span>
    </div>
  </div>
);

function PremiumGate() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-12 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{
          background: "rgba(184,92,110,0.08)",
          border: "1px solid rgba(184,92,110,0.2)",
          boxShadow: "0 0 22px rgba(184,92,110,0.15)",
        }}
      >
        <Lock size={28} style={{ color: "#B85C6E" }} />
      </div>
      <h2
        className="font-syne text-xl font-bold mb-2"
        style={{ color: "#2E1A14" }}
      >
        Premium Required
      </h2>
      <p
        className="text-sm max-w-xs leading-relaxed mb-6"
        style={{ color: "#8C5A3C" }}
      >
        Upgrade to Premium to send and receive messages on primehalf.
      </p>
      <Link
        href="/subscription"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white no-underline transition-all duration-200 active:scale-[0.98]"
        style={{
          background: "linear-gradient(135deg, #B85C6E, #9A4F5E)",
          boxShadow: "0 4px 18px rgba(184,92,110,0.40)",
        }}
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
  initialIsBlocked?: boolean;
  initialIBlockedThem?: boolean;
  initialTheyBlockedMe?: boolean;
  initialIsIgnored?: boolean;
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
  initialIsBlocked = false,
  initialIBlockedThem = false,
  initialTheyBlockedMe = false,
  initialIsIgnored = false,
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

  // ── Block / Ignore state — all mutable so UI updates instantly ──
  const [isBlocked, setIsBlocked] = useState(initialIsBlocked);
  const [iBlockedThem, setIBlockedThem] = useState(initialIBlockedThem);
  const [theyBlockedMe] = useState(initialTheyBlockedMe);
  const [isIgnored, setIsIgnored] = useState(initialIsIgnored); // FIX: was const

  const [showUnblockModal, setShowUnblockModal] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const scrollHeightBeforeRef = useRef(0);
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

  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    const container = messageContainerRef.current;

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
    <div
      className="font-outfit flex flex-col"
      style={{
        height: "100dvh",
        maxHeight: "100dvh",
        background: "#FAF0E4",
      }}
    >
      {/* ── Header ── */}
      <div
        className="flex items-center gap-3 px-4 py-3 shrink-0 z-10"
        style={{
          background: "linear-gradient(135deg, #B85C6E 0%, #9A4F5E 100%)",
          boxShadow: "0 2px 12px rgba(184,92,110,0.30)",
        }}
      >
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full flex items-center justify-center text-white/80 active:bg-white/10 transition-all cursor-pointer shrink-0"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="relative shrink-0">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white"
            style={{ background: "rgba(255,255,255,0.25)" }}
          >
            {targetName?.charAt(0)?.toUpperCase() || "?"}
          </div>
          {isPartnerOnline && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-[15px] truncate leading-tight">
            {targetName}
          </p>
          <p
            className="text-[11px] truncate leading-tight transition-colors duration-300"
            style={{
              color: partnerTyping
                ? "#FAF0E4"
                : isPartnerOnline
                  ? "#86efac"
                  : "rgba(255,255,255,0.60)",
            }}
          >
            {getStatusText()}
          </p>
        </div>

        <UserActionMenu
          targetUserId={targetUserId}
          targetName={targetName}
          iBlockedThem={iBlockedThem}
          isIgnored={isIgnored}
          onBlockChange={(action) => {
            const nowBlocked = action === "blocked";
            setIBlockedThem(nowBlocked);
            setIsBlocked(nowBlocked || theyBlockedMe);
          }}
          onIgnoreChange={(action) => {
            setIsIgnored(action === "ignored");
          }}
        />
      </div>

      {/* ── Offline Toast ── */}
      {showOffline && (
        <div
          className="absolute top-16 left-1/2 -translate-x-1/2 text-white px-4 py-2 rounded-full text-xs flex items-center gap-2 z-50"
          style={{
            background: "#2E1A14",
            boxShadow: "0 4px 16px rgba(46,26,20,0.3)",
          }}
        >
          <WifiOff size={12} style={{ color: "#B85C6E" }} />
          <span>Connecting...</span>
        </div>
      )}

      {/* ── Body ── */}
      {!isPremium ? (
        <PremiumGate />
      ) : isBlocked ? (
        <BlockedBanner
          iBlockedThem={iBlockedThem}
          theirName={targetName}
          onUnblock={() => setShowUnblockModal(true)}
        />
      ) : (
        <>
          {isIgnored && <IgnoredMessagesBanner senderName={targetName} />}

          {/* Messages */}
          <div
            ref={messageContainerRef}
            className="flex-1 overflow-y-auto px-3 py-3 overscroll-contain"
            style={{ background: "#FAF0E4" }}
          >
            {hasMore && (
              <div className="flex justify-center py-3">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="text-xs active:opacity-70 transition-opacity disabled:opacity-50 flex items-center gap-1 px-4 py-1.5 rounded-full"
                  style={{
                    color: "#B85C6E",
                    background: "rgba(184,92,110,0.08)",
                    border: "1px solid rgba(184,92,110,0.15)",
                  }}
                >
                  {loadingMore ? (
                    <>
                      <Loader2 size={12} className="animate-spin" /> Loading...
                    </>
                  ) : (
                    "Load older messages"
                  )}
                </button>
              </div>
            )}

            {groups.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
                  style={{
                    background: "rgba(184,92,110,0.08)",
                    border: "1px solid rgba(184,92,110,0.15)",
                  }}
                >
                  <MessageCircle size={24} style={{ color: "#B85C6E" }} />
                </div>
                <p
                  className="font-semibold text-sm mb-1"
                  style={{ color: "#2E1A14" }}
                >
                  No messages yet
                </p>
                <p className="text-xs" style={{ color: "#8C5A3C" }}>
                  Say hello to {targetName}!
                </p>
              </div>
            )}

            {groups.map(({ label, msgs }) => (
              <div key={label} className="mb-2">
                <div className="flex items-center justify-center py-2">
                  <span
                    className="text-[10px] px-3 py-1 rounded-full"
                    style={{
                      color: "#8C5A3C",
                      background: "rgba(184,92,110,0.08)",
                      border: "1px solid rgba(184,92,110,0.12)",
                    }}
                  >
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

          {/* ── Input Bar ── */}
          <div
            className="px-3 py-3 shrink-0"
            style={{
              background: "#ffffff",
              borderTop: "1px solid rgba(184,92,110,0.12)",
            }}
          >
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                disabled={!connected}
                className="flex-1 px-4 py-2.5 text-[14px] outline-none resize-none disabled:opacity-50 leading-relaxed transition-all duration-200"
                style={{
                  minHeight: "44px",
                  maxHeight: "120px",
                  borderRadius: "99px",
                  background: "#FAF0E4",
                  border: "1px solid rgba(184,92,110,0.20)",
                  color: "#2E1A14",
                }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || !connected}
                aria-label="Send message"
                className="w-11 h-11 rounded-full flex items-center justify-center text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shrink-0 cursor-pointer active:scale-[0.93]"
                style={{
                  background:
                    "linear-gradient(135deg, #B85C6E 0%, #9A4F5E 100%)",
                  boxShadow: "0 3px 12px rgba(184,92,110,0.45)",
                }}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </>
      )}

      {showUnblockModal && (
        <BlockConfirmModal
          targetUserId={targetUserId}
          targetName={targetName}
          isCurrentlyBlocked={true}
          onClose={() => setShowUnblockModal(false)}
          onSuccess={(action) => {
            if (action === "unblocked") {
              setIBlockedThem(false);
              setIsBlocked(theyBlockedMe);
            }
            setShowUnblockModal(false);
          }}
        />
      )}
    </div>
  );
}
