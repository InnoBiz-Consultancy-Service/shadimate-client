import { Crown, Check } from "lucide-react";
import { GlassCard } from "@/components/ui";

export const metadata = { title: "Premium – ShadiMate" };

export default function SubscriptionPage() {
  return (
    <div className="font-outfit min-h-screen px-5 py-8 md:py-12 max-w-3xl mx-auto">
      <h1 className="font-syne text-white text-2xl font-extrabold tracking-tight mb-2">
        Premium Plans
      </h1>
      <p className="text-slate-500 text-sm mb-8">
        Upgrade to unlock premium features
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <GlassCard className="p-6">
          <h3 className="font-syne text-white text-lg font-bold mb-1">Free</h3>
          <p className="text-slate-500 text-xs mb-4">Basic features</p>
          <div className="flex flex-col gap-2.5 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <Check size={14} className="text-green-400" /> Browse profiles
            </span>
            <span className="flex items-center gap-2">
              <Check size={14} className="text-green-400" /> Personality test
            </span>
            <span className="flex items-center gap-2">
              <Check size={14} className="text-green-400" /> Basic filters
            </span>
          </div>
        </GlassCard>

        <GlassCard className="p-6 border-brand/30">
          <div className="flex items-center gap-2 mb-1">
            <Crown size={18} className="text-accent" />
            <h3 className="font-syne text-white text-lg font-bold">Premium</h3>
          </div>
          <p className="text-slate-500 text-xs mb-4">Coming soon</p>
          <div className="flex flex-col gap-2.5 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <Check size={14} className="text-brand" /> Unlimited messaging
            </span>
            <span className="flex items-center gap-2">
              <Check size={14} className="text-brand" /> See who viewed you
            </span>
            <span className="flex items-center gap-2">
              <Check size={14} className="text-brand" /> Advanced filters
            </span>
            <span className="flex items-center gap-2">
              <Check size={14} className="text-brand" /> Priority support
            </span>
          </div>
          <button
            disabled
            className="mt-5 w-full py-3 rounded-xl text-sm font-bold text-on-brand bg-linear-to-r from-brand to-accent opacity-50 cursor-not-allowed border-0"
          >
            Coming Soon
          </button>
        </GlassCard>
      </div>
    </div>
  );
}
