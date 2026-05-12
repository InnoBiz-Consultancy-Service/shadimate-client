// components/subscription/PaymentHistorySection.tsx
"use client";

import { Clock, ChevronRight, Download } from "lucide-react";

interface PaymentRecord {
  _id?: string;
  plan: string;
  amount: number;
  paymentStatus: string;
  paidAt?: string;
  createdAt: string;
}

interface Props {
  paymentHistory: PaymentRecord[];
  formatDate: (dateStr: string) => string;
}

const STATUS_STYLES: Record<string, string> = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  failed: "bg-red-50 text-red-700 border-red-200",
  cancelled: "bg-slate-50 text-slate-600 border-slate-200",
};

const PLAN_LABELS: Record<string, string> = {
  "1month": "Monthly",
  "3month": "Quarterly",
  "6month": "Half-Yearly",
};

export default function PaymentHistorySection({
  paymentHistory,
  formatDate,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-syne text-slate-900 font-bold flex items-center gap-2">
          <Clock size={18} className="text-slate-400" />
          Payment History
        </h3>
        <button className="text-brand text-xs font-semibold flex items-center gap-1 hover:underline">
          <Download size={12} />
          Download
        </button>
      </div>

      <div className="divide-y divide-slate-100">
        {paymentHistory.slice(0, 5).map((record, idx) => (
          <div
            key={record._id || idx}
            className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
          >
            <div>
              <p className="text-slate-900 text-sm font-semibold">
                {PLAN_LABELS[record.plan] || record.plan} Plan
              </p>
              <p className="text-slate-500 text-xs mt-0.5">
                {formatDate(record.paidAt || record.createdAt)}
              </p>
              {record.paidAt && (
                <p className="text-slate-400 text-[10px] mt-0.5">
                  Transaction ID: {record._id?.slice(-8)}
                </p>
              )}
            </div>

            <div className="text-right">
              <p className="text-slate-900 font-bold text-sm">
                ৳{record.amount}
              </p>
              <span
                className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border mt-1 ${
                  STATUS_STYLES[record.paymentStatus] ||
                  STATUS_STYLES["pending"]
                }`}
              >
                {record.paymentStatus}
              </span>
            </div>
          </div>
        ))}
      </div>

      {paymentHistory.length > 5 && (
        <button className="w-full mt-4 text-brand text-sm font-semibold py-2 flex items-center justify-center gap-1 hover:bg-brand/5 rounded-lg transition-colors">
          View All Payments
          <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}
