"use client";

import { useState, useTransition } from "react";
import { Flag, X, ChevronDown, Loader2, AlertTriangle } from "lucide-react";
import { submitReport } from "@/actions/report-block-ignore";
import type { ReportReason } from "@/actions/report-block-ignore";

// ─── Reason config ─────────────────────────────────────────────────────────────

const REASONS: { value: ReportReason; label: string; icon: string }[] = [
  { value: "harassment", label: "Harassment", icon: "😠" },
  { value: "fake_profile", label: "Fake Profile", icon: "🎭" },
  {
    value: "inappropriate_content",
    label: "Inappropriate Content",
    icon: "⚠️",
  },
  { value: "spam", label: "Spam", icon: "📢" },
  { value: "hate_speech", label: "Hate Speech", icon: "🚫" },
  { value: "scam", label: "Scam", icon: "💸" },
  { value: "other", label: "Other", icon: "📝" },
];

interface ReportModalProps {
  targetUserId: string;
  targetName: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ReportModal({
  targetUserId,
  targetName,
  onClose,
  onSuccess,
}: ReportModalProps) {
  const [reason, setReason] = useState<ReportReason | "">("");
  const [details, setDetails] = useState("");
  const [showDrop, setShowDrop] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [isPending, startTrans] = useTransition();

  const selectedReason = REASONS.find((r) => r.value === reason);

  function handleSubmit() {
    if (!reason) {
      setError("Please select a reason.");
      return;
    }
    setError("");
    startTrans(async () => {
      const res = await submitReport(targetUserId, reason, details.trim());
      if (res.success) {
        setDone(true);
        onSuccess?.();
      } else {
        // 409 = already reported
        if (
          res.message?.includes("409") ||
          res.message?.toLowerCase().includes("already")
        ) {
          setError("You've already reported this user.");
        } else {
          setError(res.message || "Something went wrong. Try again.");
        }
      }
    });
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
              <Flag size={15} className="text-red-500" />
            </div>
            <div>
              <p className="font-syne font-bold text-gray-900 text-base leading-tight">
                Report User
              </p>
              <p className="text-gray-400 text-[11px] font-outfit">
                {targetName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center active:bg-gray-200 transition-colors"
          >
            <X size={14} className="text-gray-500" />
          </button>
        </div>

        {done ? (
          /* ── Success state ── */
          <div className="px-5 pb-7 pt-4 text-center">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">✅</span>
            </div>
            <p className="font-syne font-bold text-gray-900 text-base mb-1">
              Report Submitted
            </p>
            <p className="text-gray-400 text-sm font-outfit">
              Our team will review this report. Thank you for helping keep the
              community safe.
            </p>
            <button
              onClick={onClose}
              className="mt-5 w-full py-3 rounded-2xl bg-gray-100 text-gray-700 font-semibold text-sm active:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          /* ── Form ── */
          <div className="px-5 pb-6 space-y-4">
            {/* Reason Dropdown */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
                Reason
              </label>
              <button
                type="button"
                onClick={() => setShowDrop((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-left transition-colors active:bg-gray-100"
              >
                <span
                  className={`text-sm font-outfit ${selectedReason ? "text-gray-900" : "text-gray-400"}`}
                >
                  {selectedReason
                    ? `${selectedReason.icon} ${selectedReason.label}`
                    : "Select a reason..."}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-gray-400 transition-transform duration-200 ${showDrop ? "rotate-180" : ""}`}
                />
              </button>

              {showDrop && (
                <div className="mt-1.5 rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden">
                  {REASONS.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => {
                        setReason(r.value);
                        setShowDrop(false);
                        setError("");
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-outfit text-left transition-colors
                        ${
                          reason === r.value
                            ? "bg-brand/8 text-brand font-semibold"
                            : "text-gray-700 active:bg-gray-50"
                        }`}
                    >
                      <span>{r.icon}</span>
                      <span>{r.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
                Details{" "}
                <span className="text-gray-300 normal-case tracking-normal font-normal">
                  (optional)
                </span>
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                maxLength={500}
                placeholder="Describe what happened..."
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/10 resize-none transition-all font-outfit"
              />
              <p className="text-right text-[10px] text-gray-300 mt-0.5">
                {details.length}/500
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-red-50 border border-red-100">
                <AlertTriangle size={14} className="text-red-400 shrink-0" />
                <p className="text-red-500 text-xs font-outfit">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending || !reason}
              className="w-full py-3.5 rounded-2xl bg-linear-to-r from-red-500 to-rose-500 text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  <Flag size={15} /> Submit Report
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
