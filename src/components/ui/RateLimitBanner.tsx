import { X, Clock, AlertCircle } from "lucide-react";

interface RateLimitBannerProps {
  message: string;
  formattedTime: string;
  onDismiss?: () => void;
}

export function RateLimitBanner({
  message,
  formattedTime,
  onDismiss,
}: RateLimitBannerProps) {
  return (
    <div className="animate-[fadeUp_0.4s_ease_both] w-full bg-red-50/80 border border-red-200/60 rounded-xl p-4 mb-5 relative group overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-red-400" />
      
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="absolute top-3 right-3 text-red-400 hover:text-red-600 transition-colors bg-white/50 hover:bg-white rounded-full p-1"
        >
          <X size={14} />
        </button>
      )}

      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
          <AlertCircle size={16} className="text-red-500" />
        </div>
        
        <div className="pr-4">
          <h3 className="font-syne text-red-800 font-bold text-sm mb-1">
            Too Many Requests
          </h3>
          <p className="font-outfit text-red-600/90 text-xs leading-relaxed mb-3">
            {message}
          </p>
          
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-red-100/50 rounded-lg border border-red-200/50">
            <Clock size={12} className="text-red-500 animate-pulse" />
            <span className="font-outfit text-red-700 font-bold text-[11px] tabular-nums tracking-wider">
              {formattedTime} remaining
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
