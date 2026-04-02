"use client";

import Link from "next/link";
import { AlertCircle, ArrowRight } from "lucide-react";
import type { MissingField } from "@/types";

interface Props {
  percentage: number;
  label: string;
  missingFields: MissingField[];
}

function getBarColor(pct: number) {
  if (pct >= 90) return "#22c55e";
  if (pct >= 70) return "#3b82f6";
  if (pct >= 50) return "#f59e0b";
  return "#ef4444";
}

export default function ProfileCompletionCard({
  percentage,
  label,
  missingFields,
}: Props) {
  const color = getBarColor(percentage);

  return (
    <div className="glass-card rounded-2xl p-5 md:p-6">
      <div className="flex items-center justify-between mb-3">
        <span className="font-outfit text-slate-300 text-sm font-medium">
          Profile Completion
        </span>
        <span className="font-outfit text-lg font-bold" style={{ color }}>
          {percentage}%
        </span>
      </div>

      <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden mb-2">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>

      <span
        className="font-outfit text-xs font-semibold tracking-wider uppercase"
        style={{ color }}
      >
        {label}
      </span>

      {missingFields.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <p className="font-outfit text-slate-500 text-xs mb-2.5 flex items-center gap-1.5">
            <AlertCircle size={12} />
            Add these details to improve your profile:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {missingFields.slice(0, 6).map((f) => (
              <span
                key={f.key}
                className="font-outfit text-[11px] text-slate-400 bg-white/5 border border-white/8 rounded-lg px-2.5 py-1"
              >
                {f.label}
              </span>
            ))}
            {missingFields.length > 6 && (
              <span className="font-outfit text-[11px] text-slate-500">
                +{missingFields.length - 6} more
              </span>
            )}
          </div>
        </div>
      )}

      {percentage < 70 && (
        <Link
          href="/profile/edit"
          className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-on-brand bg-linear-to-r from-brand to-accent no-underline hover:scale-[1.01] transition-transform duration-200"
        >
          Complete Your Profile <ArrowRight size={14} />
        </Link>
      )}
    </div>
  );
}
