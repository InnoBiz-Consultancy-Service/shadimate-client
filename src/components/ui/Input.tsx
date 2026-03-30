"use client";

import { useState } from "react";

interface InputProps {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  defaultValue?: string;
  value?: string;
  onChange?: (v: string) => void;
  hint?: string;
  rightSlot?: React.ReactNode;
  error?: string;
  autoComplete?: string;
}

export default function Input({
  label,
  name,
  type = "text",
  placeholder,
  defaultValue,
  value,
  onChange,
  hint,
  rightSlot,
  error,
  autoComplete,
}: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={name}
        className="font-outfit text-slate-400 text-[11px] font-semibold tracking-[0.12em] uppercase"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          defaultValue={defaultValue}
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`font-outfit w-full px-4 py-3.5 rounded-2xl text-sm text-slate-100 placeholder-slate-600 border transition-all duration-200 outline-none ${rightSlot ? "pr-12" : ""} ${error ? "animate-[shake_0.4s_ease]" : ""}`}
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
        {rightSlot && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {rightSlot}
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-400 text-xs mt-0.5 animate-[fadeIn_0.2s_ease]">
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-slate-600 text-xs mt-0.5">{hint}</p>
      )}
    </div>
  );
}
