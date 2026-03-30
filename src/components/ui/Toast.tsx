"use client";

import { useEffect } from "react";
import { Check, XCircle } from "lucide-react";

interface ToastProps {
  message: string;
  type: "success" | "error";
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

  return (
    <div
      className={`
        fixed top-6 right-6 left-6 md:left-auto z-50 px-5 py-3.5 rounded-2xl
        backdrop-blur-xl border text-sm font-medium
        animate-[fadeUp_0.3s_ease]
        ${
          type === "success"
            ? "bg-brand/10 border-brand/30 text-brand"
            : "bg-red-500/10 border-red-500/30 text-red-400"
        }
      `}
    >
      <div className="flex items-center gap-2.5">
        {type === "success" ? <Check size={16} /> : <XCircle size={16} />}
        {message}
      </div>
    </div>
  );
}
