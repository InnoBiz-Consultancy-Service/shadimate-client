"use client";

import { useState } from "react";
import { dt } from "@/lib/design-tokens";

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
      <label htmlFor={name} className={`font-outfit text-white ${dt.inputLabel}`}>
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
          className={`font-outfit w-full px-4 py-3.5 ${dt.inputBase} text-sm placeholder:text-text-muted transition-all duration-200 outline-none ${rightSlot ? "pr-12" : ""} ${error ? "animate-[shake_0.4s_ease]" : ""}`}
          style={{
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: error
              ? "rgba(239,68,68,0.5)"
              : focused
                ? "rgb(from var(--color-brand) r g b / 0.5)"
                : "var(--color-border)",
            boxShadow: error
              ? "0 0 0 3px rgba(239,68,68,0.06)"
              : focused
                ? "0 0 0 3px rgb(from var(--color-brand) r g b / 0.06)"
                : "none",
          }}
        />
        {rightSlot && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">{rightSlot}</div>
        )}
      </div>
      {error && (
        <p className={`${dt.inputError} text-xs mt-0.5 animate-[fadeIn_0.2s_ease]`}>{error}</p>
      )}
      {hint && !error && (
        <p className={`${dt.inputHint} text-xs mt-0.5`}>{hint}</p>
      )}
    </div>
  );
}
