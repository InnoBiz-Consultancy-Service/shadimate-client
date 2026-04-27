"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight, MessageCircle, UserCircle } from "lucide-react";
import { checkUserProfile } from "@/actions/chat/chat";
import NotificationBell from "@/components/like/NotificationBell";

const NAV_LINKS = ["Features", "Psychology", "Matches"];

interface UnreadCountResponse {
  success: boolean;
  data?: {
    unreadCount: number;
  };
}

export default function Navbar() {
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Get userId and token from cookies
  useEffect(() => {
    const getCookies = () => {
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);
      
      return {
        userId: cookies.userId,
        token: cookies.accessToken
      };
    };
    
    const { userId, token } = getCookies();
    setUserId(userId || null);
    setToken(token || null);
  }, []);

  // Check if user is logged in and has profile
  useEffect(() => {
    const checkAuthAndProfile = async () => {
      try {
        setIsLoading(true);
        // Check if token exists
        const hasToken = document.cookie.includes("accessToken");
        setIsLoggedIn(hasToken);

        if (hasToken) {
          const result = await checkUserProfile();
          setHasProfile(result.hasProfile);
          
          // Fetch unread chat count
          await fetchUnreadChatCount();
        } else {
          setHasProfile(false);
          setUnreadChatCount(0);
        }
      } catch (error) {
        console.error("Failed to check profile:", error);
        setHasProfile(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndProfile();
  }, []);

  // Fetch unread chat messages count
  const fetchUnreadChatCount = async () => {
    try {
      const response = await fetch('/api/chat/unread-count', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (response.ok) {
        const data: UnreadCountResponse = await response.json();
        setUnreadChatCount(data.data?.unreadCount || 0);
      }
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  };

  // Listen for new messages via socket (if needed)
  useEffect(() => {
    if (!isLoggedIn || !userId || !token) return;

    const setupSocketListener = async () => {
      try {
        const { io } = await import("socket.io-client");
        const serverUrl = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_BASE_URL || "";
        
        if (!serverUrl) return;
        
        const socket = io(serverUrl, {
          query: { token, userId },
          transports: ["websocket", "polling"],
        });
        
        socket.on("new-message", (data) => {
          // Increment unread count when new message arrives
          setUnreadChatCount((prev) => prev + 1);
        });
        
        return () => {
          socket.disconnect();
        };
      } catch (error) {
        console.error("Socket setup failed:", error);
      }
    };
    
    setupSocketListener();
  }, [isLoggedIn, userId, token]);

  // Determine chat link based on profile status
  const getChatLink = () => {
    if (!isLoggedIn) return "/login";
    return hasProfile ? "/conversations" : "/profile/create";
  };

  const getChatButtonText = () => {
    if (!isLoggedIn) return "Login to Chat";
    return hasProfile ? "Chat" : "Create Profile";
  };

  const getChatIconColor = () => {
    if (!isLoggedIn) return "text-slate-400";
    return hasProfile
      ? "text-slate-600 hover:text-brand"
      : "text-brand/80 hover:text-brand";
  };

  return (
    <>
      {/* Mobile Menu */}
      <div
        className={`
          fixed inset-0 z-99 flex flex-col items-center justify-center gap-3
          bg-white backdrop-blur-3xl
          transition-opacity duration-300
          ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
          md:hidden
        `}
      >
        {NAV_LINKS.map((link) => (
          <button
            key={link}
            onClick={() => {
              setActive(link);
              setMenuOpen(false);
            }}
            className={`
              font-syne font-bold tracking-tight px-6 py-2 rounded-xl
              text-[clamp(32px,9vw,56px)] transition-all duration-200
              ${
                active === link
                  ? "bg-linear-to-r from-brand to-accent bg-clip-text text-transparent"
                  : "text-slate-300 hover:text-slate-900 hover:bg-slate-100"
              }
            `}
          >
            {link}
          </button>
        ))}

        {/* Chat link in mobile menu */}
        <Link
          href={getChatLink()}
          onClick={() => setMenuOpen(false)}
          className={`
            font-syne font-bold tracking-tight px-6 py-2 rounded-xl
            text-[clamp(32px,9vw,56px)] transition-all duration-200
            flex items-center gap-3 relative
            ${
              !isLoggedIn
                ? "text-slate-400"
                : hasProfile
                  ? "text-slate-700 hover:text-brand"
                  : "text-brand/80 hover:text-brand"
            }
          `}
        >
          <div className="relative">
            <MessageCircle size={40} />
            {hasProfile && unreadChatCount > 0 && (
              <span className="absolute -top-1 -right-2 min-w-[18px] h-[18px] flex items-center justify-center bg-brand text-white text-[9px] font-bold rounded-full px-1">
                {unreadChatCount > 99 ? "99+" : unreadChatCount}
              </span>
            )}
          </div>
          {getChatButtonText()}
        </Link>

        <Link
          href={isLoggedIn ? "/profiles" : "/login"}
          onClick={() => setMenuOpen(false)}
          className="
            mt-7 font-outfit font-bold tracking-widest text-base text-white
            px-14 py-4 rounded-full cursor-pointer no-underline
            bg-linear-to-r from-brand to-accent
            shadow-lg
            hover:scale-[1.04] hover:shadow-xl
            active:scale-[0.97] transition-all duration-200
            inline-flex items-center gap-2
          "
        >
          {isLoggedIn ? "Browse Profiles" : "Login"} <ArrowRight size={16} />
        </Link>

        <span className="absolute bottom-10 font-outfit text-[11px] uppercase tracking-[0.12em] text-slate-400">
          tap outside to close
        </span>
      </div>

      {menuOpen && (
        <div
          className="fixed inset-0 z-98 md:hidden bg-black/20 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div
        className={`
          sticky top-0 z-100 w-full flex justify-center
          transition-all duration-300
          ${scrolled ? "px-4 py-2" : "px-4 py-3.5"}
        `}
      >
        <nav
          className="
            relative flex items-center justify-between
            w-full max-w-175 overflow-hidden
            rounded-full border border-slate-200
            bg-white/95 backdrop-blur-2xl
            px-3.5 py-2
            shadow-lg
            transition-all duration-300 font-outfit
          "
          aria-label="Main navigation"
        >
          <Link href="/" className="no-underline" aria-label="primehalf home">
            <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center cursor-pointer bg-linear-to-br from-brand to-accent shadow-md">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M5 4C5 4 4 8 7 11C10 14 13 13 13 13C13 13 10.5 12.2 9 10C7.5 7.8 8.5 4 5 4Z"
                  fill="white"
                />
                <circle cx="9" cy="9" r="2.2" fill="white" opacity="0.6" />
              </svg>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                onClick={() => setActive(link)}
                className={`
                  nav-pill relative cursor-pointer px-4 py-1.5 rounded-full
                  text-sm font-medium tracking-wide transition-colors duration-200
                  ${active === link ? "is-active text-brand" : "text-slate-600 hover:text-slate-900"}
                `}
              >
                {link}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Chat Icon with Unread Count - Desktop */}
            {!isLoading && (
              <Link
                href={getChatLink()}
                title={getChatButtonText()}
                className={`
                  relative flex items-center justify-center w-9 h-9 rounded-full
                  transition-all duration-200
                  ${getChatIconColor()}
                `}
              >
                <MessageCircle size={18} />
                {hasProfile && unreadChatCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] flex items-center justify-center bg-brand text-white text-[8px] font-bold rounded-full px-0.5">
                    {unreadChatCount > 99 ? "99+" : unreadChatCount}
                  </span>
                )}
              </Link>
            )}

            {/* Notification Bell - Desktop */}
            {isLoggedIn && userId && token && (
              <NotificationBell 
                userId={userId}
                token={token}
                asNavItem={false}
              />
            )}

            {/* Profile Icon */}
            {isLoggedIn && (
              <Link
                href={hasProfile ? "/profile/my" : "/profile/create"}
                title={hasProfile ? "My Profile" : "Create Profile"}
                className="
                  flex items-center justify-center w-9 h-9 rounded-full
                  text-slate-600 hover:text-brand hover:bg-slate-100
                  transition-all duration-200
                "
              >
                <UserCircle size={18} />
              </Link>
            )}

            <Link
              href={isLoggedIn ? "/profiles" : "/login"}
              className="
                hidden md:flex items-center gap-1.5 font-outfit font-semibold text-sm tracking-[0.04em] text-white
                px-5 py-2 rounded-full cursor-pointer shrink-0 no-underline
                bg-linear-to-r from-brand to-accent shadow-md
                hover:scale-[1.05] hover:shadow-lg
                active:scale-[0.97] transition-all duration-200
              "
            >
              {isLoggedIn ? "Browse" : "Login"} <ArrowRight size={14} />
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              className="
                md:hidden flex flex-col justify-center items-center gap-1.5
                w-9 h-9 rounded-[10px] cursor-pointer shrink-0
                bg-slate-100 border border-slate-200
                hover:bg-brand/10 hover:border-brand/30 transition-all duration-200
              "
            >
              <span
                className={`block w-4 h-0.5 rounded-sm bg-slate-700 origin-center transition-transform duration-300 ${menuOpen ? "translate-y-1.75 rotate-45" : ""}`}
              />
              <span
                className={`block w-4 h-0.5 rounded-sm bg-slate-700 origin-center transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`}
              />
              <span
                className={`block w-4 h-0.5 rounded-sm bg-slate-700 origin-center transition-all duration-300 ${menuOpen ? "-translate-y-1.75 -rotate-45" : ""}`}
              />
            </button>
          </div>

          <div className="noise-layer absolute inset-0 rounded-full opacity-[0.025] pointer-events-none" />
        </nav>
      </div>
    </>
  );
}