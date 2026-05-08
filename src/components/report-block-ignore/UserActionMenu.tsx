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
  ChevronRight,
} from "lucide-react";
import { toggleIgnore } from "@/actions/report-block-ignore";
import ReportModal from "./ReportModal";
import BlockConfirmModal from "./BlockConfirmModal";

interface UserActionMenuProps {
  targetUserId: string;
  targetName: string;
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
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95 ${
            open
              ? "bg-gray-200 text-gray-700"
              : "bg-gray-100 text-gray-500 active:bg-gray-200"
          }`}
          aria-label="More options"
          aria-expanded={open}
        >
          {ignorePending ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <MoreHorizontal size={15} />
          )}
        </button>

        {/* Bottom Sheet style dropdown on mobile, regular dropdown on desktop */}
        {open && (
          <>
            {/* Backdrop for mobile */}
            <div
              className="fixed inset-0 z-30 sm:hidden"
              onClick={() => setOpen(false)}
            />

            {/* Dropdown Panel */}
            <div className="absolute right-0 top-11 z-40 w-64 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top-right">
              {/* Header */}
              <div className="px-4 py-3 border-b border-gray-50">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest font-outfit">
                  Actions for
                </p>
                <p className="text-sm font-bold text-gray-800 font-syne mt-0.5 truncate">
                  {targetName}
                </p>
              </div>

              {/* Ignore */}
              <button
                onClick={handleIgnoreToggle}
                disabled={ignorePending}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50 group"
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                    isIgnored
                      ? "bg-green-100 group-active:bg-green-200"
                      : "bg-gray-100 group-active:bg-gray-200"
                  }`}
                >
                  {isIgnored ? (
                    <Bell size={15} className="text-green-600" />
                  ) : (
                    <BellOff size={15} className="text-gray-500" />
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={`font-outfit font-semibold text-sm leading-tight ${
                      isIgnored ? "text-green-600" : "text-gray-800"
                    }`}
                  >
                    {isIgnored ? "Unignore" : "Ignore"}
                  </p>
                  <p className="text-[11px] text-gray-400 font-outfit leading-tight mt-0.5">
                    {isIgnored
                      ? "You'll see their messages again"
                      : "Hide messages without blocking"}
                  </p>
                </div>
                <ChevronRight size={14} className="text-gray-300 shrink-0" />
              </button>

              <div className="h-px bg-gray-100 mx-3" />

              {/* Block */}
              <button
                onClick={() => {
                  setOpen(false);
                  setShowBlock(true);
                }}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-orange-50/50 active:bg-orange-100/50 group"
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                    iBlockedThem
                      ? "bg-green-100 group-active:bg-green-200"
                      : "bg-orange-100 group-active:bg-orange-200"
                  }`}
                >
                  {iBlockedThem ? (
                    <Shield size={15} className="text-green-600" />
                  ) : (
                    <ShieldOff size={15} className="text-orange-500" />
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={`font-outfit font-semibold text-sm leading-tight ${
                      iBlockedThem ? "text-green-600" : "text-orange-600"
                    }`}
                  >
                    {iBlockedThem ? "Unblock" : "Block"}
                  </p>
                  <p className="text-[11px] text-gray-400 font-outfit leading-tight mt-0.5">
                    {iBlockedThem
                      ? "Allow messages and profile views"
                      : "Restrict all contact & profile views"}
                  </p>
                </div>
                <ChevronRight size={14} className="text-gray-300 shrink-0" />
              </button>

              <div className="h-px bg-gray-100 mx-3" />

              {/* Report */}
              <button
                onClick={() => {
                  setOpen(false);
                  setShowReport(true);
                }}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-red-50/50 active:bg-red-100/50 group"
              >
                <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center group-active:bg-red-200 transition-colors">
                  <Flag size={15} className="text-red-500" />
                </div>
                <div className="flex-1">
                  <p className="font-outfit font-semibold text-sm text-red-600 leading-tight">
                    Report
                  </p>
                  <p className="text-[11px] text-gray-400 font-outfit leading-tight mt-0.5">
                    Flag this user for admin review
                  </p>
                </div>
                <ChevronRight size={14} className="text-gray-300 shrink-0" />
              </button>

              {/* Current status badges */}
              {(iBlockedThem || isIgnored) && (
                <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-1.5">
                  {iBlockedThem && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 text-[10px] font-semibold font-outfit">
                      <ShieldOff size={10} /> Blocked
                    </span>
                  )}
                  {isIgnored && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 text-[10px] font-semibold font-outfit">
                      <BellOff size={10} /> Ignored
                    </span>
                  )}
                </div>
              )}
            </div>
          </>
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
