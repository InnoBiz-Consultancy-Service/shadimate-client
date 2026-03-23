"use client";

import {
  Question,
  SubmitAnswer,
  submitAnswers,
  patchUserInfo,
  fetchResult,
  TestResult,
} from "@/actions/public/personality-test/personality-test";
import { useState, useEffect, useCallback } from "react";

/* ══ ICONS ══ */
const SpinnerIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    className="animate-spin"
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
  >
    <circle
      cx="8"
      cy="8"
      r="6"
      stroke="rgb(from var(--on-brand) r g b / 0.3)"
      strokeWidth="2"
    />
    <path
      d="M8 2a6 6 0 016 6"
      stroke="var(--on-brand)"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const HeartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
      fill="var(--brand)"
      opacity="0.9"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const LockIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
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

/* ══ LOGO ══ */
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

/* ══ TOAST ══ */
const Toast = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-6 right-6 left-6 md:left-auto z-50 px-5 py-3.5 rounded-2xl backdrop-blur-xl border text-sm font-medium animate-[fadeUp_0.3s_ease] ${
        type === "success"
          ? "bg-brand/10 border-brand/30 text-brand"
          : "bg-red-500/10 border-red-500/30 text-red-400"
      }`}
    >
      <div className="flex items-center gap-2.5">
        {type === "success" ? (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        )}
        {message}
      </div>
    </div>
  );
};

/* ══ GENDER ICONS ══ */
const ManSVG = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
    <circle
      cx="14"
      cy="10"
      r="5"
      stroke={active ? "var(--brand)" : "#94A3B8"}
      strokeWidth="1.8"
    />
    <path
      d="M6 26c0-4.418 3.582-8 8-8s8 3.582 8 8"
      stroke={active ? "var(--brand)" : "#94A3B8"}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const WomanSVG = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
    <circle
      cx="14"
      cy="9"
      r="5"
      stroke={active ? "var(--brand)" : "#94A3B8"}
      strokeWidth="1.8"
    />
    <path
      d="M14 14v8M10 18h8"
      stroke={active ? "var(--brand)" : "#94A3B8"}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M8 26c0-3.314 2.686-6 6-6s6 2.686 6 6"
      stroke={active ? "var(--brand)" : "#94A3B8"}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

/* ══ INPUT ══ */
const Input = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={name}
        className="font-outfit text-slate-400 text-[11px] font-semibold tracking-[0.12em] uppercase"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="font-outfit w-full px-4 py-3.5 rounded-2xl text-sm text-slate-100 placeholder-slate-600 border transition-all duration-200 outline-none"
        style={{
          borderColor: error
            ? "rgba(248,113,113,0.6)"
            : focused
              ? "rgb(from var(--brand) r g b / 0.5)"
              : "rgba(255,255,255,0.1)",
          boxShadow: error
            ? "0 0 0 3px rgba(248,113,113,0.08)"
            : focused
              ? "0 0 0 3px rgb(from var(--brand) r g b / 0.08)"
              : "none",
          background: error
            ? "rgba(248,113,113,0.04)"
            : focused
              ? "rgb(from var(--brand) r g b / 0.04)"
              : "rgba(255,255,255,0.05)",
        }}
      />
      {error && (
        <p className="text-red-400 text-xs mt-0.5 animate-[fadeIn_0.2s_ease]">
          {error}
        </p>
      )}
    </div>
  );
};

/* ══ PROGRESS BAR ══ */
const ProgressBar = ({
  current,
  total,
}: {
  current: number;
  total: number;
}) => {
  const pct = total > 0 ? (current / total) * 100 : 0;
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="font-outfit text-slate-500 text-xs font-medium">
          Question {Math.min(current + 1, total)} of {total}
        </span>
        <span className="font-outfit text-brand text-xs font-bold">
          {Math.round(pct)}%
        </span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full bg-linear-to-r from-brand to-accent transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

/* ══ STEP TYPES ══ */
type Step =
  | "questions"
  | "submitting"
  | "blurred-result"
  | "info-form"
  | "result";

/* ══════════════════════════════════════════════════════════ */
/* ══ MAIN COMPONENT ══ */
/* ══════════════════════════════════════════════════════════ */
export default function PersonalityTest({
  questions,
  fetchError,
}: {
  questions: Question[];
  fetchError?: string;
}) {
  const [step, setStep] = useState<Step>("questions");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [testId, setTestId] = useState<string>("");
  const [result, setResult] = useState<TestResult | null>(null);

  /* Info form state */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isPatchLoading, setIsPatchLoading] = useState(false);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const hideToast = useCallback(() => setToast(null), []);

  const sorted = [...questions].sort((a, b) => a.order - b.order);
  const currentQuestion = sorted[currentQ];
  const totalQuestions = sorted.length;
  const allAnswered = Object.keys(answers).length === totalQuestions;

  /* ── Select an option ── */
  const handleSelect = (questionId: string, score: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: score }));

    // Auto-advance after short delay
    setTimeout(() => {
      if (currentQ < totalQuestions - 1) {
        setCurrentQ((prev) => prev + 1);
      }
    }, 350);
  };

  /* ── Submit answers ── */
  const handleSubmit = async () => {
    setStep("submitting");
    const payload: SubmitAnswer[] = Object.entries(answers).map(
      ([questionId, score]) => ({ questionId, score }),
    );

    const res = await submitAnswers(payload);
    if (!res.success || !res.testId) {
      setToast({ message: res.message || "Submission failed.", type: "error" });
      setStep("questions");
      return;
    }

    setTestId(res.testId);
    setStep("blurred-result");
  };

  /* ── Patch info & show result ── */
  const handleInfoSubmit = async () => {
    const errors: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2)
      errors.name = "Full name is required (min. 2 characters).";
    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Please enter a valid email address.";
    }
    if (!gender) errors.gender = "Please select a gender.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsPatchLoading(true);

    const patchRes = await patchUserInfo(testId, {
      name: name.trim(),
      email: email.trim(),
      gender,
    });

    if (!patchRes.success) {
      setToast({ message: patchRes.message, type: "error" });
      setIsPatchLoading(false);
      return;
    }

    // Fetch full result
    const resultRes = await fetchResult(testId);
    if (!resultRes.success || !resultRes.data) {
      setToast({
        message: resultRes.message || "Failed to load result.",
        type: "error",
      });
      setIsPatchLoading(false);
      return;
    }

    setResult(resultRes.data);
    setIsPatchLoading(false);
    setStep("result");
  };

  /* ── Error state ── */
  if (fetchError) {
    return (
      <div className="font-outfit min-h-screen flex items-center justify-center px-5">
        <div className="text-center">
          <p className="text-red-400 text-sm mb-4">{fetchError}</p>
          <button
            onClick={() => window.location.reload()}
            className="font-outfit px-6 py-3 rounded-2xl text-sm font-bold text-on-brand bg-linear-to-r from-brand to-accent cursor-pointer border-0"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="font-outfit min-h-screen flex items-center justify-center px-5">
        <div className="flex items-center gap-3 text-slate-400">
          <SpinnerIcon size={20} />
          <span className="text-sm">Loading questions...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      <div className="font-outfit relative min-h-screen w-full flex flex-col items-center justify-center px-5 py-14 bg-transparent">
        <div className="noise-layer absolute inset-0 opacity-[0.03] pointer-events-none" />

        {/* Logo */}
        <div className="animate-[fadeUp_0.55s_ease_0.05s_both] mb-6 z-10">
          <Logo />
        </div>

        {/* ═══ STEP: QUESTIONS ═══ */}
        {(step === "questions" || step === "submitting") && (
          <div className="relative z-10 w-full max-w-md animate-[fadeUp_0.55s_ease_0.1s_both]">
            {/* Progress */}
            <div className="mb-6">
              <ProgressBar
                current={Object.keys(answers).length}
                total={totalQuestions}
              />
            </div>

            {/* Question Card */}
            <div className="relative rounded-[28px] glass-card px-6 py-8 md:px-8">
              <div className="noise-layer absolute inset-0 opacity-[0.02] pointer-events-none rounded-[28px]" />
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[28px]"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgb(from var(--brand) r g b / 0.35), transparent)",
                }}
              />

              {/* Question number badge */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center">
                  <span className="text-brand text-xs font-bold">
                    {currentQ + 1}
                  </span>
                </div>
                <HeartIcon />
              </div>

              {/* Question text */}
              <h2
                key={currentQuestion._id}
                className="font-syne text-white font-extrabold text-lg md:text-xl leading-snug mb-6 animate-[fadeUp_0.35s_ease]"
              >
                {currentQuestion.text}
              </h2>

              {/* Options */}
              <div className="flex flex-col gap-3">
                {currentQuestion.options.map((opt) => {
                  const isSelected = answers[currentQuestion._id] === opt.score;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() =>
                        handleSelect(currentQuestion._id, opt.score)
                      }
                      className="font-outfit w-full flex items-center gap-3.5 px-5 py-4 rounded-2xl border cursor-pointer transition-all duration-200 text-left"
                      style={{
                        background: isSelected
                          ? "rgb(from var(--brand) r g b / 0.1)"
                          : "rgba(255,255,255,0.03)",
                        borderColor: isSelected
                          ? "rgb(from var(--brand) r g b / 0.5)"
                          : "rgba(255,255,255,0.08)",
                        boxShadow: isSelected
                          ? "0 0 16px rgb(from var(--brand) r g b / 0.15)"
                          : "none",
                      }}
                    >
                      <div
                        className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200"
                        style={{
                          borderColor: isSelected
                            ? "var(--brand)"
                            : "rgba(255,255,255,0.2)",
                          background: isSelected
                            ? "var(--brand)"
                            : "transparent",
                        }}
                      >
                        {isSelected && (
                          <span className="text-white">
                            <CheckIcon />
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-sm font-semibold ${isSelected ? "text-brand" : "text-slate-300"}`}
                      >
                        {opt.text}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-6 gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentQ((p) => Math.max(0, p - 1))}
                  disabled={currentQ === 0}
                  className="font-outfit px-5 py-3 rounded-2xl text-sm font-semibold text-slate-400 border border-white/10 bg-white/3 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all duration-200"
                >
                  Back
                </button>

                {currentQ < totalQuestions - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentQ((p) => p + 1)}
                    disabled={!answers[currentQuestion._id]}
                    className="font-outfit flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold text-on-brand bg-linear-to-r from-brand to-accent shadow-[var(--shadow-brand-md)] hover:scale-[1.02] hover:shadow-[var(--shadow-btn-hover)] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 cursor-pointer transition-all duration-200 border-0"
                  >
                    Next <ArrowRight />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!allAnswered || step === "submitting"}
                    className="font-outfit flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-on-brand bg-linear-to-r from-brand to-accent shadow-[var(--shadow-brand-md)] hover:scale-[1.02] hover:shadow-[var(--shadow-btn-hover)] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 cursor-pointer transition-all duration-200 border-0"
                  >
                    {step === "submitting" ? (
                      <>
                        <SpinnerIcon /> Submitting...
                      </>
                    ) : (
                      <>
                        See Results <HeartIcon />
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Question dots */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 mt-6">
                {sorted.map((q, i) => (
                  <button
                    key={q._id}
                    type="button"
                    onClick={() => setCurrentQ(i)}
                    className="w-2.5 h-2.5 rounded-full cursor-pointer border-0 transition-all duration-200"
                    style={{
                      background:
                        i === currentQ
                          ? "var(--brand)"
                          : answers[q._id]
                            ? "rgb(from var(--brand) r g b / 0.4)"
                            : "rgba(255,255,255,0.1)",
                      boxShadow:
                        i === currentQ
                          ? "0 0 8px rgb(from var(--brand) r g b / 0.6)"
                          : "none",
                      transform: i === currentQ ? "scale(1.3)" : "scale(1)",
                    }}
                    title={`Question ${i + 1}`}
                  />
                ))}
              </div>

              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-px rounded-b-[28px]"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgb(from var(--accent) r g b / 0.2), transparent)",
                }}
              />
            </div>
          </div>
        )}

        {/* ═══ STEP: BLURRED RESULT + INFO FORM ═══ */}
        {(step === "blurred-result" || step === "info-form") && (
          <div className="relative z-10 w-full max-w-md animate-[fadeUp_0.55s_ease_0.1s_both]">
            {/* Blurred preview card */}
            <div className="relative rounded-[28px] glass-card px-6 py-8 md:px-8 mb-5">
              <div className="noise-layer absolute inset-0 opacity-[0.02] pointer-events-none rounded-[28px]" />
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[28px]"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgb(from var(--brand) r g b / 0.35), transparent)",
                }}
              />

              <div className="text-center mb-5">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/10 border border-brand/20 mb-4">
                  <HeartIcon />
                  <span className="text-brand text-xs font-bold uppercase tracking-wider">
                    Test Complete!
                  </span>
                </div>
                <h2 className="font-syne text-white font-extrabold text-2xl mb-2">
                  Your Results Are Ready
                </h2>
                <p className="text-slate-500 text-sm">
                  Submit your info below to unlock your personality result
                </p>
              </div>

              {/* Blurred fake result */}
              <div className="relative rounded-2xl overflow-hidden">
                <div
                  className="p-5 space-y-3"
                  style={{ filter: "blur(8px)", userSelect: "none" }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 text-sm">
                      Compatibility Score
                    </span>
                    <span className="text-brand font-bold text-lg">87%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-white/5">
                    <div className="h-full w-[87%] rounded-full bg-linear-to-r from-brand to-accent" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 text-sm">Category</span>
                    <span className="text-accent font-semibold text-sm">
                      Romantic Idealist
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 text-sm">
                      Communication
                    </span>
                    <span className="text-brand font-semibold text-sm">
                      Strong
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 text-sm">Empathy</span>
                    <span className="text-accent font-semibold text-sm">
                      High
                    </span>
                  </div>
                </div>

                {/* Lock overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg-base/60 backdrop-blur-sm rounded-2xl">
                  <div className="w-12 h-12 rounded-full bg-brand/10 border border-brand/30 flex items-center justify-center mb-3 animate-[pulseGlow_2s_ease_infinite]">
                    <span className="text-brand">
                      <LockIcon />
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm font-semibold">
                    Enter your info to unlock
                  </p>
                </div>
              </div>

              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-px rounded-b-[28px]"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgb(from var(--accent) r g b / 0.2), transparent)",
                }}
              />
            </div>

            {/* Info Form Card */}
            <div className="relative rounded-[28px] glass-card px-6 py-8 md:px-8 animate-[fadeUp_0.55s_ease_0.2s_both]">
              <div className="noise-layer absolute inset-0 opacity-[0.02] pointer-events-none rounded-[28px]" />
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[28px]"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgb(from var(--brand) r g b / 0.35), transparent)",
                }}
              />

              <h3 className="font-syne text-white font-extrabold text-lg mb-1">
                Almost there!
              </h3>
              <p className="text-slate-500 text-sm mb-5">
                Tell us a bit about yourself to see your result
              </p>

              <div className="flex flex-col gap-4">
                <Input
                  label="Full Name"
                  name="pt-name"
                  placeholder="Your full name"
                  value={name}
                  onChange={setName}
                  error={formErrors.name}
                />

                <Input
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={setEmail}
                  error={formErrors.email}
                />

                {/* Gender */}
                <div>
                  <p
                    className={`text-[11px] font-semibold tracking-[0.12em] uppercase mb-2.5 ${
                      formErrors.gender ? "text-red-400" : "text-slate-400"
                    }`}
                  >
                    Gender
                  </p>
                  <div className="flex gap-3">
                    {(["male", "female"] as const).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => {
                          setGender(g);
                          setFormErrors((prev) => {
                            const next = { ...prev };
                            delete next.gender;
                            return next;
                          });
                        }}
                        className="font-outfit flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-2xl border cursor-pointer transition-all duration-200"
                        style={{
                          background:
                            gender === g
                              ? "rgb(from var(--brand) r g b / 0.08)"
                              : "rgba(255,255,255,0.03)",
                          borderColor: formErrors.gender
                            ? "rgba(248,113,113,0.5)"
                            : gender === g
                              ? "rgb(from var(--brand) r g b / 0.5)"
                              : "rgba(255,255,255,0.09)",
                          boxShadow:
                            gender === g
                              ? "0 0 14px rgb(from var(--brand) r g b / 0.12)"
                              : "none",
                        }}
                      >
                        {g === "male" ? (
                          <ManSVG active={gender === "male"} />
                        ) : (
                          <WomanSVG active={gender === "female"} />
                        )}
                        <span
                          className={`text-sm font-semibold capitalize ${gender === g ? "text-brand" : "text-slate-400"}`}
                        >
                          {g}
                        </span>
                      </button>
                    ))}
                  </div>
                  {formErrors.gender && (
                    <p className="text-red-400 text-xs mt-1.5 animate-[fadeIn_0.2s_ease]">
                      {formErrors.gender}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="button"
                  onClick={handleInfoSubmit}
                  disabled={isPatchLoading}
                  className="font-outfit mt-2 w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl font-bold text-sm tracking-[0.06em] text-on-brand bg-linear-to-r from-brand to-accent shadow-[var(--shadow-brand-md)] hover:scale-[1.02] hover:shadow-[var(--shadow-btn-hover)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 transition-all duration-200 cursor-pointer border-0"
                >
                  {isPatchLoading ? (
                    <>
                      <SpinnerIcon /> Unlocking...
                    </>
                  ) : (
                    <>
                      UNLOCK MY RESULTS <ArrowRight />
                    </>
                  )}
                </button>
              </div>

              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-px rounded-b-[28px]"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgb(from var(--accent) r g b / 0.2), transparent)",
                }}
              />
            </div>
          </div>
        )}

        {/* ═══ STEP: FINAL RESULT ═══ */}
        {step === "result" && result && (
          <div className="relative z-10 w-full max-w-md animate-[fadeUp_0.55s_ease_0.1s_both]">
            <div className="relative rounded-[28px] glass-card px-6 py-8 md:px-8">
              <div className="noise-layer absolute inset-0 opacity-[0.02] pointer-events-none rounded-[28px]" />
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[28px]"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgb(from var(--brand) r g b / 0.35), transparent)",
                }}
              />

              {/* Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/10 border border-brand/20 mb-4 animate-[pop_0.4s_ease_both]">
                  <HeartIcon />
                  <span className="text-brand text-xs font-bold uppercase tracking-wider">
                    Your Result
                  </span>
                </div>
                {result.name && (
                  <h2 className="font-syne text-white font-extrabold text-2xl mb-1">
                    {result.name}
                  </h2>
                )}
                <p className="text-slate-500 text-sm">
                  Here&apos;s your personality profile
                </p>
              </div>

              {/* Score */}
              {result.percentage !== undefined && (
                <div className="mb-6 animate-[fadeUp_0.55s_ease_0.15s_both]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-sm font-medium">
                      Your Score
                    </span>
                    <span className="text-brand font-bold text-xl">
                      {result.percentage}%
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-brand to-accent transition-all duration-1000 ease-out"
                      style={{ width: `${result.percentage}%` }}
                    />
                  </div>
                  {result.totalScore !== undefined &&
                    result.maxScore !== undefined && (
                      <p className="text-slate-600 text-xs mt-1.5 text-right">
                        {result.totalScore} / {result.maxScore}
                      </p>
                    )}
                </div>
              )}

              {/* Category */}
              {result.category && (
                <div className="mb-5 p-4 rounded-2xl bg-brand/5 border border-brand/15 animate-[fadeUp_0.55s_ease_0.2s_both]">
                  <p className="text-slate-400 text-xs font-semibold tracking-[0.1em] uppercase mb-1">
                    Personality Type
                  </p>
                  <p className="font-syne text-white font-extrabold text-lg">
                    {result.category}
                  </p>
                </div>
              )}

              {/* Result details - render any extra fields */}
              <div className="space-y-3 animate-[fadeUp_0.55s_ease_0.25s_both]">
                {Object.entries(result)
                  .filter(
                    ([key]) =>
                      ![
                        "_id",
                        "name",
                        "email",
                        "gender",
                        "totalScore",
                        "maxScore",
                        "percentage",
                        "category",
                        "answers",
                        "createdAt",
                        "updatedAt",
                        "__v",
                        "userId",
                      ].includes(key),
                  )
                  .map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0"
                    >
                      <span className="text-slate-400 text-sm capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                      <span className="text-slate-200 text-sm font-semibold">
                        {String(value)}
                      </span>
                    </div>
                  ))}
              </div>

              {/* Retake */}
              <div className="mt-7 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setStep("questions");
                    setCurrentQ(0);
                    setAnswers({});
                    setTestId("");
                    setResult(null);
                    setName("");
                    setEmail("");
                    setGender("");
                  }}
                  className="font-outfit px-6 py-3 rounded-2xl text-sm font-semibold text-slate-400 border border-white/10 bg-white/3 hover:bg-white/5 cursor-pointer transition-all duration-200"
                >
                  Retake Test
                </button>
              </div>

              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-px rounded-b-[28px]"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgb(from var(--accent) r g b / 0.2), transparent)",
                }}
              />
            </div>
          </div>
        )}

        <p className="mt-6 z-10 text-slate-700 text-xs">
          © 2026 ShadiMate · Privacy Policy · Terms
        </p>
      </div>
    </>
  );
}
