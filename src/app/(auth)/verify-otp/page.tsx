"use client";

import { resendOtpAction, verifyOtpAction, VerifyOtpState } from "@/actions/auth/verify-otp";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  useActionState,
  useCallback,
  Suspense,
} from "react";



/* ══ ICONS ══ */
const ArrowLeft = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
    <path
      d="M13 8H3M3 8L7 4M3 8L7 12"
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

const PhoneIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
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

const OTP_LENGTH = 6;

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "";

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [success, setSuccess] = useState(false);
  const [resendCd, setResendCd] = useState(60);
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  /* ── Server action state ── */
  const initialState: VerifyOtpState = { success: false, message: "" };
  const [state, formAction, isPending] = useActionState(
    verifyOtpAction,
    initialState,
  );

  /* ── Resend countdown ── */
  useEffect(() => {
    if (resendCd <= 0) return;
    const t = setTimeout(() => setResendCd((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCd]);

  /* ── Focus first box on mount ── */
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  /* ── Handle verify success / error ── */
  useEffect(() => {
    if (state.success) {
      setSuccess(true);
      const timer = setTimeout(() => {
        router.push("/dashboard"); // adjust redirect path
        router.refresh();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state, router]);

  /* ── Handle single digit input ── */
  const handleChange = (index: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  /* ── Handle backspace ── */
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  /* ── Handle paste ── */
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((d, i) => {
      next[i] = d;
    });
    setOtp(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  /* ── Resend OTP (direct server action call) ── */
  const handleResend = useCallback(async () => {
    if (resendCd > 0 || resending) return;
    setResending(true);
    setResendMsg("");

    try {
      const result = await resendOtpAction(phone);
      if (result.success) {
        setResendCd(60);
        setOtp(Array(OTP_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
        setResendMsg("OTP sent!");
        setTimeout(() => setResendMsg(""), 3000);
      } else {
        setResendMsg(result.message);
      }
    } catch {
      setResendMsg("Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  }, [phone, resendCd, resending]);

  /* ── Derive error message ── */
  const errorMsg =
    state.errors?.otp || (!state.success && state.message ? state.message : "");

  /* ══ SUCCESS SCREEN ══ */
  if (success)
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-transparent"
      >
        <div className="flex flex-col items-center gap-5 text-center px-6">
          <div className="animate-[pop_0.5s_ease_both] w-20 h-20 rounded-full flex items-center justify-center bg-linear-to-br from-brand to-accent shadow-[var(--shadow-brand-md)]">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path
                d="M8 18L15 25L28 11"
                stroke="var(--on-brand)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2
            className="font-syne animate-[fadeUp_0.5s_ease_0.3s_both] text-white font-extrabold text-3xl tracking-tight"
          >
            Phone Verified!
          </h2>
          <p className="font-outfit animate-[fadeUp_0.5s_ease_0.5s_both] text-slate-400 text-sm">
            Redirecting you to your dashboard...
          </p>
        </div>
      </div>
    );

  /* ══ MAIN OTP SCREEN ══ */
  return (
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
        className="relative z-10 w-full max-w-md rounded-[28px] glass-card px-8 py-10 md:px-10"
      >
        <div className="noise-layer absolute inset-0 opacity-[0.02] pointer-events-none" />
        {/* top glow */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[28px] bg-[linear-gradient(90deg,transparent,rgb(from var(--brand) r g b / 0.4),transparent)]"
        />

        {/* Phone icon badge */}
        <div className="animate-[fadeUp_0.55s_ease_0.15s_both] flex justify-center mb-6">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-brand"
            style={{
              background: "rgb(from var(--brand) r g b / 0.08)",
              border: "1px solid rgb(from var(--brand) r g b / 0.2)",
            }}
          >
            <PhoneIcon />
          </div>
        </div>

        {/* Heading */}
        <div className="animate-[fadeUp_0.55s_ease_0.25s_both] text-center mb-2">
          <h1
            className="font-syne text-white font-extrabold text-[26px] tracking-tight leading-tight mb-2"
          >
            Verify your phone
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            We sent a 6-digit code to{" "}
            <span className="text-slate-300 font-medium">
              {phone || "your phone"}
            </span>
          </p>
        </div>

        {/* ══ FORM (server action) ══ */}
        <form action={formAction}>
          {/* Hidden fields for server action */}
          <input type="hidden" name="phone" value={phone} />
          <input type="hidden" name="otp" value={otp.join("")} />

          {/* OTP boxes */}
          <div
            className={`animate-[fadeUp_0.55s_ease_0.35s_both] flex justify-center gap-2.5 mt-8 mb-2 ${errorMsg ? "animate-[shake_0.4s_ease]" : ""}`}
            onPaste={handlePaste}
          >
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`font-syne font-bold text-[22px] text-center w-[52px] h-[60px] rounded-2xl text-slate-100 outline-none transition-all duration-[180ms] [caret-color:var(--brand)] ${errorMsg ? "border-[1.5px] border-[rgba(248,113,113,0.6)] bg-[rgba(248,113,113,0.05)] shadow-[0_0_0_3px_rgba(248,113,113,0.08)]" : digit ? "border-[1.5px] border-brand/40 bg-brand/5" : "border-[1.5px] border-white/10 bg-white/5 focus:border-brand/60 focus:bg-brand/5 focus:shadow-[0_0_0_3px_rgba(232,84,122,0.1)]"}`}
              />
            ))}
          </div>

          {/* Error */}
          {errorMsg && (
            <p className="text-center text-red-400 text-sm mt-3 animate-[fadeUp_0.2s_ease]">
              {errorMsg}
            </p>
          )}

          {/* Resend success message */}
          {resendMsg && !errorMsg && (
            <p className="text-center text-accent text-sm mt-3 animate-[fadeUp_0.2s_ease]">
              {resendMsg}
            </p>
          )}

          {/* Verify button */}
          <div className="animate-[fadeUp_0.55s_ease_0.45s_both] mt-7">
            <button
              type="submit"
              disabled={isPending}
              className="font-outfit w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl font-bold text-sm tracking-[0.06em] text-on-brand bg-linear-to-r from-brand to-accent shadow-[var(--shadow-brand-md)] hover:scale-[1.02] hover:shadow-[var(--shadow-btn-hover)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 transition-all duration-200 cursor-pointer border-0"
            >
              {isPending ? (
                <>
                  <SpinnerIcon /> Verifying...
                </>
              ) : (
                <>VERIFY PHONE</>
              )}
            </button>
          </div>
        </form>

        {/* Resend */}
        <div className="animate-[fadeUp_0.55s_ease_0.45s_both] text-center mt-6">
          <p className="text-slate-500 text-sm">
            Didn&apos;t receive the code?{" "}
            {resendCd > 0 ? (
              <span className="text-slate-600">
                Resend in{" "}
                <span className="text-slate-400 font-semibold tabular-nums">
                  {resendCd}s
                </span>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="font-outfit text-brand font-semibold hover:text-accent transition-colors duration-150 cursor-pointer bg-transparent border-0 disabled:opacity-50"
              >
                {resending ? "Sending..." : "Resend OTP"}
              </button>
            )}
          </p>
        </div>

        {/* Back link */}
        <div className="animate-[fadeUp_0.55s_ease_0.45s_both] text-center mt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="font-outfit inline-flex items-center gap-1.5 text-slate-600 text-sm hover:text-slate-400 transition-colors duration-150 cursor-pointer bg-transparent border-0"
          >
            <ArrowLeft /> Back to registration
          </button>
        </div>

        {/* bottom glow */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px rounded-b-[28px] bg-[linear-gradient(90deg,transparent,rgb(from var(--accent) r g b / 0.2),transparent)]"
        />
      </div>

      <p className="mt-6 z-10 text-slate-700 text-xs">
        © 2026 ShadiMate · Privacy Policy · Terms
      </p>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense>
      <VerifyOtpContent />
    </Suspense>
  );
}
