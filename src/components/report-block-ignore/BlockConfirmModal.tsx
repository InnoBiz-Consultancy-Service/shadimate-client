"use client";

import { useTransition } from "react";
import { ShieldOff, Shield, X, Loader2 } from "lucide-react";
import { toggleBlock } from "@/actions/report-block-ignore";

interface BlockConfirmModalProps {
  targetUserId: string;
  targetName: string;
  isCurrentlyBlocked: boolean; // true = currently blocked, action = unblock
  onClose: () => void;
  onSuccess?: (action: "blocked" | "unblocked") => void;
}

export default function BlockConfirmModal({
  targetUserId,
  targetName,
  isCurrentlyBlocked,
  onClose,
  onSuccess,
}: BlockConfirmModalProps) {
  const [isPending, startTrans] = useTransition();

  const isUnblocking = isCurrentlyBlocked;

  function handleConfirm() {
    startTrans(async () => {
      const res = await toggleBlock(targetUserId);
      if (res.success && res.data) {
        onSuccess?.(res.data.action);
        onClose();
      }
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Icon */}
        <div className="flex flex-col items-center pt-7 pb-2 px-6 text-center">
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${
              isUnblocking ? "bg-green-50" : "bg-orange-50"
            }`}
          >
            {isUnblocking ? (
              <Shield size={26} className="text-green-500" />
            ) : (
              <ShieldOff size={26} className="text-orange-500" />
            )}
          </div>

          <p className="font-syne font-bold text-gray-900 text-lg leading-snug">
            {isUnblocking ? `Unblock ${targetName}?` : `Block ${targetName}?`}
          </p>

          <p className="text-gray-400 text-sm font-outfit mt-2 leading-relaxed">
            {isUnblocking
              ? `${targetName} will be able to message you and see your profile again.`
              : `${targetName} won't be able to message you or see your profile. You can unblock anytime.`}
          </p>
        </div>

        {/* Actions */}
        <div className="px-5 py-5 flex flex-col gap-2.5">
          <button
            onClick={handleConfirm}
            disabled={isPending}
            className={`w-full py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-all active:scale-[0.98] ${
              isUnblocking
                ? "bg-linear-to-r from-green-500 to-emerald-500 text-white"
                : "bg-linear-to-r from-orange-500 to-amber-500 text-white"
            }`}
          >
            {isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Please wait...
              </>
            ) : isUnblocking ? (
              <>
                <Shield size={15} /> Unblock
              </>
            ) : (
              <>
                <ShieldOff size={15} /> Block User
              </>
            )}
          </button>

          <button
            onClick={onClose}
            disabled={isPending}
            className="w-full py-3.5 rounded-2xl bg-gray-100 text-gray-600 font-semibold text-sm active:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
