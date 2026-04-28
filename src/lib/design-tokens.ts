/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║           primehalf — CENTRAL DESIGN TOKENS              ║
 * ║  Edit this ONE file to retheme the entire application.   ║
 * ║  Components import `dt` and use `dt.card`, `dt.text` etc ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * Color values live in  →  src/app/globals.css  (@theme block)
 * Shape / layout tokens →  here (dt object)
 *
 * Semantic Tailwind classes generated from globals.css @theme:
 *   bg-surface          = page background (#f8f8fb)
 *   bg-surface-card     = card / input background (#ffffff)
 *   bg-surface-raised   = pill / hover background (#f1f5f9)
 *   text-text           = primary text (#111827)
 *   text-text-secondary = labels, sub-headings (#4b5563)
 *   text-text-muted     = placeholders, timestamps (#9ca3af)
 *   border-border       = default border (#e5e7eb)
 *   border-border-subtle= ultra-soft divider (#f3f4f6)
 */

export const dt = {
  // ── Page / Layout ──────────────────────────────────────────
  page: "bg-surface min-h-screen",

  // ── Card ───────────────────────────────────────────────────
  // Change this to restyle EVERY card in the app
  card: "bg-surface-card rounded-2xl border border-border shadow-sm",
  cardRounded: "rounded-2xl",

  // ── Navigation Bar ─────────────────────────────────────────
  // Change this to restyle BOTH desktop & mobile nav bars
  navBar:       "bg-surface-card/95 backdrop-blur-xl border-border",
  navBarDesktop:"bg-surface-card/95 backdrop-blur-xl border-b border-border shadow-sm",
  navBarMobile: "bg-surface-card/95 backdrop-blur-xl border-t border-border",

  // ── Text ───────────────────────────────────────────────────
  // Change these to restyle ALL text across the app
  textPrimary:   "text-text",           // headings, important text  → #111827
  textSecondary: "text-text-secondary", // labels, descriptions      → #4b5563
  textMuted:     "text-text-muted",     // placeholders, timestamps  → #9ca3af

  // ── Form Inputs ────────────────────────────────────────────
  inputBase:    "bg-surface-card text-text border-border rounded-2xl",
  inputLabel:   "text-text-secondary text-[11px] font-semibold tracking-[0.10em] uppercase",
  inputError:   "text-red-500",
  inputHint:    "text-text-muted",

  // ── Borders / Dividers ─────────────────────────────────────
  border:       "border-border",        // primary border → #e5e7eb
  borderSubtle: "border-border-subtle", // soft divider    → #f3f4f6
  divider:      "border-t border-border-subtle",

  // ── Surface / Pill ─────────────────────────────────────────
  pill: "bg-surface-raised border border-border text-text-secondary text-[10px] font-medium rounded-md px-2 py-0.5",

  // ── Section Headings ──────────────────────────────────────-
  heading1: "font-syne text-text text-2xl font-extrabold tracking-tight",
  heading2: "font-syne text-text text-xl font-bold",
  heading3: "font-syne text-text text-lg font-bold",

  // ── Interactive ────────────────────────────────────────────
  // Secondary / outline button
  btnOutline: "bg-surface-card border border-border text-text-secondary hover:bg-surface-raised transition-all duration-200",
  // Active nav link
  navActive:  "text-brand bg-brand/8",
  navInactive:"text-text-secondary hover:text-text hover:bg-surface-raised",
} as const;
