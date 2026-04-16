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

// Fixed time formatter
function formatWhatsAppTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return "";
  }
  
  const isToday = date.toDateString() === now.toDateString();
  
  if (isToday) {
    // Format: "7:22 PM" (properly formatted)
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }
  
  // For older messages, show date
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
  
  // Reset time part for comparison
  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);
  const msgDate = new Date(date);
  msgDate.setHours(0, 0, 0, 0);
  
  if (msgDate.getTime() === today.getTime()) return "Today";
  if (msgDate.getTime() === yesterday.getTime()) return "Yesterday";
  
  // Within current year
  if (date.getFullYear() === today.getFullYear()) {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
  }
  
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function groupByDate(messages: Message[]): { label: string; msgs: Message[] }[] {
  const groups = new Map<string, Message[]>();
  
  // Sort messages by date first
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

// ─── WhatsApp Style Status Icons ──────────────────────────────────────────────
function WhatsAppStatusIcon({ status, isMine }: { status: Message["status"] | undefined; isMine: boolean }) {
  if (!isMine) return null;
  
  if (status === "seen") {
    return <CheckCheck size={14} className="text-[#53bdeb] shrink-0" />;
  }
  
  if (status === "delivered") {
    return <CheckCheck size={14} className="text-[#8696a0] shrink-0" />;
  }
  
  if (status === "sent") {
    return <Check size={14} className="text-[#8696a0] shrink-0" />;
  }
  
  if (status === "error") {
    return <Clock size={12} className="text-red-400 shrink-0" />;
  }
  
  return <Check size={14} className="text-[#8696a0] shrink-0" />;
}

// ─── WhatsApp Style Message Bubble ────────────────────────────────────────────
function WhatsAppMessageBubble({ msg, isMine }: { msg: Message; isMine: boolean }) {
  if (!msg.content || msg.content.trim() === "") {
    return null;
  }
  
  // Ensure we have a valid time
  const timeString = formatWhatsAppTime(msg.createdAt);
  
  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"} mb-1`}>
      <div className={`relative flex ${isMine ? "justify-end" : "justify-start"} max-w-[75%]`}>
        <div
          className={`relative px-3 py-2 text-sm leading-relaxed ${
            isMine
              ? "bg-[#005c4b] text-white rounded-l-lg rounded-br-lg"
              : "bg-[#202c33] text-white rounded-r-lg rounded-bl-lg"
          }`}
        >
          <p className="break-words whitespace-pre-wrap pr-12">{msg.content}</p>
          
          <div className="absolute bottom-1 right-2 flex items-center gap-0.5">
            <span className="text-[9px] text-white/50">
              {timeString}
            </span>
            <WhatsAppStatusIcon status={msg.status} isMine={isMine} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Typing Indicator ────────────────────────────────────────────────────────
function WhatsAppTypingIndicator({ name }: { name: string }) {
  return (
    <div className="flex justify-start mb-1">
      <div className="bg-[#202c33] rounded-r-lg rounded-bl-lg px-4 py-2.5">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#8696a0] animate-bounce" style={{ animationDelay: "0s", animationDuration: "1s" }} />
          <div className="w-1.5 h-1.5 rounded-full bg-[#8696a0] animate-bounce" style={{ animationDelay: "0.2s", animationDuration: "1s" }} />
          <div className="w-1.5 h-1.5 rounded-full bg-[#8696a0] animate-bounce" style={{ animationDelay: "0.4s", animationDuration: "1s" }} />
        </div>
      </div>
      <span className="text-[10px] text-[#8696a0] ml-2 mt-2">{name} is typing...</span>
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
      <h2 className="font-syne text-white text-xl font-bold mb-2">
        Premium Required
      </h2>
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
  currentUserId: string;
  initialMessages: Message[];
  totalPages: number;
  token?: string;
  isPremium: boolean;
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

  // Debug logs
  console.log("=== ChatRoomClient Initialization ===");
  console.log("Target User ID:", targetUserId);
  console.log("Current User ID:", currentUserId);
  console.log("Initial Messages Count:", initialMessages?.length || 0);
  console.log("Total Pages:", totalPages);
  console.log("Is Premium:", isPremium);
  
  if (initialMessages && initialMessages.length > 0) {
    console.log("Sample initial message:", {
      id: initialMessages[0]._id,
      content: initialMessages[0].content,
      senderId: initialMessages[0].senderId,
      createdAt: initialMessages[0].createdAt
    });
  }

  // Initialize messages state
  const [messages, setMessages] = useState<Message[]>(() => {
    if (!initialMessages || !Array.isArray(initialMessages)) {
      console.log("No initial messages provided");
      return [];
    }
    
    // Filter out invalid messages
    const validMessages = initialMessages.filter(
      msg => msg && msg.content && typeof msg.content === 'string' && msg.content.trim() !== ""
    );
    
    // Sort by createdAt (oldest first)
    const sorted = [...validMessages].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    
    console.log(`Processed ${sorted.length} valid messages from initial`);
    return sorted;
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

  // Socket event handlers
  const handleNewMessage = useCallback(
    (msg: Message) => {
      console.log("📩 New message received:", msg);
      
      if (!msg.content || msg.content.trim() === "") {
        return;
      }
      
      // Check if message belongs to current conversation
      if (msg.senderId !== targetUserId && msg.receiverId !== targetUserId) {
        return;
      }
      
      setMessages((prev) => {
        // Check if message already exists
        if (prev.some((m) => m._id === msg._id)) {
          return prev;
        }
        
        // Check if this is replacing an optimistic message
        const optimisticIndex = prev.findIndex(
          (m) => m._optimistic === true && 
          m.content === msg.content && 
          m.senderId === currentUserId
        );
        
        if (optimisticIndex !== -1) {
          console.log("Replacing optimistic message");
          const updated = [...prev];
          updated[optimisticIndex] = { ...msg, _optimistic: false };
          return updated;
        }
        
        // Add new message
        console.log("Adding new message to state");
        return [...prev, msg];
      });
      
      if (msg.senderId === targetUserId) {
        setPartnerTyping(false);
      }
      
      // Scroll to bottom
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    },
    [targetUserId, currentUserId]
  );

  const handleMessageSent = useCallback((msg: Message) => {
    console.log("✅ Message sent confirmation:", msg);
    
    setMessages((prev) => {
      const tempIndex = prev.findIndex(
        (m) => m._optimistic === true && 
        m.content === msg.content && 
        m.senderId === currentUserId
      );
      
      if (tempIndex !== -1) {
        console.log("Replacing optimistic with confirmed");
        const updated = [...prev];
        updated[tempIndex] = { ...msg, _optimistic: false };
        return updated;
      }
      
      if (!prev.some((m) => m._id === msg._id)) {
        return [...prev, msg];
      }
      
      return prev;
    });
  }, [currentUserId]);

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
        
        const timer = setTimeout(() => {
          setPartnerTyping(false);
        }, 3000);
        
        return () => clearTimeout(timer);
      }
    },
    [targetUserId]
  );

  const handleStopTyping = useCallback(
    (fromUserId: string) => {
      if (fromUserId === targetUserId) {
        setPartnerTyping(false);
      }
    },
    [targetUserId]
  );

  const handleUserOnline = useCallback((userId: string) => {
    if (userId === targetUserId) {
      console.log("Partner came online");
      setIsPartnerOnline(true);
      setLastSeen(null);
    }
  }, [targetUserId]);

  const handleUserOffline = useCallback((payload: { userId: string; lastSeen: string }) => {
    if (payload.userId === targetUserId) {
      console.log("Partner went offline");
      setIsPartnerOnline(false);
      setLastSeen(new Date(payload.lastSeen));
    }
  }, [targetUserId]);

  const { connected, sendMessage, markSeen, markDelivered, emitTyping, emitStopTyping } =
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

  // Show offline indicator when disconnected
  useEffect(() => {
    if (!connected) {
      setShowOffline(true);
      const timer = setTimeout(() => setShowOffline(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [connected]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  // Mark incoming messages as seen
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

  // Send message
  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text || !connected) {
      if (!connected) {
        setShowOffline(true);
        setTimeout(() => setShowOffline(false), 3000);
      }
      return;
    }

    const tempId = `temp-${Date.now()}-${Math.random()}`;
    const optimistic: Message = {
      _id: tempId,
      senderId: currentUserId,
      receiverId: targetUserId,
      content: text,
      type: "text",
      status: "sent",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      _optimistic: true,
    };

    console.log("📤 Sending message:", text);
    
    setMessages((prev) => [...prev, optimistic]);
    setInput("");
    
    if (typingTimer.current) clearTimeout(typingTimer.current);
    emitStopTyping(targetUserId);
    setIsTyping(false);
    
    if (inputRef.current) inputRef.current.style.height = "auto";

    sendMessage(targetUserId, text);
    
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [input, connected, currentUserId, targetUserId, sendMessage, emitStopTyping]);

  // Typing handler
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

  // Load older messages
  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    const anchor = topAnchorRef.current;
    
    startLoadMore(async () => {
      setIsLoading(true);
      try {
        console.log(`Loading page ${nextPage}...`);
        const res = await getChatHistory(targetUserId, nextPage, 30);
        
        console.log("Load more response:", {
          success: res.success,
          count: res.data?.length,
          hasMore: nextPage < (res.meta?.totalPages ?? 1)
        });
        
        if (res.success && res.data && res.data.length > 0) {
          const filteredMessages = res.data.filter(
            msg => msg && msg.content && typeof msg.content === 'string' && msg.content.trim() !== ""
          );
          
          const sorted = [...filteredMessages].sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          
          setMessages((prev) => [...sorted, ...prev]);
          setPage(nextPage);
          setHasMore(nextPage < (res.meta?.totalPages ?? 1));
          
          requestAnimationFrame(() => {
            anchor?.scrollIntoView({ block: "start" });
          });
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

  const groups = groupByDate(messages);

  // Debug log for groups
  useEffect(() => {
    console.log("=== Messages State Updated ===");
    console.log("Total messages:", messages.length);
    console.log("Groups:", groups.map(g => ({ label: g.label, count: g.msgs.length })));
    
    if (messages.length > 0) {
      console.log("Last message:", {
        content: messages[messages.length - 1].content,
        senderId: messages[messages.length - 1].senderId,
        createdAt: messages[messages.length - 1].createdAt
      });
    }
  }, [messages, groups]);

  // Get status text
  const getStatusText = () => {
    if (partnerTyping) return "typing...";
    if (isPartnerOnline) return "online";
    if (lastSeen) {
      const now = new Date();
      const diffMinutes = Math.floor((now.getTime() - lastSeen.getTime()) / (1000 * 60));
      
      if (diffMinutes < 1) return "online";
      if (diffMinutes < 5) return "last seen recently";
      if (diffMinutes < 60) return `last seen ${diffMinutes} minutes ago`;
      if (diffMinutes < 1440) return `last seen ${Math.floor(diffMinutes / 60)} hours ago`;
      return `last seen ${lastSeen.toLocaleDateString()}`;
    }
    return "offline";
  };

  return (
    <div className="font-outfit flex flex-col h-[100dvh] md:h-[calc(100vh-4rem)] max-w-2xl mx-auto bg-[#111b21]">

      {/* Header - WhatsApp Style */}
      <div className="flex items-center gap-3 px-4 py-2 bg-[#202c33] border-b border-[#2a3942] shrink-0 z-10">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full flex items-center justify-center text-[#aebac1] hover:bg-[#2a3942] transition-all cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand/40 to-accent/30 flex items-center justify-center shrink-0">
          <span className="font-syne text-white font-bold text-sm">
            {targetName?.charAt(0)?.toUpperCase() || "?"}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-white font-medium text-sm truncate">
            {targetName}
          </p>
          <p className="text-[11px] text-[#8696a0] truncate">
            {getStatusText()}
          </p>
        </div>

        <div
          className={`w-2 h-2 rounded-full shrink-0 transition-all duration-300 ${
            isPartnerOnline
              ? "bg-[#25d366] shadow-[0_0_6px_rgba(37,211,102,0.7)] animate-pulse"
              : "bg-[#8696a0]"
          }`}
        />
      </div>

      {/* Offline Toast */}
      {showOffline && (
        <div className="absolute top-14 left-1/2 transform -translate-x-1/2 bg-[#202c33] text-[#e9f0e8] px-4 py-2 rounded-full text-xs flex items-center gap-2 z-50 shadow-lg">
          <WifiOff size={12} />
          <span>Connecting...</span>
        </div>
      )}

      {/* Body */}
      {!isPremium ? (
        <PremiumGate />
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-4 py-2 overscroll-contain bg-[#0b141a] bg-[url('https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png')] bg-repeat">
            {hasMore && (
              <div className="flex justify-center py-3">
                <button
                  onClick={loadMore}
                  disabled={loadingMore || isLoading}
                  className="text-[#53bdeb] text-xs hover:text-[#3ea6da] transition-colors"
                >
                  {loadingMore || isLoading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    "Load more messages"
                  )}
                </button>
              </div>
            )}

            <div ref={topAnchorRef} />

            {groups.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-14 h-14 rounded-full bg-[#202c33] flex items-center justify-center mb-3">
                  <MessageCircle size={24} className="text-[#8696a0]" />
                </div>
                <p className="text-[#e9f0e8] font-medium text-sm mb-1">
                  No messages yet
                </p>
                <p className="text-[#8696a0] text-xs">
                  Say hello to {targetName}!
                </p>
              </div>
            )}

            {groups.map(({ label, msgs }) => (
              <div key={label} className="mb-4">
                <div className="flex items-center justify-center py-2">
                  <span className="text-[11px] text-[#8696a0] bg-[#202c33] rounded-full px-3 py-1 shadow-sm">
                    {label}
                  </span>
                </div>
                {msgs.map((msg) => (
                  <WhatsAppMessageBubble
                    key={msg._id}
                    msg={msg}
                    isMine={msg.senderId === currentUserId}
                  />
                ))}
              </div>
            ))}

            {partnerTyping && (
              <WhatsAppTypingIndicator name={targetName} />
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input bar */}
          <div className="px-3 py-2 bg-[#202c33] shrink-0">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type a message"
                disabled={!connected}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm text-[#e9f0e8] placeholder-[#8696a0] bg-[#2a3942] border-none outline-none focus:ring-0 resize-none disabled:opacity-50 leading-relaxed"
                style={{ minHeight: "42px", maxHeight: "120px" }}
              />

              <button
                onClick={handleSend}
                disabled={!input.trim() || !connected}
                aria-label="Send message"
                className="w-10 h-10 rounded-full flex items-center justify-center text-[#53bdeb] hover:bg-[#2a3942] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent shrink-0 cursor-pointer"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}