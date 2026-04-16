"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Message } from "@/types/chat";

interface UseSocketProps {
  token?: string;
  myUserId: string;

  onNewMessage?: (msg: Message) => void;
  onMessageSent?: (msg: Message) => void;
  onMessageSeen?: (payload: { messageId: string; conversationWith: string }) => void;
  onMessageDelivered?: (payload: { messageId: string; conversationWith: string }) => void;
  onTyping?: (userId: string) => void;
  onStopTyping?: (userId: string) => void;
  // New props for online/offline status
  onUserOnline?: (userId: string) => void;
  onUserOffline?: (payload: { userId: string; lastSeen: string }) => void;
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
}: UseSocketProps) {
  const socketRef = useRef<import("socket.io-client").Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Stable callback refs — prevent re-connect on every render
  const onNewMessageRef = useRef(onNewMessage);
  const onMessageSentRef = useRef(onMessageSent);
  const onMessageSeenRef = useRef(onMessageSeen);
  const onMessageDeliveredRef = useRef(onMessageDelivered);
  const onTypingRef = useRef(onTyping);
  const onStopTypingRef = useRef(onStopTyping);
  const onUserOnlineRef = useRef(onUserOnline);
  const onUserOfflineRef = useRef(onUserOffline);

  useEffect(() => { onNewMessageRef.current = onNewMessage; }, [onNewMessage]);
  useEffect(() => { onMessageSentRef.current = onMessageSent; }, [onMessageSent]);
  useEffect(() => { onMessageSeenRef.current = onMessageSeen; }, [onMessageSeen]);
  useEffect(() => { onMessageDeliveredRef.current = onMessageDelivered; }, [onMessageDelivered]);
  useEffect(() => { onTypingRef.current = onTyping; }, [onTyping]);
  useEffect(() => { onStopTypingRef.current = onStopTyping; }, [onStopTyping]);
  useEffect(() => { onUserOnlineRef.current = onUserOnline; }, [onUserOnline]);
  useEffect(() => { onUserOfflineRef.current = onUserOffline; }, [onUserOffline]);

  useEffect(() => {
    if (!token || !myUserId) {
      console.log("No token or userId provided");
      return;
    }
    
    let mounted = true;

    const setup = async () => {
      try {
        const { io } = await import("socket.io-client");
        const serverUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 
                         process.env.NEXT_PUBLIC_BASE_URL || 
                         "http://localhost:3000";
        
        if (!serverUrl || !mounted) return;

        console.log("Connecting to socket server:", serverUrl);
        console.log("With userId:", myUserId);

        const socket = io(serverUrl, {
          query: { token, userId: myUserId },
          transports: ["websocket", "polling"],
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 10,
        });

        socketRef.current = socket;

        socket.on("connect", () => {
          console.log("Socket connected successfully");
          if (mounted) {
            setConnected(true);
            setConnectionError(null);
          }
        });

        socket.on("connect_error", (error) => {
          console.error("Socket connection error:", error);
          if (mounted) {
            setConnected(false);
            setConnectionError(error.message);
          }
        });

        socket.on("disconnect", (reason) => {
          console.log("Socket disconnected:", reason);
          if (mounted) setConnected(false);
        });

        socket.on("reconnect", (attemptNumber) => {
          console.log("Socket reconnected after", attemptNumber, "attempts");
          if (mounted) setConnected(true);
        });

        // ── Chat event listeners ──────────────────────────────────────────
        socket.on("receive-message", (msg: Message) => {
          console.log("📩 Received message event:", msg);
          if (mounted) onNewMessageRef.current?.(msg);
        });

        socket.on("message-sent", (msg: Message) => {
          console.log("✅ Message sent confirmation:", msg);
          if (mounted) onMessageSentRef.current?.(msg);
        });

        socket.on("message-seen", (payload: { messageId: string; conversationWith: string }) => {
          console.log("👁️ Message seen event:", payload);
          if (mounted) onMessageSeenRef.current?.(payload);
        });

        socket.on("message-delivered", (payload: { messageId: string; conversationWith: string }) => {
          console.log("📬 Message delivered event:", payload);
          if (mounted) onMessageDeliveredRef.current?.(payload);
        });

        // ── Typing event listeners ──────────────────────────────────────────
        socket.on("typing", ({ fromUserId }: { fromUserId: string }) => {
          console.log("⌨️ User typing:", fromUserId);
          if (mounted) onTypingRef.current?.(fromUserId);
        });

        socket.on("stop-typing", ({ fromUserId }: { fromUserId: string }) => {
          console.log("⌨️ User stopped typing:", fromUserId);
          if (mounted) onStopTypingRef.current?.(fromUserId);
        });

        // ── Online/Offline event listeners ──────────────────────────────────
        socket.on("user-online", (userId: string) => {
          console.log("🟢 User online:", userId);
          if (mounted) onUserOnlineRef.current?.(userId);
        });

        socket.on("user-offline", (payload: { userId: string; lastSeen: string }) => {
          console.log("🔴 User offline:", payload);
          if (mounted) onUserOfflineRef.current?.(payload);
        });

      } catch (error) {
        console.error("Failed to setup socket:", error);
        if (mounted) {
          setConnectionError(error instanceof Error ? error.message : "Failed to connect");
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
  }, [token, myUserId]);

  // ── Emitters ─────────────────────────────────────────────────────────
  const sendMessage = useCallback((receiverId: string, message: string, type = "text") => {
    if (!socketRef.current) {
      console.error("Socket not connected");
      return;
    }
    console.log("📤 Sending message:", { receiverId, message, type });
    socketRef.current.emit("send-message", { receiverId, message, type });
  }, []);

  const markSeen = useCallback((messageId: string) => {
    if (!socketRef.current) return;
    console.log("👁️ Marking message as seen:", messageId);
    socketRef.current.emit("seen", { messageId });
  }, []);

  const markDelivered = useCallback((messageId: string) => {
    if (!socketRef.current) return;
    console.log("📬 Marking message as delivered:", messageId);
    socketRef.current.emit("delivered", { messageId });
  }, []);

  const emitTyping = useCallback((toUserId: string) => {
    if (!socketRef.current) return;
    socketRef.current.emit("typing", { toUserId });
  }, []);

  const emitStopTyping = useCallback((toUserId: string) => {
    if (!socketRef.current) return;
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