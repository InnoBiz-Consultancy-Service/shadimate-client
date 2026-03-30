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
} from "@/components/ui";

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

      <PageShell>
        <GlassCard className="relative z-10 w-full max-w-md p-8 md:p-10">
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
              className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl bg-white/6 border border-white/10 text-slate-200 text-sm font-medium hover:bg-white/10 hover:border-white/20 active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              <GoogleIcon />
              Continue with Google
            </button>
          </div>

          <div className="animate-[fadeUp_0.6s_ease_0.35s_both] flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.1),transparent)]" />
            <span className="text-slate-500 text-xs font-medium tracking-wider">
              OR
            </span>
            <div className="flex-1 h-px bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.1),transparent)]" />
          </div>

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
                className="text-xs text-brand hover:text-accent transition-colors duration-150 no-underline"
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
              loadingText="Signing in..."
              className="mt-2"
            >
              SIGN IN <ArrowRight size={15} />
            </GradientButton>
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
        </GlassCard>
      </PageShell>
    </>
  );
}
