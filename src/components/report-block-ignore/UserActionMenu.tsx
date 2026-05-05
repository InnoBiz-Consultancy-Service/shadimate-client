"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import {
  Flag,
  ShieldOff,
  Shield,
  BellOff,
  Bell,
  MoreHorizontal,
  Loader2,
} from "lucide-react";
import { toggleIgnore } from "@/actions/report-block-ignore";
import ReportModal from "./ReportModal";
import BlockConfirmModal from "./BlockConfirmModal";

interface UserActionMenuProps {
  targetUserId: string;
  targetName: string;
  // Initial states — pass from parent (fetched on profile load)
  iBlockedThem: boolean;
  isIgnored: boolean;
  onBlockChange?: (action: "blocked" | "unblocked") => void;
  onIgnoreChange?: (action: "ignored" | "unignored") => void;
}

export default function UserActionMenu({
  targetUserId,
  targetName,
  iBlockedThem: initialBlock,
  isIgnored: initialIgnore,
  onBlockChange,
  onIgnoreChange,
}: UserActionMenuProps) {
  const [open, setOpen] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showBlock, setShowBlock] = useState(false);
  const [iBlockedThem, setIBlockedThem] = useState(initialBlock);
  const [isIgnored, setIsIgnored] = useState(initialIgnore);
  const [ignorePending, startIgnoreTrans] = useTransition();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  function handleIgnoreToggle() {
    setOpen(false);
    startIgnoreTrans(async () => {
      const res = await toggleIgnore(targetUserId);
      if (res.success && res.data) {
        const action = res.data.action;
        setIsIgnored(action === "ignored");
        onIgnoreChange?.(action);
      }
    });
  }

  function handleBlockSuccess(action: "blocked" | "unblocked") {
    setIBlockedThem(action === "blocked");
    onBlockChange?.(action);
  }

  return (
    <>
      <div className="relative" ref={menuRef}>
        {/* Trigger button */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center active:bg-gray-200 transition-colors"
          aria-label="More options"
        >
          {ignorePending ? (
            <Loader2 size={14} className="animate-spin text-gray-500" />
          ) : (
            <MoreHorizontal size={14} className="text-gray-600" />
          )}
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 top-10 z-40 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Ignore */}
            <button
              onClick={handleIgnoreToggle}
              disabled={ignorePending}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-left transition-colors active:bg-gray-50 disabled:opacity-50"
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center ${
                  isIgnored ? "bg-green-50" : "bg-gray-100"
                }`}
              >
                {isIgnored ? (
                  <Bell size={14} className="text-green-500" />
                ) : (
                  <BellOff size={14} className="text-gray-500" />
                )}
              </div>
              <div>
                <p
                  className={`font-outfit font-semibold leading-tight ${isIgnored ? "text-green-600" : "text-gray-700"}`}
                >
                  {isIgnored ? "Unignore" : "Ignore"}
                </p>
                <p className="text-[10px] text-gray-400 font-outfit leading-tight mt-0.5">
                  {isIgnored ? "Resume normal chat" : "Mute messages silently"}
                </p>
              </div>
            </button>

            <div className="h-px bg-gray-100 mx-4" />

            {/* Block */}
            <button
              onClick={() => {
                setOpen(false);
                setShowBlock(true);
              }}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-left transition-colors active:bg-orange-50"
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center ${
                  iBlockedThem ? "bg-green-50" : "bg-orange-50"
                }`}
              >
                {iBlockedThem ? (
                  <Shield size={14} className="text-green-500" />
                ) : (
                  <ShieldOff size={14} className="text-orange-500" />
                )}
              </div>
              <div>
                <p
                  className={`font-outfit font-semibold leading-tight ${iBlockedThem ? "text-green-600" : "text-orange-500"}`}
                >
                  {iBlockedThem ? "Unblock" : "Block"}
                </p>
                <p className="text-[10px] text-gray-400 font-outfit leading-tight mt-0.5">
                  {iBlockedThem
                    ? "Allow contact again"
                    : "Restrict all contact"}
                </p>
              </div>
            </button>

            <div className="h-px bg-gray-100 mx-4" />

            {/* Report */}
            <button
              onClick={() => {
                setOpen(false);
                setShowReport(true);
              }}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-left transition-colors active:bg-red-50"
            >
              <div className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center">
                <Flag size={14} className="text-red-400" />
              </div>
              <div>
                <p className="font-outfit font-semibold text-red-500 leading-tight">
                  Report
                </p>
                <p className="text-[10px] text-gray-400 font-outfit leading-tight mt-0.5">
                  Flag for admin review
                </p>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {showReport && (
        <ReportModal
          targetUserId={targetUserId}
          targetName={targetName}
          onClose={() => setShowReport(false)}
        />
      )}

      {showBlock && (
        <BlockConfirmModal
          targetUserId={targetUserId}
          targetName={targetName}
          isCurrentlyBlocked={iBlockedThem}
          onClose={() => setShowBlock(false)}
          onSuccess={handleBlockSuccess}
        />
      )}
    </>
  );
}
