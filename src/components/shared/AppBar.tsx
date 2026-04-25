// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Home, HeartHandshake, MessageCircle, Crown, User } from "lucide-react";
// import NotificationBell from "@/components/like/NotificationBell";
// import { useEffect, useState } from "react";

// interface NavItem {
//   href: string;
//   label: string;
//   icon: React.ElementType;
//   mobileHidden?: boolean;
// }

// const NAV_ITEMS: NavItem[] = [
//   { href: "/feed", label: "Feed", icon: Home },
//   { href: "/dream-partner", label: "Dream", icon: HeartHandshake },
//   { href: "/chat", label: "Chat", icon: MessageCircle },
//   { href: "/subscription", label: "Premium", icon: Crown, mobileHidden: true },
//   { href: "/profile", label: "Profile", icon: User },
// ];

// // ── JWT decode (client-side, no library) ─────────────────────────────────────
// function decodeJwt(token: string): Record<string, unknown> | null {
//   try {
//     const part = token.split(".")[1];
//     if (!part) return null;
//     const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
//     const padded = base64.padEnd(
//       base64.length + ((4 - (base64.length % 4)) % 4),
//       "="
//     );
//     return JSON.parse(atob(padded));
//   } catch {
//     return null;
//   }
// }

// // ── Cookie reader ─────────────────────────────────────────────────────────────
// function getCookie(name: string): string | null {
//   if (typeof document === "undefined") return null;
//   const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
//   return match ? decodeURIComponent(match[1]) : null;
// }

// export default function AppBar() {
//   const pathname = usePathname();
//   const [userId, setUserId] = useState<string | undefined>(undefined);
//   const [token, setToken] = useState<string | undefined>(undefined);

//   // ── Read token from cookie client-side and decode userId ──
//   useEffect(() => {
//     const t = getCookie("accessToken");
//     if (!t) return;
//     setToken(t);
//     const payload = decodeJwt(t);
//     if (payload?.id && typeof payload.id === "string") {
//       setUserId(payload.id);
//     }
//   }, []);

//   const isActive = (href: string) => {
//     if (href === "/feed") return pathname === "/feed";
//     return pathname.startsWith(href);
//   };

//   const mobileItems = NAV_ITEMS.filter((item) => !item.mobileHidden);

//   return (
//     <>
//       {/* ── DESKTOP NAV ── */}
//       <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 h-16 items-center justify-between px-6 lg:px-10 border-b border-slate-100 bg-white/95 backdrop-blur-xl shadow-sm">
//         <Link href="/feed" className="flex items-center gap-2.5 no-underline">
//           <div className="w-8 h-8 rounded-full flex items-center justify-center bg-linear-to-br from-brand to-accent shadow-sm">
//             <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
//               <path
//                 d="M5 4C5 4 4 8 7 11C10 14 13 13 13 13C13 13 10.5 12.2 9 10C7.5 7.8 8.5 4 5 4Z"
//                 fill="white"
//               />
//               <circle cx="9" cy="9" r="2.2" fill="white" opacity="0.6" />
//             </svg>
//           </div>
//           <span className="font-syne text-slate-900 font-extrabold text-lg tracking-tight">
//             ShadiMate
//           </span>
//         </Link>

//         <div className="flex items-center gap-1">
//           {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
//             const active = isActive(href);
//             return (
//               <Link
//                 key={href}
//                 href={href}
//                 className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium no-underline transition-all duration-200 ${
//                   active
//                     ? "text-brand bg-brand/8"
//                     : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
//                 }`}
//               >
//                 <Icon size={18} className={active ? "text-brand" : ""} />
//                 <span className="font-outfit">{label}</span>
//               </Link>
//             );
//           })}

//           {/* Notification Bell — userId & token pass করা হচ্ছে */}
//           <div className="ml-1">
//             <NotificationBell userId={userId} token={token} />
//           </div>
//         </div>
//       </nav>

//       {/* ── MOBILE BOTTOM NAV ── */}
//       <nav
//         className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-slate-100 bg-white/95 backdrop-blur-xl"
//         style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
//       >
//         <div className="flex items-center justify-around h-16 max-w-md mx-auto">
//           {mobileItems.map(({ href, label, icon: Icon }) => {
//             const active = isActive(href);
//             return (
//               <Link
//                 key={href}
//                 href={href}
//                 className="relative flex flex-col items-center justify-center gap-0.5 no-underline w-16 py-1"
//               >
//                 {active && (
//                   <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-brand" />
//                 )}
//                 <Icon
//                   size={22}
//                   className={`transition-colors duration-200 ${
//                     active ? "text-brand" : "text-slate-400"
//                   }`}
//                 />
//                 <span
//                   className={`font-outfit text-[10px] font-medium transition-colors duration-200 ${
//                     active ? "text-brand" : "text-slate-400"
//                   }`}
//                 >
//                   {label}
//                 </span>
//               </Link>
//             );
//           })}

//           {/* Notification Bell — mobile nav item */}
//           <Link
//             href="/notifications"
//             className="no-underline flex flex-col items-center gap-0.5 w-16 py-1 relative"
//           >
//             {isActive("/notifications") && (
//               <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-brand" />
//             )}
//             <NotificationBell
//               asNavItem
//               active={isActive("/notifications")}
//               userId={userId}
//               token={token}
//             />
//             <span
//               className={`font-outfit text-[10px] font-medium transition-colors duration-200 ${
//                 isActive("/notifications") ? "text-brand" : "text-slate-400"
//               }`}
//             >
//               Alerts
//             </span>
//           </Link>
//         </div>
//       </nav>
//     </>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, HeartHandshake, MessageCircle, Crown, User } from "lucide-react";
import NotificationBell from "@/components/like/NotificationBell";
import { useEffect, useState, useRef } from "react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  mobileHidden?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/feed", label: "Feed", icon: Home },
  { href: "/dream-partner", label: "Dream", icon: HeartHandshake },
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/subscription", label: "Premium", icon: Crown, mobileHidden: true },
  { href: "/profile", label: "Profile", icon: User },
];

// ── JWT decode (client-side, no library) ─────────────────────────────────────
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

// ── Cookie reader ─────────────────────────────────────────────────────────────
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export default function AppBar() {
  const pathname = usePathname();
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [token, setToken] = useState<string | undefined>(undefined);
  const [unreadMsgCount, setUnreadMsgCount] = useState(0);
  const socketRef = useRef<import("socket.io-client").Socket | null>(null);

  // ── Read token from cookie client-side and decode userId ──
  useEffect(() => {
    const t = getCookie("accessToken");
    if (!t) return;
    setToken(t);
    const payload = decodeJwt(t);
    if (payload?.id && typeof payload.id === "string") {
      setUserId(payload.id);
    }
  }, []);

  // ── Socket: unread message count track করব ──
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

        // নতুন message আসলে count বাড়াব (chat page open না থাকলে)
        socket.on("receive-message", () => {
          if (!mounted) return;
          // /chat/ এর ভেতরে থাকলে count বাড়াব না
          if (!window.location.pathname.startsWith("/chat/")) {
            setUnreadMsgCount((prev) => prev + 1);
          }
        });

        // pending-notifications থেকে unread message count নেব
        socket.on("pending-notifications", (notifications: unknown[]) => {
          if (!mounted) return;
          const msgNotifs = (
            notifications as Array<{ type: string; isRead?: boolean }>
          ).filter((n) => n.type === "new_message" && !n.isRead);
          if (msgNotifs.length > 0) {
            setUnreadMsgCount(msgNotifs.length);
          }
        });
      } catch {
        /* socket.io-client unavailable */
      }
    };

    setup();

    return () => {
      mounted = false;
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [userId, token]);

  // ── Chat page এ গেলে badge clear করব ──
  useEffect(() => {
    if (pathname.startsWith("/chat")) {
      setUnreadMsgCount(0);
    }
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/feed") return pathname === "/feed";
    return pathname.startsWith(href);
  };

  const mobileItems = NAV_ITEMS.filter((item) => !item.mobileHidden);

  return (
    <>
      {/* ── DESKTOP NAV ── */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 h-16 items-center justify-between px-6 lg:px-10 border-b border-slate-100 bg-white/95 backdrop-blur-xl shadow-sm">
        <Link href="/feed" className="flex items-center gap-2.5 no-underline">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-linear-to-br from-brand to-accent shadow-sm">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M5 4C5 4 4 8 7 11C10 14 13 13 13 13C13 13 10.5 12.2 9 10C7.5 7.8 8.5 4 5 4Z"
                fill="white"
              />
              <circle cx="9" cy="9" r="2.2" fill="white" opacity="0.6" />
            </svg>
          </div>
          <span className="font-syne text-slate-900 font-extrabold text-lg tracking-tight">
            ShadiMate
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            const isChat = href === "/chat";
            return (
              <Link
                key={href}
                href={href}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium no-underline transition-all duration-200 ${
                  active
                    ? "text-brand bg-brand/8"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                }`}
              >
                <span className="relative">
                  <Icon size={18} className={active ? "text-brand" : ""} />
                  {/* Chat icon এর badge */}
                  {isChat && unreadMsgCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] flex items-center justify-center bg-red-500 text-white text-[9px] font-bold rounded-full px-1 leading-none">
                      {unreadMsgCount > 99 ? "99+" : unreadMsgCount}
                    </span>
                  )}
                </span>
                <span className="font-outfit">{label}</span>
              </Link>
            );
          })}

          {/* Notification Bell — userId & token pass করা হচ্ছে */}
          <div className="ml-1">
            <NotificationBell userId={userId} token={token} />
          </div>
        </div>
      </nav>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-slate-100 bg-white/95 backdrop-blur-xl"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-center justify-around h-16 max-w-md mx-auto">
          {mobileItems.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            const isChat = href === "/chat";
            return (
              <Link
                key={href}
                href={href}
                className="relative flex flex-col items-center justify-center gap-0.5 no-underline w-16 py-1"
              >
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-brand" />
                )}
                <span className="relative">
                  <Icon
                    size={22}
                    className={`transition-colors duration-200 ${
                      active ? "text-brand" : "text-slate-400"
                    }`}
                  />
                  {/* Chat icon এর badge — mobile */}
                  {isChat && unreadMsgCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] flex items-center justify-center bg-red-500 text-white text-[9px] font-bold rounded-full px-1 leading-none">
                      {unreadMsgCount > 99 ? "99+" : unreadMsgCount}
                    </span>
                  )}
                </span>
                <span
                  className={`font-outfit text-[10px] font-medium transition-colors duration-200 ${
                    active ? "text-brand" : "text-slate-400"
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}

          {/* Notification Bell — mobile nav item */}
          <Link
            href="/notifications"
            className="no-underline flex flex-col items-center gap-0.5 w-16 py-1 relative"
          >
            {isActive("/notifications") && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-brand" />
            )}
            <NotificationBell
              asNavItem
              active={isActive("/notifications")}
              userId={userId}
              token={token}
            />
            <span
              className={`font-outfit text-[10px] font-medium transition-colors duration-200 ${
                isActive("/notifications") ? "text-brand" : "text-slate-400"
              }`}
            >
              Alerts
            </span>
          </Link>
        </div>
      </nav>
    </>
  );
}
