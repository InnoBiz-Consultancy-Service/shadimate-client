"use client";

import { useEffect } from "react";
import { Check, XCircle, AlertTriangle } from "lucide-react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "warning";
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type,
  onClose,
  duration = 4000,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const config = {
    success: {
      bg: "bg-emerald-600",
      border: "border-emerald-500",
      text: "text-white",
      icon: <Check size={20} strokeWidth={2.5} />,
    },
    error: {
      bg: "bg-red-600",
      border: "border-red-500",
      text: "text-white",
      icon: <XCircle size={20} strokeWidth={2.5} />,
    },
    warning: {
      bg: "bg-amber-500",
      border: "border-amber-400",
      text: "text-white",
      icon: <AlertTriangle size={20} strokeWidth={2.5} />,
    },
  }[type];

  return (
    /* Overlay backdrop for centering */
    <div className="fixed inset-0 z-999 flex items-start justify-center pt-6 px-4 pointer-events-none">
      <div
        className={`
          pointer-events-auto
          flex items-center gap-3
          px-5 py-4 rounded-2xl
          border shadow-2xl
          text-sm font-semibold
          max-w-sm w-full
          animate-[fadeUp_0.3s_ease]
          ${config.bg} ${config.border} ${config.text}
        `}
        style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.25)" }}
      >
        <span className="shrink-0">{config.icon}</span>
        <span className="flex-1 leading-snug">{message}</span>
        <button
          onClick={onClose}
          className="shrink-0 ml-1 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
          aria-label="Close"
        >
          <XCircle size={16} />
        </button>
      </div>
    </div>
  );
}
