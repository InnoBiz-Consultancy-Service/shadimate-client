"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Message } from "@/types/chat";

interface UseSocketProps {
  token?: string;
  myUserId: string;

  onNewMessage?: (msg: Message) => void;
  onMessageSent?: (msg: Message) => void;
  onMessageSeen?: (payload: { messageId: string; conversationWith: string }) => void;

  onTyping?: (userId: string) => void;
  onStopTyping?: (userId: string) => void;
}

export function useSocket({
  token,
  myUserId,
  onNewMessage,
  onMessageSent,
  onMessageSeen,
  onTyping,
  onStopTyping,
}: UseSocketProps) {
  const socketRef = useRef<import("socket.io-client").Socket | null>(null);
  const [connected, setConnected] = useState(false);

  // Stable callback refs — prevent re-connect on every render
  const onNewMessageRef    = useRef(onNewMessage);
  const onMessageSentRef   = useRef(onMessageSent);
  const onMessageSeenRef   = useRef(onMessageSeen);
  const onTypingRef        = useRef(onTyping);
  const onStopTypingRef    = useRef(onStopTyping);

  useEffect(() => { onNewMessageRef.current    = onNewMessage;   }, [onNewMessage]);
  useEffect(() => { onMessageSentRef.current   = onMessageSent;  }, [onMessageSent]);
  useEffect(() => { onMessageSeenRef.current   = onMessageSeen;  }, [onMessageSeen]);
  useEffect(() => { onTypingRef.current        = onTyping;       }, [onTyping]);
  useEffect(() => { onStopTypingRef.current    = onStopTyping;   }, [onStopTyping]);

  useEffect(() => {
    if (!token || !myUserId) return;
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
          // Backend: presence.handlers.ts reads token from query
          query: { token, userId: myUserId },
          transports: ["websocket"],
          reconnection: true,
          reconnectionDelay: 1500,
          reconnectionAttempts: 5,
        });

        socketRef.current = socket;

        socket.on("connect", () => {
          if (mounted) setConnected(true);
        });

        socket.on("disconnect", () => {
          if (mounted) setConnected(false);
        });

        // ── Backend emits exactly these event names ──────────────────────────
        // chat.handlers.ts  → "receive-message", "message-sent"
        // seen.handlers.ts  → "message-seen"
        // typing.handlers.ts → "typing", "stop-typing"

        socket.on("receive-message", (msg: Message) => {
          if (mounted) onNewMessageRef.current?.(msg);
        });

        socket.on("message-sent", (msg: Message) => {
          if (mounted) onMessageSentRef.current?.(msg);
        });

        socket.on("message-seen", (payload: { messageId: string; conversationWith: string }) => {
          if (mounted) onMessageSeenRef.current?.(payload);
        });

        // Backend typing.handlers.ts emits: { fromUserId }
        socket.on("typing", ({ fromUserId }: { fromUserId: string }) => {
          if (mounted) onTypingRef.current?.(fromUserId);
        });

        socket.on("stop-typing", ({ fromUserId }: { fromUserId: string }) => {
          if (mounted) onStopTypingRef.current?.(fromUserId);
        });

      } catch {
        // socket.io-client unavailable or SSR
      }
    };

    setup();

    return () => {
      mounted = false;
      socketRef.current?.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [token, myUserId]); // only reconnect if token/userId changes

  // ── Emitters — match backend event names exactly ─────────────────────────
  // chat.handlers.ts listens on: "send-message"
  const sendMessage = useCallback((receiverId: string, message: string, type = "text") => {
    socketRef.current?.emit("send-message", { receiverId, message, type });
  }, []);

  // seen.handlers.ts listens on: "seen"
  const markSeen = useCallback((messageId: string) => {
    socketRef.current?.emit("seen", { messageId });
  }, []);

  // typing.handlers.ts listens on: "typing", "stop-typing"
  const emitTyping = useCallback((toUserId: string) => {
    socketRef.current?.emit("typing", { toUserId });
  }, []);

  const emitStopTyping = useCallback((toUserId: string) => {
    socketRef.current?.emit("stop-typing", { toUserId });
  }, []);

  return {
    connected,
    sendMessage,
    markSeen,
    emitTyping,
    emitStopTyping,
  };
}