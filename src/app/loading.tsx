import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex items-center gap-3 text-slate-400">
        <Loader2 size={20} className="animate-spin" />
        <span className="font-outfit text-sm">Loading...</span>
      </div>
    </div>
  );
}
