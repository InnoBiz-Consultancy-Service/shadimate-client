interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function GlassCard({
  children,
  className = "",
}: GlassCardProps) {
  return (
    <div
      className={`bg-transparent backdrop-blur-xs rounded-2xl border border-white/30 shadow-xl ${className}`}
    >
      {children}
    </div>
  );
}
