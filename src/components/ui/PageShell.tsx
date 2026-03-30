interface PageShellProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageShell({
  children,
  className = "",
}: PageShellProps) {
  return (
    <div
      className={`font-outfit relative min-h-screen w-full flex flex-col items-center justify-center px-5 py-14 bg-transparent ${className}`}
    >
      <div className="noise-layer absolute inset-0 opacity-[0.03] pointer-events-none" />
      {children}
      <p className="mt-6 z-10 text-slate-700 text-xs">
        © {new Date().getFullYear()} ShadiMate · Privacy Policy · Terms
      </p>
    </div>
  );
}
