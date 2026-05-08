import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { ArrowUpRight, Heart } from "lucide-react";

const footerLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Trust & Safety", href: "#" },
  { label: "Contact Us", href: "#" },
];

export default function Footer() {
  return (
    <footer className="font-outfit relative w-full overflow-hidden bg-slate-50 border-t border-slate-200">
      {/* Decorative Background Accents */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full bg-indigo-500/10 blur-3xl opacity-60" />
      <div className="pointer-events-none absolute top-10 left-10 w-32 h-32 rounded-full bg-teal-500/10 blur-2xl opacity-60" />

      {/* ── CTA Banner ── */}
      <div className="relative z-10 max-w-4xl mx-auto px-5 md:px-10 pt-20 pb-16">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-indigo-100 text-indigo-600 mb-6 shadow-sm">
            <Heart size={24} fill="currentColor" />
          </div>
          <h2 className="font-serif text-3xl md:text-5xl font-semibold text-slate-900 mb-5 leading-tight">
            Your story begins here
          </h2>
          <p className="text-slate-600 text-sm md:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            Join thousands of others who have found their true connection on Primehalf. 
            Authentic matches, secure interactions, and a community built for lasting relationships.
          </p>
          <Link href="/registration">
            <button
              className="px-8 py-4 rounded-full text-white font-bold tracking-wide flex items-center gap-2 shadow-[0_8px_20px_rgb(99,102,241,0.3)] transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_25px_rgb(99,102,241,0.4)] active:scale-95"
              style={{ background: "linear-gradient(135deg, var(--color-brand), var(--color-accent))" }}
            >
              CREATE YOUR PROFILE
              <ArrowUpRight size={18} />
            </button>
          </Link>
        </div>
      </div>

      {/* ── Main Footer Links ── */}
      <div className="relative z-10 border-t border-slate-200/80 mt-4">
        <div className="max-w-6xl mx-auto px-5 md:px-10 pt-12 pb-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-4 text-center md:text-left">
            <Logo />
            <p className="text-slate-500 text-sm max-w-[280px]">
              The premium matrimony platform powered by behavioral psychology and real connections.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-8 gap-y-4">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-slate-600 text-[14px] font-medium transition-colors hover:text-indigo-600 hover:underline underline-offset-4"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="max-w-6xl mx-auto px-5 md:px-10 py-6 border-t border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          <p className="text-slate-400 text-[13px] order-2 md:order-1">
            © {new Date().getFullYear()} Primehalf Inc. All rights reserved.
          </p>
          
          <div className="flex items-center gap-2 order-1 md:order-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">
              All systems operational
            </span>
          </div>
          
          <p className="text-slate-400 text-[13px] order-3">
            Built with science <span className="text-indigo-500">♥</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
