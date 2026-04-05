"use client";

import {
  resendOtpAction,
  verifyOtpAction,
  VerifyOtpState,
} from "@/actions/auth/verify-otp";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  useActionState,
  useCallback,
  Suspense,
} from "react";
import { ArrowLeft, Smartphone } from "lucide-react";
import { Logo, GlassCard, GradientButton, PageShell } from "@/components/ui";

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

  const initialState: VerifyOtpState = { success: false, message: "" };
  const [state, formAction, isPending] = useActionState(
    verifyOtpAction,
    initialState,
  );

  useEffect(() => {
    if (resendCd <= 0) return;
    const t = setTimeout(() => setResendCd((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCd]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (state.success) {
      setSuccess(true);
      const timer = setTimeout(() => {
        router.push("/feed");
        router.refresh();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state, router]);

  const handleChange = (index: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

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

  const errorMsg =
    state.errors?.otp || (!state.success && state.message ? state.message : "");

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="flex flex-col items-center gap-5 text-center px-6">
          <div className="animate-[pop_0.5s_ease_both] w-20 h-20 rounded-full flex items-center justify-center bg-linear-to-br from-brand to-accent shadow-(--shadow-brand-md)">
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
          <h2 className="font-syne animate-[fadeUp_0.5s_ease_0.3s_both] text-white font-extrabold text-3xl tracking-tight">
            Phone Verified!
          </h2>
          <p className="font-outfit animate-[fadeUp_0.5s_ease_0.5s_both] text-slate-400 text-sm">
            Redirecting you...
          </p>
        </div>
      </div>
    );
  }

  return (
    <PageShell>
      <div className="animate-[fadeUp_0.55s_ease_0.05s_both] mb-8 z-10">
        <Logo />
      </div>

      <GlassCard className="relative z-10 w-full max-w-md px-8 py-10 md:px-10">
        <div className="animate-[fadeUp_0.55s_ease_0.15s_both] flex justify-center mb-6">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-brand"
            style={{
              background: "rgb(from var(--brand) r g b / 0.08)",
              border: "1px solid rgb(from var(--brand) r g b / 0.2)",
            }}
          >
            <Smartphone size={28} />
          </div>
        </div>

        <div className="animate-[fadeUp_0.55s_ease_0.25s_both] text-center mb-2">
          <h1 className="font-syne text-white font-extrabold text-[26px] tracking-tight leading-tight mb-2">
            Verify your phone
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            We sent a 6-digit code to{" "}
            <span className="text-slate-300 font-medium">
              {phone || "your phone"}
            </span>
          </p>
        </div>

        <form action={formAction}>
          <input type="hidden" name="phone" value={phone} />
          <input type="hidden" name="otp" value={otp.join("")} />

          <div
            className={`animate-[fadeUp_0.55s_ease_0.35s_both] flex justify-center gap-2 sm:gap-2.5 mt-8 mb-2 ${errorMsg ? "animate-[shake_0.4s_ease]" : ""}`}
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
                aria-label={`Digit ${i + 1}`}
                className={`font-syne font-bold text-[22px] text-center w-11 h-13 sm:w-13 sm:h-15 rounded-2xl text-slate-100 outline-none transition-all duration-180 caret-(--brand) ${
                  errorMsg
                    ? "border-[1.5px] border-[rgba(248,113,113,0.6)] bg-[rgba(248,113,113,0.05)]"
                    : digit
                      ? "border-[1.5px] border-brand/40 bg-brand/5"
                      : "border-[1.5px] border-white/10 bg-white/5 focus:border-brand/60 focus:bg-brand/5 focus:shadow-[0_0_0_3px_rgba(232,84,122,0.1)]"
                }`}
              />
            ))}
          </div>

          {errorMsg && (
            <p className="text-center text-red-400 text-sm mt-3 animate-[fadeUp_0.2s_ease]">
              {errorMsg}
            </p>
          )}

          {resendMsg && !errorMsg && (
            <p className="text-center text-accent text-sm mt-3 animate-[fadeUp_0.2s_ease]">
              {resendMsg}
            </p>
          )}

          <div className="animate-[fadeUp_0.55s_ease_0.45s_both] mt-7">
            <GradientButton
              type="submit"
              fullWidth
              loading={isPending}
              loadingText="Verifying..."
            >
              VERIFY PHONE
            </GradientButton>
          </div>
        </form>

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

        <div className="animate-[fadeUp_0.55s_ease_0.45s_both] text-center mt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="font-outfit inline-flex items-center gap-1.5 text-slate-600 text-sm hover:text-slate-400 transition-colors duration-150 cursor-pointer bg-transparent border-0"
          >
            <ArrowLeft size={15} /> Back to registration
          </button>
        </div>
      </GlassCard>
    </PageShell>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense>
      <VerifyOtpContent />
    </Suspense>
  );
}
