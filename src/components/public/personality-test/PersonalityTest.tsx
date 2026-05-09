"use client";

import {
  Question,
  SubmitAnswer,
  SubmitResult,
  SuggestedProfile,
  submitAnswers,
  saveUserInfo,
} from "@/actions/public/personality-test/personality-test";
import { useState, useCallback } from "react";
import {
  Heart,
  Check,
  ArrowRight,
  Loader2,
  Users,
  RefreshCw,
  Lock,
} from "lucide-react";
import {
  Logo,
  Toast,
  Input,
  GradientButton,
  GenderSelector,
  PageShell,
} from "@/components/ui";

/* ── Progress Bar ── */
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
        <span className="font-outfit text-gray-500 text-xs font-medium">
          Question {Math.min(current + 1, total)} of {total}
        </span>
        <span className="font-outfit text-brand text-xs font-bold">
          {Math.round(pct)}%
        </span>
      </div>
      <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-linear-to-r from-brand to-accent transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

type Step = "questions" | "submitting" | "blurred-result" | "revealed";

export default function PersonalityTest({
  questions,
  fetchError,
}: {
  questions: Question[];
  fetchError?: string;
}) {
  const [step, setStep] = useState<Step>("questions");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  /* result data from POST /submit */
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestedProfile[]>([]);
  const [total, setTotal] = useState<number>(0);

  /* info form */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const hideToast = useCallback(() => setToast(null), []);

  const sorted = [...questions].sort((a, b) => a.order - b.order);
  const currentQuestion = sorted[currentQ];
  const totalQuestions = sorted.length;
  const allAnswered = Object.keys(answers).length === totalQuestions;

  /* ── Select answer ── */
  const handleSelect = (questionId: string, label: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: label }));
    setTimeout(() => {
      if (currentQ < totalQuestions - 1) setCurrentQ((prev) => prev + 1);
    }, 350);
  };

  /* ── Submit test ── */
  const handleSubmit = async () => {
    setStep("submitting");
    const payload: SubmitAnswer[] = Object.entries(answers).map(
      ([questionId, selectedOption]) => ({
        questionId,
        selectedOption: selectedOption as "agree" | "sometimes" | "disagree",
      }),
    );

    const res = await submitAnswers(payload);
    if (!res.success || !res.result) {
      setToast({
        message: res.message || "Submission failed. Please try again.",
        type: "error",
      });
      setStep("questions");
      return;
    }

    setSubmitResult(res.result);
    setSuggestions(res.suggestions ?? []);
    setTotal(res.total ?? 0);
    /* Show blurred result — data stored in state but UI is blurred */
    setStep("blurred-result");
  };

  /* ── Save info → unblur result ── */
  const handleSaveInfo = async () => {
    const errors: Record<string, string> = {};
    /* name is optional — skip validation */
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
    setIsSaving(true);

    const profileId = suggestions[0]?._id;
    if (!profileId) {
      /* No profile id — still reveal result, saving is optional */
      setIsSaving(false);
      setStep("revealed");
      return;
    }

    const res = await saveUserInfo(profileId, {
      name: name.trim(),
      email: email.trim(),
      gender,
    });

    setIsSaving(false);

    if (!res.success) {
      setToast({
        message: res.message || "Failed to save info.",
        type: "error",
      });
      /* Still reveal even if save fails */
    }

    setStep("revealed");
  };

  /* ── Reset ── */
  const resetTest = () => {
    setStep("questions");
    setCurrentQ(0);
    setAnswers({});
    setSubmitResult(null);
    setSuggestions([]);
    setTotal(0);
    setName("");
    setEmail("");
    setGender("");
    setFormErrors({});
  };

  /* ── Error / Empty states ── */
  if (fetchError) {
    return (
      <div className="font-outfit min-h-screen flex items-center justify-center px-5 bg-linear-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <p className="text-red-500 text-sm mb-4">{fetchError}</p>
          <button
            onClick={() => window.location.reload()}
            className="font-outfit px-6 py-3 rounded-xl text-sm font-bold text-white bg-linear-to-r from-brand to-accent shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer border-0"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="font-outfit min-h-screen flex items-center justify-center px-5 bg-linear-to-br from-gray-50 to-gray-100">
        <div className="flex items-center gap-3 text-gray-400">
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

        {/* ═══ QUESTIONS ═══ */}
        {(step === "questions" || step === "submitting") && (
          <div className="relative z-10 w-full max-w-md animate-[fadeUp_0.55s_ease_0.1s_both]">
            <div className="mb-6">
              <ProgressBar
                current={Object.keys(answers).length}
                total={totalQuestions}
              />
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 px-6 py-8 md:px-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center">
                  <span className="text-brand text-xs font-bold">
                    {currentQ + 1}
                  </span>
                </div>
                <Heart size={20} className="text-brand fill-brand/20" />
              </div>

              <h2
                key={currentQuestion._id}
                className="font-syne text-gray-900 font-extrabold text-lg md:text-xl leading-snug mb-6 animate-[fadeUp_0.35s_ease]"
              >
                {currentQuestion.text}
              </h2>

              <div className="flex flex-col gap-3">
                {currentQuestion.options.map((opt) => {
                  const isSelected = answers[currentQuestion._id] === opt.label;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() =>
                        handleSelect(currentQuestion._id, opt.label)
                      }
                      className="font-outfit w-full flex items-center gap-3.5 px-5 py-4 rounded-xl border-2 cursor-pointer transition-all duration-200 text-left hover:shadow-md"
                      style={{
                        borderColor: isSelected ? "var(--brand)" : "#E5E7EB",
                        boxShadow: isSelected
                          ? "0 4px 12px rgb(from var(--brand) r g b / 0.15)"
                          : "0 1px 2px rgba(0,0,0,0.05)",
                      }}
                    >
                      <div
                        className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200"
                        style={{
                          borderColor: isSelected ? "var(--brand)" : "#D1D5DB",
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
                        className={`text-sm font-semibold ${isSelected ? "text-brand" : "text-gray-700"}`}
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
                  className="font-outfit px-5 py-3 rounded-xl text-sm font-semibold text-gray-600 border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all duration-200"
                >
                  Back
                </button>

                {currentQ < totalQuestions - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentQ((p) => p + 1)}
                    disabled={!answers[currentQuestion._id]}
                    className="font-outfit flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-linear-to-r from-brand to-accent shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 cursor-pointer transition-all duration-200 border-0"
                  >
                    Next <ArrowRight size={15} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!allAnswered || step === "submitting"}
                    className="font-outfit flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-linear-to-r from-brand to-accent shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 cursor-pointer transition-all duration-200 border-0"
                  >
                    {step === "submitting" ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />{" "}
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Heart size={16} className="fill-current" /> See Results
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Dot navigation */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                {sorted.map((q, i) => (
                  <button
                    key={q._id}
                    type="button"
                    onClick={() => setCurrentQ(i)}
                    aria-label={`Go to question ${i + 1}`}
                    className="w-2 h-2 rounded-full cursor-pointer border-0 transition-all duration-200"
                    style={{
                      background:
                        i === currentQ
                          ? "var(--brand)"
                          : answers[q._id]
                            ? "rgb(from var(--brand) r g b / 0.4)"
                            : "#E5E7EB",
                      transform: i === currentQ ? "scale(1.3)" : "scale(1)",
                      boxShadow:
                        i === currentQ
                          ? "0 0 8px rgb(from var(--brand) r g b / 0.6)"
                          : "none",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ BLURRED RESULT + INFO FORM ═══ */}
        {step === "blurred-result" && submitResult && (
          <div className="relative z-10 w-full max-w-6xl animate-[fadeUp_0.55s_ease_0.1s_both]">
            {/* Mobile = stacked | Desktop = side by side */}
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
              {/* Left Card - Form */}
              <div className="flex-1 bg-white rounded-2xl shadow-xl border border-gray-100 px-6 py-8 md:px-8">
                <h3 className="font-syne text-gray-900 font-bold text-lg mb-1">
                  Unlock Your Result
                </h3>

                <p className="text-gray-500 text-sm mb-5">
                  Fill in your details to see your full personality profile
                </p>

                <div className="flex flex-col gap-4">
                  <Input
                    label="Full Name"
                    name="pt-name"
                    placeholder="Your full name (optional)"
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
                    loading={isSaving}
                    loadingText="Unlocking..."
                    onClick={handleSaveInfo}
                    className="mt-2"
                  >
                    UNLOCK MY RESULTS <ArrowRight size={15} />
                  </GradientButton>
                </div>
              </div>

              {/* Right Card - Blurred Result */}
              <div className="flex-1 bg-white rounded-2xl shadow-xl border border-gray-100 px-6 py-8 md:px-8">
                <div className="text-center mb-5">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/10 border border-brand/20 mb-4">
                    <Heart size={16} className="text-brand fill-brand/20" />

                    <span className="text-brand text-xs font-bold uppercase tracking-wider">
                      Test Complete!
                    </span>
                  </div>

                  <h2 className="font-syne text-gray-900 font-extrabold text-2xl mb-2">
                    Your Results Are Ready
                  </h2>

                  <p className="text-gray-500 text-sm">
                    Submit your info below to unlock your personality result
                  </p>
                </div>

                {/* Blurred content */}
                <div className="relative rounded-xl overflow-hidden">
                  <div
                    className="p-5 space-y-3 bg-gray-50 select-none pointer-events-none"
                    style={{ filter: "blur(7px)" }}
                    aria-hidden="true"
                  >
                    {/* Fake type row */}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-xs font-semibold uppercase tracking-widest">
                        Personality Type
                      </span>
                    </div>

                    <div className="h-7 w-48 rounded-lg bg-brand/20" />

                    {/* Fake message lines */}
                    <div className="space-y-2 pt-1">
                      <div className="h-3 w-full rounded bg-gray-200" />
                      <div className="h-3 w-5/6 rounded bg-gray-200" />
                      <div className="h-3 w-4/6 rounded bg-gray-200" />
                    </div>

                    {/* Fake match count */}
                    <div className="flex items-center gap-2 py-3 px-4 rounded-xl bg-brand/10 border border-brand/15 mt-2">
                      <div className="h-4 w-4 rounded-full bg-brand/40" />
                      <div className="h-3 w-40 rounded bg-brand/30" />
                    </div>

                    {/* Fake profiles */}
                    <div className="space-y-2 pt-1">
                      {[1, 2, 3].map((n) => (
                        <div
                          key={n}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-gray-100"
                        >
                          <div className="w-8 h-8 rounded-full bg-brand/20" />

                          <div className="space-y-1.5 flex-1">
                            <div className="h-3 w-24 rounded bg-gray-200" />
                            <div className="h-2.5 w-16 rounded bg-gray-100" />
                          </div>

                          <div className="h-5 w-20 rounded-full bg-brand/15" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Lock overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px] rounded-xl">
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                      <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center">
                        <Lock size={18} className="text-gray-400" />
                      </div>

                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Locked
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ REVEALED RESULT ═══ */}
        {step === "revealed" && submitResult && (
          <div className="relative z-10 w-full max-w-md animate-[fadeUp_0.55s_ease_0.1s_both] space-y-4">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 px-6 py-8 md:px-8">
              <div className="text-center mb-5">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/10 border border-brand/20 mb-4 animate-[pop_0.4s_ease_both]">
                  <Heart size={16} className="text-brand fill-brand/20" />
                  <span className="text-brand text-xs font-bold uppercase tracking-wider">
                    Your Result
                  </span>
                </div>
                <h2 className="font-syne text-gray-900 font-extrabold text-2xl mb-3">
                  {submitResult.type}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {submitResult.message}
                </p>
              </div>

              {/* Match count */}
              {total > 0 && (
                <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand/5 border border-brand/15 mb-5">
                  <Users size={16} className="text-brand" />
                  <span className="text-brand text-sm font-semibold">
                    {total} people match your personality
                  </span>
                </div>
              )}

              {/* Suggested profiles */}
              {suggestions.length > 0 && (
                <div>
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-3">
                    💘 Suggested Profiles
                  </p>
                  <div className="space-y-2">
                    {suggestions.slice(0, 5).map((s) => (
                      <div
                        key={s._id}
                        className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 border border-gray-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center">
                            <span className="text-brand text-xs font-bold">
                              {s.userId?.name?.charAt(0)?.toUpperCase() ?? "?"}
                            </span>
                          </div>
                          <div>
                            <p className="text-gray-800 text-sm font-semibold">
                              {s.userId?.name ?? "Unknown"}
                            </p>
                            <p className="text-gray-400 text-xs capitalize">
                              {s.userId?.gender ?? ""}
                            </p>
                          </div>
                        </div>
                        <span className="text-brand text-xs font-bold bg-brand/10 px-2 py-1 rounded-full">
                          {s.personality}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={resetTest}
                  className="font-outfit inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-gray-500 border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer transition-all duration-200"
                >
                  <RefreshCw size={14} /> Retake Test
                </button>
              </div>
            </div>
          </div>
        )}
      </PageShell>
    </>
  );
}
