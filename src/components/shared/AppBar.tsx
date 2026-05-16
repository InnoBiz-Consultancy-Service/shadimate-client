// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//   Home,
//   HeartHandshake,
//   MessageCircle,
//   User,
//   LogOut,
// } from "lucide-react";
// import NotificationBell from "@/components/like/NotificationBell";
// import { useEffect, useState, useTransition } from "react";
// import { logoutAction } from "@/actions/auth/logout";
// import { useSocketContext } from "@/context/SocketContext";

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
//   { href: "/profile", label: "Profile", icon: User },
// ];

// // ── JWT decode ────────────────────────────────────────────────────────────────
// function decodeJwt(token: string): Record<string, unknown> | null {
//   try {
//     const part = token.split(".")[1];
//     if (!part) return null;
//     const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
//     const padded = base64.padEnd(
//       base64.length + ((4 - (base64.length % 4)) % 4),
//       "=",
//     );
//     return JSON.parse(atob(padded));
//   } catch {
//     return null;
//   }
// }

// function getCookie(name: string): string | null {
//   if (typeof document === "undefined") return null;
//   const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
//   return match ? decodeURIComponent(match[1]) : null;
// }

// export default function AppBar() {
//   const pathname = usePathname();
//   const [userId, setUserId] = useState<string | undefined>(undefined);
//   const [token, setToken] = useState<string | undefined>(undefined);
//   const [showMobileProfileMenu, setShowMobileProfileMenu] = useState(false);
//   const [isLoggingOut, startLogout] = useTransition();

//   // ✅ Global socket context থেকে unread count নিচ্ছি — আর আলাদা socket নেই
//   const { unreadCount, clearUnread } = useSocketContext();

//   const handleLogout = () => {
//     startLogout(() => {
//       logoutAction();
//     });
//   };

//   // token + userId cookie থেকে (NotificationBell এর জন্য দরকার)
//   useEffect(() => {
//     const t = getCookie("accessToken");
//     if (!t) return;
//     setToken(t);
//     const payload = decodeJwt(t);
//     if (payload?.id && typeof payload.id === "string") {
//       setUserId(payload.id);
//     }
//   }, []);

//   // ✅ Chat page এ গেলে সব unread clear করব
//   useEffect(() => {
//     if (pathname.startsWith("/chat/")) {
//       // specific chat open হলে সেই userId এর unread clear
//       const userId = pathname.replace("/chat/", "");
//       if (userId) clearUnread(userId);
//     }
//   }, [pathname, clearUnread]);

//   const isActive = (href: string) => {
//     if (href === "/feed") return pathname === "/feed";
//     return pathname.startsWith(href);
//   };

//   const mobileItems = NAV_ITEMS.filter((item) => !item.mobileHidden);

//   return (
//     <>
//       {/* ── DESKTOP NAV ── */}
//       <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 h-16 items-center justify-between px-6 lg:px-10 bg-brand/95 backdrop-blur-sm shadow-lg border-b border-brand/20">
//         <Link
//           href="/feed"
//           className="flex items-center gap-2.5 no-underline group"
//         >
//           <div className="w-8 h-8 rounded-full flex items-center justify-center bg-brand/20 backdrop-blur-sm shadow-md group-hover:bg-brand/30 group-hover:scale-105 transition-all duration-300">
//             <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
//               <path
//                 d="M5 4C5 4 4 8 7 11C10 14 13 13 13 13C13 13 10.5 12.2 9 10C7.5 7.8 8.5 4 5 4Z"
//                 fill="white"
//               />
//               <circle cx="9" cy="9" r="2.2" fill="white" opacity="0.6" />
//             </svg>
//           </div>
//           <span className="font-syne text-white font-extrabold text-xl tracking-tight drop-shadow-md">
//             primehalf
//           </span>
//         </Link>

//         <div className="flex items-center gap-1">
//           {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
//             const active = isActive(href);
//             const isChat = href === "/chat";
//             return (
//               <Link
//                 key={href}
//                 href={href}
//                 className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium no-underline transition-all duration-200 ${
//                   active
//                     ? "text-white bg-brand/30 backdrop-blur-sm shadow-md"
//                     : "text-white/80 hover:text-white hover:bg-brand/20 backdrop-blur-sm"
//                 }`}
//               >
//                 <span className="relative">
//                   <Icon size={18} />
//                   {isChat && unreadCount > 0 && (
//                     <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] flex items-center justify-center bg-red-500 text-white text-[9px] font-bold rounded-full px-1 leading-none shadow-md ring-2 ring-white/50">
//                       {unreadCount > 99 ? "99+" : unreadCount}
//                     </span>
//                   )}
//                 </span>
//                 <span className="font-outfit">{label}</span>
//               </Link>
//             );
//           })}

//           <div className="ml-1">
//             <NotificationBell userId={userId} token={token} />
//           </div>

//           <button
//             onClick={handleLogout}
//             disabled={isLoggingOut}
//             className="ml-2 flex items-center justify-center w-9 h-9 rounded-xl text-white/70 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
//             title="Log out"
//           >
//             <LogOut size={18} />
//           </button>
//         </div>
//       </nav>

//       {/* ── MOBILE BOTTOM NAV ── */}
//       <nav
//         className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-brand/95 backdrop-blur-sm shadow-[0_-4px_20px_rgba(0,0,0,0.15)] border-t border-white/10"
//         style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
//       >
//         <div className="flex items-center justify-around h-16 max-w-md mx-auto">
//           {mobileItems.map(({ href, label, icon: Icon }) => {
//             const active = isActive(href);
//             const isChat = href === "/chat";
//             const isProfile = href === "/profile";

//             if (isProfile) return null;

//             return (
//               <Link
//                 key={href}
//                 href={href}
//                 className={`relative flex flex-col flex-1 items-center justify-center gap-0.5 no-underline w-[60px] py-1.5 px-2 rounded-xl transition-all duration-200 ${
//                   active
//                     ? "bg-white/20 backdrop-blur-sm text-white shadow-md"
//                     : "text-white/60 hover:text-white hover:bg-white/10"
//                 }`}
//               >
//                 <span className="relative">
//                   <Icon size={22} />
//                   {isChat && unreadCount > 0 && (
//                     <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] flex items-center justify-center bg-red-500 text-white text-[9px] font-bold rounded-full px-1 leading-none shadow-md ring-2 ring-white/50">
//                       {unreadCount > 99 ? "99+" : unreadCount}
//                     </span>
//                   )}
//                 </span>
//                 <span
//                   className={`font-outfit text-[10px] font-medium transition-colors duration-200 ${
//                     active ? "text-white" : "text-white/60"
//                   }`}
//                 >
//                   {label}
//                 </span>
//               </Link>
//             );
//           })}

//           {/* Notification Bell */}
//           <div className="flex-1 flex justify-center">
//             <Link
//               href="/notifications"
//               className="no-underline flex flex-col items-center justify-center gap-0.5 w-[60px] py-1.5 px-2 relative rounded-xl transition-all duration-200 hover:bg-white/10"
//             >
//               <NotificationBell
//                 asNavItem
//                 active={isActive("/notifications")}
//                 userId={userId}
//                 token={token}
//               />
//               <span
//                 className={`font-outfit text-[10px] font-medium transition-colors duration-200 ${
//                   isActive("/notifications") ? "text-white" : "text-white/60"
//                 }`}
//               >
//                 Alerts
//               </span>
//             </Link>
//           </div>

//           {/* Profile */}
//           {(() => {
//             const profileItem = mobileItems.find((i) => i.href === "/profile");
//             if (!profileItem) return null;
//             const { href, label, icon: Icon } = profileItem;
//             const active = isActive(href);

//             return (
//               <div
//                 key={href}
//                 className="relative flex flex-col flex-1 items-center justify-center"
//               >
//                 <button
//                   onClick={() => setShowMobileProfileMenu((prev) => !prev)}
//                   className={`relative flex flex-col items-center justify-center gap-0.5 w-[60px] py-1.5 px-2 rounded-xl transition-all duration-200 ${
//                     active || showMobileProfileMenu
//                       ? "bg-white/20 backdrop-blur-sm text-white shadow-md"
//                       : "text-white/60 hover:text-white hover:bg-white/10"
//                   }`}
//                 >
//                   <Icon size={22} />
//                   <span
//                     className={`font-outfit text-[10px] font-medium transition-colors duration-200 ${
//                       active || showMobileProfileMenu
//                         ? "text-white"
//                         : "text-white/60"
//                     }`}
//                   >
//                     {label}
//                   </span>
//                 </button>

//                 {showMobileProfileMenu && (
//                   <>
//                     <div
//                       className="fixed inset-0 z-[55]"
//                       onClick={() => setShowMobileProfileMenu(false)}
//                     />
//                     <div className="absolute bottom-[calc(100%+8px)] right-0 bg-white border border-slate-200 shadow-xl rounded-2xl w-44 overflow-hidden flex flex-col z-[60] animate-[fadeUp_0.15s_ease_both]">
//                       <Link
//                         href="/profile"
//                         onClick={() => setShowMobileProfileMenu(false)}
//                         className="flex items-center gap-2.5 px-4 py-3.5 text-sm text-slate-700 hover:bg-brand/5 hover:text-brand font-outfit transition-colors"
//                       >
//                         <User size={16} /> View Profile
//                       </Link>
//                       <button
//                         onClick={() => {
//                           setShowMobileProfileMenu(false);
//                           handleLogout();
//                         }}
//                         disabled={isLoggingOut}
//                         className="flex items-center gap-2.5 px-4 py-3.5 text-sm text-red-500 hover:bg-red-50 font-outfit text-left transition-colors"
//                       >
//                         <LogOut size={16} /> Log Out
//                       </button>
//                     </div>
//                   </>
//                 )}
//               </div>
//             );
//           })()}
//         </div>
//       </nav>
//     </>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  HeartHandshake,
  MessageCircle,
  User,
  LogOut,
  Bell,
} from "lucide-react";
import NotificationBell from "@/components/like/NotificationBell";
import { useEffect, useState, useTransition } from "react";
import { logoutAction } from "@/actions/auth/logout";
import { useSocketContext } from "@/context/SocketContext";

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
  { href: "/profile", label: "Profile", icon: User },
];

// ── JWT decode ────────────────────────────────────────────────────────────────
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

export default function AppBar() {
  const pathname = usePathname();
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [token, setToken] = useState<string | undefined>(undefined);
  const [showMobileProfileMenu, setShowMobileProfileMenu] = useState(false);
  const [isLoggingOut, startLogout] = useTransition();

  const { unreadCount, clearUnread } = useSocketContext();

  const handleLogout = () => {
    startLogout(() => {
      logoutAction();
    });
  };

  useEffect(() => {
    const t = getCookie("accessToken");
    if (!t) return;
    setToken(t);
    const payload = decodeJwt(t);
    if (payload?.id && typeof payload.id === "string") {
      setUserId(payload.id);
    }
  }, []);

  useEffect(() => {
    if (pathname.startsWith("/chat/")) {
      const uid = pathname.replace("/chat/", "");
      if (uid) clearUnread(uid);
    }
  }, [pathname, clearUnread]);

  const isActive = (href: string) => {
    if (href === "/feed") return pathname === "/feed";
    return pathname.startsWith(href);
  };

  const mobileItems = NAV_ITEMS.filter((item) => !item.mobileHidden);
  const notifActive = isActive("/notifications");

  return (
    <>
      {/* ── DESKTOP NAV ── */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 h-16 items-center justify-between px-6 lg:px-10 bg-brand/95 backdrop-blur-sm shadow-lg border-b border-brand/20">
        <Link
          href="/feed"
          className="flex items-center gap-2.5 no-underline group"
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-brand/20 backdrop-blur-sm shadow-md group-hover:bg-brand/30 group-hover:scale-105 transition-all duration-300">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M5 4C5 4 4 8 7 11C10 14 13 13 13 13C13 13 10.5 12.2 9 10C7.5 7.8 8.5 4 5 4Z"
                fill="white"
              />
              <circle cx="9" cy="9" r="2.2" fill="white" opacity="0.6" />
            </svg>
          </div>
          <span className="font-syne text-white font-extrabold text-xl tracking-tight drop-shadow-md">
            primehalf
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
                    ? "text-white bg-brand/30 backdrop-blur-sm shadow-md"
                    : "text-white/80 hover:text-white hover:bg-brand/20 backdrop-blur-sm"
                }`}
              >
                <span className="relative">
                  <Icon size={18} />
                  {isChat && unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] flex items-center justify-center bg-red-500 text-white text-[9px] font-bold rounded-full px-1 leading-none shadow-md ring-2 ring-white/50">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </span>
                <span className="font-outfit">{label}</span>
              </Link>
            );
          })}

          <div className="ml-1">
            <NotificationBell userId={userId} token={token} />
          </div>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="ml-2 flex items-center justify-center w-9 h-9 rounded-xl text-white/70 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
            title="Log out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-brand/95 backdrop-blur-sm shadow-[0_-4px_20px_rgba(0,0,0,0.15)] border-t border-white/10"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-center justify-around h-16 max-w-md mx-auto">
          {mobileItems.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            const isChat = href === "/chat";
            const isProfile = href === "/profile";

            if (isProfile) return null;

            return (
              <Link
                key={href}
                href={href}
                className={`relative flex flex-col flex-1 items-center justify-center gap-0.5 no-underline w-[60px] py-1.5 px-2 rounded-xl transition-all duration-200 ${
                  active
                    ? "bg-white/20 backdrop-blur-sm text-white shadow-md"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                <span className="relative">
                  <Icon size={22} />
                  {isChat && unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] flex items-center justify-center bg-red-500 text-white text-[9px] font-bold rounded-full px-1 leading-none shadow-md ring-2 ring-white/50">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </span>
                <span
                  className={`font-outfit text-[10px] font-medium transition-colors duration-200 ${
                    active ? "text-white" : "text-white/60"
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}

          {/* FIX: Renamed "Alerts" → "Notifications"; fixed active icon color */}
          <div className="flex-1 flex justify-center">
            <Link
              href="/notifications"
              className={`no-underline flex flex-col items-center justify-center gap-0.5 w-[60px] py-1.5 px-2 relative rounded-xl transition-all duration-200 ${
                notifActive
                  ? "bg-white/20 backdrop-blur-sm shadow-md"
                  : "hover:bg-white/10"
              }`}
            >
              {/* FIX: Use white icon always so it's visible on brand background */}
              <NotificationBell
                asNavItem
                active={notifActive}
                userId={userId}
                token={token}
              />
              <span
                className={`font-outfit text-[10px] font-medium transition-colors duration-200 ${
                  notifActive ? "text-white" : "text-white/60"
                }`}
              >
                {/* FIX: renamed from "Alerts" */}
                Notifs
              </span>
            </Link>
          </div>

          {/* Profile */}
          {(() => {
            const profileItem = mobileItems.find((i) => i.href === "/profile");
            if (!profileItem) return null;
            const { href, label, icon: Icon } = profileItem;
            const active = isActive(href);

            return (
              <div
                key={href}
                className="relative flex flex-col flex-1 items-center justify-center"
              >
                <button
                  onClick={() => setShowMobileProfileMenu((prev) => !prev)}
                  className={`relative flex flex-col items-center justify-center gap-0.5 w-[60px] py-1.5 px-2 rounded-xl transition-all duration-200 ${
                    active || showMobileProfileMenu
                      ? "bg-white/20 backdrop-blur-sm text-white shadow-md"
                      : "text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon size={22} />
                  <span
                    className={`font-outfit text-[10px] font-medium transition-colors duration-200 ${
                      active || showMobileProfileMenu
                        ? "text-white"
                        : "text-white/60"
                    }`}
                  >
                    {label}
                  </span>
                </button>

                {showMobileProfileMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-[55]"
                      onClick={() => setShowMobileProfileMenu(false)}
                    />
                    <div className="absolute bottom-[calc(100%+8px)] right-0 bg-white border border-slate-200 shadow-xl rounded-2xl w-44 overflow-hidden flex flex-col z-[60] animate-[fadeUp_0.15s_ease_both]">
                      <Link
                        href="/profile"
                        onClick={() => setShowMobileProfileMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-3.5 text-sm text-slate-700 hover:bg-brand/5 hover:text-brand font-outfit transition-colors"
                      >
                        <User size={16} /> View Profile
                      </Link>
                      <button
                        onClick={() => {
                          setShowMobileProfileMenu(false);
                          handleLogout();
                        }}
                        disabled={isLoggingOut}
                        className="flex items-center gap-2.5 px-4 py-3.5 text-sm text-red-500 hover:bg-red-50 font-outfit text-left transition-colors"
                      >
                        <LogOut size={16} /> Log Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })()}
        </div>
      </nav>
    </>
  );
}
