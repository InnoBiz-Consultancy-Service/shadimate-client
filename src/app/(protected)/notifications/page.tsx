import { Bell } from "lucide-react";
import { GlassCard } from "@/components/ui";

export const metadata = { title: "Notifications – ShadiMate" };

export default function NotificationsPage() {
  return (
    <div className="font-outfit min-h-screen px-5 py-8 md:py-12 max-w-3xl mx-auto">
      <h1 className="font-syne text-white text-2xl font-extrabold tracking-tight mb-6">
        Notifications
      </h1>
      <GlassCard className="p-10 text-center">
        <Bell size={48} className="text-slate-600 mx-auto mb-4" />
        <h2 className="font-syne text-white text-lg font-bold mb-2">
          No Notifications
        </h2>
        <p className="text-slate-500 text-sm max-w-xs mx-auto">
          You&apos;re all caught up! New notifications will appear here.
        </p>
      </GlassCard>
    </div>
  );
}
