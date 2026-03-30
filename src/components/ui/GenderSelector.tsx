"use client";

interface GenderSelectorProps {
  value: "male" | "female" | "";
  onChange: (g: "male" | "female") => void;
  error?: string;
}

const ManSVG = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
    <circle
      cx="14"
      cy="10"
      r="5"
      stroke={active ? "var(--brand)" : "#94A3B8"}
      strokeWidth="1.8"
    />
    <path
      d="M6 26c0-4.418 3.582-8 8-8s8 3.582 8 8"
      stroke={active ? "var(--brand)" : "#94A3B8"}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const WomanSVG = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
    <circle
      cx="14"
      cy="9"
      r="5"
      stroke={active ? "var(--brand)" : "#94A3B8"}
      strokeWidth="1.8"
    />
    <path
      d="M14 14v8M10 18h8"
      stroke={active ? "var(--brand)" : "#94A3B8"}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M8 26c0-3.314 2.686-6 6-6s6 2.686 6 6"
      stroke={active ? "var(--brand)" : "#94A3B8"}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

export default function GenderSelector({
  value,
  onChange,
  error,
}: GenderSelectorProps) {
  return (
    <div>
      <p
        className={`font-outfit text-[11px] font-semibold tracking-[0.12em] uppercase mb-2.5 ${
          error ? "text-red-400" : "text-slate-400"
        }`}
      >
        Gender
      </p>
      <div className="flex gap-3">
        {(["male", "female"] as const).map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => onChange(g)}
            className="font-outfit flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-2xl border cursor-pointer transition-all duration-200"
            style={{
              background:
                value === g
                  ? "rgb(from var(--brand) r g b / 0.08)"
                  : "rgba(255,255,255,0.03)",
              borderColor: error
                ? "rgba(248,113,113,0.5)"
                : value === g
                  ? "rgb(from var(--brand) r g b / 0.5)"
                  : "rgba(255,255,255,0.09)",
              boxShadow:
                value === g
                  ? "0 0 14px rgb(from var(--brand) r g b / 0.12)"
                  : "none",
            }}
          >
            {g === "male" ? (
              <ManSVG active={value === "male"} />
            ) : (
              <WomanSVG active={value === "female"} />
            )}
            <span
              className={`text-sm font-semibold capitalize ${value === g ? "text-brand" : "text-slate-400"}`}
            >
              {g}
            </span>
          </button>
        ))}
      </div>
      {error && (
        <p className="text-red-400 text-xs mt-1.5 animate-[fadeIn_0.2s_ease]">
          {error}
        </p>
      )}
    </div>
  );
}
