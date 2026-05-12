"use client";

/**
 * SocketContext — Global singleton socket provider
 *
 * এই file টা পুরো app এ একটাই socket connection maintain করে।
 * AppBar, ChatClient, ChatRoomClient সবাই এই context থেকে socket use করবে।
 * এতে multiple connection এর সমস্যা থাকবে না।
 */

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Socket } from "socket.io-client";
import type { Message } from "@/types/chat";

// ─── Types ────────────────────────────────────────────────────────────────────

type MessageSeenPayload = { messageId: string; conversationWith: string };
type MessageDeliveredPayload = { messageId: string; conversationWith: string };
type UserOfflinePayload = { userId: string; lastSeen: string };

interface SocketContextValue {
  connected: boolean;
  /** Unread message count — AppBar badge এর জন্য */
  unreadCount: number;
  /** নির্দিষ্ট conversation এর unread clear করব */
  clearUnread: (userId: string) => void;
  /** একটা conversation এ unread +1 করব */
  addUnread: (userId: string) => void;

  // Emitters
  sendMessage: (receiverId: string, message: string, type?: string) => void;
  markSeen: (messageId: string) => void;
  markDelivered: (messageId: string) => void;
  emitTyping: (toUserId: string) => void;
  emitStopTyping: (toUserId: string) => void;

  // Event subscription — component নিজে register করবে
  onNewMessage: (handler: (msg: Message) => void) => () => void;
  onMessageSent: (handler: (msg: Message) => void) => () => void;
  onMessageSeen: (handler: (p: MessageSeenPayload) => void) => () => void;
  onMessageDelivered: (handler: (p: MessageDeliveredPayload) => void) => () => void;
  onTyping: (handler: (userId: string) => void) => () => void;
  onStopTyping: (handler: (userId: string) => void) => () => void;
  onUserOnline: (handler: (userId: string) => void) => () => void;
  onUserOffline: (handler: (p: UserOfflinePayload) => void) => () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const SocketContext = createContext<SocketContextValue | null>(null);

// ─── Helper: JWT decode ───────────────────────────────────────────────────────

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

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function SocketProvider({ children }: { children: ReactNode }) {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  /**
   * unreadByUser: { [userId]: count }
   * প্রতিটা conversation এর আলাদা count রাখি, যাতে specific conversation
   * seen করলে সেটার count কমানো যায়।
   */
  const unreadByUserRef = useRef<Record<string, number>>({});
  const [unreadCount, setUnreadCount] = useState(0);

  // Listener sets — multiple component same event শুনতে পারবে
  const newMessageListeners = useRef<Set<(msg: Message) => void>>(new Set());
  const messageSentListeners = useRef<Set<(msg: Message) => void>>(new Set());
  const messageSeenListeners = useRef<Set<(p: MessageSeenPayload) => void>>(new Set());
  const messageDeliveredListeners = useRef<Set<(p: MessageDeliveredPayload) => void>>(new Set());
  const typingListeners = useRef<Set<(userId: string) => void>>(new Set());
  const stopTypingListeners = useRef<Set<(userId: string) => void>>(new Set());
  const userOnlineListeners = useRef<Set<(userId: string) => void>>(new Set());
  const userOfflineListeners = useRef<Set<(p: UserOfflinePayload) => void>>(new Set());

  // ── Unread helpers ──────────────────────────────────────────────────────────

  const recalcTotal = useCallback(() => {
    const total = Object.values(unreadByUserRef.current).reduce(
      (sum, n) => sum + n,
      0,
    );
    setUnreadCount(total);
  }, []);

  const addUnread = useCallback(
    (userId: string) => {
      unreadByUserRef.current[userId] =
        (unreadByUserRef.current[userId] ?? 0) + 1;
      recalcTotal();
    },
    [recalcTotal],
  );

  const clearUnread = useCallback(
    (userId: string) => {
      if (unreadByUserRef.current[userId]) {
        unreadByUserRef.current[userId] = 0;
        recalcTotal();
      }
    },
    [recalcTotal],
  );

  // ── Socket setup ────────────────────────────────────────────────────────────

  useEffect(() => {
    let mounted = true;

    const setup = async () => {
      // token + userId cookie থেকে নেব
      const token = getCookie("accessToken");
      if (!token) return;

      const payload = decodeJwt(token);
      const userId =
        payload?.id && typeof payload.id === "string" ? payload.id : null;
      if (!userId) return;

      // আগে থেকে connected থাকলে নতুন connection করব না
      if (socketRef.current?.connected) return;

      try {
        const { io } = await import("socket.io-client");
        const serverUrl =
          process.env.NEXT_PUBLIC_SOCKET_URL ||
          process.env.NEXT_PUBLIC_BASE_URL ||
          "";
        if (!serverUrl || !mounted) return;

        const cleanToken = token.startsWith("Bearer ")
          ? token.slice(7)
          : token;

        const socket = io(serverUrl, {
          query: { token: cleanToken, userId },
          transports: ["websocket"],
          reconnection: true,
          reconnectionDelay: 2000,
          reconnectionDelayMax: 10000,
          reconnectionAttempts: Infinity,
        });

        socketRef.current = socket;

        // ── Connection events ─────────────────────────────────────────────────

        socket.on("connect", () => {
          if (!mounted) return;
          setConnected(true);
          console.log("✅ [SocketContext] Connected:", socket.id);
        });

        socket.on("connect_error", (err) => {
          if (!mounted) return;
          setConnected(false);
          console.error("❌ [SocketContext] Connect error:", err.message);
        });

        socket.on("disconnect", (reason) => {
          if (!mounted) return;
          setConnected(false);
          console.log("🔌 [SocketContext] Disconnected:", reason);
          if (reason === "io server disconnect") socket.connect();
        });

        socket.on("unauthorized", (data: { message: string }) => {
          console.error("🚫 [SocketContext] Unauthorized:", data.message);
          socket.disconnect();
        });

        // ── Message events ────────────────────────────────────────────────────

        socket.on("receive-message", (msg: Message) => {
          if (!mounted) return;
          // badge count — open chat এ থাকলে count করব না
          const currentPath = window.location.pathname;
          const isInThisChat = currentPath === `/chat/${msg.senderId}`;
          if (!isInThisChat) {
            addUnread(msg.senderId);
          }
          newMessageListeners.current.forEach((fn) => fn(msg));
        });

        socket.on("message-sent", (msg: Message) => {
          if (!mounted) return;
          messageSentListeners.current.forEach((fn) => fn(msg));
        });

        socket.on("message-seen", (payload: MessageSeenPayload) => {
          if (!mounted) return;
          messageSeenListeners.current.forEach((fn) => fn(payload));
        });

        socket.on("message-delivered", (payload: MessageDeliveredPayload) => {
          if (!mounted) return;
          messageDeliveredListeners.current.forEach((fn) => fn(payload));
        });

        // ── Typing ────────────────────────────────────────────────────────────

        socket.on("typing", ({ fromUserId }: { fromUserId: string }) => {
          if (!mounted) return;
          typingListeners.current.forEach((fn) => fn(fromUserId));
        });

        socket.on("stop-typing", ({ fromUserId }: { fromUserId: string }) => {
          if (!mounted) return;
          stopTypingListeners.current.forEach((fn) => fn(fromUserId));
        });

        // ── Presence ──────────────────────────────────────────────────────────

        socket.on("user-online", (uid: string) => {
          if (!mounted) return;
          userOnlineListeners.current.forEach((fn) => fn(uid));
        });

        socket.on("online-users", (uids: string[]) => {
          if (!mounted) return;
          uids.forEach((uid) =>
            userOnlineListeners.current.forEach((fn) => fn(uid)),
          );
        });

        socket.on("user-offline", (payload: UserOfflinePayload) => {
          if (!mounted) return;
          userOfflineListeners.current.forEach((fn) => fn(payload));
        });

        // ── Pending notifications — initial unread count সেট ─────────────────

        socket.on(
          "pending-notifications",
          (
            notifications: Array<{
              type: string;
              isRead?: boolean;
              metadata?: { conversationWith?: string };
            }>,
          ) => {
            if (!mounted) return;
            // unread message notifications গুলো conversation অনুযায়ী count করি
            const fresh: Record<string, number> = {};
            notifications
              .filter((n) => n.type === "new_message" && !n.isRead && n.metadata?.conversationWith)
              .forEach((n) => {
                const partnerId = n.metadata!.conversationWith!;
                fresh[partnerId] = (fresh[partnerId] ?? 0) + 1;
              });
            unreadByUserRef.current = fresh;
            recalcTotal();
          },
        );
      } catch (err) {
        console.error("[SocketContext] Setup error:", err);
      }
    };

    setup();

    return () => {
      mounted = false;
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setConnected(false);
    };
  }, []); // একবারই setup হবে

  // ── Emitters ─────────────────────────────────────────────────────────────────

  const sendMessage = useCallback(
    (receiverId: string, message: string, type = "text") => {
      socketRef.current?.emit("send-message", { receiverId, message, type });
    },
    [],
  );

  const markSeen = useCallback((messageId: string) => {
    socketRef.current?.emit("seen", { messageId });
  }, []);

  const markDelivered = useCallback((messageId: string) => {
    socketRef.current?.emit("delivered", { messageId });
  }, []);

  const emitTyping = useCallback((toUserId: string) => {
    socketRef.current?.emit("typing", { toUserId });
  }, []);

  const emitStopTyping = useCallback((toUserId: string) => {
    socketRef.current?.emit("stop-typing", { toUserId });
  }, []);

  // ── Event subscription helpers ────────────────────────────────────────────

  const onNewMessage = useCallback((handler: (msg: Message) => void) => {
    newMessageListeners.current.add(handler);
    return () => newMessageListeners.current.delete(handler);
  }, []);

  const onMessageSent = useCallback((handler: (msg: Message) => void) => {
    messageSentListeners.current.add(handler);
    return () => messageSentListeners.current.delete(handler);
  }, []);

  const onMessageSeen = useCallback((handler: (p: MessageSeenPayload) => void) => {
    messageSeenListeners.current.add(handler);
    return () => messageSeenListeners.current.delete(handler);
  }, []);

  const onMessageDelivered = useCallback(
    (handler: (p: MessageDeliveredPayload) => void) => {
      messageDeliveredListeners.current.add(handler);
      return () => messageDeliveredListeners.current.delete(handler);
    },
    [],
  );

  const onTyping = useCallback((handler: (userId: string) => void) => {
    typingListeners.current.add(handler);
    return () => typingListeners.current.delete(handler);
  }, []);

  const onStopTyping = useCallback((handler: (userId: string) => void) => {
    stopTypingListeners.current.add(handler);
    return () => stopTypingListeners.current.delete(handler);
  }, []);

  const onUserOnline = useCallback((handler: (userId: string) => void) => {
    userOnlineListeners.current.add(handler);
    return () => userOnlineListeners.current.delete(handler);
  }, []);

  const onUserOffline = useCallback(
    (handler: (p: UserOfflinePayload) => void) => {
      userOfflineListeners.current.add(handler);
      return () => userOfflineListeners.current.delete(handler);
    },
    [],
  );

  return (
    <SocketContext.Provider
      value={{
        connected,
        unreadCount,
        clearUnread,
        addUnread,
        sendMessage,
        markSeen,
        markDelivered,
        emitTyping,
        emitStopTyping,
        onNewMessage,
        onMessageSent,
        onMessageSeen,
        onMessageDelivered,
        onTyping,
        onStopTyping,
        onUserOnline,
        onUserOffline,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSocketContext() {
  const ctx = useContext(SocketContext);
  if (!ctx) {
    throw new Error("useSocketContext must be used within <SocketProvider>");
  }
  return ctx;
}
