
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
      className={`font-outfit relative min-h-screen w-full flex flex-col items-center justify-center px-5 py-14 ${className}`}
      style={{
        backgroundImage: "url('/images/auth-bg.avif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Dark overlay - form readable রাখার জন্য */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full">
        {children}
      </div>

      <p className={`mt-6 z-10 relative text-white/60 text-xs`}>
        © {new Date().getFullYear()} primehalf · Privacy Policy · Terms
      </p>
    </div>
  );
}
