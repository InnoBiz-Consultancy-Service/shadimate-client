import { type NextRequest, NextResponse } from "next/server";

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );
    const json = atob(padded);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

const GUEST_PUBLIC_PATHS = ["/", "/personality-test"];
const AUTH_PATHS = ["/login", "/registration", "/verify-otp"];

// ── FIX: (user-agreement) routes — public for everyone, no auth needed ──
const USER_AGREEMENT_PATHS = ["/privacy", "/terms", "/trust", "/contact"];

function isGuestPublic(pathname: string) {
  return GUEST_PUBLIC_PATHS.some((p) =>
    p === "/"
      ? pathname === "/"
      : pathname === p || pathname.startsWith(p + "/"),
  );
}

function isAuthPage(pathname: string) {
  return AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

function isUserAgreementPage(pathname: string) {
  return USER_AGREEMENT_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    /\.\w+$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // ── User agreement pages are always public (no token required) ──
  if (isUserAgreementPage(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("accessToken")?.value;

  // ── NO TOKEN (guest) ──
  if (!token) {
    if (isGuestPublic(pathname) || isAuthPage(pathname)) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ── HAS TOKEN ──
  const payload = decodeJwtPayload(token);

  if (!payload) {
    const res = NextResponse.redirect(new URL("/login", request.url));
    res.cookies.delete("accessToken");
    return res;
  }

  const isVerified = payload["isVerified"] === true;

  // Logged-in user on "/" → redirect to /feed
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/feed", request.url));
  }

  // Logged-in user on auth pages → redirect to /feed
  if (isAuthPage(pathname)) {
    if (!isVerified) return NextResponse.next();
    return NextResponse.redirect(new URL("/feed", request.url));
  }

  // /personality-test → allow even when logged in
  if (
    pathname === "/personality-test" ||
    pathname.startsWith("/personality-test/")
  ) {
    return NextResponse.next();
  }

  // Protected pages → must be verified
  if (!isVerified) {
    return NextResponse.redirect(new URL("/verify-otp", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
