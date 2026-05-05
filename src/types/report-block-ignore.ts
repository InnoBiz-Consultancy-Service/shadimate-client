// ─── Re-export from actions so components can import from one place ────────────
export type {
  ReportReason,
  ReportData,
  MyReportItem,
  BlockedUser,
  BlockStatus,
  IgnoredUser,
  IgnoredConversation,
} from "@/actions/report-block-ignore";

// ─── UI-level state types ─────────────────────────────────────────────────────

export type UserRelationStatus = {
  isBlocked: boolean; // either party blocked
  iBlockedThem: boolean; // current user blocked them
  theyBlockedMe: boolean; // they blocked current user
  isIgnored: boolean; // current user ignoring them
};
