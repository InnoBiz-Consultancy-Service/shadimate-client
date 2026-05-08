"use client";

import { BellOff } from "lucide-react";

interface IgnoredMessagesBannerProps {
  senderName: string;
}

/**
 * Shown at the top of the chat input area when the conversation is "ignored".
 * The input still works — messages save as ignoredMessage in DB, not surfaced to the other party.
 */
export default function IgnoredMessagesBanner({
  senderName,
}: IgnoredMessagesBannerProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-100">
      <BellOff size={13} className="text-gray-400 shrink-0" />
      <p className="text-gray-400 text-[11px] font-outfit">
        Messages from{" "}
        <span className="font-semibold text-gray-500">{senderName}</span> are
        muted — they won&apos;t know you&apos;re ignoring them.
      </p>
    </div>
  );
}
