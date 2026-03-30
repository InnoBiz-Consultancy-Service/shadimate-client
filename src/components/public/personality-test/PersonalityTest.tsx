"use client";

import {
  Question,
  SubmitAnswer,
  submitAnswers,
  patchUserInfo,
  fetchResult,
  TestResult,
} from "@/actions/public/personality-test/personality-test";
import { useState, useCallback } from "react";
import { Heart, Check, Lock, ArrowRight, Loader2 } from "lucide-react";
import {
  Logo,
  Toast,
  GlassCard,
  Input,
  GradientButton,
  GenderSelector,
  PageShell,
} from "@/components/ui";

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

type Step =
  | "questions"
  | "submitting"
  | "blurred-result"
  | "info-form"
  | "result";

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
  const [testId, setTestId] = useState("");
  const [result, setResult] = useState<TestResult | null>(null);

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

  const handleSelect = (questionId: string, score: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: score }));
    setTimeout(() => {
      if (currentQ < totalQuestions - 1) setCurrentQ((prev) => prev + 1);
    }, 350);
  };

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

  const resetTest = () => {
    setStep("questions");
    setCurrentQ(0);
    setAnswers({});
    setTestId("");
    setResult(null);
    setName("");
    setEmail("");
    setGender("");
  };

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
          <Loader2 size={20} className="animate-spin" />
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

      <PageShell>
        <div className="animate-[fadeUp_0.55s_ease_0.05s_both] mb-6 z-10">
          <Logo />
        </div>

        {/* ═══ QUESTIONS STEP ═══ */}
        {(step === "questions" || step === "submitting") && (
          <div className="relative z-10 w-full max-w-md animate-[fadeUp_0.55s_ease_0.1s_both]">
            <div className="mb-6">
              <ProgressBar
                current={Object.keys(answers).length}
                total={totalQuestions}
              />
            </div>

            <GlassCard className="px-6 py-8 md:px-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center">
                  <span className="text-brand text-xs font-bold">
                    {currentQ + 1}
                  </span>
                </div>
                <Heart size={20} className="text-brand fill-brand opacity-90" />
              </div>

              <h2
                key={currentQuestion._id}
                className="font-syne text-white font-extrabold text-lg md:text-xl leading-snug mb-6 animate-[fadeUp_0.35s_ease]"
              >
                {currentQuestion.text}
              </h2>

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
                          <Check size={14} className="text-white" />
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
                    className="font-outfit flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold text-on-brand bg-linear-to-r from-brand to-accent shadow-(--shadow-brand-md) hover:scale-[1.02] hover:shadow-(--shadow-btn-hover) active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 cursor-pointer transition-all duration-200 border-0"
                  >
                    Next <ArrowRight size={15} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!allAnswered || step === "submitting"}
                    className="font-outfit flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-on-brand bg-linear-to-r from-brand to-accent shadow-(--shadow-brand-md) hover:scale-[1.02] hover:shadow-(--shadow-btn-hover) active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 cursor-pointer transition-all duration-200 border-0"
                  >
                    {step === "submitting" ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />{" "}
                        Submitting...
                      </>
                    ) : (
                      <>
                        See Results <Heart size={16} className="fill-current" />
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-1.5 mt-6">
                {sorted.map((q, i) => (
                  <button
                    key={q._id}
                    type="button"
                    onClick={() => setCurrentQ(i)}
                    aria-label={`Go to question ${i + 1}`}
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
                  />
                ))}
              </div>
            </GlassCard>
          </div>
        )}

        {/* ═══ BLURRED RESULT + INFO FORM ═══ */}
        {(step === "blurred-result" || step === "info-form") && (
          <div className="relative z-10 w-full max-w-md animate-[fadeUp_0.55s_ease_0.1s_both]">
            <GlassCard className="px-6 py-8 md:px-8 mb-5">
              <div className="text-center mb-5">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/10 border border-brand/20 mb-4">
                  <Heart size={16} className="text-brand fill-brand" />
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
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="p-3 rounded-xl bg-white/3 border border-white/5">
                      <p className="text-slate-500 text-[10px]">Type</p>
                      <p className="text-white text-sm font-bold">Empath</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/3 border border-white/5">
                      <p className="text-slate-500 text-[10px]">Trait</p>
                      <p className="text-white text-sm font-bold">Analytical</p>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center bg-bg-base/40 backdrop-blur-sm rounded-2xl">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <Lock size={24} />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Locked
                    </span>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="px-6 py-8 md:px-8">
              <h3 className="font-syne text-white font-bold text-lg mb-1">
                Unlock Your Result
              </h3>
              <p className="text-slate-500 text-sm mb-5">
                Fill in your details to see your full personality profile
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
                  name="pt-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={setEmail}
                  error={formErrors.email}
                />
                <GenderSelector
                  value={gender}
                  onChange={setGender}
                  error={formErrors.gender}
                />

                <GradientButton
                  fullWidth
                  loading={isPatchLoading}
                  loadingText="Unlocking..."
                  onClick={handleInfoSubmit}
                  className="mt-2"
                >
                  UNLOCK MY RESULTS <ArrowRight size={15} />
                </GradientButton>
              </div>
            </GlassCard>
          </div>
        )}

        {/* ═══ FINAL RESULT ═══ */}
        {step === "result" && result && (
          <div className="relative z-10 w-full max-w-md animate-[fadeUp_0.55s_ease_0.1s_both]">
            <GlassCard className="px-6 py-8 md:px-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/10 border border-brand/20 mb-4 animate-[pop_0.4s_ease_both]">
                  <Heart size={16} className="text-brand fill-brand" />
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

              {result.category && (
                <div className="mb-5 p-4 rounded-2xl bg-brand/5 border border-brand/15 animate-[fadeUp_0.55s_ease_0.2s_both]">
                  <p className="text-slate-400 text-xs font-semibold tracking-widest uppercase mb-1">
                    Personality Type
                  </p>
                  <p className="font-syne text-white font-extrabold text-lg">
                    {result.category}
                  </p>
                </div>
              )}

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

              <div className="mt-7 text-center">
                <button
                  type="button"
                  onClick={resetTest}
                  className="font-outfit px-6 py-3 rounded-2xl text-sm font-semibold text-slate-400 border border-white/10 bg-white/3 hover:bg-white/5 cursor-pointer transition-all duration-200"
                >
                  Retake Test
                </button>
              </div>
            </GlassCard>
          </div>
        )}
      </PageShell>
    </>
  );
}
