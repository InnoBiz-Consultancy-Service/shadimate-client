"use client";

import Link from "next/link";

// ── Left character SVG (woman waving) ───────────────────────────────────
const CharacterLeft = () => (
  <svg
    width="120"
    height="180"
    viewBox="0 0 90 150"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="select-none"
    aria-hidden
  >
    {/* Head */}
    <ellipse cx="45" cy="28" rx="18" ry="19" fill="#1a1a1a" />
    {/* Eyes */}
    <circle cx="38" cy="26" r="3.5" fill="white" />
    <circle cx="52" cy="26" r="3.5" fill="white" />
    <circle cx="39" cy="26.5" r="1.8" fill="#1a1a1a" />
    <circle cx="53" cy="26.5" r="1.8" fill="#1a1a1a" />
    {/* Smile */}
    <path
      d="M38 34 Q45 39 52 34"
      stroke="white"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
    />
    {/* Glasses */}
    <circle
      cx="38"
      cy="26"
      r="5.5"
      fill="none"
      stroke="#E8547A"
      strokeWidth="1.2"
    />
    <circle
      cx="52"
      cy="26"
      r="5.5"
      fill="none"
      stroke="#E8547A"
      strokeWidth="1.2"
    />
    <line
      x1="43.5"
      y1="26"
      x2="46.5"
      y2="26"
      stroke="#E8547A"
      strokeWidth="1.2"
    />
    {/* Body */}
    <rect x="22" y="44" width="46" height="60" rx="14" fill="#1a1a1a" />
    {/* Left arm - waving up */}
    <path d="M22 54 L6 36 Q2 30 8 28 Q14 26 16 34 L24 52" fill="#1a1a1a" />
    {/* Hand fingers */}
    <path
      d="M6 28 Q3 24 5 22"
      stroke="#1a1a1a"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M9 26 Q7 21 9 19"
      stroke="#1a1a1a"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M12 25 Q11 20 13 18"
      stroke="#1a1a1a"
      strokeWidth="3"
      strokeLinecap="round"
    />
    {/* Right arm - pointing out */}
    <rect x="66" y="50" width="20" height="10" rx="5" fill="#1a1a1a" />
    {/* Legs */}
    <path
      d="M36 104 L30 138 L38 138 L45 120 L52 138 L60 138 L54 104Z"
      fill="#1a1a1a"
    />
    {/* Neckline detail */}
    <path
      d="M36 48 Q45 54 54 48"
      stroke="white"
      strokeWidth="1"
      fill="none"
      strokeLinecap="round"
      opacity="0.25"
    />
  </svg>
);

// ── Right character SVG (man pointing) ──────────────────────────────────
const CharacterRight = () => (
  <svg
    width="120"
    height="180"
    viewBox="0 0 90 150"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="select-none"
    aria-hidden
  >
    {/* Head */}
    <ellipse cx="45" cy="28" rx="18" ry="19" fill="#1a1a1a" />
    {/* Hair/beard suggestion */}
    <path
      d="M27 22 Q28 10 45 8 Q62 10 63 22 Q58 15 45 14 Q32 15 27 22Z"
      fill="#1a1a1a"
    />
    <path
      d="M30 42 Q35 48 45 46 Q55 48 60 42 Q58 50 45 50 Q32 50 30 42Z"
      fill="#1a1a1a"
      opacity="0.5"
    />
    {/* Eyes */}
    <circle cx="38" cy="26" r="3.5" fill="white" />
    <circle cx="52" cy="26" r="3.5" fill="white" />
    <circle cx="39" cy="26.5" r="1.8" fill="#1a1a1a" />
    <circle cx="53" cy="26.5" r="1.8" fill="#1a1a1a" />
    {/* Glasses */}
    <circle
      cx="38"
      cy="26"
      r="5.5"
      fill="none"
      stroke="white"
      strokeWidth="1.2"
      opacity="0.6"
    />
    <circle
      cx="52"
      cy="26"
      r="5.5"
      fill="none"
      stroke="white"
      strokeWidth="1.2"
      opacity="0.6"
    />
    <line
      x1="43.5"
      y1="26"
      x2="46.5"
      y2="26"
      stroke="white"
      strokeWidth="1.2"
      opacity="0.6"
    />
    {/* Smile */}
    <path
      d="M38 34 Q45 39 52 34"
      stroke="white"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
    />
    {/* Body */}
    <rect x="22" y="44" width="46" height="60" rx="14" fill="#1a1a1a" />
    {/* Tie */}
    <path d="M43 48 L47 48 L49 68 L45 72 L41 68Z" fill="white" opacity="0.15" />
    {/* Left arm */}
    <rect x="4" y="50" width="20" height="10" rx="5" fill="#1a1a1a" />
    {/* Right arm pointing */}
    <path d="M68 54 L82 44 Q88 40 88 46 Q88 52 82 52 L70 56" fill="#1a1a1a" />
    {/* Pointing finger */}
    <path
      d="M86 40 Q92 38 91 34"
      stroke="#1a1a1a"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    {/* Legs */}
    <path
      d="M36 104 L30 138 L38 138 L45 120 L52 138 L60 138 L54 104Z"
      fill="#1a1a1a"
    />
  </svg>
);

// ── Heart + logo mark ────────────────────────────────────────────────────
const LogoMark = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
    <path
      d="M18 31 C18 31 3 22 3 11 C3 7 6.5 3.5 11 3.5 C14 3.5 16.5 5 18 7.5 C19.5 5 22 3.5 25 3.5 C29.5 3.5 33 7 33 11 C33 22 18 31 18 31Z"
      fill="#E8547A"
      fillOpacity="0.18"
      stroke="#E8547A"
      strokeWidth="1.5"
    />
  </svg>
);

// ── Main section ─────────────────────────────────────────────────────────
export default function WhereSoulsMeet() {
  return (
    <section
      className="relative overflow-hidden py-16 px-5 md:py-20"
      style={{ background: "#f7f5f2" }}
    >
      {/* subtle background ring */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-slate-200 opacity-40" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full border border-slate-200 opacity-30" />

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Characters row */}
        <div className="flex justify-between items-end mb-8 md:mb-10 px-2 md:px-8">
          <CharacterLeft />

          {/* Centre logo mark */}
          <div className="flex flex-col items-center gap-1 mb-4">
            <LogoMark />
            <span
              className="font-outfit text-[10px] font-bold tracking-[0.14em] uppercase"
              style={{ color: "#E8547A" }}
            >
              primehalf
            </span>
          </div>

          <CharacterRight />
        </div>

        {/* Text block */}
        <div className="text-center">
          <h2
            className="font-outfit text-slate-900 leading-[1.1] tracking-[-0.03em] mb-4"
            style={{ fontWeight: 800, fontSize: "clamp(28px, 7vw, 52px)" }}
          >
            Where souls meet
          </h2>

          <p
            className="font-outfit text-slate-800 leading-snug tracking-[-0.01em] mb-4 mx-auto"
            style={{
              fontWeight: 700,
              fontSize: "clamp(15px, 3.5vw, 20px)",
              maxWidth: 560,
            }}
          >
            The connection platform for everyone —
            <br className="hidden md:block" />
            every culture, every background.
          </p>

          <p
            className="font-outfit text-slate-500 leading-relaxed mb-6 mx-auto"
            style={{ fontSize: "clamp(13px, 2.5vw, 15px)", maxWidth: 520 }}
          >
            We&apos;re not like other dating sites. Primehalf uses behavioral
            psychology to find your true match — not just looks or location. No
            awkward bios, no endless swiping. Just real, meaningful connections
            for real people, from every walk of life.
          </p>

          <p
            className="font-outfit text-slate-700"
            style={{ fontSize: "clamp(13px, 2.5vw, 15px)", fontWeight: 500 }}
          >
            Could you be next?{" "}
            <Link
              href="/login"
              className="font-bold underline underline-offset-2"
              style={{ color: "#E8547A", textDecorationColor: "#E8547A" }}
            >
              Join Primehalf today
            </Link>{" "}
            and start your story.
          </p>
        </div>
      </div>
    </section>
  );
}
