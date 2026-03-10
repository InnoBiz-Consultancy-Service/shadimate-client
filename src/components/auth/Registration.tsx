"use client";

import Link from "next/link";
import { useState } from "react";

/* ══ ICONS ══ */
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

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M2.5 7L5.5 10L11.5 4"
      stroke="#0d0e14"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowRight = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
    <path
      d="M3 8H13M13 8L9 4M13 8L9 12"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowLeft = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
    <path
      d="M13 8H3M3 8L7 4M3 8L7 12"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SpinnerIcon = () => (
  <svg
    className="animate-spin"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <circle cx="8" cy="8" r="6" stroke="rgba(13,14,20,0.3)" strokeWidth="2" />
    <path
      d="M8 2a6 6 0 016 6"
      stroke="#0d0e14"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

/* ══ LOGO ══ */
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
      className="text-white font-extrabold text-xl tracking-tight"
      style={{ fontFamily: "'Syne', sans-serif" }}
    >
      ShadiMate
    </span>
  </div>
);

/* ══ REUSABLE INPUT ══ */
const Input = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  hint,
  rightSlot,
  error,
}: {
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  rightSlot?: React.ReactNode;
  error?: string;
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-slate-400 text-[11px] font-semibold tracking-[0.12em] uppercase"
        style={{ fontFamily: "'Outfit',sans-serif" }}
      >
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full px-4 py-3.5 pr-12 rounded-2xl text-sm text-slate-100 placeholder-slate-600 bg-white/[0.05] border transition-all duration-200 outline-none"
          style={{
            fontFamily: "'Outfit',sans-serif",
            borderColor: error
              ? "rgba(248,113,113,0.6)"
              : focused
                ? "rgba(179,240,0,0.5)"
                : "rgba(255,255,255,0.1)",
            boxShadow: error
              ? "0 0 0 3px rgba(248,113,113,0.08)"
              : focused
                ? "0 0 0 3px rgba(179,240,0,0.08)"
                : "none",
            background: error
              ? "rgba(248,113,113,0.04)"
              : focused
                ? "rgba(179,240,0,0.04)"
                : "rgba(255,255,255,0.05)",
          }}
        />
        {rightSlot && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {rightSlot}
          </div>
        )}
      </div>
      {error && <p className="text-red-400 text-xs mt-0.5">{error}</p>}
      {hint && !error && (
        <p className="text-slate-600 text-xs mt-0.5">{hint}</p>
      )}
    </div>
  );
};

/* ══ GENDER OPTION ══ */
const GenderOption = ({
  label,
  selected,
  onSelect,
  icon,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
}) => (
  <button
    onClick={onSelect}
    className="flex flex-col items-center gap-2 px-4 py-4 rounded-2xl border cursor-pointer transition-all duration-200 flex-1"
    style={{
      fontFamily: "'Outfit',sans-serif",
      background: selected ? "rgba(179,240,0,0.07)" : "rgba(255,255,255,0.03)",
      borderColor: selected ? "rgba(179,240,0,0.45)" : "rgba(255,255,255,0.09)",
      boxShadow: selected ? "0 0 16px rgba(179,240,0,0.12)" : "none",
    }}
  >
    <span className="text-2xl">{icon}</span>
    <span
      className={`text-sm font-semibold ${selected ? "text-[#b3f000]" : "text-slate-400"}`}
    >
      {label}
    </span>
  </button>
);

/* ══ INTEREST TAG ══ */
const InterestTag = ({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) => (
  <button
    onClick={onToggle}
    className="px-4 py-2 rounded-full text-xs font-semibold tracking-wide cursor-pointer transition-all duration-200 border"
    style={{
      fontFamily: "'Outfit',sans-serif",
      background: selected ? "rgba(179,240,0,0.12)" : "rgba(255,255,255,0.04)",
      borderColor: selected ? "rgba(179,240,0,0.5)" : "rgba(255,255,255,0.1)",
      color: selected ? "#b3f000" : "#94A3B8",
      boxShadow: selected ? "0 0 10px rgba(179,240,0,0.15)" : "none",
    }}
  >
    {label}
  </button>
);

/* ══ STEP INDICATOR ══ */
const StepDots = ({ total, current }: { total: number; current: number }) => (
  <div className="flex items-center gap-2">
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        className="transition-all duration-300 rounded-full"
        style={{
          width: i === current ? 24 : 8,
          height: 8,
          background:
            i < current
              ? "linear-gradient(90deg,#b3f000,#00f0ff)"
              : i === current
                ? "linear-gradient(90deg,#b3f000,#00f0ff)"
                : "rgba(255,255,255,0.12)",
          boxShadow: i === current ? "0 0 8px rgba(179,240,0,0.4)" : "none",
        }}
      />
    ))}
  </div>
);

/* ══ PROGRESS BAR ══ */
const ProgressBar = ({ step, total }: { step: number; total: number }) => (
  <div className="w-full h-1 rounded-full bg-white/[0.06] overflow-hidden">
    <div
      className="h-full rounded-full transition-all duration-500"
      style={{
        width: `${((step + 1) / total) * 100}%`,
        background: "linear-gradient(90deg, #b3f000, #00f0ff)",
        boxShadow: "0 0 8px rgba(179,240,0,0.5)",
      }}
    />
  </div>
);

/* ══ GENDER ICONS (SVG only) ══ */
const ManSVG = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="10" r="5" stroke="#94A3B8" strokeWidth="1.8" />
    <path
      d="M6 26c0-4.418 3.582-8 8-8s8 3.582 8 8"
      stroke="#94A3B8"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);
const WomanSVG = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="9" r="5" stroke="#94A3B8" strokeWidth="1.8" />
    <path
      d="M14 14v8M10 18h8"
      stroke="#94A3B8"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M8 26c0-3.314 2.686-6 6-6s6 2.686 6 6"
      stroke="#94A3B8"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);
const NonBinarySVG = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="11" r="5" stroke="#94A3B8" strokeWidth="1.8" />
    <path
      d="M14 16v6"
      stroke="#94A3B8"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M10 19l4-3 4 3"
      stroke="#94A3B8"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const interests = [
  "Deep conversations",
  "Mindfulness",
  "Travel",
  "Music",
  "Art & Design",
  "Books",
  "Fitness",
  "Philosophy",
  "Gaming",
  "Cooking",
  "Film",
  "Psychology",
  "Nature",
  "Tech",
  "Spirituality",
  "Writing",
  "Dancing",
  "Yoga",
];

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function RegisterPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  /* Step 1 */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);

  /* Step 2 */
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [location, setLocation] = useState("");

  /* Step 3 */
  const [selected, setSelected] = useState<string[]>([]);

  const TOTAL_STEPS = 3;

  const toggleInterest = (tag: string) =>
    setSelected((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );

  const next = () => {
    if (step < TOTAL_STEPS - 1) setStep((s) => s + 1);
    else {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setDone(true);
      }, 2000);
    }
  };
  const back = () => setStep((s) => s - 1);

  const stepTitles = [
    {
      title: "Create your account",
      sub: "Start your journey to real connection",
    },
    { title: "Tell us about yourself", sub: "Help us understand who you are" },
    { title: "Your interests", sub: "Select at least 3 things you love" },
  ];

  /* ── Done screen ── */
  if (done)
    return (
      <>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@400;500;600;700&display=swap');
        @keyframes pop { 0%{transform:scale(0.6);opacity:0} 70%{transform:scale(1.12)} 100%{transform:scale(1);opacity:1} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .pop { animation: pop 0.5s ease both; }
        .fu1 { animation: fadeUp 0.5s ease 0.3s both; }
        .fu2 { animation: fadeUp 0.5s ease 0.5s both; }
        .fu3 { animation: fadeUp 0.5s ease 0.7s both; }
      `}</style>
        <div
          className="min-h-screen flex items-center justify-center px-5"
          style={{
            background:
              "radial-gradient(ellipse at 25% 40%, #1e0a42 0%, #0F172A 50%, #06101e 100%)",
            fontFamily: "'Outfit',sans-serif",
          }}
        >
          <div className="flex flex-col items-center text-center gap-5 max-w-sm">
            <div className="pop w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br from-[#b3f000] to-[#00f0ff] shadow-[0_0_40px_rgba(179,240,0,0.5)]">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <path
                  d="M8 18L15 25L28 11"
                  stroke="#0d0e14"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2
              className="fu1 text-white font-extrabold text-[32px] tracking-tight leading-tight"
              style={{ fontFamily: "'Syne',sans-serif" }}
            >
              You&apos;re all set!
            </h2>
            <p className="fu2 text-slate-400 text-sm leading-relaxed">
              Your Soul&apos;s OS is being calibrated. We&apos;re finding your
              99.9% match right now.
            </p>
            <button
              className="fu3 w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl font-bold text-sm tracking-[0.06em] text-[#0d0e14] bg-gradient-to-r from-[#b3f000] to-[#00f0ff] shadow-[0_0_22px_rgba(179,240,0,0.4)] hover:scale-[1.03] transition-all duration-200 border-0 cursor-pointer"
              style={{ fontFamily: "'Outfit',sans-serif" }}
            >
              START MY PERSONALITY SCAN <ArrowRight />
            </button>
          </div>
        </div>
      </>
    );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@400;500;600;700&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
        .anim-1 { animation: fadeUp 0.55s ease 0.05s both; }
        .anim-2 { animation: fadeUp 0.55s ease 0.15s both; }
        .anim-3 { animation: fadeUp 0.55s ease 0.25s both; }
        .anim-4 { animation: fadeUp 0.55s ease 0.35s both; }
        .anim-5 { animation: fadeUp 0.55s ease 0.45s both; }
        .anim-6 { animation: fadeUp 0.55s ease 0.55s both; }
        .blob-float { animation: float 8s ease-in-out infinite; }
        .blob-float2 { animation: float 11s ease-in-out infinite 2s; }
      `}</style>

      <div
        className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden px-5 py-12"
        style={{
          background:
            "radial-gradient(ellipse at 25% 40%, #1e0a42 0%, #0F172A 50%, #06101e 100%)",
          fontFamily: "'Outfit',sans-serif",
        }}
      >
        {/* BG blobs */}
        <div
          className="blob-float pointer-events-none absolute top-[-100px] left-[-80px] w-[450px] h-[450px] rounded-full opacity-25"
          style={{
            background:
              "radial-gradient(circle, rgba(168,85,247,0.55) 0%, transparent 70%)",
          }}
        />
        <div
          className="blob-float2 pointer-events-none absolute bottom-[-80px] right-[-60px] w-[380px] h-[380px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(6,182,212,0.5) 0%, transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Logo */}
        <div className="anim-1 mb-8 z-10">
          <Logo />
        </div>

        {/* Card */}
        <div
          className="relative z-10 w-full max-w-md rounded-[28px] border border-white/[0.09] px-8 py-8 md:px-10 backdrop-blur-2xl"
          style={{ background: "rgba(18,22,40,0.78)" }}
        >
          {/* Top glow line */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[28px]"
            style={{
              background:
                "linear-gradient(90deg,transparent,rgba(179,240,0,0.35),transparent)",
            }}
          />

          {/* Progress bar */}
          <div className="anim-2 mb-6">
            <ProgressBar step={step} total={TOTAL_STEPS} />
          </div>

          {/* Step dots + counter */}
          <div className="anim-2 flex items-center justify-between mb-6">
            <StepDots total={TOTAL_STEPS} current={step} />
            <span
              className="text-slate-600 text-xs font-medium"
              style={{ fontFamily: "'Outfit',sans-serif" }}
            >
              Step {step + 1} of {TOTAL_STEPS}
            </span>
          </div>

          {/* Heading */}
          <div className="anim-3 mb-7">
            <h1
              className="text-white font-extrabold text-[26px] tracking-tight leading-tight mb-1"
              style={{ fontFamily: "'Syne',sans-serif" }}
            >
              {stepTitles[step].title}
            </h1>
            <p className="text-slate-500 text-sm">{stepTitles[step].sub}</p>
          </div>

          {/* ── STEP 1: Account ── */}
          {step === 0 && (
            <div className="flex flex-col gap-4">
              <div className="anim-4">
                <Input
                  label="Full Name"
                  placeholder="Your full name"
                  value={name}
                  onChange={setName}
                />
              </div>
              <div className="anim-5">
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={setEmail}
                />
              </div>
              <div className="anim-5">
                <Input
                  label="Password"
                  type={showPass ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={setPassword}
                  hint="Use letters, numbers & symbols"
                  rightSlot={
                    <button
                      onClick={() => setShowPass(!showPass)}
                      className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer bg-transparent border-0"
                    >
                      {showPass ? <EyeClosed /> : <EyeOpen />}
                    </button>
                  }
                />
              </div>
              <div className="anim-6">
                <Input
                  label="Confirm Password"
                  type={showConf ? "text" : "password"}
                  placeholder="Repeat your password"
                  value={confirm}
                  onChange={setConfirm}
                  error={
                    confirm && confirm !== password
                      ? "Passwords don't match"
                      : ""
                  }
                  rightSlot={
                    <button
                      onClick={() => setShowConf(!showConf)}
                      className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer bg-transparent border-0"
                    >
                      {showConf ? <EyeClosed /> : <EyeOpen />}
                    </button>
                  }
                />
              </div>
            </div>
          )}

          {/* ── STEP 2: Profile ── */}
          {step === 1 && (
            <div className="flex flex-col gap-5">
              {/* Gender */}
              <div className="anim-3">
                <p className="text-slate-400 text-[11px] font-semibold tracking-[0.12em] uppercase mb-3">
                  I identify as
                </p>
                <div className="flex gap-3">
                  {[
                    { id: "male", label: "Male", icon: <ManSVG /> },
                    { id: "female", label: "Female", icon: <WomanSVG /> },
                    {
                      id: "nonbinary",
                      label: "Non-binary",
                      icon: <NonBinarySVG />,
                    },
                  ].map((g) => (
                    <GenderOption
                      key={g.id}
                      label={g.label}
                      icon={g.icon}
                      selected={gender === g.id}
                      onSelect={() => setGender(g.id)}
                    />
                  ))}
                </div>
              </div>

              <div className="anim-4">
                <Input
                  label="Date of Birth"
                  type="date"
                  placeholder="YYYY-MM-DD"
                  value={dob}
                  onChange={setDob}
                />
              </div>

              <div className="anim-5">
                <Input
                  label="Location"
                  placeholder="City, Country"
                  value={location}
                  onChange={setLocation}
                  hint="Used to find nearby matches"
                />
              </div>
            </div>
          )}

          {/* ── STEP 3: Interests ── */}
          {step === 2 && (
            <div className="anim-3 flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                {interests.map((tag) => (
                  <InterestTag
                    key={tag}
                    label={tag}
                    selected={selected.includes(tag)}
                    onToggle={() => toggleInterest(tag)}
                  />
                ))}
              </div>
              {selected.length > 0 && (
                <p className="text-slate-600 text-xs">
                  {selected.length} selected
                  {selected.length < 3
                    ? ` · pick ${3 - selected.length} more`
                    : " · looking good!"}
                </p>
              )}
            </div>
          )}

          {/* ── NAV BUTTONS ── */}
          <div
            className={`mt-8 flex gap-3 ${step > 0 ? "flex-row" : "flex-col"}`}
          >
            {step > 0 && (
              <button
                onClick={back}
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-semibold text-sm text-slate-400 bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.09] hover:text-white active:scale-[0.97] transition-all duration-200 cursor-pointer"
                style={{ fontFamily: "'Outfit',sans-serif" }}
              >
                <ArrowLeft /> Back
              </button>
            )}

            <button
              onClick={next}
              disabled={loading || (step === 2 && selected.length < 3)}
              className="flex-1 flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl font-bold text-sm tracking-[0.06em] text-[#0d0e14] bg-gradient-to-r from-[#b3f000] to-[#00f0ff] shadow-[0_0_22px_rgba(179,240,0,0.35)] hover:scale-[1.02] hover:shadow-[0_0_32px_rgba(179,240,0,0.5)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 transition-all duration-200 cursor-pointer border-0"
              style={{ fontFamily: "'Outfit',sans-serif" }}
            >
              {loading ? (
                <>
                  <SpinnerIcon /> Creating account...
                </>
              ) : step === TOTAL_STEPS - 1 ? (
                <>
                  <CheckIcon /> CREATE MY ACCOUNT
                </>
              ) : (
                <>
                  CONTINUE <ArrowRight />
                </>
              )}
            </button>
          </div>

          {/* Sign in link */}
          {step === 0 && (
            <p className="anim-6 text-center text-slate-500 text-sm mt-6">
              Already have an account?{" "}
              <Link href={"/login"}>
                <button
                  className="text-[#b3f000] font-semibold hover:text-[#00f0ff] transition-colors duration-150 cursor-pointer bg-transparent border-0"
                  style={{ fontFamily: "'Outfit',sans-serif" }}
                >
                  Login
                </button>
              </Link>
            </p>
          )}

          {/* Bottom glow */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px rounded-b-[28px]"
            style={{
              background:
                "linear-gradient(90deg,transparent,rgba(6,182,212,0.2),transparent)",
            }}
          />
        </div>

        <p className="mt-6 z-10 text-slate-700 text-xs">
          © 2026 ShadiMate · Privacy Policy · Terms
        </p>
      </div>
    </>
  );
}
