// components/subscription/SubscriptionClient.tsx
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Crown,
  Check,
  Clock,
  ChevronRight,
  AlertCircle,
  Loader2,
  Sparkles,
  ShieldCheck,
  Zap,
  MessageCircle,
  Eye,
  Filter,
  Star,
} from "lucide-react";
import { GlassCard, Toast } from "@/components/ui";
import type { ToastData } from "@/types";
import { initiatePaymentAction } from "@/actions/payment/payment";
import { useSimpleCurrency } from "@/hooks/useCurrency";


// ─── Types ────────────────────────────────────────────────────────────────────

interface Plan {
  plan: string;
  label: string;
  labelEn?: string;
  months: number;
  amount: number;
  amountBDT: number;
  amountGBP?: number;
  amountGBPFormatted?: string;
  amountConverted?: number;
  amountFormatted?: string;
  exchangeRate?: number;
  currency?: { code: string; symbol: string; name: string };
  chargeNote?: string | null;
}

interface Subscription {
  _id: string;
  plan: string;
  amount: number;
  startDate: string;
  endDate: string;
  status: string;
}

interface PaymentRecord {
  _id?: string;
  plan: string;
  amount: number;
  merchantTransactionId?: string;
  paymentStatus: string;
  paidAt?: string;
  createdAt: string;
}

interface Props {
  plans: Plan[];
  subscription: Subscription | null;
  paymentHistory: PaymentRecord[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PREMIUM_FEATURES = [
  { icon: MessageCircle, label: "Unlimited messaging" },
  { icon: Eye,           label: "See who viewed you" },
  { icon: Filter,        label: "Advanced filters" },
  { icon: Zap,           label: "Priority matching" },
  { icon: ShieldCheck,   label: "Verified badge" },
  { icon: Star,          label: "Priority support" },
];

const STATUS_STYLES: Record<string, string> = {
  success:   "text-emerald-600 bg-emerald-50 border-emerald-200",
  pending:   "text-amber-600 bg-amber-50 border-amber-200",
  failed:    "text-red-600 bg-red-50 border-red-200",
  cancelled: "text-slate-500 bg-slate-100 border-slate-200",
};

const PLAN_THEMES: Record<string, { bg: string, text: string, border: string, btn: string }> = {
  "1month": {
    bg: "bg-blue-50/50",
    text: "text-blue-600",
    border: "border-blue-200",
    btn: "bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/20",
  },
  "3month": {
    bg: "bg-brand/5",
    text: "text-brand",
    border: "border-brand/40 shadow-[0_0_30px_rgba(var(--color-brand),0.12)]",
    btn: "bg-linear-to-r from-brand to-accent hover:scale-[1.02] text-on-brand shadow-(--shadow-brand-md)",
  },
  "6month": {
    bg: "bg-amber-50/50",
    text: "text-amber-600",
    border: "border-amber-200",
    btn: "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-BD", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function getDaysLeft(endDate: string) {
  return Math.max(
    0,
    Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );
}

function getPlanLabel(plan: string) {
  const map: Record<string, string> = {
    "1month": "1 month",
    "3month": "3 months",
    "6month": "6 months",
  };
  return map[plan] || plan;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SubscriptionClient({ plans, subscription, paymentHistory }: Props) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastData | null>(null);
  const hideToast = useCallback(() => setToast(null), []);
  
  const { currency, loading: currencyLoading, symbol } = useSimpleCurrency();

  // ── Display amount helper ──────────────────────────────────────────────────
  const getDisplayAmount = (plan: Plan): string => {
    if (currencyLoading) return "...";
    
    if (currency === "GBP") {
      const amountBDT = plan.amountBDT || plan.amount;
      const gbpAmount = (amountBDT * 0.0072).toFixed(2);
      return `£${gbpAmount}`;
    }
    
    // BDT
    const amountBDT = plan.amountBDT || plan.amount;
    return `৳${amountBDT.toLocaleString()}`;
  };

  const getPerMonthAmount = (plan: Plan): string => {
    if (currencyLoading) return "...";
    
    if (currency === "GBP") {
      const amountBDT = plan.amountBDT || plan.amount;
      const totalGbp = amountBDT * 0.0072;
      const perMonth = (totalGbp / plan.months).toFixed(2);
      return `£${perMonth} / month`;
    }
    
    const amountBDT = plan.amountBDT || plan.amount;
    return `৳${Math.round(amountBDT / plan.months).toLocaleString()} / month`;
  };

  const getChargeNote = (plan: Plan): string | null => {
    if (currency === "GBP") {
      const amountBDT = plan.amountBDT || plan.amount;
      return `Charged as ৳${amountBDT} BDT via payment gateway`;
    }
    return null;
  };

  // ── Subscription state ─────────────────────────────────────────────────────
  const isActive      = subscription?.status === "active";
  const daysLeft      = subscription?.endDate ? getDaysLeft(subscription.endDate) : 0;
  const isExpiringSoon = isActive && daysLeft <= 7;

  // ── Savings calculation (BDT base) ────────────────────────────────────────
  const baseMonthly = plans.find((p) => p.plan === "1month")?.amountBDT || 299;
  function getSaving(plan: Plan) {
    const amountBDT = plan.amountBDT || plan.amount;
    return baseMonthly * plan.months - amountBDT;
  }

  // ── Payment initiate ───────────────────────────────────────────────────────
  const handleSelectPlan = async (plan: string) => {
    setLoadingPlan(plan);
    try {
      const result = await initiatePaymentAction(plan);
      if (!result.success || !result.data?.paymentUrl) {
        setToast({
          message: result.message || "Payment initiation failed.",
          type: "error",
        });
        return;
      }
      window.location.href = result.data.paymentUrl;
    } catch {
      setToast({ message: "Network error. Please try again.", type: "error" });
    } finally {
      setLoadingPlan(null);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      <div className="font-outfit min-h-screen px-5 py-8 md:py-12 max-w-3xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/8 border border-brand/20 mb-4">
            <Crown size={14} className="text-brand" />
            <span className="font-outfit text-brand text-xs font-bold uppercase tracking-wider">
              Premium Plans
            </span>
          </div>
          <h1 className="font-syne text-slate-900 text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Unlock Your True Connection
          </h1>
          <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
            Upgrade to Premium and complete your journey to find your soulmate.
          </p>

       
        </div>

        {/* ── Active Subscription Banner ── */}
        {isActive && subscription && (
          <div
            className={`mb-6 rounded-2xl border p-5 ${
              isExpiringSoon
                ? "border-amber-500/30 bg-amber-500/5"
                : "border-brand/30 bg-brand/5"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  isExpiringSoon ? "bg-amber-500/10" : "bg-brand/10"
                }`}
              >
                <Crown
                  size={20}
                  className={isExpiringSoon ? "text-amber-400" : "text-accent"}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-syne text-black font-bold text-base">
                    ⭐ Premium Active
                  </p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400/15 text-emerald-400 border border-emerald-400/25">
                    ACTIVE
                  </span>
                </div>
                <p className="text-gray-700 text-sm">
                  Plan:{" "}
                  <span className="text-gray-600 font-medium">
                    {getPlanLabel(subscription.plan)}
                  </span>{" "}
                  · Expire:{" "}
                  <span className="text-gray-600 font-medium">
                    {formatDate(subscription.endDate)}
                  </span>
                </p>
                <p
                  className={`text-sm font-semibold mt-1 ${
                    isExpiringSoon ? "text-amber-400" : "text-brand"
                  }`}
                >
                  {daysLeft} day{daysLeft !== 1 && "s"} left
                  {isExpiringSoon && " — Expiring soon!"}
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-brand/10">
              <div className="flex items-center gap-2 text-slate-500 text-xs">
                <AlertCircle size={13} />
                <span>
                  {isExpiringSoon
                    ? "Renew now to keep your premium access without interruption."
                    : "You can extend your subscription anytime — remaining days will be added on top."}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── Plans Grid ── */}
        {plans.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {plans.map((plan) => {
              const saving    = getSaving(plan);
              const isPopular = plan.plan === "3month";
              const isLoading = loadingPlan === plan.plan;
              const chargeNote = getChargeNote(plan);
              const displayAmount = getDisplayAmount(plan);
              const perMonthAmount = getPerMonthAmount(plan);

              const theme = PLAN_THEMES[plan.plan] || PLAN_THEMES["1month"];

              return (
                <div key={plan.plan} className="relative">
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-on-brand bg-linear-to-r from-brand to-accent shadow-(--shadow-brand-sm)">
                        <Sparkles size={10} /> Most Popular
                      </span>
                    </div>
                  )}

                  <GlassCard
                    className={`p-5 h-full flex flex-col ${theme.bg} ${theme.border}`}
                  >
                    {/* Plan header */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-syne text-slate-900 text-lg font-extrabold">
                          {plan.label}
                        </h3>
                        {saving > 0 && currency === "BDT" && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                            ৳{saving} off
                          </span>
                        )}
                      </div>

                      {/* Main price */}
                      <div className="flex items-baseline gap-1">
                        {currencyLoading ? (
                          <span className="font-syne text-3xl font-extrabold text-slate-300 animate-pulse">
                            ···
                          </span>
                        ) : (
                          <span className="font-syne text-3xl font-extrabold text-slate-900">
                            {displayAmount}
                          </span>
                        )}
                        <span className="text-slate-400 text-sm">
                          / {plan.months} mo
                        </span>
                      </div>

                      {/* Per month */}
                      <p className="text-slate-400 text-xs mt-1">
                        {perMonthAmount}
                      </p>

                      {/* Charge note for GBP users */}
                      {chargeNote && (
                        <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
                          ℹ️ {chargeNote}
                        </p>
                      )}
                    </div>

                    {/* Features */}
                    <div className="flex-1 space-y-2 mb-5">
                      {PREMIUM_FEATURES.slice(0, 3).map((feat) => (
                        <div key={feat.label} className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 bg-white shadow-sm`}>
                            <Check size={9} className={theme.text} />
                          </div>
                          <span className="text-gray-900 text-xs">{feat.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <button
                      onClick={() => handleSelectPlan(plan.plan)}
                      disabled={!!loadingPlan}
                      className={`
                        w-full py-3 rounded-2xl text-sm font-bold tracking-wide border-0 cursor-pointer
                        transition-all duration-200 flex items-center justify-center gap-2
                        disabled:opacity-50 disabled:cursor-not-allowed shadow-md outline-none
                        ${theme.btn}
                      `}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Processing...
                        </>
                      ) : isActive ? (
                        <>
                          Extend Plan <ChevronRight size={14} />
                        </>
                      ) : (
                        <>
                          Select Plan <ChevronRight size={14} />
                        </>
                      )}
                    </button>
                  </GlassCard>
                </div>
              );
            })}
          </div>
        ) : (
          /* ── Fallback static plans ── */
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { plan: "1month", label: "1 month", amountBDT: 299, months: 1 },
              { plan: "3month", label: "3 months", amountBDT: 799, months: 3 },
              { plan: "6month", label: "6 months", amountBDT: 1499, months: 6 },
            ].map((plan) => {
              const isPopular = plan.plan === "3month";
              const isLoading = loadingPlan === plan.plan;
              const theme = PLAN_THEMES[plan.plan] || PLAN_THEMES["1month"];
              
              const displayAmount = currency === 'GBP' 
                ? `£${(plan.amountBDT * 0.0072).toFixed(2)}`
                : `৳${plan.amountBDT}`;
              
              return (
                <div key={plan.plan} className="relative">
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-on-brand bg-linear-to-r from-brand to-accent shadow-(--shadow-brand-sm)">
                        <Sparkles size={10} /> Most Popular
                      </span>
                    </div>
                  )}
                  <GlassCard
                    className={`p-5 flex flex-col ${theme.bg} ${theme.border}`}
                  >
                    <div className="mb-4">
                      <h3 className="font-syne text-black text-lg font-extrabold mb-1">
                        {plan.label}
                      </h3>
                      <div className="flex items-baseline gap-1">
                        <span className="font-syne text-3xl font-extrabold text-black">
                          {displayAmount}
                        </span>
                        <span className="text-slate-400 text-sm">/ {plan.months} mo</span>
                      </div>
                      {currency === 'GBP' && (
                        <p className="text-xs text-gray-400 mt-1">
                          ≈ ৳{plan.amountBDT} BDT
                        </p>
                      )}
                    </div>
                    <div className="flex-1 space-y-2 mb-5">
                      {PREMIUM_FEATURES.slice(0, 3).map((feat) => (
                        <div key={feat.label} className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 bg-white shadow-sm`}>
                            <Check size={9} className={theme.text} />
                          </div>
                          <span className="text-gray-700 text-xs">{feat.label}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => handleSelectPlan(plan.plan)}
                      disabled={!!loadingPlan}
                      className={`w-full py-3 rounded-2xl text-sm font-bold border-0 cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md outline-none ${theme.btn}`}
                    >
                      {isLoading ? (
                        <><Loader2 size={14} className="animate-spin" /> Processing...</>
                      ) : isActive ? (
                        <>Extend Plan <ChevronRight size={14} /></>
                      ) : (
                        <>Select Plan <ChevronRight size={14} /></>
                      )}
                    </button>
                  </GlassCard>
                </div>
              );
            })}
          </div>
        )}

        {/* ── All Features ── */}
        <GlassCard className="p-6 mb-6">
          <h2 className="font-syne text-slate-900 text-base font-bold mb-4 flex items-center gap-2">
            <Crown size={16} className="text-brand" />
            What You&apos;ll Get with Premium
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PREMIUM_FEATURES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-brand/8 border border-brand/15 flex items-center justify-center shrink-0">
                  <Icon size={14} className="text-brand" />
                </div>
                <span className="text-slate-700 text-sm">{label}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* ── Payment History ── */}
        {paymentHistory.length > 0 && (
          <GlassCard className="p-5">
            <h2 className="font-syne text-slate-900 text-base font-bold mb-4 flex items-center gap-2">
              <Clock size={15} className="text-slate-400" />
              Payment History
            </h2>
            <div className="space-y-3">
              {paymentHistory.map((record, idx) => (
                <div
                  key={record._id || idx}
                  className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0"
                >
                  <div className="w-9 h-9 rounded-xl bg-brand/8 border border-brand/15 flex items-center justify-center shrink-0">
                    <Crown size={13} className="text-brand" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-800 text-sm font-medium">
                      {getPlanLabel(record.plan)} Plan
                    </p>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      {formatDate(record.paidAt || record.createdAt)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-slate-900 text-sm font-bold">
                      ৳{record.amount}
                    </p>
                    <span
                      className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border mt-0.5 ${
                        STATUS_STYLES[record.paymentStatus] || STATUS_STYLES["pending"]
                      }`}
                    >
                      {record.paymentStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* ── Security note ── */}
        <div className="mt-5 flex items-center justify-center gap-2 text-slate-400 text-xs">
          <ShieldCheck size={13} />
          <span>EPS Secured Payment · SSL Encrypted · 100% Safe</span>
        </div>
      </div>
    </>
  );
}