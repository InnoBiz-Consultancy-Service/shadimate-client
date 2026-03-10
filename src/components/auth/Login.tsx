"use client";

import Link from "next/link";
import { useState } from "react";

/* ── Google icon SVG ── */
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path
      d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      fill="#4285F4"
    />
    <path
      d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
      fill="#34A853"
    />
    <path
      d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
      fill="#FBBC05"
    />
    <path
      d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"
      fill="#EA4335"
    />
  </svg>
);

/* ── Eye icons ── */
const EyeOpen = () => (
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
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const EyeClosed = () => (
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
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

/* ── Logo ── */
const Logo = () => (
  <div className="flex items-center gap-2.5">
    <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-[#b3f000] to-[#00f0ff] shadow-[0_0_16px_rgba(179,240,0,0.4)]">
      <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
        <path
          d="M5 4C5 4 4 8 7 11C10 14 13 13 13 13C13 13 10.5 12.2 9 10C7.5 7.8 8.5 4 5 4Z"
          fill="#0d0e14"
        />
        <circle cx="9" cy="9" r="2.2" fill="#0d0e14" opacity="0.6" />
      </svg>
    </div>
    <span
      className="text-white font-bold text-lg tracking-tight"
      style={{ fontFamily: "'Syne', sans-serif" }}
    >
      Shadimate
    </span>
  </div>
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@400;500;600;700&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes float {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          33%      { transform: translateY(-18px) rotate(2deg); }
          66%      { transform: translateY(-8px) rotate(-1deg); }
        }
        @keyframes floatSlow {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-24px); }
        }

        .anim-1 { animation: fadeUp 0.6s ease 0.05s both; }
        .anim-2 { animation: fadeUp 0.6s ease 0.15s both; }
        .anim-3 { animation: fadeUp 0.6s ease 0.25s both; }
        .anim-4 { animation: fadeUp 0.6s ease 0.35s both; }
        .anim-5 { animation: fadeUp 0.6s ease 0.45s both; }
        .anim-6 { animation: fadeUp 0.6s ease 0.55s both; }

        .blob-1 { animation: float 7s ease-in-out infinite; }
        .blob-2 { animation: floatSlow 9s ease-in-out infinite 1s; }
        .blob-3 { animation: float 11s ease-in-out infinite 2s; }

        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(13,14,20,0.3);
          border-top-color: #0d0e14;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        .input-field {
          font-family: 'Outfit', sans-serif;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #F1F5F9;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }
        .input-field::placeholder { color: rgba(148,163,184,0.5); }
        .input-field:focus { outline: none; }
        .input-field.focused {
          border-color: rgba(179,240,0,0.5);
          background: rgba(179,240,0,0.04);
          box-shadow: 0 0 0 3px rgba(179,240,0,0.08);
        }

        .divider-line {
          flex: 1; height: 1px;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent);
        }
      `}</style>

      <div
        className="relative min-h-screen w-full flex items-center justify-center overflow-hidden px-5 py-12"
        style={{
          background:
            "radial-gradient(ellipse at 20% 50%, #1a0a3e 0%, #0F172A 45%, #06101e 100%)",
          fontFamily: "'Outfit', sans-serif",
        }}
      >
        {/* ── Animated background blobs ── */}
        <div
          className="blob-1 pointer-events-none absolute top-[-80px] left-[-80px] w-[420px] h-[420px] rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(168,85,247,0.5) 0%, transparent 70%)",
          }}
        />
        <div
          className="blob-2 pointer-events-none absolute bottom-[-60px] right-[-60px] w-[380px] h-[380px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(6,182,212,0.5) 0%, transparent 70%)",
          }}
        />
        <div
          className="blob-3 pointer-events-none absolute top-[40%] right-[15%] w-[200px] h-[200px] rounded-full opacity-15"
          style={{
            background:
              "radial-gradient(circle, rgba(179,240,0,0.4) 0%, transparent 70%)",
          }}
        />

        {/* ── Floating grid dots (decorative) ── */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* ── Card ── */}
        <div
          className="relative z-10 w-full max-w-md rounded-[28px] border border-white/[0.09] p-8 md:p-10 backdrop-blur-2xl"
          style={{ background: "rgba(18, 22, 40, 0.75)" }}
        >
          {/* Subtle inner glow top */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[28px]"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(179,240,0,0.3), transparent)",
            }}
          />

          {/* ── Logo ── */}
          <div className="anim-1 flex justify-center mb-8">
            <Logo />
          </div>

          {/* ── Heading ── */}
          <div className="anim-2 text-center mb-8">
            <h1
              className="text-white text-[32px] font-extrabold tracking-tight leading-tight mb-2"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Welcome back
            </h1>
            <p className="text-slate-400 text-sm">
              Sign in to find your soul&apos;s connection
            </p>
          </div>

          {/* ── Google button ── */}
          <div className="anim-3 mb-6">
            <button
              className="
                w-full flex items-center justify-center gap-3
                px-5 py-3.5 rounded-2xl
                bg-white/[0.06] border border-white/[0.1]
                text-slate-200 text-sm font-medium
                hover:bg-white/[0.1] hover:border-white/20
                active:scale-[0.98]
                transition-all duration-200 cursor-pointer
              "
            >
              <GoogleIcon />
              Continue with Google
            </button>
          </div>

          {/* ── Divider ── */}
          <div className="anim-4 flex items-center gap-4 mb-6">
            <div className="divider-line" />
            <span className="text-slate-500 text-xs font-medium tracking-wider">
              OR
            </span>
            <div className="divider-line" />
          </div>

          {/* ── Form ── */}
          <div className="anim-5 flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-400 text-xs font-semibold tracking-wider uppercase">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                className={`input-field w-full px-4 py-3.5 rounded-2xl text-sm ${focused === "email" ? "focused" : ""}`}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-slate-400 text-xs font-semibold tracking-wider uppercase">
                  Password
                </label>
                <button className="text-xs text-[#b3f000] hover:text-[#00f0ff] transition-colors duration-150 cursor-pointer bg-transparent border-0">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  className={`input-field w-full px-4 py-3.5 pr-12 rounded-2xl text-sm ${focused === "password" ? "focused" : ""}`}
                />
                <button
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors duration-150 cursor-pointer bg-transparent border-0"
                >
                  {showPass ? <EyeClosed /> : <EyeOpen />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="
                mt-2 w-full flex items-center justify-center gap-2.5
                px-5 py-4 rounded-2xl
                font-bold text-sm tracking-[0.06em] text-[#0d0e14]
                bg-gradient-to-r from-[#b3f000] to-[#00f0ff]
                shadow-[0_0_22px_rgba(179,240,0,0.35)]
                hover:scale-[1.02] hover:shadow-[0_0_32px_rgba(179,240,0,0.5),0_0_14px_rgba(0,240,255,0.25)]
                active:scale-[0.98]
                disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100
                transition-all duration-200 cursor-pointer border-0
              "
            >
              {loading ? (
                <>
                  <div className="spinner" />
                  Signing in...
                </>
              ) : (
                <>
                  SIGN IN
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 8H13M13 8L9 4M13 8L9 12"
                      stroke="#0d0e14"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>

          {/* ── Sign up link ── */}
          <div className="anim-6 text-center mt-7">
            <p className="text-slate-500 text-sm">
              New to ShadiMate?{" "}
              <Link href={'/registration'}>
                <button className="text-[#b3f000] font-semibold hover:text-[#00f0ff] transition-colors duration-150 cursor-pointer bg-transparent border-0">
                  Create account
                </button>
              </Link>
            </p>
          </div>

          {/* Bottom inner glow */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px rounded-b-[28px]"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(6,182,212,0.2), transparent)",
            }}
          />
        </div>

        {/* ── Footer ── */}
        <p className="absolute bottom-5 text-slate-600 text-xs">
          © 2026 Shadimate · Built with behavioral science
        </p>
      </div>
    </>
  );
}
