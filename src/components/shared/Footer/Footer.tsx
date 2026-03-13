/* ── Social icon SVGs ── */
const TwitterX = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.632 5.905-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
  </svg>
);

const Instagram = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const TikTok = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" />
  </svg>
);

const Discord = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.04.031.053a19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

/* ── Arrow icon ── */
const ArrowUpRight = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" />
  </svg>
);

/* ── Logo ── */
const Logo = () => (
  <div className="flex items-center gap-2.5">
    <div className="w-9 h-9 rounded-full flex items-center justify-center bg-linear-to-br from-brand to-accent shadow-[var(--shadow-brand-sm)]">
      <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
        <path
          d="M5 4C5 4 4 8 7 11C10 14 13 13 13 13C13 13 10.5 12.2 9 10C7.5 7.8 8.5 4 5 4Z"
          fill="var(--on-brand)"
        />
        <circle cx="9" cy="9" r="2.2" fill="var(--on-brand)" opacity="0.6" />
      </svg>
    </div>
    <span className="font-syne text-white font-extrabold text-xl tracking-tight">
      ShadiMate
    </span>
  </div>
);

/* ── Nav columns ── */
const footerLinks = [
  {
    heading: "Product",
    links: ["Features", "Psychology", "Matches", "How It Works", "Pricing"],
  },
  {
    heading: "Company",
    links: ["About Us", "Blog", "Careers", "Press Kit", "Contact"],
  },
  {
    heading: "Legal",
    links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"],
  },
];

const socials = [
  { icon: <TwitterX />, label: "X / Twitter" },
  { icon: <Instagram />, label: "Instagram" },
  { icon: <TikTok />, label: "TikTok" },
  { icon: <Discord />, label: "Discord" },
];

export default function Footer() {
  return (
    <footer
      className="font-outfit relative w-full overflow-hidden bg-[linear-gradient(to_bottom,#0F172A_0%,#080d1a_100%)]"
    >
      {/* Top border glow */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent 0%, rgb(from var(--brand) r g b / 0.4) 30%, rgb(from var(--accent) r g b / 0.4) 70%, transparent 100%)`,
        }}
      />

      {/* Subtle bg glow */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full opacity-10 bg-[radial-gradient(ellipse,rgba(168,85,247,0.6)_0%,transparent_70%)]"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 pt-16 pb-8">
        {/* ── TOP SECTION ── */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-8 pb-14 border-b border-white/[0.07]">
          {/* Brand col — 2 cols wide on desktop */}
          <div className="md:col-span-2 flex flex-col gap-5">
            <Logo />

            <p className="text-slate-400 text-sm leading-relaxed max-w-[260px]">
              We use behavioral psychology and AI to match you with your true
              99.9% connection. Traditional dating is dead.
            </p>

            {/* CTA pill */}
            <div>
              <button
                className="
                  inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                  text-on-brand text-sm font-bold tracking-[0.05em]
                  bg-linear-to-r from-brand to-accent
                  shadow-[var(--shadow-brand-md)]
                  hover:scale-[1.04] hover:shadow-[var(--shadow-brand-lg)]
                  active:scale-[0.97] transition-all duration-200 border-0 cursor-pointer
                "
              >
                Start Your Scan
                <ArrowUpRight />
              </button>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-2.5 mt-1">
              {socials.map(({ icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="
                    w-9 h-9 rounded-xl flex items-center justify-center
                    bg-white/[0.05] border border-white/[0.1]
                    text-slate-400 cursor-pointer
                    transition-all duration-200
                    hover:bg-brand/10 hover:border-brand/35 hover:text-brand hover:shadow-[var(--shadow-brand-xs)] hover:-translate-y-0.5
                  "
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((col) => (
            <div key={col.heading} className="flex flex-col gap-4">
              <h4 className="font-syne text-white text-xs font-bold tracking-[0.15em] uppercase">
                {col.heading}
              </h4>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-slate-400 text-sm transition-colors duration-[180ms] hover:text-brand"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── BIG TAGLINE ── */}
        <div className="py-10 text-center">
          <p
            className="text-[clamp(32px,7vw,72px)] font-extrabold leading-none tracking-tight bg-clip-text text-transparent animate-[shimmer_5s_linear_infinite] [background-size:200%_auto]"
            style={{
              backgroundImage: `linear-gradient(90deg, var(--brand), var(--accent), #A855F7, var(--brand))`,
            }}
          >
            FIND YOUR SOUL MATE
          </p>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="border-t border-white/[0.07] pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-slate-600 text-xs">
            © {new Date().getFullYear()} ShadiMate Inc. All rights reserved.
          </p>

          <div className="flex items-center gap-1.5">
            {/* Status dot */}
            <span className="w-1.5 h-1.5 rounded-full bg-brand shadow-[var(--shadow-brand-dot)]" />
            <span className="text-slate-600 text-xs">
              All systems operational
            </span>
          </div>

          <p className="text-slate-600 text-xs">
            Built with behavioral science &amp; love
          </p>
        </div>
      </div>
    </footer>
  );
}
