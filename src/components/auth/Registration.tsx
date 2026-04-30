"use client";

import { registerAction, RegisterState } from "@/actions/auth/registration";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useActionState, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import {
  Logo,
  Toast,
  GlassCard,
  Input,
  PasswordInput,
  GradientButton,
  GenderSelector,
  PageShell,
  RateLimitBanner,
} from "@/components/ui";
import { useCountdown } from "@/hooks/useCountdown";

export default function RegisterPage() {
  const router = useRouter();
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [toastDismissedFor, setToastDismissedFor] = useState<object | null>(
    null,
  );

  const initialState: RegisterState = { success: false, message: "" };
  const [state, formAction, isPending] = useActionState(
    registerAction,
    initialState,
  );

  const countdown = useCountdown(0);
  
  useEffect(() => {
    if (state.retryAfter && state.retryAfter > 0) {
      countdown.start(state.retryAfter);
    }
  }, [state.retryAfter, countdown]);

  const toastData = (() => {
    if (toastDismissedFor === state) return null;
    if (state.success && state.phone)
      return {
        message: "Account created! Verifying your phone...",
        type: "success" as const,
      };
    if (state.message && !state.success && !state.retryAfter)
      return { message: state.message, type: "error" as const };
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

      <PageShell>
        <div className="animate-[fadeUp_0.55s_ease_0.05s_both] mb-8 z-10">
          <Logo />
        </div>

        <GlassCard className="relative z-10 w-full max-w-md px-8 py-9 md:px-10">
          <div className="animate-[fadeUp_0.55s_ease_0.1s_both] mb-7">
            <h1 className="font-syne text-slate-900 font-extrabold text-[26px] tracking-tight leading-tight mb-1.5">
              Create your account
            </h1>
            <p className="text-slate-500 text-sm">
              Start your journey to real connection
            </p>
          </div>

          {countdown.isActive && (
            <RateLimitBanner
              message="You can register a limited number of times. Please wait before trying again."
              formattedTime={countdown.formatted}
              onDismiss={countdown.reset}
            />
          )}

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
              <PasswordInput
                autoComplete="new-password"
                placeholder="Min. 6 characters"
                error={state.errors?.password}
              />
            </div>
            <div className="animate-[fadeUp_0.55s_ease_0.3s_both]">
              <GenderSelector
                value={gender}
                onChange={setGender}
                error={state.errors?.gender}
              />
            </div>

            <div className="animate-[fadeUp_0.55s_ease_0.35s_both] mt-2">
              <GradientButton
                type="submit"
                fullWidth
                loading={isPending}
                disabled={countdown.isActive}
                loadingText="Creating account..."
              >
                {countdown.isActive ? `Wait ${countdown.formatted}` : (
                  <>CREATE ACCOUNT <ArrowRight size={15} /></>
                )}
              </GradientButton>
            </div>
          </form>

          <p className="animate-[fadeUp_0.55s_ease_0.35s_both] text-center text-slate-500 text-sm mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-brand font-semibold hover:text-brand/80 transition-colors duration-150 no-underline"
            >
              Sign in
            </Link>
          </p>
        </GlassCard>
      </PageShell>
    </>
  );
}
