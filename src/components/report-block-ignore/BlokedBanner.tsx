"use client";

import { ShieldOff } from "lucide-react";

interface BlockedBannerProps {
  iBlockedThem: boolean; // true = I blocked them, false = they blocked me
  theirName: string;
  onUnblock?: () => void; // only shown when iBlockedThem is true
}

export default function BlockedBanner({
  iBlockedThem,
  theirName,
  onUnblock,
}: BlockedBannerProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center mb-4">
        <ShieldOff size={28} className="text-orange-400" />
      </div>

      <p className="font-syne font-bold text-gray-800 text-base mb-1">
        {iBlockedThem ? `You blocked ${theirName}` : "You're blocked"}
      </p>

      <p className="text-gray-400 text-sm font-outfit leading-relaxed max-w-xs">
        {iBlockedThem
          ? "You can't send or receive messages from this person."
          : `You can't send messages to ${theirName}.`}
      </p>

      {iBlockedThem && onUnblock && (
        <button
          onClick={onUnblock}
          className="mt-5 px-6 py-2.5 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-sm font-semibold active:bg-orange-100 transition-colors"
        >
          Unblock {theirName}
        </button>
      )}
    </div>
  );
}
