"use client";

import { dt } from "@/lib/design-tokens";

interface GenderSelectorProps {
  value: "male" | "female" | "";
  onChange: (g: "male" | "female") => void;
  error?: string;
}

const ManSVG = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="10" r="5" stroke={active ? "var(--color-brand)" : "var(--color-text-muted)"} strokeWidth="1.8" />
    <path d="M6 26c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke={active ? "var(--color-brand)" : "var(--color-text-muted)"} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const WomanSVG = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="9" r="5" stroke={active ? "var(--color-brand)" : "var(--color-text-muted)"} strokeWidth="1.8" />
    <path d="M14 14v8M10 18h8" stroke={active ? "var(--color-brand)" : "var(--color-text-muted)"} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M8 26c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke={active ? "var(--color-brand)" : "var(--color-text-muted)"} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export default function GenderSelector({ value, onChange, error }: GenderSelectorProps) {
  return (
    <div>
      <p className={`font-outfit ${dt.inputLabel} mb-2.5 ${error ? "text-red-500" : ""}`}>
        Gender
      </p>
      <div className="flex gap-3">
        {(["male", "female"] as const).map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => onChange(g)}
            className={`font-outfit flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-2xl border cursor-pointer transition-all duration-200 bg-surface-card`}
            style={{
              borderColor: error
                ? "rgba(239,68,68,0.4)"
                : value === g
                  ? "rgb(from var(--color-brand) r g b / 0.5)"
                  : "var(--color-border)",
              boxShadow: value === g ? "0 0 0 3px rgb(from var(--color-brand) r g b / 0.06)" : "none",
              background: value === g ? "rgb(from var(--color-brand) r g b / 0.04)" : "var(--color-surface-card)",
            }}
          >
            {g === "male" ? <ManSVG active={value === "male"} /> : <WomanSVG active={value === "female"} />}
            <span className={`text-sm font-semibold capitalize ${value === g ? "text-brand" : dt.textSecondary}`}>
              {g}
            </span>
          </button>
        ))}
      </div>
      {error && (
        <p className={`${dt.inputError} text-xs mt-1.5 animate-[fadeIn_0.2s_ease]`}>{error}</p>
      )}
    </div>
  );
}
