import { Globe, Users, Star } from "lucide-react";

// ── Back phone: Profile view ─────────────────────────────────────────────
const ProfilePhone = () => (
  <div
    className="w-full h-full flex flex-col"
    style={{ background: "linear-gradient(160deg, #2d1b3d 0%, #1a1a2e 100%)" }}
  >
    <div className="flex justify-between px-3 pt-2 pb-1">
      <span className="text-white/80 text-[10px] font-semibold">9:41</span>
      <span className="text-white/80 text-[10px]">■</span>
    </div>
    <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-2xl mx-auto mt-2">
      👨
    </div>
    <p className="text-center text-white font-bold text-[13px] mt-1">
      Aryan, 27
    </p>
    <p className="text-center text-white/50 text-[10px] mt-0.5">
      📍 5km · Dhaka
    </p>
    <div className="flex flex-wrap gap-1 justify-center mt-2 px-2">
      {["Analytical", "Curious", "96% match"].map((t) => (
        <span
          key={t}
          className="text-[9px] font-semibold text-white/70 border border-white/25 rounded-full px-2 py-0.5"
        >
          {t}
        </span>
      ))}
    </div>
    <div className="flex-1" />
    <div className="flex justify-center items-center gap-3 pb-4">
      <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-sm text-white/70">
        ✕
      </div>
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center text-lg text-white shadow-lg"
        style={{ background: "linear-gradient(135deg, #E8547A, #F0C070)" }}
      >
        ♥
      </div>
      <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-sm text-white/70">
        ★
      </div>
    </div>
  </div>
);

// ── Front phone: Match screen ────────────────────────────────────────────
const MatchPhone = () => (
  <div
    className="w-full h-full flex flex-col"
    style={{
      background:
        "linear-gradient(160deg, #E8547A 0%, #c43060 50%, #7a1535 100%)",
    }}
  >
    <div className="flex justify-between px-3 pt-2 pb-1">
      <span className="text-white/80 text-[10px] font-semibold">9:41</span>
      <span className="text-white/80 text-[10px]">■</span>
    </div>
    <div className="text-center text-2xl mt-1">✨</div>
    <p className="font-outfit text-white text-center font-bold text-[13px] leading-snug mt-1 px-2">
      You and Priya
      <br />
      matched!
    </p>
    <div className="flex items-center justify-center gap-2 mt-3">
      <div
        className="w-12 h-12 rounded-[14px] border-2 border-white/40 flex items-center justify-center text-xl"
        style={{ background: "linear-gradient(135deg,#6b4fa0,#c4527a)" }}
      >
        👦
      </div>
      <div className="w-6 h-6 rounded-full bg-white/25 flex items-center justify-center text-[11px] text-white">
        ♥
      </div>
      <div
        className="w-12 h-12 rounded-[14px] border-2 border-white/40 flex items-center justify-center text-xl"
        style={{ background: "linear-gradient(135deg,#e8845a,#F0C070)" }}
      >
        👧
      </div>
    </div>
    <div className="flex justify-center gap-8 mt-2">
      <div className="text-center">
        <p className="font-outfit text-white font-semibold text-[11px]">You</p>
        <p className="font-outfit text-white/50 text-[9px]">Dhaka</p>
      </div>
      <div className="text-center">
        <p className="font-outfit text-white font-semibold text-[11px]">
          Priya, 25
        </p>
        <p className="font-outfit text-white/50 text-[9px]">Chittagong</p>
      </div>
    </div>
    <div className="mx-2 mt-3 bg-white/20 rounded-full px-3 py-2 flex items-center gap-2">
      <p className="font-outfit text-white/45 text-[10px] flex-1">
        Say hello to Priya...
      </p>
      <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center text-[9px] text-white">
        ➤
      </div>
    </div>
    <p className="font-outfit text-white/50 text-[10px] text-center mt-2 underline underline-offset-2">
      View full profile
    </p>
  </div>
);

// ── Stat row ─────────────────────────────────────────────────────────────
const Stat = ({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) => (
  <div className="flex items-center gap-3">
    <div
      className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
      style={{ background: "rgba(232,84,122,0.10)" }}
    >
      {icon}
    </div>
    <div>
      <p
        className="font-outfit font-bold text-[17px] leading-none"
        style={{ color: "#E8547A" }}
      >
        {value}
      </p>
      <p className="font-outfit text-[12px] text-slate-500 mt-0.5">{label}</p>
    </div>
  </div>
);

// ── Main Section ──────────────────────────────────────────────────────────
export default function AppSection() {
  return (
    <section className="relative overflow-hidden bg-white py-16 px-5 md:py-20">
      {/* bg blob */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-[0.06]"
        style={{
          background: "radial-gradient(circle, #E8547A 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        {/* ── Phone mockups ── */}
        <div
          className="relative flex justify-center items-end"
          style={{ height: 300 }}
        >
          {/* back phone */}
          <div
            className="absolute rounded-[26px] overflow-hidden border border-slate-200"
            style={{
              width: 145,
              height: 282,
              transform: "rotate(-6deg) translateX(-55px) translateY(8px)",
              zIndex: 1,
              boxShadow:
                "0 16px 40px rgba(0,0,0,0.12), 0 0 0 0.5px rgba(0,0,0,0.06)",
            }}
          >
            <ProfilePhone />
          </div>

          {/* front phone */}
          <div
            className="relative rounded-[26px] overflow-hidden border border-white/20"
            style={{
              width: 145,
              height: 282,
              transform: "rotate(3deg) translateX(30px)",
              zIndex: 2,
              boxShadow:
                "0 20px 48px rgba(232,84,122,0.28), 0 0 0 0.5px rgba(232,84,122,0.2)",
            }}
          >
            <MatchPhone />
          </div>

          {/* floating badge */}
          <div
            className="absolute z-10 flex items-center gap-2 bg-white border border-slate-100 rounded-2xl px-3 py-1.5 shadow-lg"
            style={{ top: 16, right: 8, transform: "rotate(3deg)" }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: "#E8547A" }}
            />
            <span className="font-outfit text-[11px] font-bold text-slate-700">
              99% match found!
            </span>
          </div>

          {/* floating heart */}
          <div
            className="absolute z-10 w-9 h-9 rounded-[10px] flex items-center justify-center text-white text-base shadow-lg"
            style={{
              bottom: 20,
              left: 20,
              background: "linear-gradient(135deg,#E8547A,#F0C070)",
              transform: "rotate(-8deg)",
            }}
          >
            ♥
          </div>
        </div>

        {/* ── Text + Stats ── */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <div
              className="h-[1.5px] w-7 rounded"
              style={{ background: "#E8547A" }}
            />
            <span
              className="font-outfit text-[11px] font-bold tracking-[0.14em] uppercase"
              style={{ color: "#E8547A" }}
            >
              App coming soon
            </span>
          </div>

          <h2
            className="font-outfit tracking-[-0.03em] text-slate-800 m-0"
            style={{
              fontWeight: 800,
              fontSize: "clamp(28px, 6vw, 48px)",
              lineHeight: 1.08,
            }}
          >
            The app connecting
            <br />
            <span
              style={{
                background: "linear-gradient(90deg, #E8547A, #F0A050)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              everyone, everywhere
            </span>
          </h2>

          <p className="font-outfit text-slate-500 text-[14px] md:text-[15px] leading-relaxed max-w-sm m-0">
            Our website is live and growing every day. The mobile app is coming
            soon — built for every culture and background to find a genuine,
            soul-level connection.
          </p>

          <div className="flex flex-col gap-3">
            <Stat
              icon={<Globe size={16} style={{ color: "#E8547A" }} />}
              value="500,000+"
              label="Connections made"
            />
            <Stat
              icon={<Users size={16} style={{ color: "#E8547A" }} />}
              value="10M+"
              label="People from all backgrounds"
            />
            <Stat
              icon={
                <Star size={16} fill="#E8547A" style={{ color: "#E8547A" }} />
              }
              value="99.9%"
              label="Psychology-backed accuracy"
            />
          </div>

          <div className="flex gap-3 flex-wrap mt-1">
            {[
              { ico: "🍎", store: "App Store" },
              { ico: "▶", store: "Google Play" },
            ].map(({ ico, store }) => (
              <div
                key={store}
                className="flex items-center gap-2.5 px-3.5 py-2.5 border border-slate-200 rounded-[14px] bg-slate-50 opacity-55 select-none cursor-not-allowed"
              >
                <span className="text-[15px]">{ico}</span>
                <div>
                  <p className="font-outfit text-[9px] text-slate-400 font-medium leading-none mb-0.5">
                    Coming soon
                  </p>
                  <p className="font-outfit text-[12px] text-slate-600 font-bold leading-none">
                    {store}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
