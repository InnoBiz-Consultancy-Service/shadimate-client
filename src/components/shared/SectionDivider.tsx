export default function SectionDivider() {
  return (
    <div className="relative w-full flex items-center justify-center ">
      {/* Left Line */}
      <div className="flex-1 h-px bg-linear-to-r from-transparent via-brand/30 to-brand/60" />

      {/* Heart Icon */}
      <div className="mx-6 relative group">
        <div className="absolute inset-0 bg-brand/20 blur-xl rounded-full animate-pulse group-hover:bg-brand/40 transition-all duration-500" />
        <svg
          viewBox="0 0 100 90"
          className="w-6 h-6 fill-brand opacity-60 transition-all duration-500 group-hover:opacity-100 group-hover:scale-110"
        >
          <path d="M50 85 C30 68 5 55 5 33 C5 14 20 5 35 5 C43 5 50 11 50 11 C50 11 57 5 65 5 C80 5 95 14 95 33 C95 55 70 68 50 85Z" />
        </svg>
      </div>

      {/* Right Line */}
      <div className="flex-1 h-px bg-linear-to-l from-transparent via-brand/30 to-brand/60" />
    </div>
  );
}
