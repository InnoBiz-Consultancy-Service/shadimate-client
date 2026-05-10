"use client";
import React from "react";
import Image from "next/image";

// ─── Types ───────────────────────────────────────────────────────────────────
interface PrivacyFeature {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

// ─── Icon Components ─────────────────────────────────────────────────────────
const LockIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <rect
      x="3"
      y="11"
      width="18"
      height="11"
      rx="2"
      stroke="var(--color-brand)"
      strokeWidth="1.5"
    />
    <path
      d="M7 11V7a5 5 0 0110 0v4"
      stroke="var(--color-brand)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="12" cy="16.5" r="1.5" fill="var(--color-brand)" />
  </svg>
);

const ProfileIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle
      cx="12"
      cy="8"
      r="4"
      stroke="var(--color-brand)"
      strokeWidth="1.5"
    />
    <path
      d="M4 20c0-4 3.58-7 8-7s8 3 8 7"
      stroke="var(--color-brand)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M17 14l1.5 1.5L22 12"
      stroke="var(--color-brand)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
      stroke="var(--color-brand)"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M9 12l2 2 4-4"
      stroke="var(--color-brand)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const NoShareIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M3 12h18M3 6h18M3 18h18"
      stroke="var(--color-brand)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle
      cx="18"
      cy="6"
      r="2.5"
      fill="white"
      stroke="var(--color-brand)"
      strokeWidth="1.5"
    />
    <circle
      cx="6"
      cy="18"
      r="2.5"
      fill="white"
      stroke="var(--color-brand)"
      strokeWidth="1.5"
    />
    <path
      d="M16.5 4.5l3 3"
      stroke="var(--color-brand)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// ─── Data ─────────────────────────────────────────────────────────────────────
const PRIVACY_FEATURES: PrivacyFeature[] = [
  {
    id: 1,
    icon: <LockIcon />,
    title: "Encrypted Data",
    description:
      "All your information is protected with SSL encryption. No unauthorized person can ever access your personal data.",
  },
  {
    id: 2,
    icon: <ProfileIcon />,
    title: "Profile Control",
    description:
      "You decide who gets to view your profile. Customize your visibility settings fully on your own terms.",
  },
  {
    id: 3,
    icon: <ShieldCheckIcon />,
    title: "Verified Identities",
    description:
      "Every profile is verified by our team, keeping you completely safe from fake or fraudulent accounts.",
  },
  {
    id: 4,
    icon: <NoShareIcon />,
    title: "No Data Sharing",
    description:
      "Your personal information is never sold or shared with any third party — ever. Your privacy is non-negotiable.",
  },
];

const PROMISES: string[] = [
  "24/7 security monitoring",
  "Delete your account anytime, hassle-free",
  "Fully transparent privacy policy",
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function FeatureCard({ feature }: { feature: PrivacyFeature }) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white shadow-sm p-7 transition-all hover:shadow-md hover:border-brand/30">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-brand/8">
        {feature.icon}
      </div>
      <h3 className="mb-2 text-[15px] font-medium text-slate-900">
        {feature.title}
      </h3>
      <p className="text-[13px] leading-relaxed text-slate-600">
        {feature.description}
      </p>
    </div>
  );
}

function PromiseBanner() {
  return (
    <div className="mt-14 flex flex-col items-start gap-8 rounded-2xl bg-slate-900 p-10 sm:flex-row sm:items-center shadow-xl">
      {/* Lock circle */}
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-brand/15">
        <svg
          width="38"
          height="38"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="3"
            y="11"
            width="18"
            height="11"
            rx="2"
            fill="var(--color-brand)"
            fillOpacity="0.25"
          />
          <rect
            x="3"
            y="11"
            width="18"
            height="11"
            rx="2"
            stroke="var(--color-brand)"
            strokeWidth="1.5"
          />
          <path
            d="M7 11V7a5 5 0 0110 0v4"
            stroke="var(--color-brand)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="12" cy="16" r="1.5" fill="var(--color-brand)" />
        </svg>
      </div>

      {/* Text */}
      <div>
        <h3 className="font-serif text-xl font-semibold text-white">
          Our Promise to You
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-slate-400">
          Your trust is the most valuable thing to us.
          <br />
          We are always here to protect you.
        </p>
        <ul className="mt-4 space-y-2">
          {PROMISES.map((promise) => (
            <li
              key={promise}
              className="flex items-center gap-3 text-[13px] text-slate-300"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/15">
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2.5 6l2.5 2.5L10 3.5"
                    stroke="var(--color-brand)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              {promise}
            </li>
          ))}
        </ul>
      </div>

      {/* Decorative image placeholder — replace src with your actual image */}
      <div className="relative ml-auto hidden h-40 w-40 overflow-hidden rounded-2xl sm:block bg-text border border-brand/30">
        <Image
          src="/images/privacy-illustration.png"
          alt="Privacy illustration"
          fill
          className="object-cover opacity-80"
          // Remove the fallback below once you add the real image
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
        {/* Fallback if image is missing */}
        <div className="flex h-full w-full items-center justify-center rounded-2xl bg-brand/8">
          <svg
            width="56"
            height="56"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4z"
              fill="var(--color-brand)"
              fillOpacity="0.3"
            />
            <path
              d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4z"
              stroke="var(--color-brand)"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M9 12l2 2 4-4"
              stroke="var(--color-brand)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PrivacySection() {
  return (
    <section
      aria-labelledby="privacy-heading"
      className="relative overflow-hidden bg-white px-6 py-20 lg:px-8 border-t border-slate-100"
    >
      {/* Subtle background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-80 w-80 -translate-y-1/3 translate-x-1/3 rounded-full bg-brand/8/80"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 -translate-x-1/3 translate-y-1/3 rounded-full bg-slate-50"
      />

      <div className="relative mx-auto max-w-5xl">
        {/* ── Header ── */}
        <div className="mb-14 text-center">
          {/* Badge */}
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand/15 bg-brand/8 px-4 py-1.5 text-xs font-medium tracking-widest text-brand shadow-sm">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4z"
                fill="var(--color-brand)"
                fillOpacity="0.2"
              />
              <path
                d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4z"
                stroke="var(--color-brand)"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
            Your Information is Safe
          </span>

          {/* Heading */}
          <h2
            id="privacy-heading"
            className="font-serif text-4xl font-semibold leading-snug text-slate-900 sm:text-5xl"
          >
            Your Privacy is{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{
                background:
                  "linear-gradient(to right, var(--color-brand), var(--color-accent))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Our Highest Priority
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-slate-600">
            We believe every person&apos;s personal information belongs to them
            alone. That&apos;s why we go to the highest lengths to ensure your
            data stays protected.
          </p>
        </div>

        {/* ── Feature Grid ── */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PRIVACY_FEATURES.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>

        {/* ── Promise Banner ── */}
        <PromiseBanner />
      </div>
    </section>
  );
}
