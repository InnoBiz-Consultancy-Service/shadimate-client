// import { type NextRequest, NextResponse } from "next/server";

// /* ─────────────────────────────────────────────────────────────────
//    Helpers
// ───────────────────────────────────────────────────────────────── */

// /** Decode a JWT payload without verifying the signature. */
// function decodeJwtPayload(token: string): Record<string, unknown> | null {
//   try {
//     const parts = token.split(".");
//     if (parts.length !== 3) return null;

//     // Base64-url → Base64 → decode
//     const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
//     const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
//     const json = atob(padded);
//     return JSON.parse(json) as Record<string, unknown>;
//   } catch {
//     return null;
//   }
// }

// /* ─────────────────────────────────────────────────────────────────
//    Public routes that do NOT require authentication at all
// ───────────────────────────────────────────────────────────────── */
// const PUBLIC_PATHS = ["/login", "/registration", "/verify-otp", "/personality-test"];

// /** Returns true if the pathname starts with one of the public prefixes. */
// function isPublic(pathname: string) {
//   return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
// }

// const PROFILE_SETUP_PATH = "/submit-basic-info";

// /* ─────────────────────────────────────────────────────────────────
//    Proxy (middleware)
// ───────────────────────────────────────────────────────────────── */
// export default function proxy(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   // Always allow Next.js internals and static files
//   if (
//     pathname.startsWith("/_next") ||
//     pathname.startsWith("/api") ||
//     pathname.startsWith("/favicon") ||
//     /\.\w+$/.test(pathname)          // e.g. .png .svg .ico
//   ) {
//     return NextResponse.next();
//   }

//   const token = request.cookies.get("accessToken")?.value;

//   // ── No token at all ──────────────────────────────────────────────
//   if (!token) {
//     // Let public routes through; redirect everything else to login
//     if (isPublic(pathname)) return NextResponse.next();
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   // ── Decode token ─────────────────────────────────────────────────
//   const payload = decodeJwtPayload(token);

//   if (!payload) {
//     // Corrupt token → clear it and send to login
//     const res = NextResponse.redirect(new URL("/login", request.url));
//     res.cookies.delete("accessToken");
//     return res;
//   }

//   const isProfileCompleted = payload["isProfileCompleted"] === true;
//   const isVerified         = payload["isVerified"]         === true;

//   // ── User is on a public/auth page with a valid token ─────────────
//   if (isPublic(pathname)) {
//     // If not verified, stay in the auth flow
//     if (!isVerified) return NextResponse.next();

//     // Verified but profile incomplete → force them to complete profile
//     if (!isProfileCompleted) {
//       return NextResponse.redirect(new URL(PROFILE_SETUP_PATH, request.url));
//     }

//     // Fully onboarded → send away from auth pages
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   // ── Accessing profile-setup page ─────────────────────────────────
//   if (pathname === PROFILE_SETUP_PATH || pathname.startsWith(PROFILE_SETUP_PATH + "/")) {
//     // Profile already done → redirect to dashboard
//     if (isProfileCompleted) {
//       return NextResponse.redirect(new URL("/dashboard", request.url));
//     }
//     // Profile incomplete → allow access
//     return NextResponse.next();
//   }

//   // ── Authenticated, normal protected pages ────────────────────────
//   if (!isVerified) {
//     // Not verified yet → back to OTP verification
//     return NextResponse.redirect(new URL("/verify-otp", request.url));
//   }

//   if (!isProfileCompleted) {
//     // Profile incomplete → lock them to profile-setup
//     return NextResponse.redirect(new URL(PROFILE_SETUP_PATH, request.url));
//   }

//   // All good — let the request through
//   return NextResponse.next();
// }

// /* ─────────────────────────────────────────────────────────────────
//    Matcher — run the proxy on every page route
// ───────────────────────────────────────────────────────────────── */
// export const config = {
//   matcher: [
//     /*
//      * Match all request paths EXCEPT:
//      *  - _next/static  (static files)
//      *  - _next/image   (image optimization)
//      *  - favicon.ico
//      */
//     "/((?!_next/static|_next/image|favicon.ico).*)",
//   ],
// };
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

const ALWAYS_PUBLIC_PATHS = ["/", "/personality-test"];
const AUTH_PATHS = ["/login", "/registration", "/verify-otp"];

function isAlwaysPublic(pathname: string) {
  return ALWAYS_PUBLIC_PATHS.some((p) =>
    p === "/"
      ? pathname === "/"
      : pathname === p || pathname.startsWith(p + "/"),
  );
}

function isAuthPage(pathname: string) {
  return AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip Next.js internals and static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    /\.\w+$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Always-public routes
  if (isAlwaysPublic(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("accessToken")?.value;

  // No token → allow auth pages, redirect others to login
  if (!token) {
    if (isAuthPage(pathname)) return NextResponse.next();
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Decode token
  const payload = decodeJwtPayload(token);

  if (!payload) {
    const res = NextResponse.redirect(new URL("/login", request.url));
    res.cookies.delete("accessToken");
    return res;
  }

  const isVerified = payload["isVerified"] === true;

  // User on auth page with valid token → redirect to dashboard
  if (isAuthPage(pathname)) {
    if (!isVerified) return NextResponse.next();
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Protected pages — must be verified
  if (!isVerified) {
    return NextResponse.redirect(new URL("/verify-otp", request.url));
  }

  // All good
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
