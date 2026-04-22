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

interface Plan {
  plan: string;
  label: string;
  labelEn?: string;
  amount: number;
  months: number;
  currency?: string;
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

const PREMIUM_FEATURES = [
  { icon: MessageCircle, label: "Unlimited messaging" },
  { icon: Eye, label: "See who viewed you" },
  { icon: Filter, label: "Advanced filters" },
  { icon: Zap, label: "Priority matching" },
  { icon: ShieldCheck, label: "Verified badge" },
  { icon: Star, label: "Priority support" },
];

const STATUS_STYLES: Record<string, string> = {
  success: "text-emerald-600 bg-emerald-50 border-emerald-200",
  pending: "text-amber-600 bg-amber-50 border-amber-200",
  failed: "text-red-600 bg-red-50 border-red-200",
  cancelled: "text-slate-500 bg-slate-100 border-slate-200",
};

const STATUS_LABELS: Record<string, string> = {
  success: "success",
  pending: "pending",
  failed: "failed",
  cancelled: "cancelled",
};

function formatDate(dateStr: string, locale = "en-BD") {
  return new Date(dateStr).toLocaleDateString(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function getDaysLeft(endDate: string) {
  return Math.max(
    0,
    Math.ceil(
      (new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    ),
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

export default function SubscriptionClient({
  plans,
  subscription,
  paymentHistory,
}: Props) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastData | null>(null);
  const hideToast = useCallback(() => setToast(null), []);

  const isActive = subscription?.status === "active";
  const daysLeft = subscription?.endDate
    ? getDaysLeft(subscription.endDate)
    : 0;
  const isExpiringSoon = isActive && daysLeft <= 7;

  const handleSelectPlan = async (plan: string) => {
    if (isActive) {
      setToast({
        message: `Your active subscription expires on ${formatDate(subscription!.endDate)}.`,
        type: "error",
      });
      return;
    }

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

  // Savings calculation
  const baseMonthly = plans.find((p) => p.plan === "1month")?.amount || 299;
  function getSaving(plan: Plan) {
    const full = baseMonthly * plan.months;
    return full - plan.amount;
  }

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
                  {isExpiringSoon && " — Subscription is expiring soon!"}
                </p>
              </div>
            </div>

            {isExpiringSoon && (
              <div className="mt-3 pt-3 border-t border-amber-500/15">
                <div className="flex items-center gap-2 text-amber-400/80 text-xs">
                  <AlertCircle size={13} />
                  <span>Subscription renew to keep your premium access.</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Plans Grid ── */}
        {plans.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {plans.map((plan) => {
              const saving = getSaving(plan);
              const isPopular = plan.plan === "3month";
              const isLoading = loadingPlan === plan.plan;

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
                    className={`p-5 h-full flex flex-col ${
                      isPopular
                        ? "border-brand/40 shadow-[0_0_30px_rgba(232,84,122,0.12)]"
                        : ""
                    }`}
                  >
                    {/* Plan header */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-syne text-slate-900 text-lg font-extrabold">
                          {plan.label}
                        </h3>
                        {saving > 0 && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                            ৳{saving} discount
                          </span>
                        )}
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="font-syne text-3xl font-extrabold text-slate-900">
                          ৳{plan.amount}
                        </span>
                        <span className="text-slate-400 text-sm">
                          / {plan.months} months
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs mt-1">
                        ৳{Math.round(plan.amount / plan.months)} / month
                      </p>
                    </div>

                    {/* Features */}
                    <div className="flex-1 space-y-2 mb-5">
                      {PREMIUM_FEATURES.slice(0, 3).map((feat) => (
                        <div
                          key={feat.label}
                          className="flex items-center gap-2"
                        >
                          <div className="w-4 h-4 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0">
                            <Check size={9} className="text-brand" />
                          </div>
                          <span className="text-gray-900 text-xs">
                            {feat.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => handleSelectPlan(plan.plan)}
                      disabled={!!loadingPlan || (isActive && !isExpiringSoon)}
                      className={`
                        w-full py-3 rounded-2xl text-sm font-bold tracking-wide border-0 cursor-pointer
                        transition-all duration-200 flex items-center justify-center gap-2
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${
                          isPopular
                            ? "text-on-brand bg-linear-to-r from-brand to-accent shadow-(--shadow-brand-md) hover:scale-[1.02] hover:shadow-(--shadow-btn-hover)"
                            : "text-brand border border-brand/30 bg-brand/8 hover:bg-brand/15"
                        }
                      `}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Processing...
                        </>
                      ) : isActive && !isExpiringSoon ? (
                        "Subscribed"
                      ) : (
                        <>
                          Select Plan
                          <ChevronRight size={14} />
                        </>
                      )}
                    </button>
                  </GlassCard>
                </div>
              );
            })}
          </div>
        ) : (
          /* Fallback static plans */
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { plan: "1month", label: "1 month", amount: 299, months: 1 },
              { plan: "3month", label: "3 months", amount: 799, months: 3 },
              { plan: "6month", label: "6 months", amount: 1499, months: 6 },
            ].map((plan) => {
              const isPopular = plan.plan === "3month";
              const isLoading = loadingPlan === plan.plan;
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
                    className={`p-5 flex flex-col ${isPopular ? "border-brand/40" : ""}`}
                  >
                    <div className="mb-4">
                      <h3 className="font-syne text-black text-lg font-extrabold mb-1">
                        {plan.label}
                      </h3>
                      <div className="flex items-baseline gap-1">
                        <span className="font-syne text-3xl font-extrabold text-black">
                          ৳{plan.amount}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-2 mb-5">
                      {PREMIUM_FEATURES.slice(0, 3).map((feat) => (
                        <div
                          key={feat.label}
                          className="flex items-center gap-2"
                        >
                          <div className="w-4 h-4 rounded-full bg-brand/15 border border-brand/20 flex items-center justify-center shrink-0">
                            <Check size={9} className="text-brand" />
                          </div>
                          <span className="text-gray-700 text-xs">
                            {feat.label}
                          </span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => handleSelectPlan(plan.plan)}
                      disabled={!!loadingPlan || (isActive && !isExpiringSoon)}
                      className={`w-full py-3 rounded-2xl text-sm font-bold border-0 cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                        isPopular
                          ? "text-on-brand bg-linear-to-r from-brand to-accent shadow-(--shadow-brand-md) hover:scale-[1.02]"
                          : "text-brand border border-brand/30 bg-brand/8 hover:bg-brand/15"
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />{" "}
                          Processing...
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
                        STATUS_STYLES[record.paymentStatus] ||
                        STATUS_STYLES["pending"]
                      }`}
                    >
                      {STATUS_LABELS[record.paymentStatus] ||
                        record.paymentStatus}
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
