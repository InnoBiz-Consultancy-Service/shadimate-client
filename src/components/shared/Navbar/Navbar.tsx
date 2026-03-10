"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const NAV_LINKS = ["Features", "Psychology", "Matches"];

export default function Navbar() {
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@400;500;600;700&display=swap');
        .font-outfit { font-family: 'Outfit', sans-serif; }
        .font-syne   { font-family: 'Syne', sans-serif; }

        /* gradient text helper */
        .grad-text {
          background: linear-gradient(90deg, #b3f000, #00f0ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* nav link hover overlay */
        .nav-pill::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 999px;
          opacity: 0;
          background: linear-gradient(90deg, rgba(179,240,0,0.13), rgba(0,240,255,0.10));
          transition: opacity 0.2s ease;
          pointer-events: none;
        }
        .nav-pill:hover::after,
        .nav-pill.is-active::after { opacity: 1; }
        .nav-pill.is-active { text-shadow: 0 0 10px rgba(179,240,0,0.55); }

        /* bar animations */
        .bar { transition: transform 0.3s ease, opacity 0.3s ease; }
        .bar-open-1 { transform: translateY(7px) rotate(45deg); }
        .bar-open-2 { opacity: 0; transform: scaleX(0); }
        .bar-open-3 { transform: translateY(-7px) rotate(-45deg); }

        /* noise texture */
        .noise-layer {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 128px;
        }
      `}</style>

      <div
        className={`
          fixed inset-0 z-99 flex flex-col items-center justify-center gap-3
          bg-[rgba(10,11,18,0.97)] backdrop-blur-3xl
          transition-opacity duration-300
          ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
          md:hidden
        `}
      >
        {NAV_LINKS.map((link) => (
          <button
            key={link}
            onClick={() => {
              setActive(link);
              setMenuOpen(false);
            }}
            className={`
              font-syne font-bold tracking-tight px-6 py-2 rounded-xl
              text-[clamp(32px,9vw,56px)] transition-all duration-200
              ${
                active === link
                  ? "grad-text"
                  : "text-white/15 hover:text-white/90 hover:bg-[rgba(179,240,0,0.07)]"
              }
            `}
          >
            {link}
          </button>
        ))}

        <Link href={"/login"}>
          <button
            onClick={() => setMenuOpen(false)}
            className="
            mt-7 font-outfit font-bold tracking-widest text-base text-[#0d0e14]
            px-14 py-4 rounded-full cursor-pointer
            bg-linear-to-r from-[#b3f000] to-[#00f0ff]
            shadow-[0_0_30px_rgba(179,240,0,0.4)]
            hover:scale-[1.04] hover:shadow-[0_0_50px_rgba(179,240,0,0.6)]
            active:scale-[0.97] transition-all duration-200
          "
          >
            Login →
          </button>
        </Link>

        <span className="absolute bottom-10 font-outfit text-[11px] uppercase tracking-[0.12em] text-white/20">
          tap outside to close
        </span>
      </div>

      {menuOpen && (
        <div
          className="fixed inset-0 z-98 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div
        className={`
          sticky top-0 z-100 w-full flex justify-center
          transition-all duration-300
          ${scrolled ? "px-4 py-2" : "px-4 py-3.5"}
        `}
      >
        <nav
          className="
            relative flex items-center justify-between
            w-full max-w-175 overflow-hidden
            rounded-full border border-white/8
            bg-[rgba(16,18,28,0.82)] backdrop-blur-2xl
            px-3.5 py-2
            shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_12px_40px_rgba(0,0,0,0.5)]
            transition-all duration-300
            font-outfit
          "
        >
          <div
            className="
              w-8 h-8 rounded-full shrink-0 flex items-center justify-center cursor-pointer
              bg-linear-to-br from-[#b3f000] to-[#00f0ff]
              shadow-[0_0_16px_rgba(179,240,0,0.4)]
            "
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M5 4C5 4 4 8 7 11C10 14 13 13 13 13C13 13 10.5 12.2 9 10C7.5 7.8 8.5 4 5 4Z"
                fill="#0d0e14"
              />
              <circle cx="9" cy="9" r="2.2" fill="#0d0e14" opacity="0.6" />
            </svg>
          </div>

          <div className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                onClick={() => setActive(link)}
                className={`
                  nav-pill relative cursor-pointer px-4 py-1.5 rounded-full
                  text-sm font-medium tracking-wide
                  transition-colors duration-200
                  ${active === link ? "is-active text-white" : "text-[rgba(200,205,220,0.8)] hover:text-white"}
                `}
              >
                {link}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link href={"/login"}>
              <button
                className="
                hidden md:block font-outfit font-semibold text-sm tracking-[0.04em] text-[#0d0e14]
                px-5 py-2 rounded-full cursor-pointer shrink-0
                bg-linear-to-r from-[#b3f000] to-[#00f0ff]
                shadow-[0_0_18px_rgba(179,240,0,0.35)]
                hover:scale-[1.05] hover:shadow-[0_0_28px_rgba(179,240,0,0.55),0_0_14px_rgba(0,240,255,0.3)]
                active:scale-[0.97] transition-all duration-200
              "
              >
                Login →
              </button>
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              className="
                md:hidden flex flex-col justify-center items-center gap-1.5
                w-9 h-9 rounded-[10px] cursor-pointer shrink-0
                bg-white/6 border border-white/10
                hover:bg-[rgba(179,240,0,0.1)] hover:border-[rgba(179,240,0,0.3)]
                transition-all duration-200
              "
            >
              <span
                className={`bar block w-4 h-0.5 rounded-sm bg-white origin-center ${menuOpen ? "bar-open-1" : ""}`}
              />
              <span
                className={`bar block w-4 h-0.5 rounded-sm bg-white origin-center ${menuOpen ? "bar-open-2" : ""}`}
              />
              <span
                className={`bar block w-4 h-0.5 rounded-sm bg-white origin-center ${menuOpen ? "bar-open-3" : ""}`}
              />
            </button>
          </div>

          <div className="noise-layer absolute inset-0 rounded-full opacity-[0.025] pointer-events-none" />
        </nav>
      </div>
    </>
  );
}
