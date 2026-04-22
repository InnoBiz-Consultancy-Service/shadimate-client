import { dt } from "@/lib/design-tokens";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function GlassCard({ children, className = "" }: GlassCardProps) {
  return (
    <div className={`${dt.card} ${className}`}>
      {children}
    </div>
  );
}
