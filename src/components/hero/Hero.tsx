import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {

  return (
    <section className="relative min-h-screen flex items-center justify-center px-5 py-16 md:py-20 overflow-hidden">
      {/* ── Video Background ── */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            /* On mobile portrait, keep the video centred on the most
               visually important area (centre-top) so faces / key action
               are never cropped awkwardly. */
            objectPosition: "center center",
          }}
        >
          <source
            src="https://res.cloudinary.com/dce4clgq6/video/upload/q_auto/f_auto/v1777283352/0427_1_pzrnfz.mp4"
            type="video/mp4"
          />
        </video>

        {/* Dark overlay — slightly heavier on mobile so text stays readable
            on smaller, brighter screens */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.65) 100%)",
          }}
        />

        {/* Subtle rose-tinted vignette that reinforces the brand palette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(232,84,122,0.18) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 grid grid-cols-1 gap-8 md:gap-12 w-full max-w-5xl items-center">
        {/* Left — headline + CTA */}
        <div className="flex flex-col gap-6">
          <h1
            className="animate-[fadeUp_0.65s_ease_0.05s_both] leading-[0.9] tracking-[-0.04em] text-white"
            style={{ fontWeight: 800, fontSize: "clamp(40px, 10vw, 84px)" }}
          >
            <span className="block opacity-90">FIND YOUR</span>
            <span className="block text-gradient-rose">SOUL MATE</span>
          </h1>

          <p className="font-outfit animate-[fadeUp_0.65s_ease_0.2s_both] text-white/80 leading-relaxed max-w-sm text-[15px] font-medium">
            Traditional matching is dead. We use behavioral psychology to find
            your 99.9% true connection.
          </p>

          <div className="animate-[fadeUp_0.65s_ease_0.35s_both] w-full md:w-auto">
            <Link href="/personality-test">
              <button className="font-outfit w-full md:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4.5 rounded-full font-bold text-[13px] tracking-[0.08em] text-white bg-linear-to-r from-brand to-accent shadow-(--shadow-brand-md) hover:scale-[1.04] hover:shadow-(--shadow-btn-hover-lg) active:scale-[0.97] transition-all duration-300 cursor-pointer border-0 relative overflow-hidden group">
                <span className="relative z-10 uppercase">
                  Start My Personality Scan
                </span>
                <ArrowRight
                  size={18}
                  className="relative z-10 group-hover:translate-x-1 transition-transform"
                />
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
