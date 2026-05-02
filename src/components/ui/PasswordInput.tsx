"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Input from "./Input";

interface PasswordInputProps {
  label?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  error?: string;
  autoComplete?: string;
}

export default function PasswordInput({
  label = "Password",
  name = "password",
  placeholder = "••••••••",
  value,
  onChange,
  error,
  autoComplete = "current-password",
}: PasswordInputProps) {
  const [showPass, setShowPass] = useState(false);

  return (
    <Input
      label={label}
      name={name}
      type={showPass ? "text" : "password"}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      error={error}
      autoComplete={autoComplete}
      rightSlot={
        <button
          type="button"
          onClick={() => setShowPass(!showPass)}
          className="text-slate-400 hover:text-slate-600 transition-colors duration-150 cursor-pointer bg-transparent border-0"
        >
          {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      }
    />
  );
}
