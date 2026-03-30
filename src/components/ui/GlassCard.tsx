interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function GlassCard({
  children,
  className = "",
}: GlassCardProps) {
  return (
    <div className={`relative rounded-[28px] glass-card ${className}`}>
      <div className="noise-layer absolute inset-0 opacity-[0.02] pointer-events-none rounded-[28px]" />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[28px]"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgb(from var(--brand) r g b / 0.4), transparent)",
        }}
      />
      {children}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px rounded-b-[28px]"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgb(from var(--accent) r g b / 0.2), transparent)",
        }}
      />
    </div>
  );
}
