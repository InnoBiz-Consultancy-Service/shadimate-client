"use client";

import Link from "next/link";
import Image from "next/image";

// ── Heart + logo mark ────────────────────────────────────────────────────
const LogoMark = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
    <path
      d="M18 31 C18 31 3 22 3 11 C3 7 6.5 3.5 11 3.5 C14 3.5 16.5 5 18 7.5 C19.5 5 22 3.5 25 3.5 C29.5 3.5 33 7 33 11 C33 22 18 31 18 31Z"
      fill="var(--color-brand)"
      fillOpacity="0.18"
      stroke="var(--color-brand)"
      strokeWidth="1.5"
    />
  </svg>
);

// ── Main section ─────────────────────────────────────────────────────────
export default function WhereSoulsMeet() {
  return (
    <section
      className="relative overflow-hidden py-16 px-5 md:py-20"
      style={{ background: "#f8fafc" }}
    >
      {/* Subtle background rings */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-slate-200 opacity-40" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full border border-slate-200 opacity-30" />

      {/* Left character — pinned to top-left edge */}
      <div className="absolute top-0 left-0 w-[120px] md:w-[160px] lg:w-[180px]">
        <Image
          src="/images/character-left.png"
          alt=""
          width={180}
          height={280}
          className="object-contain object-top w-full h-auto select-none"
          priority
        />
      </div>

      {/* Right character — pinned to bottom-right edge */}
      <div className="absolute bottom-0 right-0 w-[120px] md:w-[160px] lg:w-[180px]">
        <Image
          src="/images/character-right.png"
          alt=""
          width={180}
          height={280}
          className="object-contain object-bottom w-full h-auto select-none"
          priority
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Logo mark */}
        <div className="flex flex-col items-center gap-1 mb-8 md:mb-10">
          <LogoMark />
          <span
            className="font-outfit text-[10px] font-bold tracking-[0.14em] uppercase"
            style={{ color: "var(--color-brand)" }}
          >
            primehalf
          </span>
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
              style={{
                color: "var(--color-brand)",
                textDecorationColor: "var(--color-brand)",
              }}
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
