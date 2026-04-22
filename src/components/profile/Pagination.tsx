"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="w-9 h-9 rounded-xl flex items-center justify-center bg-white border border-slate-200 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm"
      >
        <ChevronLeft size={16} />
      </button>

      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
        let pageNum: number;
        if (totalPages <= 5) pageNum = i + 1;
        else if (page <= 3) pageNum = i + 1;
        else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
        else pageNum = page - 2 + i;

        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`font-outfit w-9 h-9 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-200 ${
              pageNum === page
                ? "bg-brand text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300"
            }`}
          >
            {pageNum}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="w-9 h-9 rounded-xl flex items-center justify-center bg-white border border-slate-200 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
