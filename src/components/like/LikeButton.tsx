"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import Toast from "@/components/ui/Toast";
import { toggleLike } from "@/actions/profile-like/like";

interface LikeButtonProps {
  targetUserId: string;
  initialLiked?: boolean;
  likeCount?: number;
  showCount?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function LikeButton({
  targetUserId,
  initialLiked = false,
  likeCount = 0,
  showCount = false,
  size = "md",
  className = "",
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [count, setCount] = useState(likeCount);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const iconSize = size === "sm" ? 13 : size === "lg" ? 20 : 16;

  const handleLike = () => {
    const wasLiked = isLiked;
    // Optimistic update
    setIsLiked(!wasLiked);
    setCount((prev) => (wasLiked ? Math.max(0, prev - 1) : prev + 1));

    startTransition(async () => {
      try {
        const res = await toggleLike(targetUserId);
        if (res.success && res.data) {
          const action = (res.data as { action: string }).action;
          setIsLiked(action === "liked");
          setToast({
            message: action === "liked" ? "❤️ Profile liked!" : "Like removed",
            type: "success",
          });
        } else {
          // Revert
          setIsLiked(wasLiked);
          setCount((prev) => (wasLiked ? prev + 1 : Math.max(0, prev - 1)));
          setToast({
            message: res.message || "Something went wrong",
            type: "error",
          });
        }
      } catch {
        setIsLiked(wasLiked);
        setCount((prev) => (wasLiked ? prev + 1 : Math.max(0, prev - 1)));
        setToast({ message: "Network error. Try again.", type: "error" });
      }
    });
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <button
        onClick={handleLike}
        disabled={isPending}
        aria-label={isLiked ? "Unlike profile" : "Like profile"}
        className={`
          flex items-center gap-1.5 rounded-xl transition-all duration-200 cursor-pointer
          border font-outfit font-semibold
          disabled:opacity-60 disabled:cursor-not-allowed
          ${size === "sm" ? "px-2.5 py-1 text-[11px]" : size === "lg" ? "px-5 py-3 text-sm" : "px-3.5 py-2 text-xs"}
          ${
            isLiked
              ? "bg-brand/15 border-brand/40 text-brand hover:bg-brand/25 shadow-(--shadow-brand-xs)"
              : "bg-white/5 border-white/10 text-slate-400 hover:border-brand/30 hover:text-brand hover:bg-brand/8"
          }
          ${className}
        `}
      >
        <Heart
          size={iconSize}
          className={`transition-all duration-200 ${isPending ? "animate-pulse" : ""}`}
          fill={isLiked ? "currentColor" : "none"}
        />
        <span>{isLiked ? "Liked" : "Like"}</span>
        {showCount && count > 0 && (
          <span className={`${isLiked ? "text-brand/60" : "text-slate-600"}`}>
            {count}
          </span>
        )}
      </button>
    </>
  );
}
