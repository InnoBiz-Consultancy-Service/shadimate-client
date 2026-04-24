"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, XOctagon, Crown, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/ui";

// ── SUCCESS PAGE ──
export function PaymentSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.push("/feed"), 5000);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="font-outfit min-h-screen flex items-center justify-center px-5 bg-[#f8f8fb]">
      <GlassCard className="p-8 max-w-sm w-full text-center">
        <div className="animate-[pop_0.5s_ease_both] w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center bg-emerald-50 border border-emerald-200">
          <CheckCircle size={32} className="text-emerald-500" />
        </div>
        <h1 className="font-syne text-slate-900 text-2xl font-extrabold mb-2">
          Payment Successful!
        </h1>
        <p className="text-slate-500 text-sm mb-5 leading-relaxed">
          Your Premium subscription is now activated. You can now access all premium features.
        </p>
        <div className="flex items-center justify-center gap-2 mb-6 px-3 py-2.5 rounded-xl bg-brand/8 border border-brand/15">
          <Crown size={14} className="text-brand" />
          <span className="text-brand text-sm font-semibold">Premium Activated ✓</span>
        </div>
        <div className="flex flex-col gap-3">
          <Link
            href="/feed"
            className="w-full py-3 rounded-2xl text-sm font-bold text-white bg-linear-to-r from-brand to-accent shadow-sm hover:scale-[1.02] transition-all duration-200 no-underline flex items-center justify-center gap-2"
          >
            Explore Premium <ArrowRight size={14} />
          </Link>
          <p className="text-slate-400 text-xs">5 seconds to auto-redirect...</p>
        </div>
      </GlassCard>
    </div>
  );
}

// ── FAIL PAGE ──
export function PaymentFailPage() {
  return (
    <div className="font-outfit min-h-screen flex items-center justify-center px-5 bg-[#f8f8fb]">
      <GlassCard className="p-8 max-w-sm w-full text-center">
        <div className="animate-[pop_0.5s_ease_both] w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center bg-red-50 border border-red-200">
          <XCircle size={32} className="text-red-500" />
        </div>
        <h1 className="font-syne text-slate-900 text-2xl font-extrabold mb-2">
          Payment Failed
        </h1>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          Your payment could not be processed. Please check your details and try again. If the problem persists, contact support.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/subscription"
            className="w-full py-3 rounded-2xl text-sm font-bold text-white bg-linear-to-r from-brand to-accent shadow-sm hover:scale-[1.02] transition-all duration-200 no-underline flex items-center justify-center gap-2"
          >
            Try Again <ArrowRight size={14} />
          </Link>
          <Link
            href="/feed"
            className="w-full py-3 rounded-2xl text-sm font-medium text-slate-500 border border-slate-200 bg-white hover:bg-slate-50 transition-all duration-200 no-underline flex items-center justify-center gap-2"
          >
            Back to Home
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}

// ── CANCEL PAGE ──
export function PaymentCancelPage() {
  return (
    <div className="font-outfit min-h-screen flex items-center justify-center px-5 bg-[#f8f8fb]">
      <GlassCard className="p-8 max-w-sm w-full text-center">
        <div className="animate-[pop_0.5s_ease_both] w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center bg-slate-100 border border-slate-200">
          <XOctagon size={32} className="text-slate-400" />
        </div>
        <h1 className="font-syne text-slate-900 text-2xl font-extrabold mb-2">
          Payment Cancelled
        </h1>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          You have cancelled your payment. You can purchase a premium plan at any time.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/subscription"
            className="w-full py-3 rounded-2xl text-sm font-bold text-brand border border-brand/30 bg-brand/8 hover:bg-brand/15 transition-all duration-200 no-underline flex items-center justify-center gap-2"
          >
            View Plans
          </Link>
          <Link
            href="/feed"
            className="w-full py-3 rounded-2xl text-sm font-medium text-slate-500 border border-slate-200 bg-white hover:bg-slate-50 transition-all duration-200 no-underline flex items-center justify-center gap-2"
          >
            Back to Home
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
