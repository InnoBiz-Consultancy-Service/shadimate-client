"use client";

import { RotateCcw } from "lucide-react";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
          <span className="text-red-400 text-2xl font-bold">!</span>
        </div>
        <h2 className="font-syne text-white text-xl font-extrabold mb-2">
          Something went wrong
        </h2>
        <p className="font-outfit text-slate-400 text-sm mb-6">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="font-outfit inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-on-brand bg-linear-to-r from-brand to-accent cursor-pointer border-0 hover:scale-[1.02] transition-all duration-200"
        >
          <RotateCcw size={14} />
          Try Again
        </button>
      </div>
    </div>
  );
}
