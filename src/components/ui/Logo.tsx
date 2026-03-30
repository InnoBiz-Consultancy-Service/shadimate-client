import Link from "next/link";

export default function Logo({ size = "default" }: { size?: "default" | "small" }) {
  const wh = size === "small" ? "w-8 h-8" : "w-9 h-9";
  const svgSize = size === "small" ? 18 : 20;
  const textSize = size === "small" ? "text-lg" : "text-xl";

  return (
    <Link href="/" className="flex items-center gap-2.5 no-underline">
      <div
        className={`${wh} rounded-full flex items-center justify-center bg-linear-to-br from-brand to-accent shadow-(--shadow-brand-sm)`}
      >
        <svg width={svgSize} height={svgSize} viewBox="0 0 18 18" fill="none">
          <path
            d="M5 4C5 4 4 8 7 11C10 14 13 13 13 13C13 13 10.5 12.2 9 10C7.5 7.8 8.5 4 5 4Z"
            fill="var(--on-brand)"
          />
          <circle cx="9" cy="9" r="2.2" fill="var(--on-brand)" opacity="0.6" />
        </svg>
      </div>
      <span className={`font-syne text-white font-extrabold ${textSize} tracking-tight`}>
        ShadiMate
      </span>
    </Link>
  );
}