import { Loader2 } from "lucide-react";

interface GradientButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  onClick?: () => void;
  className?: string;
  fullWidth?: boolean;
}

export default function GradientButton({
  children,
  type = "button",
  disabled = false,
  loading = false,
  loadingText,
  onClick,
  className = "",
  fullWidth = false,
}: GradientButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        font-outfit flex items-center justify-center gap-2.5
        px-6 py-4 rounded-2xl
        font-bold text-sm tracking-[0.06em] text-on-brand
        bg-linear-to-r from-brand to-accent
        shadow-(--shadow-brand-md)
        hover:scale-[1.02] hover:shadow-(--shadow-btn-hover)
        active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100
        transition-all duration-200 cursor-pointer border-0
        relative overflow-hidden group
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
    >
      {loading ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          {loadingText || "Loading..."}
        </>
      ) : (
        <span className="relative z-10 flex items-center gap-2.5">
          {children}
        </span>
      )}
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    </button>
  );
}
