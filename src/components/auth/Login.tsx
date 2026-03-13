"use client";

import { loginAction, LoginState } from "@/actions/auth/login";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useActionState, useCallback } from "react";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path
      d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      fill="#4285F4"
    />
    <path
      d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
      fill="#34A853"
    />
    <path
      d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
      fill="#FBBC05"
    />
    <path
      d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"
      fill="#EA4335"
    />
  </svg>
);

const EyeOpen = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const EyeClosed = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const Logo = () => (
  <div className="flex items-center gap-2.5">
    <div className="w-9 h-9 rounded-full flex items-center justify-center bg-linear-to-br from-brand to-accent shadow-[var(--shadow-brand-sm)]">
      <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
        <path
          d="M5 4C5 4 4 8 7 11C10 14 13 13 13 13C13 13 10.5 12.2 9 10C7.5 7.8 8.5 4 5 4Z"
          fill="var(--on-brand)"
        />
        <circle cx="9" cy="9" r="2.2" fill="var(--on-brand)" opacity="0.6" />
      </svg>
    </div>
    <span className="font-syne text-white font-bold text-lg tracking-tight">
      Shadimate
    </span>
  </div>
);

const FieldError = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <p className="text-red-400 text-xs mt-1 ml-1 animate-[fadeIn_0.2s_ease]">
      {message}
    </p>
  );
};

const Toast = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`
        fixed top-6 right-6 z-50 px-5 py-3.5 rounded-2xl
        backdrop-blur-xl border text-sm font-medium
        animate-[fadeUp_0.3s_ease]
        ${
          type === "success"
            ? "bg-brand/10 border-brand/30 text-brand"
            : "bg-red-500/10 border-red-500/30 text-red-400"
        }
      `}
    >
      <div className="flex items-center gap-2.5">
        {type === "success" ? (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        )}
        {message}
      </div>
    </div>
  );
};

export default function LoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [toastDismissedFor, setToastDismissedFor] = useState<object | null>(
    null,
  );
  const initialState: LoginState = { success: false, message: "" };
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );

  const toastData = (() => {
    if (toastDismissedFor === state) return null;
    if (state.success)
      return {
        message: state.message || "Login successful!",
        type: "success" as const,
      };
    if (state.message)
      return { message: state.message, type: "error" as const };
    return null;
  })();

  const handleToastClose = useCallback(() => {
    setToastDismissedFor(state);
  }, [state]);

  useEffect(() => {
    if (!state.success) return;
    const timer = setTimeout(() => {
      router.push("/dashboard");
      router.refresh();
    }, 1000);
    return () => clearTimeout(timer);
  }, [state, router]);

  return (
    <>
      {toastData && (
        <Toast
          message={toastData.message}
          type={toastData.type}
          onClose={handleToastClose}
        />
      )}

      <div className="font-outfit relative min-h-screen w-full flex items-center justify-center px-5 py-12 bg-transparent">
        <div className="noise-layer absolute inset-0 opacity-[0.03] pointer-events-none" />

        {/* ── Card ── */}
        <div className="relative z-10 w-full max-w-md rounded-[28px] glass-card p-8 md:p-10">
          <div className="noise-layer absolute inset-0 opacity-[0.02] pointer-events-none" />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[28px]"
            style={{ background: "linear-gradient(90deg, transparent, rgb(from var(--brand) r g b / 0.5), transparent)" }}
          />

          <div className="animate-[fadeUp_0.6s_ease_0.05s_both] flex justify-center mb-8">
            <Logo />
          </div>

          <div className="animate-[fadeUp_0.6s_ease_0.15s_both] text-center mb-8">
            <h1 className="font-syne text-white text-[32px] font-extrabold tracking-tight leading-tight mb-2">
              Welcome back
            </h1>
            <p className="text-slate-400 text-sm">
              Sign in to find your soul&apos;s connection
            </p>
          </div>

          <div className="animate-[fadeUp_0.6s_ease_0.25s_both] mb-6">
            <button
              type="button"
              className="
                w-full flex items-center justify-center gap-3
                px-5 py-3.5 rounded-2xl
                bg-white/[0.06] border border-white/[0.1]
                text-slate-200 text-sm font-medium
                hover:bg-white/[0.1] hover:border-white/20
                active:scale-[0.98] transition-all duration-200 cursor-pointer
              "
            >
              <GoogleIcon />
              Continue with Google
            </button>
          </div>

          <div className="animate-[fadeUp_0.6s_ease_0.35s_both] flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.1),transparent)]" />
            <span className="text-slate-500 text-xs font-medium tracking-wider">OR</span>
            <div className="flex-1 h-px bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.1),transparent)]" />
          </div>

          <form
            action={formAction}
            className="animate-[fadeUp_0.6s_ease_0.45s_both] flex flex-col gap-4"
          >
            {/* Email / Phone */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="identifier"
                className="text-slate-400 text-xs font-semibold tracking-wider uppercase"
              >
                Email or Phone
              </label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                autoComplete="username"
                placeholder="you@example.com or 01XXXXXXXXX"
                onFocus={() => setFocused("identifier")}
                onBlur={() => setFocused(null)}
                className={`font-outfit w-full px-4 py-3.5 rounded-2xl text-sm text-slate-100 placeholder-slate-400/50 bg-white/5 border border-white/10 transition-[border-color,box-shadow,background] duration-200 outline-none ${state.errors?.identifier ? "animate-[shake_0.4s_ease]" : ""}`}
                style={
                  focused === "identifier"
                    ? {
                        borderColor: "rgb(from var(--brand) r g b / 0.5)",
                        background: "rgb(from var(--brand) r g b / 0.04)",
                        boxShadow: "0 0 0 3px rgb(from var(--brand) r g b / 0.08)",
                      }
                    : state.errors?.identifier
                      ? {
                          borderColor: "rgba(248,113,113,0.5)",
                          boxShadow: "0 0 0 3px rgba(248,113,113,0.08)",
                        }
                      : undefined
                }
              />
              <FieldError message={state.errors?.identifier} />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-slate-400 text-xs font-semibold tracking-wider uppercase"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-brand hover:text-accent transition-colors duration-150 no-underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  className={`font-outfit w-full px-4 py-3.5 pr-12 rounded-2xl text-sm text-slate-100 placeholder-slate-400/50 bg-white/5 border border-white/10 transition-[border-color,box-shadow,background] duration-200 outline-none ${state.errors?.password ? "animate-[shake_0.4s_ease]" : ""}`}
                  style={
                    focused === "password"
                      ? {
                          borderColor: "rgb(from var(--brand) r g b / 0.5)",
                          background: "rgb(from var(--brand) r g b / 0.04)",
                          boxShadow: "0 0 0 3px rgb(from var(--brand) r g b / 0.08)",
                        }
                      : state.errors?.password
                        ? {
                            borderColor: "rgba(248,113,113,0.5)",
                            boxShadow: "0 0 0 3px rgba(248,113,113,0.08)",
                          }
                        : undefined
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors duration-150 cursor-pointer bg-transparent border-0"
                >
                  {showPass ? <EyeClosed /> : <EyeOpen />}
                </button>
              </div>
              <FieldError message={state.errors?.password} />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="
                mt-2 w-full flex items-center justify-center gap-2.5
                px-5 py-4 rounded-2xl
                font-bold text-sm tracking-[0.06em] text-on-brand
                bg-linear-to-r from-brand to-accent
                shadow-[var(--shadow-brand-md)]
                hover:scale-[1.02] hover:shadow-[var(--shadow-btn-hover)]
                active:scale-[0.98]
                disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100
                transition-all duration-200 cursor-pointer border-0
              "
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-on-brand/30 border-t-on-brand animate-[spin_0.7s_linear_infinite]" />
                  Signing in...
                </>
              ) : (
                <>
                  SIGN IN
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 8H13M13 8L9 4M13 8L9 12"
                      stroke="var(--on-brand)"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="animate-[fadeUp_0.6s_ease_0.55s_both] text-center mt-7">
            <p className="text-slate-500 text-sm">
              New to ShadiMate?{" "}
              <Link
                href="/registration"
                className="text-brand font-semibold hover:text-accent transition-colors duration-150 no-underline"
              >
                Create account
              </Link>
            </p>
          </div>

          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px rounded-b-[28px]"
            style={{ background: "linear-gradient(90deg, transparent, rgb(from var(--accent) r g b / 0.2), transparent)" }}
          />
        </div>

        <p className="absolute bottom-5 text-slate-600 text-xs">
          © 2026 Shadimate · Built with behavioral science
        </p>
      </div>
    </>
  );
}
