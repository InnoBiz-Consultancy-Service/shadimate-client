"use client";

import { useState, useRef, useEffect, useCallback } from "react";

/* ─────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────── */

export interface DropdownOption {
  _id: string;
  name: string;
  shortName?: string;
}

interface SearchableDropdownProps {
  label: string;
  placeholder?: string;
  options: DropdownOption[];
  loading?: boolean;
  disabled?: boolean;
  required?: boolean;
  selectedId: string;
  selectedName: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSelect: (id: string, name: string) => void;
  onOpen?: () => void;
  /** Hidden input name for form submission */
  name?: string;
  /** Extra info shown after option name */
  renderExtra?: (option: DropdownOption) => React.ReactNode;
}

/* ─────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────── */

export default function SearchableDropdown({
  label,
  placeholder = "Search…",
  options,
  loading = false,
  disabled = false,
  selectedId,
  selectedName,
  searchValue,
  onSearchChange,
  onSelect,
  onOpen,
  name,
  renderExtra,
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Click outside to close ──
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // ── Open handler (lazy load trigger) ──
  const handleOpen = useCallback(() => {
    if (disabled) return;
    setIsOpen(true);
    onOpen?.();
    // Focus input after a tick
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [disabled, onOpen]);

  // ── Select handler ──
  const handleSelect = useCallback(
    (id: string, name: string) => {
      onSelect(id, name);
      setIsOpen(false);
      onSearchChange("");
    },
    [onSelect, onSearchChange],
  );

  const inputBaseClass =
    "font-outfit w-full px-4 py-3.5 rounded-2xl text-sm text-slate-100 placeholder-slate-600 border transition-all duration-200 outline-none";

  return (
    <div className="flex flex-col gap-1.5" ref={containerRef}>
      <label className="text-slate-400 text-[11px] font-semibold tracking-[0.12em] uppercase">
        {label}
      </label>

      {/* Hidden input for form data */}
      {name && <input type="hidden" name={name} value={selectedId} />}

      <div className="relative">
        {/* ── Trigger / Display ── */}
        <button
          type="button"
          onClick={handleOpen}
          disabled={disabled}
          className={`${inputBaseClass} text-left bg-white/5 border-white/10 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-between gap-2`}
          style={
            isOpen
              ? {
                  borderColor: "rgb(from var(--brand) r g b / 0.5)",
                  background: "rgb(from var(--brand) r g b / 0.04)",
                  boxShadow: "0 0 0 3px rgb(from var(--brand) r g b / 0.08)",
                }
              : undefined
          }
        >
          <span className={selectedName ? "text-slate-100" : "text-slate-600"}>
            {selectedName || placeholder}
          </span>
          <svg
            className={`w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* ── Dropdown Panel ── */}
        {isOpen && (
          <div className="absolute z-50 top-full left-0 right-0 mt-1.5 rounded-2xl border border-white/10 bg-[#1a1015] backdrop-blur-xl shadow-lg shadow-black/40 overflow-hidden animate-[fadeUp_0.15s_ease_both]">
            {/* Search input */}
            <div className="p-2.5 border-b border-white/5">
              <input
                ref={inputRef}
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={`Search ${label.toLowerCase()}…`}
                className="w-full px-3 py-2.5 rounded-xl text-sm text-slate-100 placeholder-slate-600 bg-white/5 border border-white/10 outline-none focus:border-brand/40 transition-colors"
              />
            </div>

            {/* Options list */}
            <div className="max-h-52 overflow-y-auto overscroll-contain">
              {loading ? (
                <div className="flex items-center justify-center gap-2 py-6">
                  <div className="w-4 h-4 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
                  <span className="text-slate-500 text-sm">Loading…</span>
                </div>
              ) : options.length === 0 ? (
                <div className="py-6 text-center">
                  <p className="text-slate-500 text-sm">No results found</p>
                </div>
              ) : (
                options.map((option) => (
                  <button
                    key={option._id}
                    type="button"
                    onClick={() => handleSelect(option._id, option.name)}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                      option._id === selectedId
                        ? "bg-brand/10 text-brand"
                        : "text-slate-300 hover:bg-white/5 active:bg-white/8"
                    }`}
                  >
                    <span className="truncate">{option.name}</span>
                    {renderExtra ? (
                      renderExtra(option)
                    ) : option.shortName ? (
                      <span className="text-xs text-slate-500 shrink-0">
                        {option.shortName}
                      </span>
                    ) : null}
                    {option._id === selectedId && (
                      <svg
                        className="w-4 h-4 text-brand shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
