// import Image from "next/image";
// import MaleAvatar from "../../../public/images/male_shadimate.png";
// import FemaleAvatar from "../../../public/images/female_shadimate.png";
// import Link from "next/link";
// import { ArrowRight } from "lucide-react";

// const AvatarSmall = ({
//   v,
//   size = 38,
// }: {
//   v: "a" | "b" | "c" | "d";
//   size?: number;
// }) => {
//   const cfg = {
//     a: {
//       b1: "#E8547A",
//       b2: "#7A1A35",
//       s: "#F0A0B0",
//       h: "#C0415C",
//       e: "#3d0018",
//     },
//     b: {
//       b1: "#C4703A",
//       b2: "#6B3010",
//       s: "#E8A070",
//       h: "#A05828",
//       e: "#3d1800",
//     },
//     c: {
//       b1: "#B54A7A",
//       b2: "#5A1A3A",
//       s: "#D890B0",
//       h: "#903860",
//       e: "#300020",
//     },
//     d: {
//       b1: "#D4845A",
//       b2: "#7A3820",
//       s: "#EDB898",
//       h: "#B06040",
//       e: "#3d1800",
//     },
//   };
//   const c = cfg[v];
//   const gid = `sav-${v}`;
//   return (
//     <svg width={size} height={size} viewBox="0 0 38 38" fill="none">
//       <circle cx="19" cy="19" r="19" fill={`url(#${gid})`} />
//       <ellipse cx="19" cy="18" rx="9" ry="9.5" fill={c.s} />
//       <path
//         d="M10 16 Q11 8 19 7 Q27 8 28 16 Q25 10 19 10 Q13 10 10 16Z"
//         fill={c.h}
//       />
//       <ellipse cx="15.5" cy="17" rx="1.8" ry="1.8" fill="white" />
//       <ellipse cx="22.5" cy="17" rx="1.8" ry="1.8" fill="white" />
//       <circle cx="16" cy="17.4" r="1" fill={c.e} />
//       <circle cx="23" cy="17.4" r="1" fill={c.e} />
//       <path
//         d="M15.5 22 Q19 24.5 22.5 22"
//         stroke={c.h}
//         strokeWidth="1.2"
//         fill="none"
//         strokeLinecap="round"
//       />
//       <rect
//         x="15"
//         y="24"
//         width="8"
//         height="5"
//         rx="2.5"
//         fill={c.s}
//         opacity="0.7"
//       />
//       <ellipse cx="19" cy="33" rx="9" ry="5" fill={c.h} opacity="0.5" />
//       <defs>
//         <radialGradient id={gid} cx="50%" cy="30%" r="70%">
//           <stop offset="0%" stopColor={c.b1} />
//           <stop offset="100%" stopColor={c.b2} />
//         </radialGradient>
//       </defs>
//     </svg>
//   );
// };

// const Gauge = ({ value = 94 }: { value?: number }) => {
//   const r = 44;
//   const circ = 2 * Math.PI * r;
//   return (
//     <div className="relative flex items-center justify-center w-27.5 h-27.5">
//       <svg
//         width="110"
//         height="110"
//         viewBox="0 0 110 110"
//         className="absolute inset-0"
//         style={{ transform: "rotate(-225deg)" }}
//       >
//         <circle
//           cx="55"
//           cy="55"
//           r={r}
//           fill="none"
//           stroke="rgba(255,255,255,0.07)"
//           strokeWidth="8"
//           strokeDasharray={`${circ * 0.75} ${circ}`}
//           strokeLinecap="round"
//         />
//         <circle
//           cx="55"
//           cy="55"
//           r={r}
//           fill="none"
//           stroke="url(#gGrad)"
//           strokeWidth="8"
//           strokeDasharray={`${circ * 0.75 * (value / 100)} ${circ}`}
//           strokeLinecap="round"
//           style={{ filter: "drop-shadow(0 0 7px rgba(232,84,122,0.75))" }}
//         />
//         <defs>
//           <linearGradient id="gGrad" x1="0%" y1="0%" x2="100%" y2="0%">
//             <stop offset="0%" stopColor="#E8547A" />
//             <stop offset="100%" stopColor="#F0C070" />
//           </linearGradient>
//         </defs>
//       </svg>
//       <div className="relative z-10 flex flex-col items-center leading-none">
//         <span className="font-outfit text-white font-bold text-[26px]">
//           {value}%
//         </span>
//         <span className="font-outfit text-[9px] font-semibold tracking-[0.13em] text-slate-400 mt-1">
//           MATCH
//         </span>
//       </div>
//     </div>
//   );
// };

// const Tag = ({ label }: { label: string }) => (
//   <span className="font-outfit text-[10px] font-semibold tracking-[0.08em] text-slate-400 border border-slate-600/40 rounded-[7px] px-2.5 py-1 bg-white/4 whitespace-nowrap">
//     {label}
//   </span>
// );

// const PersonRow = ({
//   name,
//   match,
//   v,
// }: {
//   name: string;
//   match: number;
//   v: "a" | "b" | "c" | "d";
// }) => (
//   <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-[14px] bg-white/4 border border-white/[0.07]">
//     <div className="rounded-full overflow-hidden shrink-0">
//       <AvatarSmall v={v} size={38} />
//     </div>
//     <div className="flex-1 min-w-0">
//       <p className="font-outfit text-[13px] font-semibold text-slate-100 truncate">
//         {name}
//       </p>
//       <p className="font-outfit text-[10px] text-slate-500 mt-0.5">
//         Compatible
//       </p>
//     </div>
//     <div className="text-right shrink-0">
//       <p
//         className="font-outfit text-[15px] font-bold"
//         style={{ color: "var(--brand)" }}
//       >
//         {match}%
//       </p>
//       <p className="font-outfit text-[9px] font-semibold tracking-widest text-slate-500">
//         MATCH
//       </p>
//     </div>
//   </div>
// );

// export default function HeroSection() {
//   const tags = [
//     "INTROVERT",
//     "HIGH EMPATHY",
//     "VALUE-DRIVEN",
//     "ANALYTICAL",
//     "CURIOUS",
//     "CREATIVE",
//   ];

//   return (
//     <section className="relative min-h-screen flex items-center justify-center px-5 py-16 md:py-20">
//       <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 w-full max-w-5xl items-center">
//         <div className="flex flex-col gap-6">
//           <h1
//             className="animate-[fadeUp_0.65s_ease_0.05s_both] leading-[0.9] tracking-[-0.04em] text-slate-100"
//             style={{ fontWeight: 800, fontSize: "clamp(40px, 10vw, 84px)" }}
//           >
//             <span className="block opacity-90">FIND YOUR</span>
//             <span className="block text-gradient-rose">SOUL MATE</span>
//           </h1>

//           <p className="font-outfit animate-[fadeUp_0.65s_ease_0.2s_both] text-slate-400/90 leading-relaxed max-w-sm text-[15px] font-medium">
//             Traditional matching is dead. We use behavioral psychology to find
//             your 99.9% true connection.
//           </p>

//           <div className="animate-[fadeUp_0.65s_ease_0.35s_both] w-full md:w-auto">
//             <Link href="/personality-test">
//               <button className="font-outfit w-full md:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4.5 rounded-full font-bold text-[13px] tracking-[0.08em] text-on-brand bg-linear-to-r from-brand to-accent shadow-(--shadow-brand-md) hover:scale-[1.04] hover:shadow-(--shadow-btn-hover-lg) active:scale-[0.97] transition-all duration-300 cursor-pointer border-0 relative overflow-hidden group">
//                 <span className="relative z-10 uppercase">
//                   Start My Personality Scan
//                 </span>
//                 <ArrowRight
//                   size={18}
//                   className="relative z-10 group-hover:translate-x-1 transition-transform"
//                 />
//                 <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
//               </button>
//             </Link>
//           </div>
//         </div>

//         <div className="flex flex-col gap-4">
//           <div className="animate-[fadeIn_0.65s_ease_0.5s_both] glass-card p-6 relative overflow-hidden rounded-3xl">
//             <div className="noise-layer absolute inset-0 opacity-[0.03] pointer-events-none" />
//             <p className="font-outfit text-center text-[13px] font-medium text-slate-400 mb-4">
//               Compatibility Meter
//             </p>
//             <div className="flex items-center justify-center gap-4">
//               <div className="animate-[pulseGlow_2.5s_ease-in-out_infinite] rounded-full p-0.75">
//                 <div className="rounded-full overflow-hidden flex">
//                   <Image
//                     alt="Male avatar"
//                     width={100}
//                     height={100}
//                     src={MaleAvatar}
//                     sizes="100px"
//                     priority
//                   />
//                 </div>
//               </div>
//               <Gauge value={94} />
//               <div className="animate-[pulseGlow_2.5s_ease-in-out_infinite] rounded-full p-0.75">
//                 <div className="rounded-full overflow-hidden flex">
//                   <Image
//                     alt="Female avatar"
//                     width={100}
//                     height={100}
//                     src={FemaleAvatar}
//                     sizes="100px"
//                     priority
//                   />
//                 </div>
//               </div>
//             </div>
//             <div className="flex flex-wrap gap-1.75 mt-5 justify-center">
//               {tags.map((t) => (
//                 <Tag key={t} label={t} />
//               ))}
//             </div>
//           </div>

//           <div className="animate-[fadeIn_0.65s_ease_0.65s_both] hidden md:block glass-card p-5 relative overflow-hidden rounded-3xl">
//             <div className="noise-layer absolute inset-0 opacity-[0.03] pointer-events-none" />
//             <p className="font-outfit text-[13px] font-medium text-slate-400 mb-3">
//               Compatible Personalities
//             </p>
//             <div className="grid grid-cols-2 gap-2">
//               <PersonRow name="Sherry" match={94} v="a" />
//               <PersonRow name="Bruno" match={91} v="b" />
//               <PersonRow name="Sherry" match={89} v="c" />
//               <PersonRow name="Bruno" match={87} v="d" />
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }



import Image from "next/image";
import MaleAvatar from "../../../public/images/male_shadimate.png";
import FemaleAvatar from "../../../public/images/female_shadimate.png";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const AvatarSmall = ({
  v,
  size = 38,
}: {
  v: "a" | "b" | "c" | "d";
  size?: number;
}) => {
  const cfg = {
    a: {
      b1: "#E8547A",
      b2: "#7A1A35",
      s: "#F0A0B0",
      h: "#C0415C",
      e: "#3d0018",
    },
    b: {
      b1: "#C4703A",
      b2: "#6B3010",
      s: "#E8A070",
      h: "#A05828",
      e: "#3d1800",
    },
    c: {
      b1: "#B54A7A",
      b2: "#5A1A3A",
      s: "#D890B0",
      h: "#903860",
      e: "#300020",
    },
    d: {
      b1: "#D4845A",
      b2: "#7A3820",
      s: "#EDB898",
      h: "#B06040",
      e: "#3d1800",
    },
  };
  const c = cfg[v];
  const gid = `sav-${v}`;
  return (
    <svg width={size} height={size} viewBox="0 0 38 38" fill="none">
      <circle cx="19" cy="19" r="19" fill={`url(#${gid})`} />
      <ellipse cx="19" cy="18" rx="9" ry="9.5" fill={c.s} />
      <path
        d="M10 16 Q11 8 19 7 Q27 8 28 16 Q25 10 19 10 Q13 10 10 16Z"
        fill={c.h}
      />
      <ellipse cx="15.5" cy="17" rx="1.8" ry="1.8" fill="white" />
      <ellipse cx="22.5" cy="17" rx="1.8" ry="1.8" fill="white" />
      <circle cx="16" cy="17.4" r="1" fill={c.e} />
      <circle cx="23" cy="17.4" r="1" fill={c.e} />
      <path
        d="M15.5 22 Q19 24.5 22.5 22"
        stroke={c.h}
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
      <rect
        x="15"
        y="24"
        width="8"
        height="5"
        rx="2.5"
        fill={c.s}
        opacity="0.7"
      />
      <ellipse cx="19" cy="33" rx="9" ry="5" fill={c.h} opacity="0.5" />
      <defs>
        <radialGradient id={gid} cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor={c.b1} />
          <stop offset="100%" stopColor={c.b2} />
        </radialGradient>
      </defs>
    </svg>
  );
};

const Gauge = ({ value = 94 }: { value?: number }) => {
  const r = 44;
  const circ = 2 * Math.PI * r;
  return (
    <div className="relative flex items-center justify-center w-27.5 h-27.5">
      <svg
        width="110"
        height="110"
        viewBox="0 0 110 110"
        className="absolute inset-0"
        style={{ transform: "rotate(-225deg)" }}
      >
        <circle
          cx="55"
          cy="55"
          r={r}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="8"
          strokeDasharray={`${circ * 0.75} ${circ}`}
          strokeLinecap="round"
        />
        <circle
          cx="55"
          cy="55"
          r={r}
          fill="none"
          stroke="url(#gGrad)"
          strokeWidth="8"
          strokeDasharray={`${circ * 0.75 * (value / 100)} ${circ}`}
          strokeLinecap="round"
          style={{ filter: "drop-shadow(0 0 7px rgba(232,84,122,0.75))" }}
        />
        <defs>
          <linearGradient id="gGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E8547A" />
            <stop offset="100%" stopColor="#F0C070" />
          </linearGradient>
        </defs>
      </svg>
      <div className="relative z-10 flex flex-col items-center leading-none">
        <span className="font-outfit text-slate-800 font-bold text-[26px]">
          {value}%
        </span>
        <span className="font-outfit text-[9px] font-semibold tracking-[0.13em] text-slate-500 mt-1">
          MATCH
        </span>
      </div>
    </div>
  );
};

const Tag = ({ label }: { label: string }) => (
  <span className="font-outfit text-[10px] font-semibold tracking-[0.08em] text-slate-600 border border-slate-300 rounded-[7px] px-2.5 py-1 bg-white shadow-sm whitespace-nowrap">
    {label}
  </span>
);

const PersonRow = ({
  name,
  match,
  v,
}: {
  name: string;
  match: number;
  v: "a" | "b" | "c" | "d";
}) => (
  <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-[14px] bg-white border border-slate-200 shadow-sm">
    <div className="rounded-full overflow-hidden shrink-0">
      <AvatarSmall v={v} size={38} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-outfit text-[13px] font-semibold text-slate-800 truncate">
        {name}
      </p>
      <p className="font-outfit text-[10px] text-slate-500 mt-0.5">
        Compatible
      </p>
    </div>
    <div className="text-right shrink-0">
      <p
        className="font-outfit text-[15px] font-bold"
        style={{ color: "#E8547A" }}
      >
        {match}%
      </p>
      <p className="font-outfit text-[9px] font-semibold tracking-widest text-slate-500">
        MATCH
      </p>
    </div>
  </div>
);

export default function HeroSection() {
  const tags = [
    "INTROVERT",
    "HIGH EMPATHY",
    "VALUE-DRIVEN",
    "ANALYTICAL",
    "CURIOUS",
    "CREATIVE",
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center px-5 py-16 md:py-20 bg-white">
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 w-full max-w-5xl items-center">
        <div className="flex flex-col gap-6">
          <h1
            className="animate-[fadeUp_0.65s_ease_0.05s_both] leading-[0.9] tracking-[-0.04em] text-slate-800"
            style={{ fontWeight: 800, fontSize: "clamp(40px, 10vw, 84px)" }}
          >
            <span className="block opacity-90">FIND YOUR</span>
            <span className="block text-gradient-rose">SOUL MATE</span>
          </h1>

          <p className="font-outfit animate-[fadeUp_0.65s_ease_0.2s_both] text-slate-600 leading-relaxed max-w-sm text-[15px] font-medium">
            Traditional matching is dead. We use behavioral psychology to find
            your 99.9% true connection.
          </p>

          <div className="animate-[fadeUp_0.65s_ease_0.35s_both] w-full md:w-auto">
            <Link href="/personality-test">
              <button className="font-outfit w-full md:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4.5 rounded-full font-bold text-[13px] tracking-[0.08em] text-white bg-linear-to-r from-brand to-accent shadow-(--shadow-brand-md) hover:scale-[1.04] hover:shadow-(--shadow-btn-hover-lg) active:scale-[0.97] transition-all duration-300 cursor-pointer border-0 relative overflow-hidden group">
                <span className="relative z-10 uppercase">
                  Start My Personality Scan
                </span>
                <ArrowRight
                  size={18}
                  className="relative z-10 group-hover:translate-x-1 transition-transform"
                />
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="animate-[fadeIn_0.65s_ease_0.5s_both] bg-white border border-slate-200 shadow-xl p-6 relative overflow-hidden rounded-3xl">
            <div className="noise-layer absolute inset-0 opacity-[0.03] pointer-events-none" />
            <p className="font-outfit text-center text-[13px] font-medium text-slate-600 mb-4">
              Compatibility Meter
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="animate-[pulseGlow_2.5s_ease-in-out_infinite] rounded-full p-0.75">
                <div className="rounded-full overflow-hidden flex">
                  <Image
                    alt="Male avatar"
                    width={100}
                    height={100}
                    src={MaleAvatar}
                    sizes="100px"
                    priority
                  />
                </div>
              </div>
              <Gauge value={94} />
              <div className="animate-[pulseGlow_2.5s_ease-in-out_infinite] rounded-full p-0.75">
                <div className="rounded-full overflow-hidden flex">
                  <Image
                    alt="Female avatar"
                    width={100}
                    height={100}
                    src={FemaleAvatar}
                    sizes="100px"
                    priority
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.75 mt-5 justify-center">
              {tags.map((t) => (
                <Tag key={t} label={t} />
              ))}
            </div>
          </div>

          <div className="animate-[fadeIn_0.65s_ease_0.65s_both] hidden md:block bg-white border border-slate-200 shadow-xl p-5 relative overflow-hidden rounded-3xl">
            <div className="noise-layer absolute inset-0 opacity-[0.03] pointer-events-none" />
            <p className="font-outfit text-[13px] font-medium text-slate-600 mb-3">
              Compatible Personalities
            </p>
            <div className="grid grid-cols-2 gap-2">
              <PersonRow name="Sherry" match={94} v="a" />
              <PersonRow name="Bruno" match={91} v="b" />
              <PersonRow name="Sherry" match={89} v="c" />
              <PersonRow name="Bruno" match={87} v="d" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}