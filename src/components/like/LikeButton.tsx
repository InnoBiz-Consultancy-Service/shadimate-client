"use client";

import { useState, useTransition, useEffect } from "react";
import { Heart } from "lucide-react";
import Toast from "@/components/ui/Toast";
import { toggleLike, getLikeCount } from "@/actions/profile-like/like";

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
  likeCount: initialLikeCount = 0,
  showCount = false,
  size = "md",
  className = "",
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialLikeCount);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const iconSize = size === "sm" ? 13 : size === "lg" ? 20 : 16;

  // Fetch initial like status and count if not provided
  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const countRes = await getLikeCount(targetUserId);
        if (countRes.success && countRes.data) {
          // universalApi wraps response: countRes.data = { success, data: { count } }
          const outer = countRes.data as unknown as Record<string, unknown>;
          const inner = (outer?.data ?? outer) as { count?: number; isLiked?: boolean };
          setCount(inner?.count ?? 0);
          if (inner?.isLiked !== undefined) {
            setIsLiked(inner.isLiked);
          }
        }
      } catch (error) {
        console.error("Failed to fetch like status:", error);
      }
    };

    if (!initialLiked && initialLikeCount === 0) {
      fetchLikeStatus();
    }
  }, [targetUserId, initialLiked, initialLikeCount]);

  const handleLike = () => {
    const wasLiked = isLiked;

    // Optimistic update
    setIsLiked(!wasLiked);
    setCount((prev) => (wasLiked ? Math.max(0, prev - 1) : prev + 1));

    startTransition(async () => {
      try {
        const res = await toggleLike(targetUserId);

        if (res.success && res.data) {
          // universalApi wraps: res.data = full backend body = { success, message, data: { action } }
          const outer = res.data as unknown as Record<string, unknown>;
          const inner = (outer?.data ?? outer) as { action?: string };
          const action = inner?.action;

          // Add a console.log here temporarily to debug if needed:
          // console.log("toggle response outer:", outer, "inner:", inner, "action:", action);

          const isNowLiked = action === "liked";
          setIsLiked(isNowLiked);

          // Refetch actual count from server
          const countRes = await getLikeCount(targetUserId);
          if (countRes.success && countRes.data) {
            const cOuter = countRes.data as unknown as Record<string, unknown>;
            const cInner = (cOuter?.data ?? cOuter) as { count?: number };
            setCount(cInner?.count ?? (isNowLiked ? count + 1 : Math.max(0, count - 1)));
          }

          setToast({
            message: isNowLiked ? "❤️ Profile liked!" : "Like removed",
            type: "success",
          });
        } else {
          // Revert optimistic update
          setIsLiked(wasLiked);
          setCount((prev) => (wasLiked ? prev + 1 : Math.max(0, prev - 1)));
          setToast({
            message: res.message || "Something went wrong",
            type: "error",
          });
        }
      } catch (error) {
        // Revert optimistic update on error
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
        {showCount && (
          <span className={`${isLiked ? "text-brand/60" : "text-slate-600"}`}>
            {count}
          </span>
        )}
      </button>
    </>
  );
}