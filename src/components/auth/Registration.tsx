"use client";

import { registerAction, RegisterState } from "@/actions/auth/registration";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useActionState, useCallback } from "react";

/* ══ ICONS ══ */
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

const ArrowRight = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
    <path
      d="M3 8H13M13 8L9 4M13 8L9 12"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SpinnerIcon = () => (
  <svg
    className="animate-spin"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <circle cx="8" cy="8" r="6" stroke="rgb(from var(--on-brand) r g b / 0.3)" strokeWidth="2" />
    <path
      d="M8 2a6 6 0 016 6"
      stroke="var(--on-brand)"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

/* ══ LOGO ══ */
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
    <span className="font-syne text-white font-extrabold text-xl tracking-tight">
      ShadiMate
    </span>
  </div>
);

/* ══ INPUT COMPONENT ══ */
const Input = ({
  label,
  name,
  type = "text",
  placeholder,
  defaultValue,
  hint,
  rightSlot,
  error,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  defaultValue?: string;
  hint?: string;
  rightSlot?: React.ReactNode;
  error?: string;
  autoComplete?: string;
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={name}
        className="font-outfit text-slate-400 text-[11px] font-semibold tracking-[0.12em] uppercase"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          defaultValue={defaultValue}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="font-outfit w-full px-4 py-3.5 pr-12 rounded-2xl text-sm text-slate-100 placeholder-slate-600 border transition-all duration-200 outline-none"
          style={{
            borderColor: error
              ? "rgba(248,113,113,0.6)"
              : focused
                ? "rgb(from var(--brand) r g b / 0.5)"
                : "rgba(255,255,255,0.1)",
            boxShadow: error
              ? "0 0 0 3px rgba(248,113,113,0.08)"
              : focused
                ? "0 0 0 3px rgb(from var(--brand) r g b / 0.08)"
                : "none",
            background: error
              ? "rgba(248,113,113,0.04)"
              : focused
                ? "rgb(from var(--brand) r g b / 0.04)"
                : "rgba(255,255,255,0.05)",
          }}
        />
        {rightSlot && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {rightSlot}
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-400 text-xs mt-0.5 animate-[fadeIn_0.2s_ease]">
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-slate-600 text-xs mt-0.5">{hint}</p>
      )}
    </div>
  );
};

/* ══ GENDER ICONS ══ */
const ManSVG = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
    <circle
      cx="14"
      cy="10"
      r="5"
      stroke={active ? "var(--brand)" : "#94A3B8"}
      strokeWidth="1.8"
    />
    <path
      d="M6 26c0-4.418 3.582-8 8-8s8 3.582 8 8"
      stroke={active ? "var(--brand)" : "#94A3B8"}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const WomanSVG = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
    <circle
      cx="14"
      cy="9"
      r="5"
      stroke={active ? "var(--brand)" : "#94A3B8"}
      strokeWidth="1.8"
    />
    <path
      d="M14 14v8M10 18h8"
      stroke={active ? "var(--brand)" : "#94A3B8"}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M8 26c0-3.314 2.686-6 6-6s6 2.686 6 6"
      stroke={active ? "var(--brand)" : "#94A3B8"}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

/* ══ TOAST ══ */
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
      className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-2xl backdrop-blur-xl border text-sm font-medium animate-[fadeUp_0.3s_ease] ${
        type === "success"
          ? "bg-brand/10 border-brand/30 text-brand"
          : "bg-red-500/10 border-red-500/30 text-red-400"
      }`}
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

/* ══════════════════════════════════════════════════════════ */
/* ══ MAIN PAGE ══ */
/* ══════════════════════════════════════════════════════════ */
export default function RegisterPage() {
  const router = useRouter();
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [showPass, setShowPass] = useState(false);
  const [toastDismissedFor, setToastDismissedFor] = useState<object | null>(null);

  const initialState: RegisterState = { success: false, message: "" };
  const [state, formAction, isPending] = useActionState(
    registerAction,
    initialState,
  );

  const toastData = (() => {
    if (toastDismissedFor === state) return null;
    if (state.success && state.phone) return { message: "Account created! Verifying your phone...", type: "success" as const };
    if (state.message && !state.success) return { message: state.message, type: "error" as const };
    return null;
  })();

  const handleToastClose = useCallback(() => {
    setToastDismissedFor(state);
  }, [state]);

  useEffect(() => {
    if (!state.success || !state.phone) return;
    const timer = setTimeout(() => {
      router.push(`/verify-otp?phone=${encodeURIComponent(state.phone!)}`);
    }, 800);
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

      <div
        className="font-outfit relative min-h-screen w-full flex flex-col items-center justify-center px-5 py-14 bg-transparent"
      >
        <div className="noise-layer absolute inset-0 opacity-[0.03] pointer-events-none" />

        {/* Logo */}
        <div className="animate-[fadeUp_0.55s_ease_0.05s_both] mb-8 z-10">
          <Logo />
        </div>

        {/* Card */}
        <div
          className="relative z-10 w-full max-w-md rounded-[28px] glass-card px-8 py-9 md:px-10"
        >
          <div className="noise-layer absolute inset-0 opacity-[0.02] pointer-events-none" />
          {/* top glow */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[28px]"
            style={{ background: "linear-gradient(90deg, transparent, rgb(from var(--brand) r g b / 0.35), transparent)" }}
          />

          {/* Heading */}
          <div className="animate-[fadeUp_0.55s_ease_0.1s_both] mb-7">
            <h1
              className="font-syne text-white font-extrabold text-[28px] tracking-tight leading-tight mb-1.5"
            >
              Create your account
            </h1>
            <p className="text-slate-500 text-sm">
              Start your journey to real connection
            </p>
          </div>

          {/* ══ FORM (server action) ══ */}
          <form action={formAction} className="flex flex-col gap-4">
            <input type="hidden" name="gender" value={gender} />

            <div className="animate-[fadeUp_0.55s_ease_0.15s_both]">
              <Input
                label="Full Name"
                name="name"
                placeholder="Your full name"
                autoComplete="name"
                error={state.errors?.name}
              />
            </div>

            <div className="animate-[fadeUp_0.55s_ease_0.2s_both]">
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                error={state.errors?.email}
              />
            </div>

            <div className="animate-[fadeUp_0.55s_ease_0.25s_both]">
              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                placeholder="01XXXXXXXXX"
                autoComplete="tel"
                hint="OTP will be sent to this number"
                error={state.errors?.phone}
              />
            </div>

            <div className="animate-[fadeUp_0.55s_ease_0.25s_both]">
              <Input
                label="Password"
                name="password"
                type={showPass ? "text" : "password"}
                placeholder="Min. 6 characters"
                autoComplete="new-password"
                error={state.errors?.password}
                rightSlot={
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer bg-transparent border-0"
                  >
                    {showPass ? <EyeClosed /> : <EyeOpen />}
                  </button>
                }
              />
            </div>

            {/* Gender selector */}
            <div className="animate-[fadeUp_0.55s_ease_0.3s_both]">
              <p
                className={`text-[11px] font-semibold tracking-[0.12em] uppercase mb-2.5 ${
                  state.errors?.gender ? "text-red-400" : "text-slate-400"
                }`}
              >
                Gender
              </p>
              <div className="flex gap-3">
                {(["male", "female"] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className="font-outfit flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-2xl border cursor-pointer transition-all duration-200"
                    style={{
                      background:
                        gender === g
                          ? "rgb(from var(--brand) r g b / 0.08)"
                          : "rgba(255,255,255,0.03)",
                      borderColor: state.errors?.gender
                        ? "rgba(248,113,113,0.5)"
                        : gender === g
                          ? "rgb(from var(--brand) r g b / 0.5)"
                          : "rgba(255,255,255,0.09)",
                      boxShadow:
                        gender === g ? "0 0 14px rgb(from var(--brand) r g b / 0.12)" : "none",
                    }}
                  >
                    {g === "male" ? (
                      <ManSVG active={gender === "male"} />
                    ) : (
                      <WomanSVG active={gender === "female"} />
                    )}
                    <span
                      className={`text-sm font-semibold capitalize ${gender === g ? "text-brand" : "text-slate-400"}`}
                    >
                      {g}
                    </span>
                  </button>
                ))}
              </div>
              {state.errors?.gender && (
                <p className="text-red-400 text-xs mt-1.5 animate-[fadeIn_0.2s_ease]">
                  {state.errors.gender}
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="animate-[fadeUp_0.55s_ease_0.35s_both] mt-2">
              <button
                type="submit"
                disabled={isPending}
                className="font-outfit w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl font-bold text-sm tracking-[0.06em] text-on-brand bg-linear-to-r from-brand to-accent shadow-[var(--shadow-brand-md)] hover:scale-[1.02] hover:shadow-[var(--shadow-btn-hover)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 transition-all duration-200 cursor-pointer border-0"
              >
                {isPending ? (
                  <>
                    <SpinnerIcon /> Creating account...
                  </>
                ) : (
                  <>
                    CREATE ACCOUNT <ArrowRight />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Login link */}
          <p className="animate-[fadeUp_0.55s_ease_0.35s_both] text-center text-slate-500 text-sm mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-brand font-semibold hover:text-accent transition-colors duration-150 no-underline"
            >
              Sign in
            </Link>
          </p>

          {/* bottom glow */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px rounded-b-[28px]"
            style={{ background: "linear-gradient(90deg, transparent, rgb(from var(--accent) r g b / 0.2), transparent)" }}
          />
        </div>

        <p className="mt-6 z-10 text-slate-700 text-xs">
          © 2026 ShadiMate · Privacy Policy · Terms
        </p>
      </div>
    </>
  );
}
