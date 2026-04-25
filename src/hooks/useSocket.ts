"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Message } from "@/types/chat";

interface UseSocketProps {
  token?: string;
  myUserId: string;
  onNewMessage?: (msg: Message) => void;
  onMessageSent?: (msg: Message) => void;
  onMessageSeen?: (payload: {
    messageId: string;
    conversationWith: string;
  }) => void;
  onMessageDelivered?: (payload: {
    messageId: string;
    conversationWith: string;
  }) => void;
  onTyping?: (userId: string) => void;
  onStopTyping?: (userId: string) => void;
  onUserOnline?: (userId: string) => void;
  onUserOffline?: (payload: { userId: string; lastSeen: string }) => void;
  onNotification?: (notification: any) => void;
  onPendingNotifications?: (notifications: any[]) => void;
}

export function useSocket({
  token,
  myUserId,
  onNewMessage,
  onMessageSent,
  onMessageSeen,
  onMessageDelivered,
  onTyping,
  onStopTyping,
  onUserOnline,
  onUserOffline,
  onNotification,
  onPendingNotifications,
}: UseSocketProps) {
  const socketRef = useRef<import("socket.io-client").Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // ✅ Stable callback refs
  const onNewMessageRef = useRef(onNewMessage);
  const onMessageSentRef = useRef(onMessageSent);
  const onMessageSeenRef = useRef(onMessageSeen);
  const onMessageDeliveredRef = useRef(onMessageDelivered);
  const onTypingRef = useRef(onTyping);
  const onStopTypingRef = useRef(onStopTyping);
  const onUserOnlineRef = useRef(onUserOnline);
  const onUserOfflineRef = useRef(onUserOffline);
  const onNotificationRef = useRef(onNotification);
  const onPendingNotificationsRef = useRef(onPendingNotifications);

  useEffect(() => { onNewMessageRef.current = onNewMessage; }, [onNewMessage]);
  useEffect(() => { onMessageSentRef.current = onMessageSent; }, [onMessageSent]);
  useEffect(() => { onMessageSeenRef.current = onMessageSeen; }, [onMessageSeen]);
  useEffect(() => { onMessageDeliveredRef.current = onMessageDelivered; }, [onMessageDelivered]);
  useEffect(() => { onTypingRef.current = onTyping; }, [onTyping]);
  useEffect(() => { onStopTypingRef.current = onStopTyping; }, [onStopTyping]);
  useEffect(() => { onUserOnlineRef.current = onUserOnline; }, [onUserOnline]);
  useEffect(() => { onUserOfflineRef.current = onUserOffline; }, [onUserOffline]);
  useEffect(() => { onNotificationRef.current = onNotification; }, [onNotification]);
  useEffect(() => { onPendingNotificationsRef.current = onPendingNotifications; }, [onPendingNotifications]);

  useEffect(() => {
    if (!token || !myUserId) return;

    // ✅ আগে থেকে connected থাকলে নতুন connection করো না
    if (socketRef.current?.connected) return;

    let mounted = true;

    const setup = async () => {
      try {
        const { io } = await import("socket.io-client");
        const serverUrl =
          process.env.NEXT_PUBLIC_SOCKET_URL ||
          process.env.NEXT_PUBLIC_BASE_URL ||
          "";

        if (!serverUrl || !mounted) return;

        // ✅ Bearer prefix strip করো
        const cleanToken = token.startsWith("Bearer ")
          ? token.slice(7)
          : token;

        const socket = io(serverUrl, {
          query: { token: cleanToken, userId: myUserId },
          transports: ["websocket"], // ✅ polling বাদ — double connect বন্ধ
          reconnection: true,
          reconnectionDelay: 2000,
          reconnectionDelayMax: 10000,
          reconnectionAttempts: Infinity,
        });

        socketRef.current = socket;

        // ── Connection events ──
        socket.on("connect", () => {
          if (mounted) {
            setConnected(true);
            setConnectionError(null);
            console.log("✅ Socket connected:", socket.id);
          }
        });

        socket.on("connect_error", (error) => {
          if (mounted) {
            setConnected(false);
            setConnectionError(error.message);
            console.error("❌ Socket connect error:", error.message);
          }
        });

        socket.on("disconnect", (reason) => {
          if (mounted) {
            setConnected(false);
            console.log("🔌 Socket disconnected:", reason);
            if (reason === "io server disconnect") {
              socket.connect();
            }
          }
        });

        socket.on("unauthorized", (data: { message: string }) => {
          console.error("🚫 Unauthorized:", data.message);
          setConnectionError(data.message);
          socket.disconnect();
        });

        // ── Chat events ──
        socket.on("receive-message", (msg: Message) => {
          if (mounted) onNewMessageRef.current?.(msg);
        });

        socket.on("message-sent", (msg: Message) => {
          if (mounted) onMessageSentRef.current?.(msg);
        });

        socket.on("message-seen", (payload: { messageId: string; conversationWith: string }) => {
          if (mounted) onMessageSeenRef.current?.(payload);
        });

        socket.on("message-delivered", (payload: { messageId: string; conversationWith: string }) => {
          if (mounted) onMessageDeliveredRef.current?.(payload);
        });

        // ── Typing events ──
        socket.on("typing", ({ fromUserId }: { fromUserId: string }) => {
          if (mounted) onTypingRef.current?.(fromUserId);
        });

        socket.on("stop-typing", ({ fromUserId }: { fromUserId: string }) => {
          if (mounted) onStopTypingRef.current?.(fromUserId);
        });

        // ── Presence events ──
        socket.on("user-online", (userId: string) => {
          if (mounted) onUserOnlineRef.current?.(userId);
        });

        socket.on("user-offline", (payload: { userId: string; lastSeen: string }) => {
          if (mounted) onUserOfflineRef.current?.(payload);
        });

        // ✅ নতুন — connect হওয়ার সময় currently online সব user এর list
        socket.on("online-users", (userIds: string[]) => {
          if (mounted) {
            userIds.forEach((id) => onUserOnlineRef.current?.(id));
          }
        });

        // ── Notification events ──
        socket.on("new-notification", (notification: any) => {
          if (mounted) onNotificationRef.current?.(notification);
        });

        // ✅ নতুন — connect হওয়ার সময় pending notifications
        socket.on("pending-notifications", (notifications: any[]) => {
          if (mounted) onPendingNotificationsRef.current?.(notifications);
        });

      } catch (error) {
        if (mounted) {
          setConnectionError(
            error instanceof Error ? error.message : "Failed to connect"
          );
        }
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
      setConnectionError(null);
    };
  }, [token, myUserId]); // ✅ শুধু এই দুটো dependency

  // ── Emitters ──
  const sendMessage = useCallback(
    (receiverId: string, message: string, type = "text") => {
      if (!socketRef.current?.connected) return;
      socketRef.current.emit("send-message", { receiverId, message, type });
    },
    []
  );

  const markSeen = useCallback((messageId: string) => {
    if (!socketRef.current?.connected) return;
    socketRef.current.emit("seen", { messageId });
  }, []);

  const markDelivered = useCallback((messageId: string) => {
    if (!socketRef.current?.connected) return;
    socketRef.current.emit("delivered", { messageId });
  }, []);

  const emitTyping = useCallback((toUserId: string) => {
    if (!socketRef.current?.connected) return;
    socketRef.current.emit("typing", { toUserId });
  }, []);

  const emitStopTyping = useCallback((toUserId: string) => {
    if (!socketRef.current?.connected) return;
    socketRef.current.emit("stop-typing", { toUserId });
  }, []);

  return {
    connected,
    connectionError,
    sendMessage,
    markSeen,
    markDelivered,
    emitTyping,
    emitStopTyping,
  };
}