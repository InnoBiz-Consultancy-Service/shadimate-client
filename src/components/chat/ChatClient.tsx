// "use client";

// import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { MessageCircle, Lock, Search, X, CheckCheck } from "lucide-react";
// import type { Conversation, Message } from "@/types/chat";
// import { useSocketContext } from "@/context/SocketContext";

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// function timeAgo(dateStr: string): string {
//   const diff = Date.now() - new Date(dateStr).getTime();
//   const mins = Math.floor(diff / 60000);
//   if (mins < 1) return "now";
//   if (mins < 60) return `${mins}m`;
//   const hrs = Math.floor(mins / 60);
//   if (hrs < 24) return `${hrs}h`;
//   const days = Math.floor(hrs / 24);
//   if (days < 7) return `${days}d`;
//   return new Date(dateStr).toLocaleDateString("en-US", {
//     month: "short",
//     day: "numeric",
//   });
// }

// // ─── Props ────────────────────────────────────────────────────────────────────

// interface Props {
//   initialConversations: Conversation[];
//   token?: string;
//   currentUserId: string;
//   chatRoomSlot?: React.ReactNode;
// }

// // ─── Main Component ───────────────────────────────────────────────────────────

// export default function ChatClient({
//   initialConversations,
//   currentUserId,
//   chatRoomSlot,
// }: Props) {
//   const [conversations, setConversations] =
//     useState<Conversation[]>(initialConversations);
//   const [search, setSearch] = useState("");
//   const [searchFocused, setSearchFocused] = useState(false);
//   const pathname = usePathname();

//   // ✅ Global socket context
//   const { onNewMessage, onMessageSent, onMessageSeen, clearUnread } =
//     useSocketContext();

//   // Which chat is open (from URL)
//   const openChatUserId = useMemo(() => {
//     if (pathname.startsWith("/chat/")) return pathname.split("/chat/")[1];
//     return null;
//   }, [pathname]);

//   const isMobileOnChat = pathname.startsWith("/chat/");

//   // ── Conversation update helper ─────────────────────────────────────────────

//   const openChatUserIdRef = useRef(openChatUserId);
//   useEffect(() => {
//     openChatUserIdRef.current = openChatUserId;
//   }, [openChatUserId]);

//   const updateConversation = useCallback(
//     (msg: Message, isMine: boolean) => {
//       const partnerId = isMine ? msg.receiverId : msg.senderId;

//       setConversations((prev) => {
//         const idx = prev.findIndex((c) => c.userId === partnerId);
//         const isCurrentlyOpen = openChatUserIdRef.current === partnerId;

//         if (idx === -1) {
//           const newConv: Conversation = {
//             userId: partnerId,
//             name: null,
//             lastMessage: msg.content,
//             lastMessageType: msg.type,
//             lastMessageTime: msg.createdAt,
//             unreadCount: isMine || isCurrentlyOpen ? 0 : 1,
//             isLocked: false,
//           };
//           return [newConv, ...prev];
//         }

//         const updated = [...prev];
//         updated[idx] = {
//           ...updated[idx],
//           lastMessage: msg.content,
//           lastMessageType: msg.type,
//           lastMessageTime: msg.createdAt,
//           status: isMine ? "sent" : updated[idx].status,
//           unreadCount:
//             isMine || isCurrentlyOpen
//               ? 0
//               : (updated[idx].unreadCount ?? 0) + 1,
//         };
//         const [entry] = updated.splice(idx, 1);
//         return [entry, ...updated];
//       });
//     },
//     [],
//   );

//   // ── Reset unread when chat opens ───────────────────────────────────────────

//   useEffect(() => {
//     if (!openChatUserId) return;
//     setConversations((prev) =>
//       prev.map((c) =>
//         c.userId === openChatUserId ? { ...c, unreadCount: 0 } : c,
//       ),
//     );
//     clearUnread(openChatUserId);
//   }, [openChatUserId, clearUnread]);

//   // ── Socket event subscriptions ─────────────────────────────────────────────

//   useEffect(() => {
//     // ✅ Global socket context এর event subscribe করছি
//     const unsubNewMsg = onNewMessage((msg: Message) => {
//       if (msg.senderId !== currentUserId && msg.receiverId !== currentUserId)
//         return;
//       updateConversation(msg, msg.senderId === currentUserId);
//     });

//     const unsubMsgSent = onMessageSent((msg: Message) => {
//       if (msg.senderId !== currentUserId) return;
//       updateConversation(msg, true);
//     });

//     const unsubMsgSeen = onMessageSeen(
//       ({ conversationWith }: { messageId: string; conversationWith: string }) => {
//         setConversations((prev) =>
//           prev.map((c) =>
//             c.userId === conversationWith ? { ...c, status: "seen" } : c,
//           ),
//         );
//       },
//     );

//     return () => {
//       unsubNewMsg();
//       unsubMsgSent();
//       unsubMsgSeen();
//     };
//   }, [currentUserId, updateConversation, onNewMessage, onMessageSent, onMessageSeen]);

//   // ── Filtered + totals ──────────────────────────────────────────────────────

//   const filtered = useMemo(
//     () =>
//       conversations.filter((c) =>
//         (c.name ?? "").toLowerCase().includes(search.toLowerCase()),
//       ),
//     [conversations, search],
//   );

//   const totalUnread = useMemo(
//     () => conversations.reduce((sum, c) => sum + (c.unreadCount ?? 0), 0),
//     [conversations],
//   );

//   return (
//     <div
//       className="flex w-full overflow-hidden"
//       style={{
//         height: "calc(100dvh - 64px)",
//         background: "#FAF0E4",
//       }}
//     >
//       {/* ══ SIDEBAR ══════════════════════════════════════════════════════════ */}
//       <aside
//         className={`
//           flex-col shrink-0 overflow-hidden
//           w-full md:w-[340px] lg:w-[380px]
//           border-r border-[rgba(184,92,110,0.12)]
//           bg-white
//           ${isMobileOnChat ? "hidden md:flex" : "flex"}
//         `}
//       >
//         {/* Sidebar Header */}
//         <div
//           className="px-4 pt-4 pb-3 shrink-0"
//           style={{
//             background: "linear-gradient(135deg, #B85C6E 0%, #9A4F5E 100%)",
//           }}
//         >
//           <div className="flex items-center justify-between mb-3">
//             <h1 className="font-syne text-white text-xl font-extrabold tracking-tight flex items-center gap-2">
//               <MessageCircle size={20} />
//               Messages
//               {totalUnread > 0 && (
//                 <span className="ml-1 bg-white text-[#B85C6E] text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center leading-none flex items-center justify-center">
//                   {totalUnread > 99 ? "99+" : totalUnread}
//                 </span>
//               )}
//             </h1>
//             {conversations.length > 0 && (
//               <span className="text-white/60 text-xs font-outfit">
//                 {conversations.length}{" "}
//                 {conversations.length === 1 ? "chat" : "chats"}
//               </span>
//             )}
//           </div>

//           {/* Search Bar */}
//           <div className="relative">
//             <Search
//               size={14}
//               className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
//               style={{ color: "rgba(255,255,255,0.5)" }}
//             />
//             <input
//               type="text"
//               placeholder="Search conversations..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               onFocus={() => setSearchFocused(true)}
//               onBlur={() => setSearchFocused(false)}
//               className="font-outfit w-full pl-9 pr-8 py-2 rounded-xl text-sm outline-none transition-all duration-200"
//               style={{
//                 background: "rgba(255,255,255,0.15)",
//                 border: searchFocused
//                   ? "1px solid rgba(255,255,255,0.5)"
//                   : "1px solid rgba(255,255,255,0.2)",
//                 color: "#fff",
//               }}
//             />
//             {search && (
//               <button
//                 onClick={() => setSearch("")}
//                 className="absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors"
//                 style={{ color: "rgba(255,255,255,0.6)" }}
//               >
//                 <X size={13} />
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Conversation list */}
//         <div className="flex-1 overflow-y-auto overscroll-contain">
//           {conversations.length === 0 && <EmptyState />}

//           {filtered.length > 0 && (
//             <ul className="py-0.5">
//               {filtered.map((conv) => (
//                 <ConversationRow
//                   key={conv.userId ?? `locked-${conv.lastMessageTime}`}
//                   conv={conv}
//                   isActive={conv.userId === openChatUserId}
//                 />
//               ))}
//             </ul>
//           )}

//           {conversations.length > 0 && filtered.length === 0 && (
//             <div className="text-center py-12 px-4">
//               <p className="text-gray-400 text-sm">
//                 No conversations match &ldquo;{search}&rdquo;
//               </p>
//             </div>
//           )}
//         </div>
//       </aside>

//       {/* ══ RIGHT PANEL ══════════════════════════════════════════════════════ */}
//       <main
//         className={`
//           flex-1 flex flex-col min-w-0
//           ${isMobileOnChat ? "flex" : "hidden md:flex"}
//         `}
//       >
//         {chatRoomSlot ?? <WelcomePanel />}
//       </main>
//     </div>
//   );
// }

// // ─── Welcome Panel ─────────────────────────────────────────────────────────────

// function WelcomePanel() {
//   return (
//     <div
//       className="flex-1 flex flex-col items-center justify-center text-center px-6"
//       style={{ background: "#FAF0E4" }}
//     >
//       <div
//         className="w-24 h-24 rounded-3xl flex items-center justify-center mb-5"
//         style={{
//           background: "rgba(184,92,110,0.07)",
//           border: "2px dashed rgba(184,92,110,0.25)",
//         }}
//       >
//         <MessageCircle size={40} style={{ color: "#B85C6E", opacity: 0.6 }} />
//       </div>
//       <h2
//         className="font-syne text-xl font-bold mb-2"
//         style={{ color: "#2E1A14" }}
//       >
//         Select a Conversation
//       </h2>
//       <p
//         className="text-sm max-w-xs leading-relaxed"
//         style={{ color: "#8C5A3C" }}
//       >
//         Choose a chat from the left to start messaging.
//       </p>
//     </div>
//   );
// }

// // ─── Empty State ───────────────────────────────────────────────────────────────

// function EmptyState() {
//   return (
//     <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
//       <div
//         className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
//         style={{
//           background: "rgba(184,92,110,0.08)",
//           border: "1px solid rgba(184,92,110,0.2)",
//         }}
//       >
//         <MessageCircle size={26} style={{ color: "#B85C6E" }} />
//       </div>
//       <h2 className="font-syne text-gray-800 text-base font-bold mb-1">
//         No Messages Yet
//       </h2>
//       <p className="text-gray-500 text-xs max-w-[200px] mx-auto mb-5 leading-relaxed">
//         Start a conversation by visiting someone&apos;s profile.
//       </p>
//       <Link
//         href="/search"
//         className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white no-underline transition-all duration-200 active:scale-[0.98]"
//         style={{
//           background: "linear-gradient(135deg, #B85C6E, #9A4F5E)",
//           boxShadow: "0 4px 14px rgba(184,92,110,0.35)",
//         }}
//       >
//         Browse Profiles
//       </Link>
//     </div>
//   );
// }

// // ─── Conversation Row ──────────────────────────────────────────────────────────

// const ConversationRow = memo(
//   function ConversationRow({
//     conv,
//     isActive,
//   }: {
//     conv: Conversation;
//     isActive: boolean;
//   }) {
//     const isLocked = conv.isLocked;
//     const hasUnread = (conv.unreadCount ?? 0) > 0;

//     const inner = (
//       <li
//         className={`
//           flex items-center gap-3 px-4 py-3
//           border-b border-[rgba(184,92,110,0.05)]
//           transition-all duration-150
//           ${
//             isActive
//               ? "bg-[rgba(184,92,110,0.08)] border-l-[3px] border-l-[#B85C6E]"
//               : isLocked
//                 ? "opacity-55"
//                 : "cursor-pointer hover:bg-[rgba(184,92,110,0.04)] active:bg-[rgba(184,92,110,0.07)]"
//           }
//         `}
//       >
//         {/* Avatar */}
//         <div className="relative shrink-0">
//           <div
//             className="w-12 h-12 rounded-full flex items-center justify-center"
//             style={{
//               background: isActive
//                 ? "linear-gradient(135deg, #B85C6E, #9A4F5E)"
//                 : "linear-gradient(135deg, rgba(184,92,110,0.18), rgba(154,79,94,0.12))",
//               border: isActive
//                 ? "2px solid #B85C6E"
//                 : "2px solid rgba(184,92,110,0.15)",
//             }}
//           >
//             <span
//               className="font-syne font-bold text-sm"
//               style={{ color: isActive ? "#fff" : "#B85C6E" }}
//             >
//               {(conv.name ?? "?").charAt(0).toUpperCase()}
//             </span>
//           </div>
//           {hasUnread && (
//             <span
//               className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full text-[10px] font-bold text-white flex items-center justify-center px-1 leading-none"
//               style={{ background: "#B85C6E" }}
//             >
//               {conv.unreadCount! > 99 ? "99+" : conv.unreadCount}
//             </span>
//           )}
//         </div>

//         {/* Text */}
//         <div className="flex-1 min-w-0">
//           <div className="flex items-center justify-between gap-2 mb-0.5">
//             <p
//               className={`font-outfit text-[13.5px] truncate ${
//                 isActive
//                   ? "font-bold text-[#B85C6E]"
//                   : hasUnread
//                     ? "font-bold text-gray-900"
//                     : "font-medium text-gray-800"
//               }`}
//             >
//               {conv.name ?? (
//                 <span className="text-gray-400 italic text-xs">Loading…</span>
//               )}
//             </p>
//             <span
//               className="font-outfit text-[10px] shrink-0 tabular-nums"
//               style={{ color: isActive ? "#B85C6E" : "#A8896C" }}
//             >
//               {timeAgo(conv.lastMessageTime)}
//             </span>
//           </div>

//           <div className="flex items-center gap-1">
//             {!isLocked && conv.status === "seen" && (
//               <CheckCheck
//                 size={11}
//                 style={{ color: "#B07A1E" }}
//                 className="shrink-0"
//               />
//             )}
//             {isLocked ? (
//               <span className="flex items-center gap-1 text-[11px] text-gray-400">
//                 <Lock size={9} /> Premium only
//               </span>
//             ) : conv.lastMessage ? (
//               <p
//                 className={`text-[12px] truncate leading-tight ${
//                   hasUnread ? "text-gray-800 font-semibold" : "text-gray-500"
//                 }`}
//               >
//                 {conv.lastMessage}
//               </p>
//             ) : (
//               <p className="text-[12px] text-gray-400 italic">
//                 No messages yet
//               </p>
//             )}
//           </div>
//         </div>
//       </li>
//     );

//     if (!conv.userId || isLocked) return <div>{inner}</div>;
//     return (
//       <Link href={`/chat/${conv.userId}`} className="no-underline block">
//         {inner}
//       </Link>
//     );
//   },
//   (prev, next) =>
//     prev.conv.userId === next.conv.userId &&
//     prev.conv.lastMessage === next.conv.lastMessage &&
//     prev.conv.unreadCount === next.conv.unreadCount &&
//     prev.conv.status === next.conv.status &&
//     prev.conv.lastMessageTime === next.conv.lastMessageTime &&
//     prev.isActive === next.isActive,
// );

"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  memo,
  startTransition,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Lock, Search, X, CheckCheck } from "lucide-react";
import type { Conversation, Message } from "@/types/chat";
import { useSocketContext } from "@/context/SocketContext";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  initialConversations: Conversation[];
  token?: string;
  currentUserId: string;
  chatRoomSlot?: React.ReactNode;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ChatClient({
  initialConversations,
  currentUserId,
  chatRoomSlot,
}: Props) {
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const pathname = usePathname();

  // ✅ Global socket context
  const { onNewMessage, onMessageSent, onMessageSeen, clearUnread } =
    useSocketContext();

  // Which chat is open (from URL)
  const openChatUserId = useMemo(() => {
    if (pathname.startsWith("/chat/")) return pathname.split("/chat/")[1];
    return null;
  }, [pathname]);

  const isMobileOnChat = pathname.startsWith("/chat/");

  // ── Conversation update helper ─────────────────────────────────────────────

  const openChatUserIdRef = useRef(openChatUserId);
  useEffect(() => {
    openChatUserIdRef.current = openChatUserId;
  }, [openChatUserId]);

  const updateConversation = useCallback((msg: Message, isMine: boolean) => {
    const partnerId = isMine ? msg.receiverId : msg.senderId;

    setConversations((prev) => {
      const idx = prev.findIndex((c) => c.userId === partnerId);
      const isCurrentlyOpen = openChatUserIdRef.current === partnerId;

      if (idx === -1) {
        const newConv: Conversation = {
          userId: partnerId,
          name: null,
          lastMessage: msg.content,
          lastMessageType: msg.type,
          lastMessageTime: msg.createdAt,
          unreadCount: isMine || isCurrentlyOpen ? 0 : 1,
          isLocked: false,
        };
        return [newConv, ...prev];
      }

      const updated = [...prev];
      updated[idx] = {
        ...updated[idx],
        lastMessage: msg.content,
        lastMessageType: msg.type,
        lastMessageTime: msg.createdAt,
        status: isMine ? "sent" : updated[idx].status,
        unreadCount:
          isMine || isCurrentlyOpen ? 0 : (updated[idx].unreadCount ?? 0) + 1,
      };
      const [entry] = updated.splice(idx, 1);
      return [entry, ...updated];
    });
  }, []);

  // ── Reset unread when chat opens ───────────────────────────────────────────
  // ✅ Fixed: Wrapped setConversations in startTransition to avoid cascading renders warning
  const resetUnreadForChat = useCallback(
    (userId: string) => {
      startTransition(() => {
        setConversations((prev) =>
          prev.map((c) => (c.userId === userId ? { ...c, unreadCount: 0 } : c)),
        );
      });
      clearUnread(userId);
    },
    [clearUnread],
  );

  useEffect(() => {
    if (openChatUserId) {
      resetUnreadForChat(openChatUserId);
    }
  }, [openChatUserId, resetUnreadForChat]);

  // ── Socket event subscriptions ─────────────────────────────────────────────

  useEffect(() => {
    // ✅ Global socket context এর event subscribe করছি
    const unsubNewMsg = onNewMessage((msg: Message) => {
      if (msg.senderId !== currentUserId && msg.receiverId !== currentUserId)
        return;
      updateConversation(msg, msg.senderId === currentUserId);
    });

    const unsubMsgSent = onMessageSent((msg: Message) => {
      if (msg.senderId !== currentUserId) return;
      updateConversation(msg, true);
    });

    const unsubMsgSeen = onMessageSeen(
      ({
        conversationWith,
      }: {
        messageId: string;
        conversationWith: string;
      }) => {
        startTransition(() => {
          setConversations((prev) =>
            prev.map((c) =>
              c.userId === conversationWith ? { ...c, status: "seen" } : c,
            ),
          );
        });
      },
    );

    return () => {
      unsubNewMsg();
      unsubMsgSent();
      unsubMsgSeen();
    };
  }, [
    currentUserId,
    updateConversation,
    onNewMessage,
    onMessageSent,
    onMessageSeen,
  ]);

  // ── Filtered + totals ──────────────────────────────────────────────────────

  const filtered = useMemo(
    () =>
      conversations.filter((c) =>
        (c.name ?? "").toLowerCase().includes(search.toLowerCase()),
      ),
    [conversations, search],
  );

  const totalUnread = useMemo(
    () => conversations.reduce((sum, c) => sum + (c.unreadCount ?? 0), 0),
    [conversations],
  );

  return (
    <div
      className="flex w-full overflow-hidden"
      style={{
        height: "calc(100dvh - 64px)",
        background: "#FAF0E4",
      }}
    >
      {/* ══ SIDEBAR ══════════════════════════════════════════════════════════ */}
      <aside
        className={`
          flex-col shrink-0 overflow-hidden
          w-full md:w-[340px] lg:w-[380px]
          border-r border-[rgba(184,92,110,0.12)]
          bg-white
          ${isMobileOnChat ? "hidden md:flex" : "flex"}
        `}
      >
        {/* Sidebar Header */}
        <div
          className="px-4 pt-4 pb-3 shrink-0"
          style={{
            background: "linear-gradient(135deg, #B85C6E 0%, #9A4F5E 100%)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <h1 className="font-syne text-white text-xl font-extrabold tracking-tight flex items-center gap-2">
              <MessageCircle size={20} />
              Messages
              {totalUnread > 0 && (
                <span className="ml-1 bg-white text-[#B85C6E] text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center leading-none flex items-center justify-center">
                  {totalUnread > 99 ? "99+" : totalUnread}
                </span>
              )}
            </h1>
            {conversations.length > 0 && (
              <span className="text-white/60 text-xs font-outfit">
                {conversations.length}{" "}
                {conversations.length === 1 ? "chat" : "chats"}
              </span>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "rgba(255,255,255,0.5)" }}
            />
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="font-outfit w-full pl-9 pr-8 py-2 rounded-xl text-sm outline-none transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.15)",
                border: searchFocused
                  ? "1px solid rgba(255,255,255,0.5)"
                  : "1px solid rgba(255,255,255,0.2)",
                color: "#fff",
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {conversations.length === 0 && <EmptyState />}

          {filtered.length > 0 && (
            <ul className="py-0.5">
              {filtered.map((conv) => (
                <ConversationRow
                  key={conv.userId ?? `locked-${conv.lastMessageTime}`}
                  conv={conv}
                  isActive={conv.userId === openChatUserId}
                />
              ))}
            </ul>
          )}

          {conversations.length > 0 && filtered.length === 0 && (
            <div className="text-center py-12 px-4">
              <p className="text-gray-400 text-sm">
                No conversations match &ldquo;{search}&rdquo;
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* ══ RIGHT PANEL ══════════════════════════════════════════════════════ */}
      <main
        className={`
          flex-1 flex flex-col min-w-0
          ${isMobileOnChat ? "flex" : "hidden md:flex"}
        `}
      >
        {chatRoomSlot ?? <WelcomePanel />}
      </main>
    </div>
  );
}

// ─── Welcome Panel ─────────────────────────────────────────────────────────────

function WelcomePanel() {
  return (
    <div
      className="flex-1 flex flex-col items-center justify-center text-center px-6"
      style={{ background: "#FAF0E4" }}
    >
      <div
        className="w-24 h-24 rounded-3xl flex items-center justify-center mb-5"
        style={{
          background: "rgba(184,92,110,0.07)",
          border: "2px dashed rgba(184,92,110,0.25)",
        }}
      >
        <MessageCircle size={40} style={{ color: "#B85C6E", opacity: 0.6 }} />
      </div>
      <h2
        className="font-syne text-xl font-bold mb-2"
        style={{ color: "#2E1A14" }}
      >
        Select a Conversation
      </h2>
      <p
        className="text-sm max-w-xs leading-relaxed"
        style={{ color: "#8C5A3C" }}
      >
        Choose a chat from the left to start messaging.
      </p>
    </div>
  );
}

// ─── Empty State ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
        style={{
          background: "rgba(184,92,110,0.08)",
          border: "1px solid rgba(184,92,110,0.2)",
        }}
      >
        <MessageCircle size={26} style={{ color: "#B85C6E" }} />
      </div>
      <h2 className="font-syne text-gray-800 text-base font-bold mb-1">
        No Messages Yet
      </h2>
      <p className="text-gray-500 text-xs max-w-[200px] mx-auto mb-5 leading-relaxed">
        Start a conversation by visiting someone&apos;s profile.
      </p>
      <Link
        href="/search"
        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white no-underline transition-all duration-200 active:scale-[0.98]"
        style={{
          background: "linear-gradient(135deg, #B85C6E, #9A4F5E)",
          boxShadow: "0 4px 14px rgba(184,92,110,0.35)",
        }}
      >
        Browse Profiles
      </Link>
    </div>
  );
}

// ─── Conversation Row ──────────────────────────────────────────────────────────

const ConversationRow = memo(
  function ConversationRow({
    conv,
    isActive,
  }: {
    conv: Conversation;
    isActive: boolean;
  }) {
    const isLocked = conv.isLocked;
    const hasUnread = (conv.unreadCount ?? 0) > 0;

    const inner = (
      <li
        className={`
          flex items-center gap-3 px-4 py-3
          border-b border-[rgba(184,92,110,0.05)]
          transition-all duration-150
          ${
            isActive
              ? "bg-[rgba(184,92,110,0.08)] border-l-[3px] border-l-[#B85C6E]"
              : isLocked
                ? "opacity-55"
                : "cursor-pointer hover:bg-[rgba(184,92,110,0.04)] active:bg-[rgba(184,92,110,0.07)]"
          }
        `}
      >
        {/* Avatar */}
        <div className="relative shrink-0">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: isActive
                ? "linear-gradient(135deg, #B85C6E, #9A4F5E)"
                : "linear-gradient(135deg, rgba(184,92,110,0.18), rgba(154,79,94,0.12))",
              border: isActive
                ? "2px solid #B85C6E"
                : "2px solid rgba(184,92,110,0.15)",
            }}
          >
            <span
              className="font-syne font-bold text-sm"
              style={{ color: isActive ? "#fff" : "#B85C6E" }}
            >
              {(conv.name ?? "?").charAt(0).toUpperCase()}
            </span>
          </div>
          {hasUnread && (
            <span
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full text-[10px] font-bold text-white flex items-center justify-center px-1 leading-none"
              style={{ background: "#B85C6E" }}
            >
              {conv.unreadCount! > 99 ? "99+" : conv.unreadCount}
            </span>
          )}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <p
              className={`font-outfit text-[13.5px] truncate ${
                isActive
                  ? "font-bold text-[#B85C6E]"
                  : hasUnread
                    ? "font-bold text-gray-900"
                    : "font-medium text-gray-800"
              }`}
            >
              {conv.name ?? (
                <span className="text-gray-400 italic text-xs">Loading…</span>
              )}
            </p>
            <span
              className="font-outfit text-[10px] shrink-0 tabular-nums"
              style={{ color: isActive ? "#B85C6E" : "#A8896C" }}
            >
              {timeAgo(conv.lastMessageTime)}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {!isLocked && conv.status === "seen" && (
              <CheckCheck
                size={11}
                style={{ color: "#B07A1E" }}
                className="shrink-0"
              />
            )}
            {isLocked ? (
              <span className="flex items-center gap-1 text-[11px] text-gray-400">
                <Lock size={9} /> Premium only
              </span>
            ) : conv.lastMessage ? (
              <p
                className={`text-[12px] truncate leading-tight ${
                  hasUnread ? "text-gray-800 font-semibold" : "text-gray-500"
                }`}
              >
                {conv.lastMessage}
              </p>
            ) : (
              <p className="text-[12px] text-gray-400 italic">
                No messages yet
              </p>
            )}
          </div>
        </div>
      </li>
    );

    if (!conv.userId || isLocked) return <div>{inner}</div>;
    return (
      <Link href={`/chat/${conv.userId}`} className="no-underline block">
        {inner}
      </Link>
    );
  },
  (prev, next) =>
    prev.conv.userId === next.conv.userId &&
    prev.conv.lastMessage === next.conv.lastMessage &&
    prev.conv.unreadCount === next.conv.unreadCount &&
    prev.conv.status === next.conv.status &&
    prev.conv.lastMessageTime === next.conv.lastMessageTime &&
    prev.isActive === next.isActive,
);
