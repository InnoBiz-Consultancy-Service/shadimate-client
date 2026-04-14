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
  ChevronUp,
  CheckCheck,
  Check,
  Clock,
} from "lucide-react";
import { getChatHistory } from "@/actions/chat/chat";
import type { Message } from "@/types/chat";
import { useSocket } from "@/hooks/useSocket";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function groupByDate(messages: Message[]): { label: string; msgs: Message[] }[] {
  const groups = new Map<string, Message[]>();
  for (const msg of messages) {
    const label = formatDateLabel(msg.createdAt);
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(msg);
  }
  return Array.from(groups.entries()).map(([label, msgs]) => ({ label, msgs }));
}

// ─── StatusTick ───────────────────────────────────────────────────────────────
function StatusTick({ status }: { status: Message["status"] | undefined }) {
  if (!status) return <Clock size={11} className="text-white/40 shrink-0" />;
  if (status === "seen")
    return <CheckCheck size={13} className="text-[#F0C070] shrink-0" />;
  if (status === "delivered")
    return <CheckCheck size={13} className="text-white/50 shrink-0" />;
  return <Check size={13} className="text-white/40 shrink-0" />;
}

// ─── MessageBubble ────────────────────────────────────────────────────────────
function MessageBubble({
  msg,
  isMine,
}: {
  msg: Message;
  isMine: boolean;
}) {
  return (
    <div
      className={`flex ${isMine ? "justify-end" : "justify-start"} animate-[fadeIn_0.15s_ease]`}
    >
      <div
        className={`max-w-[72%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
          ${isMine
            ? "bg-gradient-to-br from-brand to-[#c93d66] text-white rounded-tr-sm shadow-[0_2px_12px_rgba(232,84,122,0.3)]"
            : "bg-white/8 border border-white/10 text-slate-200 rounded-tl-sm"
          }
          ${msg._optimistic ? "opacity-70" : "opacity-100"}
        `}
      >
        <p className="break-words whitespace-pre-wrap">{msg.content}</p>
        <div className={`flex items-center gap-1 mt-1 ${isMine ? "justify-end" : "justify-start"}`}>
          <span className={`text-[10px] ${isMine ? "text-white/50" : "text-slate-600"}`}>
            {formatTime(msg.createdAt)}
          </span>
          {isMine && <StatusTick status={msg.status} />}
        </div>
      </div>
    </div>
  );
}

// ─── TypingIndicator ──────────────────────────────────────────────────────────
function TypingIndicator({ name }: { name: string }) {
  return (
    <div className="flex justify-start items-end gap-2 animate-[fadeIn_0.2s_ease]">
      <div className="bg-white/8 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.8s" }}
          />
        ))}
      </div>
      <span className="text-[10px] text-slate-600 mb-1">{name} is typing...</span>
    </div>
  );
}

// ─── PremiumGate ──────────────────────────────────────────────────────────────
function PremiumGate() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center mb-4 shadow-[0_0_22px_rgba(232,84,122,0.2)]">
        <Lock size={28} className="text-brand" />
      </div>
      <h2 className="font-syne text-white text-xl font-bold mb-2">Premium Required</h2>
      <p className="text-slate-500 text-sm max-w-xs leading-relaxed mb-6">
        Upgrade to Premium to send and receive messages on ShadiMate.
      </p>
      <Link
        href="/subscription"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-on-brand bg-gradient-to-r from-brand to-accent no-underline hover:scale-[1.02] transition-all duration-200 shadow-[0_0_22px_rgba(232,84,122,0.35)]"
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
  currentUserId: string;    // FIX: server থেকে JWT decode করে pass — কখনো empty না
  initialMessages: Message[];
  totalPages: number;
  token?: string;
  isPremium: boolean;       // FIX: server-side JWT subscription field থেকে আসে
}

// ─── Main ─────────────────────────────────────────────────────────────────────
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

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(totalPages > 1);
  const [loadingMore, startLoadMore] = useTransition();

  const bottomRef    = useRef<HTMLDivElement>(null);
  const topAnchorRef = useRef<HTMLDivElement>(null); // load-more scroll anchor
  const typingTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef     = useRef<HTMLTextAreaElement>(null);
  const seenSet      = useRef<Set<string>>(new Set()); // 중복 seen emit 방지

  // ── Socket callbacks ────────────────────────────────────────────────────────

  const handleNewMessage = useCallback(
    (msg: Message) => {
      if (msg.senderId !== targetUserId) return;
      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
      setPartnerTyping(false);
    },
    [targetUserId],
  );

  const handleMessageSent = useCallback((msg: Message) => {
    // FIX: tempId-based replacement — _optimistic flag দিয়ে temp message খুঁজি
    setMessages((prev) => {
      const tempIdx = prev.findIndex((m) => m._optimistic === true);
      if (tempIdx === -1) return prev; // fallback: নতুন করে যোগ করো না (duplicate এড়াতে)
      const updated = [...prev];
      updated[tempIdx] = {
        ...msg,
        _optimistic: false,
      };
      return updated;
    });
  }, []);

  const handleMessageSeen = useCallback(
    (payload: { messageId: string; conversationWith: string }) => {
      if (payload.conversationWith !== targetUserId) return;
      // সব আমার message-কে "seen" করো — backend সব updateMany করেছে
      setMessages((prev) =>
        prev.map((m) =>
          m.senderId === currentUserId && m.status !== "seen"
            ? { ...m, status: "seen" as const }
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

  const { connected, sendMessage, markSeen, emitTyping, emitStopTyping } =
    useSocket({
      token,
      myUserId: currentUserId, // FIX: stable prop, কখনো empty না
      onNewMessage:    handleNewMessage,
      onMessageSent:   handleMessageSent,
      onMessageSeen:   handleMessageSeen,
      onTyping:        handleTyping,
      onStopTyping:    handleStopTyping,
    });

  // ── Auto-scroll to bottom ───────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, partnerTyping]);

  // ── Mark incoming messages as seen ─────────────────────────────────────────
  // FIX: seenSet দিয়ে duplicate emit আটকাই
  useEffect(() => {
    if (!connected) return;
    messages
      .filter(
        (m) =>
          m.senderId === targetUserId &&
          m.status !== "seen" &&
          !m._optimistic &&
          !seenSet.current.has(m._id),
      )
      .forEach((m) => {
        seenSet.current.add(m._id);
        markSeen(m._id);
      });
  }, [messages, connected, targetUserId, markSeen]);

  // ── Send ────────────────────────────────────────────────────────────────────
  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text || !connected) return;

    // Optimistic message — _optimistic: true flag দিয়ে track করি
    const optimistic: Message = {
      _id:          `temp-${Date.now()}`,
      senderId:     currentUserId,
      receiverId:   targetUserId,
      content:      text,
      type:         "text",
      status:       "sent",
      createdAt:    new Date().toISOString(),
      _optimistic:  true,
    };

    setMessages((prev) => [...prev, optimistic]);
    setInput("");
    sendMessage(targetUserId, text);

    if (typingTimer.current) clearTimeout(typingTimer.current);
    emitStopTyping(targetUserId);
    setIsTyping(false);

    if (inputRef.current) inputRef.current.style.height = "auto";
  }, [input, connected, currentUserId, targetUserId, sendMessage, emitStopTyping]);

  // ── Typing ──────────────────────────────────────────────────────────────────
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);

      e.target.style.height = "auto";
      e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;

      if (!isTyping) {
        setIsTyping(true);
        emitTyping(targetUserId);
      }
      if (typingTimer.current) clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => {
        setIsTyping(false);
        emitStopTyping(targetUserId);
      }, 2000);
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

  // ── Load older messages ─────────────────────────────────────────────────────
  const loadMore = () => {
    const nextPage = page + 1;
    // FIX: scroll position ধরে রাখো — load হওয়ার আগের top element-এ
    const anchor = topAnchorRef.current;

    startLoadMore(async () => {
      const res = await getChatHistory(targetUserId, nextPage, 30);
      if (res.success && res.data && res.data.length > 0) {
        setMessages((prev) => [...res.data!, ...prev]);
        setPage(nextPage);
        setHasMore(nextPage < (res.meta?.totalPages ?? 1));
        // পুরনো message load হওয়ার পর scroll position restore করো
        requestAnimationFrame(() => {
          anchor?.scrollIntoView({ block: "start" });
        });
      } else {
        setHasMore(false);
      }
    });
  };

  const groups = groupByDate(messages);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="font-outfit flex flex-col h-[100dvh] md:h-[calc(100vh-4rem)] max-w-2xl mx-auto">

      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8 bg-[rgba(18,8,16,0.9)] backdrop-blur-xl shrink-0 z-10">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand/40 to-accent/30 border border-white/10 flex items-center justify-center shrink-0">
          <span className="font-syne text-white font-bold text-sm">
            {targetName.charAt(0).toUpperCase()}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-syne text-white font-bold text-sm truncate">{targetName}</p>
          <p className={`text-[11px] transition-colors duration-300 ${
            partnerTyping
              ? "text-brand"
              : connected
              ? "text-emerald-400"
              : "text-slate-600"
          }`}>
            {partnerTyping ? "typing..." : connected ? "online" : "connecting..."}
          </p>
        </div>

        <div className={`w-2 h-2 rounded-full shrink-0 transition-all duration-300 ${
          connected
            ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.7)]"
            : "bg-slate-600"
        }`} />
      </div>

      {/* ── Body ── */}
      {!isPremium ? (
        <PremiumGate />
      ) : (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 overscroll-contain">

            {/* Load more */}
            {hasMore && (
              <div className="flex justify-center pb-4">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="font-outfit flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs text-slate-400 bg-white/5 border border-white/10 hover:bg-white/8 transition-all cursor-pointer disabled:opacity-50"
                >
                  {loadingMore
                    ? <><Loader2 size={12} className="animate-spin" /> Loading...</>
                    : <><ChevronUp size={12} /> Load older messages</>
                  }
                </button>
              </div>
            )}

            {/* Scroll anchor for load-more position restore */}
            <div ref={topAnchorRef} />

            {/* Empty conversation */}
            {groups.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-14 h-14 rounded-2xl bg-brand/8 border border-brand/15 flex items-center justify-center mb-3">
                  <span className="text-2xl">💬</span>
                </div>
                <p className="font-syne text-white font-bold text-sm mb-1">
                  Start the conversation
                </p>
                <p className="text-slate-600 text-xs">Say hello to {targetName}!</p>
              </div>
            )}

            {/* Message groups */}
            {groups.map(({ label, msgs }) => (
              <div key={label} className="space-y-1.5 mb-2">
                <div className="flex items-center justify-center py-3">
                  <span className="font-outfit text-[10px] text-slate-600 bg-white/5 border border-white/8 rounded-full px-3 py-1">
                    {label}
                  </span>
                </div>
                {msgs.map((msg) => (
                  <MessageBubble
                    key={msg._id}
                    msg={msg}
                    isMine={msg.senderId === currentUserId} // FIX: stable prop
                  />
                ))}
              </div>
            ))}

            {/* Typing indicator */}
            {partnerTyping && (
              <div className="mt-1">
                <TypingIndicator name={targetName} />
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-white/8 bg-[rgba(18,8,16,0.9)] backdrop-blur-xl shrink-0">
            <div className="flex items-end gap-2.5">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={connected ? `Message ${targetName}...` : "Connecting..."}
                disabled={!connected}
                className="font-outfit flex-1 px-4 py-3 rounded-2xl text-sm text-slate-100 placeholder-slate-600 bg-white/7 border border-white/10 outline-none focus:border-brand/40 transition-all duration-200 resize-none disabled:opacity-50 leading-relaxed"
                style={{ minHeight: "48px", maxHeight: "120px" }}
              />

              <button
                onClick={handleSend}
                disabled={!input.trim() || !connected}
                aria-label="Send message"
                className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-brand to-[#c93d66] text-white shadow-[0_0_16px_rgba(232,84,122,0.4)] hover:scale-[1.05] hover:shadow-[0_0_22px_rgba(232,84,122,0.55)] active:scale-[0.95] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 shrink-0 cursor-pointer border-0"
              >
                <Send size={17} />
              </button>
            </div>
            <p className="text-[10px] text-slate-700 text-center mt-1.5">
              Enter to send · Shift+Enter for new line
            </p>
          </div>
        </>
      )}
    </div>
  );
}
