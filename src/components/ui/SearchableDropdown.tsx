"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Check, Loader2 } from "lucide-react";

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
  selectedId: string;
  selectedName: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSelect: (id: string, name: string) => void;
  onOpen?: () => void;
  name?: string;
  renderExtra?: (option: DropdownOption) => React.ReactNode;
}

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

  const handleOpen = useCallback(() => {
    if (disabled) return;
    setIsOpen(true);
    onOpen?.();
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [disabled, onOpen]);

  const handleSelect = useCallback(
    (id: string, optName: string) => {
      onSelect(id, optName);
      setIsOpen(false);
      onSearchChange("");
    },
    [onSelect, onSearchChange],
  );

  return (
    <div className="flex flex-col gap-1.5" ref={containerRef}>
      <label className="font-outfit text-slate-400 text-[10px] font-semibold tracking-[0.12em] uppercase">
        {label}
      </label>
      {name && <input type="hidden" name={name} value={selectedId} />}

      <div className="relative">
        <button
          type="button"
          onClick={handleOpen}
          disabled={disabled}
          className="font-outfit w-full px-4 py-3.5 rounded-2xl text-sm text-left border transition-all duration-200 outline-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-between gap-2"
          style={
            isOpen
              ? {
                  borderColor: "rgb(from var(--brand) r g b / 0.5)",
                  background: "rgb(from var(--brand) r g b / 0.04)",
                  boxShadow: "0 0 0 3px rgb(from var(--brand) r g b / 0.08)",
                }
              : {
                  borderColor: "rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.05)",
                }
          }
        >
          <span className={selectedName ? "text-slate-100" : "text-slate-600"}>
            {selectedName || placeholder}
          </span>
          <ChevronDown
            size={16}
            className={`text-slate-500 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 top-full left-0 right-0 mt-1.5 rounded-2xl border border-white/10 bg-[#1a1015] backdrop-blur-xl shadow-lg shadow-black/40 overflow-hidden animate-[fadeUp_0.15s_ease_both]">
            <div className="p-2.5 border-b border-white/5">
              <input
                ref={inputRef}
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={`Search ${label.toLowerCase()}…`}
                className="font-outfit w-full px-3 py-2.5 rounded-xl text-sm text-slate-100 placeholder-slate-600 bg-white/5 border border-white/10 outline-none focus:border-brand/40 transition-colors"
              />
            </div>

            <div className="max-h-52 overflow-y-auto overscroll-contain">
              {loading ? (
                <div className="flex items-center justify-center gap-2 py-6">
                  <Loader2 size={16} className="animate-spin text-brand" />
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
                      <Check size={16} className="text-brand shrink-0" />
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
