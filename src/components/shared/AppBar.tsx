"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  HeartHandshake,
  MessageCircle,
  Bell,
  Crown,
  User,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: boolean;
  mobileHidden?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/feed", label: "Feed", icon: Home },
  { href: "/dream-partner", label: "Dream", icon: HeartHandshake },
  { href: "/chat", label: "Chat", icon: MessageCircle, badge: true },
  { href: "/notifications", label: "Alerts", icon: Bell, badge: true },
  { href: "/subscription", label: "Premium", icon: Crown, mobileHidden: true },
  { href: "/profile/edit", label: "Profile", icon: User },
];

export default function AppBar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/feed") return pathname === "/feed";
    return pathname.startsWith(href);
  };

  const mobileItems = NAV_ITEMS.filter((item) => !item.mobileHidden);

  return (
    <>
      {/* DESKTOP */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 h-16 items-center justify-between px-6 lg:px-10 border-b border-white/5 bg-[rgba(18,8,16,0.85)] backdrop-blur-2xl">
        <Link href="/feed" className="flex items-center gap-2.5 no-underline">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-linear-to-br from-brand to-accent shadow-[var(--shadow-brand-sm)]">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M5 4C5 4 4 8 7 11C10 14 13 13 13 13C13 13 10.5 12.2 9 10C7.5 7.8 8.5 4 5 4Z"
                fill="var(--on-brand)"
              />
              <circle
                cx="9"
                cy="9"
                r="2.2"
                fill="var(--on-brand)"
                opacity="0.6"
              />
            </svg>
          </div>
          <span className="font-syne text-white font-extrabold text-lg tracking-tight">
            ShadiMate
          </span>
        </Link>
        <div className="flex items-center gap-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon, badge }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium no-underline transition-all duration-200 ${active ? "text-brand bg-brand/10" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
              >
                <Icon size={18} className={active ? "text-brand" : ""} />
                <span className="font-outfit">{label}</span>
                {badge && (
                  <span
                    className="absolute top-1.5 right-2.5 w-2 h-2 rounded-full bg-brand shadow-[var(--shadow-brand-dot)] hidden"
                    id={`badge-${href.slice(1)}`}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* MOBILE (5 items, Premium hidden) */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 bg-[rgba(18,8,16,0.92)] backdrop-blur-2xl"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-center justify-around h-16 max-w-md mx-auto">
          {mobileItems.map(({ href, label, icon: Icon, badge }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className="relative flex flex-col items-center justify-center gap-0.5 no-underline w-16 py-1"
              >
                {active && (
                  <span className="absolute -top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-brand shadow-[var(--shadow-brand-sm)]" />
                )}
                <div className="relative">
                  <Icon
                    size={22}
                    className={`transition-colors duration-200 ${active ? "text-brand" : "text-slate-500"}`}
                  />
                  {badge && (
                    <span
                      className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-brand shadow-[var(--shadow-brand-dot)] hidden"
                      id={`badge-mobile-${href.slice(1)}`}
                    />
                  )}
                </div>
                <span
                  className={`font-outfit text-[10px] font-medium transition-colors duration-200 ${active ? "text-brand" : "text-slate-600"}`}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
 