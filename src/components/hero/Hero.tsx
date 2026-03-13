import Image from "next/image";
import MaleAvatar from "../../../public/images/male_shadimate.png";

const AvatarFemale = ({ size = 60 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
    <circle cx="28" cy="28" r="28" fill="url(#fBg)" />
    <ellipse cx="28" cy="50" rx="14" ry="8" fill="#6b21a8" />
    <rect x="22" y="35" width="12" height="9" rx="4" fill="#c084f0" />
    <ellipse cx="28" cy="25" rx="13" ry="14" fill="#c084f0" />
    <path
      d="M15 21 Q14 36 15 46 Q20 52 28 52 Q36 52 41 46 Q42 36 41 21 Q37 13 28 12 Q19 13 15 21Z"
      fill="#7c3aed"
      opacity="0.65"
    />
    <path
      d="M15 21 Q17 10 28 10 Q39 10 41 21 Q37 14 28 14 Q19 14 15 21Z"
      fill="#7c3aed"
    />
    <ellipse cx="15" cy="25" rx="2.5" ry="3.2" fill="#c084f0" />
    <ellipse cx="41" cy="25" rx="2.5" ry="3.2" fill="#c084f0" />
    <ellipse cx="22.5" cy="24" rx="2.8" ry="2.8" fill="white" />
    <ellipse cx="33.5" cy="24" rx="2.8" ry="2.8" fill="white" />
    <circle cx="23" cy="24.5" r="1.5" fill="#2e0052" />
    <circle cx="34" cy="24.5" r="1.5" fill="#2e0052" />
    <path
      d="M22.5 30.5 Q28 34.5 33.5 30.5"
      stroke="#7c3aed"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
    />
    <defs>
      <radialGradient id="fBg" cx="50%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#a855f7" />
        <stop offset="100%" stopColor="#581c87" />
      </radialGradient>
    </defs>
  </svg>
);

const AvatarSmall = ({
  v,
  size = 38,
}: {
  v: "a" | "b" | "c" | "d";
  size?: number;
}) => {
  const cfg = {
    a: {
      b1: "#1e8c7a",
      b2: "#0d4a42",
      s: "#4ec9b0",
      h: "#1a6b5e",
      e: "#0d3330",
    },
    b: {
      b1: "#a855f7",
      b2: "#581c87",
      s: "#c084f0",
      h: "#7c3aed",
      e: "#2e0052",
    },
    c: {
      b1: "#3b82f6",
      b2: "#1e40af",
      s: "#93c5fd",
      h: "#1d4ed8",
      e: "#1e3a8a",
    },
    d: {
      b1: "#ec4899",
      b2: "#9d174d",
      s: "#f9a8d4",
      h: "#be185d",
      e: "#831843",
    },
  };
  const c = cfg[v];
  const gid = `sav-${v}`;
  return (
    <svg width={size} height={size} viewBox="0 0 38 38" fill="none">
      <circle cx="19" cy="19" r="19" fill={`url(#${gid})`} />
      <ellipse cx="19" cy="18" rx="9" ry="9.5" fill={c.s} />
      <path
        d="M10 16 Q11 8 19 7 Q27 8 28 16 Q25 10 19 10 Q13 10 10 16Z"
        fill={c.h}
      />
      <ellipse cx="15.5" cy="17" rx="1.8" ry="1.8" fill="white" />
      <ellipse cx="22.5" cy="17" rx="1.8" ry="1.8" fill="white" />
      <circle cx="16" cy="17.4" r="1" fill={c.e} />
      <circle cx="23" cy="17.4" r="1" fill={c.e} />
      <path
        d="M15.5 22 Q19 24.5 22.5 22"
        stroke={c.h}
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
      <rect
        x="15"
        y="24"
        width="8"
        height="5"
        rx="2.5"
        fill={c.s}
        opacity="0.7"
      />
      <ellipse cx="19" cy="33" rx="9" ry="5" fill={c.h} opacity="0.5" />
      <defs>
        <radialGradient id={gid} cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor={c.b1} />
          <stop offset="100%" stopColor={c.b2} />
        </radialGradient>
      </defs>
    </svg>
  );
};

/* ─── Gauge ─── */
const Gauge = ({ value = 94 }: { value?: number }) => {
  const r = 44;
  const circ = 2 * Math.PI * r;
  return (
    <div className="relative flex items-center justify-center w-27.5 h-27.5">
      <svg
        width="110"
        height="110"
        viewBox="0 0 110 110"
        className="absolute inset-0"
        style={{ transform: "rotate(-225deg)" }}
      >
        <circle
          cx="55"
          cy="55"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="8"
          strokeDasharray={`${circ * 0.75} ${circ}`}
          strokeLinecap="round"
        />
        <circle
          cx="55"
          cy="55"
          r={r}
          fill="none"
          stroke="url(#gGrad)"
          strokeWidth="8"
          strokeDasharray={`${circ * 0.75 * (value / 100)} ${circ}`}
          strokeLinecap="round"
          style={{ filter: "drop-shadow(0 0 7px rgba(45,212,191,0.75))" }}
        />
        <defs>
          <linearGradient id="gGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2DD4BF" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
      </svg>
      <div className="relative z-10 flex flex-col items-center leading-none">
        <span className="font-outfit text-white font-bold text-[26px]">
          {value}%
        </span>
        <span className="font-outfit text-[9px] font-semibold tracking-[0.13em] text-slate-400 mt-1">
          MATCH
        </span>
      </div>
    </div>
  );
};

/* ─── Tag pill ─── */
const Tag = ({ label }: { label: string }) => (
  <span
    className="font-outfit text-[10px] font-semibold tracking-[0.08em] text-slate-400 border border-slate-600/40 rounded-[7px] px-2.5 py-1 bg-white/4 whitespace-nowrap"
  >
    {label}
  </span>
);

/* ─── Person row ─── */
const PersonRow = ({
  name,
  match,
  v,
}: {
  name: string;
  match: number;
  v: "a" | "b" | "c" | "d";
}) => (
  <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-[14px] bg-white/4 border border-white/[0.07]">
    <div className="rounded-full overflow-hidden shrink-0">
      <AvatarSmall v={v} size={38} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-outfit text-[13px] font-semibold text-slate-100 truncate">
        {name}
      </p>
      <p className="font-outfit text-[10px] text-slate-500 mt-0.5">
        Compatible
      </p>
    </div>
    <div className="text-right shrink-0">
      <p className="font-outfit text-[15px] font-bold text-[#2DD4BF]">
        {match}%
      </p>
      <p className="font-outfit text-[9px] font-semibold tracking-widest text-slate-500">
        MATCH
      </p>
    </div>
  </div>
);

/* ══════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════ */
export default function HeroSection() {
  const tags = [
    "INTROVERT",
    "HIGH EMPATHY",
    "VALUE-DRIVEN",
    "ANALYTICAL",
    "CURIOUS",
    "CREATIVE",
  ];

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-5 py-16 md:py-20 bg-[radial-gradient(ellipse_at_25%_40%,#1e0a42_0%,#0F172A_50%,#06101e_100%)]"
    >
      {/* BG blobs */}
      <div
        className="pointer-events-none absolute top-[5%] left-0 w-120 h-120 rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.18)_0%,transparent_65%)]"
      />
      <div
        className="pointer-events-none absolute bottom-[5%] right-[5%] w-[320px] h-80 rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.12)_0%,transparent_65%)]"
      />

      {/* Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 w-full max-w-5xl items-center">
        {/* ════ LEFT ════ */}
        <div className="flex flex-col gap-6">
          {/* Headline */}
          <h1
            className="animate-[fadeUp_0.65s_ease_0.05s_both] leading-[0.95] tracking-tight text-slate-100"
            style={{
              fontWeight: 800,
              fontSize: "clamp(52px, 11vw, 72px)",
              letterSpacing: "-0.02em",
            }}
          >
            <span className="block">FIND YOUR</span>
            <span
              className="block"
              style={{
                background:
                  "linear-gradient(100deg, #A855F7 0%, #06B6D4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              SOUL MATE
            </span>
          </h1>

          {/* Sub */}
          <p
            className="font-outfit animate-[fadeUp_0.65s_ease_0.2s_both] text-slate-400 leading-relaxed max-w-sm"
          >
            Traditional matching is dead. We use behavioral psychology to find
            your 99.9% true connection.
          </p>

          {/* CTA */}
          <div className="animate-[fadeUp_0.65s_ease_0.35s_both] w-full md:w-auto">
            <button
              className="
                font-outfit
                w-full md:w-auto
                inline-flex items-center justify-center gap-2.5
                px-8 py-4 rounded-full
                font-bold text-[13px] tracking-[0.07em] text-on-brand
                bg-linear-to-r from-brand to-accent
                shadow-[var(--shadow-brand-md)]
                hover:scale-[1.04] hover:shadow-[var(--shadow-btn-hover-lg)]
                active:scale-[0.97]
                transition-all duration-200 cursor-pointer border-0
              "
            >
              START MY PERSONALITY SCAN
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8H13M13 8L9 4M13 8L9 12"
                  stroke="var(--on-brand)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* ════ RIGHT ════ */}
        <div className="flex flex-col gap-4">
          {/* Compatibility Meter */}
          <div
            className="animate-[fadeIn_0.65s_ease_0.5s_both] rounded-[20px] border border-white/9 p-5 backdrop-blur-xl"
            style={{ background: "rgba(28,32,52,0.72)" }}
          >
            <p
              className="font-outfit text-center text-[13px] font-medium text-slate-400 mb-4"
            >
              Compatibility Meter
            </p>

            {/* Avatars + Gauge */}
            <div className="flex items-center justify-center gap-4">
              {/* Male */}
              <div
                className="animate-[pulseGlow_2.5s_ease-in-out_infinite] rounded-full p-0.75"
              >
                <div className="rounded-full overflow-hidden flex">
                  <Image
                    alt="male_shadimate"
                    width={100}
                    height={100}
                    src={MaleAvatar}
                  />
                </div>
              </div>

              <Gauge value={94} />

              {/* Female */}
              <div
                className="rounded-full p-0.75 shadow-[0_0_18px_rgba(168,85,247,0.45)]"
                style={{
                  background: "linear-gradient(135deg, #A855F7, #7C3AED)",
                }}
              >
                <div className="rounded-full overflow-hidden bg-[#141826] flex">
                  <AvatarFemale size={60} />
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.75 mt-5 justify-center">
              {tags.map((t) => (
                <Tag key={t} label={t} />
              ))}
            </div>
          </div>

          {/* Compatible Personalities — hidden on mobile */}
          <div
            className="animate-[fadeIn_0.65s_ease_0.65s_both] hidden md:block rounded-[20px] border border-white/9 p-4 backdrop-blur-xl"
            style={{ background: "rgba(28,32,52,0.72)" }}
          >
            <p
              className="font-outfit text-[13px] font-medium text-slate-400 mb-3"
            >
              Compatible Personalities
            </p>
            <div className="grid grid-cols-2 gap-2">
              <PersonRow name="Sherry" match={94} v="a" />
              <PersonRow name="Bruno" match={91} v="b" />
              <PersonRow name="Sherry" match={89} v="c" />
              <PersonRow name="Bruno" match={87} v="d" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
