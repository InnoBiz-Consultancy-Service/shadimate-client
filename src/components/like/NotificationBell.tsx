// "use client";

// import { useState, useEffect, useCallback, useRef } from "react";
// import Link from "next/link";
// import { Bell, Heart, MessageCircle, User, CheckCheck, X, Loader2 } from "lucide-react";
// import type { NotificationItem } from "@/types/like";
// import {
//   getNotifications,
//   getUnreadNotificationCount,
//   markAllNotificationsRead,
//   markNotificationRead,
// } from "@/actions/profile-like/like";

// // Toast animation styles
// const toastAnimationStyle = `
//   @keyframes slideInRight {
//     from {
//       opacity: 0;
//       transform: translateX(384px);
//     }
//     to {
//       opacity: 1;
//       transform: translateX(0);
//     }
//   }

//   .toast-animate {
//     animation: slideInRight 0.3s ease-out;
//   }
// `;

// // ─── Toast Component ─────────────────────────────────────────────────────────
// function ToastNotification({
//   notification,
//   onClose
// }: {
//   notification: NotificationItem;
//   onClose: () => void;
// }) {
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       onClose();
//     }, 5000);
//     return () => clearTimeout(timer);
//   }, [onClose]);

//   function getToastIcon() {
//     if (notification.type === "new_message") {
//       return <MessageCircle size={18} className="text-blue-500" />;
//     }
//     if (notification.type === "profile_visit") {
//       return <User size={18} className="text-purple-500" />;
//     }
//     return <Heart size={16} className="text-brand fill-brand" />;
//   }

//   function getToastMessage(): string {
//     const name = notification.senderName ||
//       (typeof notification.senderId === "object" && notification.senderId !== null
//         ? (notification.senderId as { name: string }).name
//         : "Someone");

//     if (notification.type === "new_message") return `${name} sent you a message`;
//     if (notification.type === "profile_visit") return `${name} visited your profile`;
//     return `${name} liked your profile`;
//   }

//   return (
//     <>
//       <style>{toastAnimationStyle}</style>
//       <div className="fixed top-20 right-4 z-[100] toast-animate">
//       <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-3 min-w-[280px] max-w-[320px]">
//         <div className="flex items-start gap-3">
//           <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
//             {getToastIcon()}
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className="font-outfit text-xs text-slate-700 leading-relaxed">
//               {getToastMessage()}
//             </p>
//             {notification.type === "new_message" && notification.message && (
//               <p className="font-outfit text-[10px] text-slate-400 mt-0.5 truncate">
//                 {notification.message.replace(/^.+ sent you a new message$/, "Tap to view")}
//               </p>
//             )}
//           </div>
//           <button
//             onClick={onClose}
//             className="text-slate-300 hover:text-slate-500 transition-colors cursor-pointer shrink-0"
//           >
//             <X size={12} />
//           </button>
//         </div>
//       </div>
//     </div>
//     </>
//   );
// }

// // ─── Notification type → icon + color mapping ─────────────────────────────────
// function NotifIcon({ type }: { type: string }) {
//   if (type === "new_message") {
//     return (
//       <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
//         <MessageCircle size={13} className="text-blue-500" />
//       </div>
//     );
//   }
//   if (type === "profile_visit") {
//     return (
//       <div className="w-8 h-8 rounded-full bg-purple-50 border border-purple-200 flex items-center justify-center shrink-0">
//         <User size={13} className="text-purple-500" />
//       </div>
//     );
//   }
//   // default: like
//   return (
//     <div className="w-8 h-8 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0">
//       <Heart size={12} className="text-brand fill-brand" />
//     </div>
//   );
// }

// function notifMessage(n: NotificationItem): string {
//   return n.message || "You have a new notification";
// }

// function senderName(n: NotificationItem): string {
//   if (n.senderName) return n.senderName;
//   if (typeof n.senderId === "object" && n.senderId !== null)
//     return (n.senderId as { name: string }).name;
//   return "Someone";
// }

// function timeAgo(d: string): string {
//   const diff = Date.now() - new Date(d).getTime();
//   const m = Math.floor(diff / 60000);
//   if (m < 1) return "just now";
//   if (m < 60) return `${m}m`;
//   const h = Math.floor(m / 60);
//   if (h < 24) return `${h}h`;
//   return `${Math.floor(h / 24)}d`;
// }

// interface NotificationBellProps {
//   userId?: string;
//   token?: string;
//   asNavItem?: boolean;
//   active?: boolean;
// }

// export default function NotificationBell({
//   userId,
//   token,
//   asNavItem = false,
//   active = false,
// }: NotificationBellProps) {
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [notifications, setNotifications] = useState<NotificationItem[]>([]);
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [toastNotif, setToastNotif] = useState<NotificationItem | null>(null);
//   const socketRef = useRef<import("socket.io-client").Socket | null>(null);

//   // ── Fetch unread count on mount ──
//   useEffect(() => {
//     getUnreadNotificationCount().then((res) => {
//       if (res.success && res.data) {
//         setUnreadCount((res.data as { unreadCount: number }).unreadCount ?? 0);
//       }
//     });
//   }, []);

//   // ── Socket.io — listen for new notifications (all types) ──
//   useEffect(() => {
//     if (!userId || !token) return;
//     let mounted = true;

//     const setup = async () => {
//       try {
//         const { io } = await import("socket.io-client");
//         const serverUrl =
//           process.env.NEXT_PUBLIC_SOCKET_URL ||
//           process.env.NEXT_PUBLIC_BASE_URL ||
//           "";
//         if (!serverUrl) return;

//         const socket = io(serverUrl, {
//           query: { token, userId },
//           transports: ["websocket", "polling"],
//           reconnection: true,
//           reconnectionDelay: 1000,
//           reconnectionDelayMax: 10000,
//           reconnectionAttempts: Infinity,
//         });

//         socketRef.current = socket;

//         // ── new-notification: triggered by chat message, like, profile visit ──
//         const onNew = (notif: unknown) => {
//           if (!mounted) return;
//           const n = notif as NotificationItem;

//           // Show toast for new notification
//           setToastNotif(n);

//           // Auto-hide toast after 5 seconds (handled by Toast component)

//           // Update unread count
//           setUnreadCount((prev) => prev + 1);

//           // Add to dropdown list if open
//           setNotifications((prev) => {
//             if (prev.some((x) => x._id === n._id)) return prev;
//             return [n, ...prev];
//           });
//         };

//         // ── pending-notifications: socket'e ilk bağlandığında ──
//         const onPending = (arr: unknown) => {
//           if (!mounted) return;
//           const notifs = arr as NotificationItem[];
//           const unread = notifs.filter((n) => !n.isRead);
//           setUnreadCount(unread.length);
//           setNotifications((prev) => {
//             const existingIds = new Set(prev.map((n) => n._id));
//             const fresh = notifs.filter((n) => !existingIds.has(n._id));
//             return [...fresh, ...prev];
//           });
//         };

//         socket.on("new-notification", onNew);
//         socket.on("pending-notifications", onPending);
//       } catch {
//         // socket.io-client unavailable — REST only mode
//       }
//     };

//     setup();

//     return () => {
//       mounted = false;
//       socketRef.current?.off("new-notification");
//       socketRef.current?.off("pending-notifications");
//       socketRef.current?.disconnect();
//       socketRef.current = null;
//     };
//   }, [userId, token]);

//   // ── Fetch full list when dropdown opens ──
//   const fetchNotifs = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await getNotifications();
//       if (res.success && res.data) {
//         const d = res.data as { data?: NotificationItem[] };
//         setNotifications(d.data || []);
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const handleOpen = () => {
//     const next = !open;
//     setOpen(next);
//     if (next) fetchNotifs();
//   };

//   const handleMarkAll = async () => {
//     await markAllNotificationsRead();
//     setUnreadCount(0);
//     setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
//   };

//   const handleMarkOne = async (id: string) => {
//     await markNotificationRead(id);
//     setNotifications((prev) =>
//       prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
//     );
//     setUnreadCount((prev) => Math.max(0, prev - 1));
//   };

//   // ── Notification link: chat bildirimi ise chat'e git ──
//   function getNotifLink(n: NotificationItem): string | null {
//     if (n.type === "new_message" && n.metadata?.conversationWith) {
//       return `/chat/${n.metadata.conversationWith}`;
//     }
//     if (n.type === "like" || n.type === "profile_visit") {
//       return "/notifications";
//     }
//     return null;
//   }

//   // ─────────────────────────────────────────────────────────────────────────────
//   // NAV ITEM MODE (mobile bottom bar — just icon + animated dot)
//   // ─────────────────────────────────────────────────────────────────────────────
//   if (asNavItem) {
//     return (
//       <>
//         <div className="relative">
//           <Bell
//             size={22}
//             className={`transition-colors duration-200 ${
//               active ? "text-brand" : "text-slate-400"
//             }`}
//           />
//           {unreadCount > 0 && (
//             <span className="absolute -top-1 -right-1.5">
//               {/* Animated red dot instead of number */}
//               <span className="relative flex h-3 w-3">
//                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
//                 <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
//               </span>
//             </span>
//           )}
//         </div>

//         {/* Toast for nav item mode */}
//         {toastNotif && (
//           <ToastNotification
//             notification={toastNotif}
//             onClose={() => setToastNotif(null)}
//           />
//         )}
//       </>
//     );
//   }

//   // ─────────────────────────────────────────────────────────────────────────────
//   // FULL DROPDOWN MODE (desktop)
//   // ─────────────────────────────────────────────────────────────────────────────
//   return (
//     <>
//       <div className="relative">
//         {/* Bell button */}
//         <button
//           onClick={handleOpen}
//           aria-label="Notifications"
//           className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 hover:bg-brand/10 hover:border-brand/30 transition-all duration-200 cursor-pointer"
//         >
//           <Bell
//             size={16}
//             className={unreadCount > 0 ? "text-brand" : "text-slate-500"}
//           />
//           {unreadCount > 0 && (
//             <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] flex items-center justify-center bg-brand text-white text-[9px] font-bold rounded-full px-1">
//               {unreadCount > 99 ? "99+" : unreadCount}
//             </span>
//           )}
//         </button>

//         {/* Backdrop */}
//         {open && (
//           <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
//         )}

//         {/* Dropdown */}
//         {open && (
//           <div className="absolute right-0 top-11 z-50 w-80 rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden animate-[fadeUp_0.2s_ease]">
//             {/* Header */}
//             <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
//               <div className="flex items-center gap-2">
//                 <Bell size={14} className="text-slate-500" />
//                 <span className="font-syne text-slate-900 text-sm font-bold">
//                   Notifications
//                 </span>
//                 {unreadCount > 0 && (
//                   <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-brand/10 text-brand border border-brand/20">
//                     {unreadCount} new
//                   </span>
//                 )}
//               </div>
//               <div className="flex items-center gap-2">
//                 {unreadCount > 0 && (
//                   <button
//                     onClick={handleMarkAll}
//                     className="font-outfit text-[11px] text-brand hover:text-brand/70 transition-colors cursor-pointer flex items-center gap-1"
//                   >
//                     <CheckCheck size={11} /> Mark all read
//                   </button>
//                 )}
//                 <button
//                   onClick={() => setOpen(false)}
//                   className="text-slate-400 hover:text-slate-600 cursor-pointer"
//                 >
//                   <X size={14} />
//                 </button>
//               </div>
//             </div>

//             {/* List */}
//             <div className="max-h-[360px] overflow-y-auto">
//               {loading && (
//                 <div className="py-10 flex items-center justify-center gap-2 text-slate-400">
//                   <Loader2 size={16} className="animate-spin" />
//                   <span className="text-sm">Loading...</span>
//                 </div>
//               )}

//               {!loading && notifications.length === 0 && (
//                 <div className="py-10 text-center">
//                   <Bell size={24} className="text-slate-300 mx-auto mb-2" />
//                   <p className="font-outfit text-slate-400 text-sm">
//                     No notifications yet
//                   </p>
//                 </div>
//               )}

//               {!loading &&
//                 notifications.map((n) => {
//                   const link = getNotifLink(n);
//                   const content = (
//                     <div
//                       className={`flex items-start gap-3 px-4 py-3 border-b border-slate-50 last:border-0 transition-colors duration-150 ${
//                         n.isRead
//                           ? "bg-slate-50/50 hover:bg-slate-100/50"
//                           : "hover:bg-brand/3"
//                       }`}
//                     >
//                       <NotifIcon type={n.type} />

//                       <div
//                         className="flex-1 min-w-0 cursor-pointer"
//                         onClick={() => !n.isRead && handleMarkOne(n._id)}
//                       >
//                         <p className={`font-outfit text-xs leading-relaxed ${
//                           n.isRead ? "text-slate-600" : "text-slate-700"
//                         }`}>
//                           <span className={`font-semibold ${
//                             n.isRead ? "text-slate-700" : "text-slate-900"
//                           }`}>
//                             {senderName(n)}
//                           </span>{" "}
//                           {n.type === "new_message"
//                             ? "sent you a message"
//                             : n.type === "profile_visit"
//                               ? "visited your profile"
//                               : "liked your profile"}
//                         </p>
//                         {/* Show message preview for chat notifications */}
//                         {n.type === "new_message" && n.message && (
//                           <p className={`text-[11px] mt-0.5 truncate ${
//                             n.isRead ? "text-slate-500" : "text-slate-400"
//                           }`}>
//                             {n.message.replace(/^.+ sent you a new message$/, "New message")}
//                           </p>
//                         )}
//                         <p className={`font-outfit text-[10px] mt-0.5 ${
//                           n.isRead ? "text-slate-500" : "text-slate-400"
//                         }`}>
//                           {timeAgo(n.createdAt)}
//                         </p>
//                       </div>

//                       <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
//                         {!n.isRead && (
//                           <div
//                             className="w-2 h-2 rounded-full bg-brand"
//                             style={{ boxShadow: "var(--shadow-brand-dot)" }}
//                           />
//                         )}
//                       </div>
//                     </div>
//                   );

//                   if (link) {
//                     return (
//                       <Link
//                         key={n._id}
//                         href={link}
//                         onClick={() => {
//                           if (!n.isRead) handleMarkOne(n._id);
//                           setOpen(false);
//                         }}
//                         className="no-underline block"
//                       >
//                         {content}
//                       </Link>
//                     );
//                   }

//                   return <div key={n._id}>{content}</div>;
//                 })}
//             </div>

//             {/* Footer — View all */}
//             {notifications.length > 0 && (
//               <div className="border-t border-slate-100 px-4 py-2.5">
//                 <Link
//                   href="/notifications"
//                   onClick={() => setOpen(false)}
//                   className="font-outfit text-xs text-brand hover:text-brand/70 transition-colors no-underline flex items-center justify-center gap-1"
//                 >
//                   View all notifications →
//                 </Link>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Toast for desktop mode */}
//       {toastNotif && (
//         <ToastNotification
//           notification={toastNotif}
//           onClose={() => setToastNotif(null)}
//         />
//       )}
//     </>
//   );
// }

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Bell,
  Heart,
  MessageCircle,
  User,
  CheckCheck,
  X,
  Loader2,
} from "lucide-react";
import type { NotificationItem } from "@/types/like";
import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/actions/profile-like/like";

// Toast animation styles
const toastAnimationStyle = `
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(384px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  .toast-animate {
    animation: slideInRight 0.3s ease-out;
  }
`;

// ─── Toast Component ─────────────────────────────────────────────────────────
function ToastNotification({
  notification,
  onClose,
}: {
  notification: NotificationItem;
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  function getToastIcon() {
    if (notification.type === "new_message") {
      return <MessageCircle size={18} className="text-blue-500" />;
    }
    if (notification.type === "profile_visit") {
      return <User size={18} className="text-purple-500" />;
    }
    return <Heart size={16} className="text-brand fill-brand" />;
  }

  function getToastMessage(): string {
    const name =
      notification.senderName ||
      (typeof notification.senderId === "object" &&
      notification.senderId !== null
        ? (notification.senderId as { name: string }).name
        : "Someone");

    if (notification.type === "new_message")
      return `${name} sent you a message`;
    if (notification.type === "profile_visit")
      return `${name} visited your profile`;
    return `${name} liked your profile`;
  }

  return (
    <>
      <style>{toastAnimationStyle}</style>
      <div className="fixed top-20 right-4 z-[100] toast-animate">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-3 min-w-[280px] max-w-[320px]">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
              {getToastIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-outfit text-xs text-slate-700 leading-relaxed">
                {getToastMessage()}
              </p>
              {notification.type === "new_message" && notification.message && (
                <p className="font-outfit text-[10px] text-slate-400 mt-0.5 truncate">
                  {notification.message.replace(
                    /^.+ sent you a new message$/,
                    "Tap to view",
                  )}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-slate-500 transition-colors cursor-pointer shrink-0"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Notification type → icon + color mapping ─────────────────────────────────
function NotifIcon({ type }: { type: string }) {
  if (type === "new_message") {
    return (
      <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
        <MessageCircle size={13} className="text-blue-500" />
      </div>
    );
  }
  if (type === "profile_visit") {
    return (
      <div className="w-8 h-8 rounded-full bg-purple-50 border border-purple-200 flex items-center justify-center shrink-0">
        <User size={13} className="text-purple-500" />
      </div>
    );
  }
  // default: like
  return (
    <div className="w-8 h-8 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0">
      <Heart size={12} className="text-brand fill-brand" />
    </div>
  );
}

function notifMessage(n: NotificationItem): string {
  return n.message || "You have a new notification";
}

function senderName(n: NotificationItem): string {
  if (n.senderName) return n.senderName;
  if (typeof n.senderId === "object" && n.senderId !== null)
    return (n.senderId as { name: string }).name;
  return "Someone";
}

function timeAgo(d: string): string {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

interface NotificationBellProps {
  userId?: string;
  token?: string;
  asNavItem?: boolean;
  active?: boolean;
}

export default function NotificationBell({
  userId,
  token,
  asNavItem = false,
  active = false,
}: NotificationBellProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastNotif, setToastNotif] = useState<NotificationItem | null>(null);
  const socketRef = useRef<import("socket.io-client").Socket | null>(null);

  // ── Fetch unread count on mount ──
  useEffect(() => {
    getUnreadNotificationCount().then((res) => {
      if (res.success && res.data) {
        setUnreadCount((res.data as { unreadCount: number }).unreadCount ?? 0);
      }
    });
  }, []);

  // ── Socket.io — listen for new notifications (all types) ──
  useEffect(() => {
    if (!userId || !token) return;
    let mounted = true;

    const setup = async () => {
      try {
        const { io } = await import("socket.io-client");
        const serverUrl =
          process.env.NEXT_PUBLIC_SOCKET_URL ||
          process.env.NEXT_PUBLIC_BASE_URL ||
          "";
        if (!serverUrl) return;

        const socket = io(serverUrl, {
          query: { token, userId },
          transports: ["websocket", "polling"],
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 10000,
          reconnectionAttempts: Infinity,
        });

        socketRef.current = socket;

        // ── new-notification: triggered by like, profile visit (NOT new_message) ──
        const onNew = (notif: unknown) => {
          if (!mounted) return;
          const n = notif as NotificationItem;

          // new_message notification এখানে দেখাবো না — chat icon badge handle করবে
          if (n.type === "new_message") return;

          // Show toast only for non-message notifications
          setToastNotif(n);

          // Update unread count (message ছাড়া)
          setUnreadCount((prev) => prev + 1);

          // Add to dropdown list if open
          setNotifications((prev) => {
            if (prev.some((x) => x._id === n._id)) return prev;
            return [n, ...prev];
          });
        };

        // ── pending-notifications: socket'e ilk bağlandığında ──
        const onPending = (arr: unknown) => {
          if (!mounted) return;
          const notifs = arr as NotificationItem[];
          // শুধু non-message notification count করব
          const unread = notifs.filter(
            (n) => !n.isRead && n.type !== "new_message",
          );
          setUnreadCount(unread.length);
          const nonMsgNotifs = notifs.filter((n) => n.type !== "new_message");
          setNotifications((prev) => {
            const existingIds = new Set(prev.map((n) => n._id));
            const fresh = nonMsgNotifs.filter((n) => !existingIds.has(n._id));
            return [...fresh, ...prev];
          });
        };

        socket.on("new-notification", onNew);
        socket.on("pending-notifications", onPending);
      } catch {
        // socket.io-client unavailable — REST only mode
      }
    };

    setup();

    return () => {
      mounted = false;
      socketRef.current?.off("new-notification");
      socketRef.current?.off("pending-notifications");
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [userId, token]);

  // ── Fetch full list when dropdown opens ──
  const fetchNotifs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getNotifications();
      if (res.success && res.data) {
        const d = res.data as { data?: NotificationItem[] };
        // new_message বাদ দিয়ে শুধু like/profile_visit রাখব
        const filtered = (d.data || []).filter((n) => n.type !== "new_message");
        setNotifications(filtered);
        // Unread count ও recalculate করি
        const unread = filtered.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleOpen = () => {
    const next = !open;
    setOpen(next);
    if (next) fetchNotifs();
  };

  const handleMarkAll = async () => {
    await markAllNotificationsRead();
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleMarkOne = async (id: string) => {
    await markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  // ── Notification link: chat bildirimi ise chat'e git ──
  function getNotifLink(n: NotificationItem): string | null {
    if (n.type === "new_message" && n.metadata?.conversationWith) {
      return `/chat/${n.metadata.conversationWith}`;
    }
    if (n.type === "like" || n.type === "profile_visit") {
      return "/notifications";
    }
    return null;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // NAV ITEM MODE (mobile bottom bar — just icon + animated dot)
  // ─────────────────────────────────────────────────────────────────────────────
  if (asNavItem) {
    return (
      <>
        <div className="relative">
          <Bell
            size={22}
            className={`transition-colors duration-200 ${
              active ? "text-brand" : "text-slate-400"
            }`}
          />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1.5">
              {/* Animated red dot instead of number */}
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </span>
          )}
        </div>

        {/* Toast for nav item mode */}
        {toastNotif && (
          <ToastNotification
            notification={toastNotif}
            onClose={() => setToastNotif(null)}
          />
        )}
      </>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // FULL DROPDOWN MODE (desktop)
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="relative">
        {/* Bell button */}
        <button
          onClick={handleOpen}
          aria-label="Notifications"
          className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 hover:bg-brand/10 hover:border-brand/30 transition-all duration-200 cursor-pointer"
        >
          <Bell
            size={16}
            className={unreadCount > 0 ? "text-brand" : "text-slate-500"}
          />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] flex items-center justify-center bg-brand text-white text-[9px] font-bold rounded-full px-1">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {/* Backdrop */}
        {open && (
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
        )}

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 top-11 z-50 w-80 rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden animate-[fadeUp_0.2s_ease]">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Bell size={14} className="text-slate-500" />
                <span className="font-syne text-slate-900 text-sm font-bold">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-brand/10 text-brand border border-brand/20">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAll}
                    className="font-outfit text-[11px] text-brand hover:text-brand/70 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <CheckCheck size={11} /> Mark all read
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-[360px] overflow-y-auto">
              {loading && (
                <div className="py-10 flex items-center justify-center gap-2 text-slate-400">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-sm">Loading...</span>
                </div>
              )}

              {!loading && notifications.length === 0 && (
                <div className="py-10 text-center">
                  <Bell size={24} className="text-slate-300 mx-auto mb-2" />
                  <p className="font-outfit text-slate-400 text-sm">
                    No notifications yet
                  </p>
                </div>
              )}

              {!loading &&
                notifications.map((n) => {
                  const link = getNotifLink(n);
                  const content = (
                    <div
                      className={`flex items-start gap-3 px-4 py-3 border-b border-slate-50 last:border-0 transition-colors duration-150 ${
                        n.isRead
                          ? "bg-slate-50/50 hover:bg-slate-100/50"
                          : "hover:bg-brand/3"
                      }`}
                    >
                      <NotifIcon type={n.type} />

                      <div
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => !n.isRead && handleMarkOne(n._id)}
                      >
                        <p
                          className={`font-outfit text-xs leading-relaxed ${
                            n.isRead ? "text-slate-600" : "text-slate-700"
                          }`}
                        >
                          <span
                            className={`font-semibold ${
                              n.isRead ? "text-slate-700" : "text-slate-900"
                            }`}
                          >
                            {senderName(n)}
                          </span>{" "}
                          {n.type === "new_message"
                            ? "sent you a message"
                            : n.type === "profile_visit"
                              ? "visited your profile"
                              : "liked your profile"}
                        </p>
                        {/* Show message preview for chat notifications */}
                        {n.type === "new_message" && n.message && (
                          <p
                            className={`text-[11px] mt-0.5 truncate ${
                              n.isRead ? "text-slate-500" : "text-slate-400"
                            }`}
                          >
                            {n.message.replace(
                              /^.+ sent you a new message$/,
                              "New message",
                            )}
                          </p>
                        )}
                        <p
                          className={`font-outfit text-[10px] mt-0.5 ${
                            n.isRead ? "text-slate-500" : "text-slate-400"
                          }`}
                        >
                          {timeAgo(n.createdAt)}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                        {!n.isRead && (
                          <div
                            className="w-2 h-2 rounded-full bg-brand"
                            style={{ boxShadow: "var(--shadow-brand-dot)" }}
                          />
                        )}
                      </div>
                    </div>
                  );

                  if (link) {
                    return (
                      <Link
                        key={n._id}
                        href={link}
                        onClick={() => {
                          if (!n.isRead) handleMarkOne(n._id);
                          setOpen(false);
                        }}
                        className="no-underline block"
                      >
                        {content}
                      </Link>
                    );
                  }

                  return <div key={n._id}>{content}</div>;
                })}
            </div>

            {/* Footer — View all */}
            {notifications.length > 0 && (
              <div className="border-t border-slate-100 px-4 py-2.5">
                <Link
                  href="/notifications"
                  onClick={() => setOpen(false)}
                  className="font-outfit text-xs text-brand hover:text-brand/70 transition-colors no-underline flex items-center justify-center gap-1"
                >
                  View all notifications →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Toast for desktop mode */}
      {toastNotif && (
        <ToastNotification
          notification={toastNotif}
          onClose={() => setToastNotif(null)}
        />
      )}
    </>
  );
}
