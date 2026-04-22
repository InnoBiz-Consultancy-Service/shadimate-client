import { dt } from "@/lib/design-tokens";

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageShell({ children, className = "" }: PageShellProps) {
  return (
    <div className={`font-outfit relative min-h-screen w-full flex flex-col items-center justify-center px-5 py-14 ${dt.page} ${className}`}>
      {children}
      <p className={`mt-6 z-10 ${dt.textMuted} text-xs`}>
        © {new Date().getFullYear()} ShadiMate · Privacy Policy · Terms
      </p>
    </div>
  );
}
