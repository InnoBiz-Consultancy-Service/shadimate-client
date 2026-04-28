import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { ArrowUpRight } from "lucide-react";

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
    <footer className="font-outfit relative w-full overflow-hidden bg-white">
      {/* Subtle gradient accent - light version */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-150 h-50 rounded-full opacity-20 bg-[radial-gradient(ellipse,rgba(232,84,122,0.2)_0%,transparent_70%)]" />

      <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-10 pt-12 md:pt-16 pb-6 md:pb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-8 pb-10 md:pb-14 border-b border-slate-200">
          <div className="md:col-span-2 flex flex-col gap-4 md:gap-5">
            <Logo />
            <p className="text-slate-600 text-sm leading-relaxed max-w-65">
              We use behavioral psychology and AI to match you with your true
              99.9% connection. Traditional dating is dead.
            </p>

            <Link
              href="/personality-test"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 md:px-6 md:py-3 rounded-full text-white text-sm font-bold tracking-[0.06em] no-underline bg-gradient-to-r from-brand to-accent shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 w-fit"
            >
              Start Your Scan <ArrowUpRight size={14} />
            </Link>

            <div className="flex items-center gap-2 mt-1">
              {socials.map(({ icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-100 text-slate-500 cursor-pointer transition-all duration-200 hover:bg-brand/10 hover:text-brand hover:-translate-y-0.5 active:translate-y-0"
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {footerLinks.map((col) => (
            <div key={col.heading} className="flex flex-col gap-3 md:gap-4">
              <h4 className="font-syne text-slate-800 text-xs font-bold tracking-[0.15em] uppercase">
                {col.heading}
              </h4>
              <ul className="flex flex-col gap-2 md:gap-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-slate-500 text-sm transition-colors duration-150 hover:text-brand block py-0.5"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* Bottom bar - simplified for mobile */}
        <div className="border-t border-slate-200 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-3">
          <p className="text-slate-400 text-xs order-2 md:order-1">
            © {new Date().getFullYear()} primehalf Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 order-1 md:order-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
            <span className="text-slate-500 text-xs">
              All systems operational
            </span>
          </div>
          <p className="text-slate-400 text-xs order-3">
            Built with behavioral science &amp; love
          </p>
        </div>
      </div>
    </footer>
  );
}
