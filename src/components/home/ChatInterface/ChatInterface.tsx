import React from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ChatFeature {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Message {
  id: number;
  text: string;
  time: string;
  isSender: boolean;
  avatar?: string;
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const HeartIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
      stroke="#e11d48"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

const LockChatIcon = () => (
  <svg
    width="18"
    height="18"
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
      stroke="#0891b2"
      strokeWidth="1.5"
    />
    <path
      d="M7 11V7a5 5 0 0110 0v4"
      stroke="#0891b2"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const ImageIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="2"
      stroke="#7c3aed"
      strokeWidth="1.5"
    />
    <circle cx="8.5" cy="8.5" r="1.5" stroke="#7c3aed" strokeWidth="1.5" />
    <path
      d="M21 15l-5-5L5 21"
      stroke="#7c3aed"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const NotifIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"
      stroke="#d97706"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.73 21a2 2 0 01-3.46 0"
      stroke="#d97706"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const TypingIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
      stroke="#059669"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

const VerifiedIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M12 2l2.4 4.8 5.3.8-3.85 3.75.91 5.3L12 14.1l-4.76 2.55.91-5.3L4.3 7.6l5.3-.8z"
      fill="#f59e0b"
      stroke="#f59e0b"
      strokeWidth="1"
      strokeLinejoin="round"
    />
  </svg>
);

// ─── Data ─────────────────────────────────────────────────────────────────────
const CHAT_FEATURES: ChatFeature[] = [
  {
    id: 1,
    icon: <LockChatIcon />,
    title: "End-to-End Encrypted",
    description:
      "Every conversation is fully encrypted. Only you and your match can read your messages.",
  },
  {
    id: 2,
    icon: <HeartIcon />,
    title: "Message Your Matches",
    description:
      "Chat only with people you've mutually liked. No random strangers in your inbox.",
  },
  {
    id: 3,
    icon: <ImageIcon />,
    title: "Share Photos Safely",
    description:
      "Send photos privately within the chat. You control who sees what, always.",
  },
  {
    id: 4,
    icon: <NotifIcon />,
    title: "Instant Notifications",
    description:
      "Get notified the moment your match replies. Never miss an important conversation.",
  },
  {
    id: 5,
    icon: <TypingIcon />,
    title: "Real-time Messaging",
    description:
      "See when your match is typing. Conversations feel natural and alive.",
  },
];

const MESSAGES: Message[] = [
  {
    id: 1,
    text: "Hi! I came across your profile and really liked it 😊",
    time: "10:32 AM",
    isSender: false,
  },
  {
    id: 2,
    text: "Thank you! I noticed yours too. Where are you from?",
    time: "10:34 AM",
    isSender: true,
  },
  {
    id: 3,
    text: "I'm from Chittagong. Currently working in Dhaka. You?",
    time: "10:35 AM",
    isSender: false,
  },
  {
    id: 4,
    text: "Dhaka as well! Maybe we could meet sometime ☕",
    time: "10:37 AM",
    isSender: true,
  },
];

// ─── Mock Chat UI ─────────────────────────────────────────────────────────────
function MockChat() {
  return (
    <div className="w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-5 py-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-pink-400 to-rose-500 text-sm font-bold text-white">
              S
            </div>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-slate-900 bg-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-[14px] font-semibold text-white">
                Sadia Islam
              </p>
              <VerifiedIcon />
            </div>
            <p className="text-[11px] text-emerald-400">Online now</p>
          </div>
        </div>
        {/* Action icons */}
        <div className="flex items-center gap-3">
          <button
            aria-label="Call"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-slate-300 transition hover:bg-white/20"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.6 19.79 19.79 0 01.5 2.1 2 2 0 012.49 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.18 6.18l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            aria-label="More options"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-slate-300 transition hover:bg-white/20"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5" cy="12" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="19" cy="12" r="1.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-3 px-5 py-5">
        {MESSAGES.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isSender ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[78%] ${msg.isSender ? "" : "flex items-end gap-2"}`}
            >
              {!msg.isSender && (
                <div className="mb-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-pink-400 to-rose-500 text-[10px] font-bold text-white">
                  S
                </div>
              )}
              <div>
                <div
                  className={`rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${
                    msg.isSender
                      ? "rounded-tr-sm bg-rose-500 text-white"
                      : "rounded-tl-sm bg-white/10 text-slate-200"
                  }`}
                >
                  {msg.text}
                </div>
                <p
                  className={`mt-1 text-[10px] text-slate-500 ${msg.isSender ? "text-right" : "text-left"}`}
                >
                  {msg.time}
                  {msg.isSender && (
                    <span className="ml-1 text-emerald-400">✓✓</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        <div className="flex items-end gap-2">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-pink-400 to-rose-500 text-[10px] font-bold text-white">
            S
          </div>
          <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-white/10 px-4 py-3">
            <span
              className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
              style={{ animationDelay: "0ms" }}
            />
            <span
              className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
              style={{ animationDelay: "150ms" }}
            />
            <span
              className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
      </div>

      {/* Input bar */}
      <div className="flex items-center gap-3 border-t border-white/10 bg-white/5 px-5 py-4">
        <button
          aria-label="Attach image"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:text-slate-200"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect
              x="3"
              y="3"
              width="18"
              height="18"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <circle
              cx="8.5"
              cy="8.5"
              r="1.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M21 15l-5-5L5 21"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="flex-1 rounded-full bg-white/10 px-4 py-2 text-[13px] text-slate-400">
          Type a message...
        </div>
        <button
          aria-label="Send message"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg transition hover:bg-rose-600"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path
              d="M22 2L11 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M22 2L15 22l-4-9-9-4 20-7z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Feature Card ─────────────────────────────────────────────────────────────
function FeatureCard({ feature }: { feature: ChatFeature }) {
  return (
    <div className="group flex items-start gap-4 rounded-2xl border border-white/8 bg-white/5 p-5 transition-all hover:border-white/15 hover:bg-white/8">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10">
        {feature.icon}
      </div>
      <div>
        <h4 className="text-[14px] font-semibold text-white">
          {feature.title}
        </h4>
        <p className="mt-1 text-[12px] leading-relaxed text-slate-400">
          {feature.description}
        </p>
      </div>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function ChatSection() {
  return (
    <section
      aria-labelledby="chat-heading"
      className="relative overflow-hidden bg-[#0a0a14] px-6 py-24 lg:px-8"
    >
      {/* Glowing background blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-1/2 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-600/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-96 w-96 translate-x-1/3 -translate-y-1/3 rounded-full bg-violet-600/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-1/3 h-64 w-64 translate-y-1/2 rounded-full bg-cyan-600/8 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl">
        {/* ── Header ── */}
        <div className="mb-16 text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1.5 text-xs font-medium tracking-widest text-rose-400">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
                fill="currentColor"
                fillOpacity="0.3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
            REAL CONVERSATIONS
          </span>

          <h2
            id="chat-heading"
            className="text-4xl font-bold leading-tight text-white sm:text-5xl"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Talk, Connect &{" "}
            <span
              className="text-brand">
              Find Your One
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-slate-400">
            Our built-in chat lets you have real, meaningful conversations with
            your matches — private, secure, and designed to help you truly
            connect.
          </p>
        </div>

        {/* ── Two-column layout ── */}
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left — mock chat */}
          <div className="flex justify-center lg:justify-start">
            <div className="w-full max-w-sm">
              <MockChat />

              {/* Floating badges */}
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-[12px] text-emerald-400">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  1,240 active conversations now
                </div>
                <div className="flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-[12px] text-rose-400">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                  </svg>
                  320 matches made this week
                </div>
              </div>
            </div>
          </div>

          {/* Right — features + stat cards */}
          <div className="flex flex-col gap-4">
            {/* Feature list */}
            <div className="space-y-3">
              {CHAT_FEATURES.map((f) => (
                <FeatureCard key={f.id} feature={f} />
              ))}
            </div>

            {/* CTA */}
            <div className="mt-2 rounded-2xl border border-rose-500/20 bg-linear-to-br from-rose-950/50 to-[#0a0a14] p-6">
              <p className="text-[15px] font-semibold text-white">
                Ready to start a conversation?
              </p>
              <p className="mt-1 text-[13px] text-slate-400">
                Create your free profile and start chatting with verified
                matches today.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button className="rounded-full bg-rose-500 px-6 py-2.5 text-[13px] font-semibold text-white shadow-lg transition hover:bg-rose-600">
                  Start for Free
                </button>
                <button className="rounded-full border border-white/15 bg-white/5 px-6 py-2.5 text-[13px] font-medium text-slate-300 transition hover:bg-white/10">
                  See how it works
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom stats ── */}
        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { value: "50K+", label: "Messages sent daily" },
            { value: "98%", label: "Delivery rate" },
            { value: "256-bit", label: "Encryption standard" },
            { value: "4.9 ★", label: "Chat experience rating" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/8 bg-white/5 p-5 text-center"
            >
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="mt-1 text-[12px] text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
