"use client";

import { loginAction, LoginState } from "@/actions/auth/login";
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
  PageShell,
  RateLimitBanner,
} from "@/components/ui";
import { useCountdown } from "@/hooks/useCountdown";

export default function LoginPage() {
  const router = useRouter();
  const [toastDismissedFor, setToastDismissedFor] = useState<object | null>(
    null,
  );
  const initialState: LoginState = { success: false, message: "" };
  const [state, formAction, isPending] = useActionState(
    loginAction,
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
    if (state.success)
      return {
        message: state.message || "Login successful!",
        type: "success" as const,
      };
    if (state.message && !state.retryAfter)
      return { message: state.message, type: "error" as const };
    return null;
  })();

  const handleToastClose = useCallback(() => {
    setToastDismissedFor(state);
  }, [state]);

  useEffect(() => {
    if (!state.success) return;
    const timer = setTimeout(() => {
      router.push("/feed");
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

      <PageShell>
        <div className="animate-[fadeUp_0.55s_ease_0.05s_both] mb-8 z-10">
          <Logo />
        </div>

        <GlassCard className="relative z-10 w-full max-w-md p-8 md:p-10">
          <div className="animate-[fadeUp_0.6s_ease_0.15s_both] text-center mb-8">
            <h1 className="font-syne text-white text-[30px] font-extrabold tracking-tight leading-tight mb-2">
              Welcome back
            </h1>
            <p className="text-slate-100 text-sm">
              Sign in to find your soul&apos;s connection
            </p>
          </div>

          {countdown.isActive && (
            <RateLimitBanner
              message="You have tried to login too many times. Please wait before trying again."
              formattedTime={countdown.formatted}
              onDismiss={countdown.reset}
            />
          )}

          <form
            action={formAction}
            className="animate-[fadeUp_0.6s_ease_0.45s_both] flex flex-col gap-4"
          >
            <Input
              label="Email or Phone"
              name="identifier"
              placeholder="you@example.com or 01XXXXXXXXX"
              autoComplete="username"
              error={state.errors?.identifier}
            />

            <div className="flex items-center justify-between">
              <span />
              <Link
                href="/forgot-password"
                className="text-xs text-brand hover:text-brand/80 transition-colors duration-150 no-underline font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <PasswordInput
              error={state.errors?.password}
              autoComplete="current-password"
            />

            <GradientButton
              type="submit"
              fullWidth
              loading={isPending}
              disabled={countdown.isActive}
              loadingText="Signing in..."
              className="mt-2"
            >
              {countdown.isActive ? (
                `Wait ${countdown.formatted}`
              ) : (
                <>
                  SIGN IN <ArrowRight size={15} />
                </>
              )}
            </GradientButton>
          </form>

          <div className="animate-[fadeUp_0.6s_ease_0.55s_both] text-center mt-7">
            <p className="text-slate-500 text-sm">
              New to primehalf?{" "}
              <Link
                href="/registration"
                className="text-brand font-semibold hover:text-brand/80 transition-colors duration-150 no-underline"
              >
                Create account
              </Link>
            </p>
          </div>
        </GlassCard>
      </PageShell>
    </>
  );
}
