"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
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
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  // ─── Connect ─────────────────────────────────────────────
  useEffect(() => {
    if (!token || !myUserId) return;

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      console.log("✅ Socket connected");
    });

    socket.on("disconnect", () => {
      setConnected(false);
      console.log("❌ Socket disconnected");
    });

    // ─── Events ────────────────────────────────────────────

    socket.on("new_message", (msg: Message) => {
      onNewMessage?.(msg);
    });

    socket.on("message_sent", (msg: Message) => {
      onMessageSent?.(msg);
    });

    socket.on("message_seen", (payload) => {
      onMessageSeen?.(payload);
    });

    socket.on("typing", (userId: string) => {
      onTyping?.(userId);
    });

    socket.on("stop_typing", (userId: string) => {
      onStopTyping?.(userId);
    });

    return () => {
      socket.disconnect();
    };
  }, [token, myUserId]);

  // ─── Emitters ────────────────────────────────────────────

  const sendMessage = useCallback((receiverId: string, content: string) => {
    socketRef.current?.emit("send_message", {
      receiverId,
      content,
    });
  }, []);

  const markSeen = useCallback((messageId: string) => {
    socketRef.current?.emit("mark_seen", { messageId });
  }, []);

  const emitTyping = useCallback((toUserId: string) => {
    socketRef.current?.emit("typing", { toUserId });
  }, []);

  const emitStopTyping = useCallback((toUserId: string) => {
    socketRef.current?.emit("stop_typing", { toUserId });
  }, []);

  return {
    connected,
    sendMessage,
    markSeen,
    emitTyping,
    emitStopTyping,
  };
}