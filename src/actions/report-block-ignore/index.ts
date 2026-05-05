"use server";

import { universalApi } from "@/actions/universal-api";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ReportReason =
  | "harassment"
  | "fake_profile"
  | "inappropriate_content"
  | "spam"
  | "hate_speech"
  | "scam"
  | "other";

export interface ReportData {
  _id: string;
  status: "pending" | "reviewed" | "resolved" | "dismissed";
}

export interface MyReportItem {
  reportId: string;
  reportedUser: { userId: string; name: string };
  reason: ReportReason;
  reasonLabel: string;
  details: string;
  status: "pending" | "reviewed" | "resolved" | "dismissed";
  createdAt: string;
}

export interface BlockedUser {
  userId: string;
  name: string;
  blockedAt: string;
}

export interface BlockStatus {
  iBlockedThem: boolean;
  theyBlockedMe: boolean;
  isBlocked: boolean;
}

export interface IgnoredUser {
  userId: string;
  name: string;
  ignoredAt: string;
}

export interface IgnoredConversation {
  userId: string;
  name: string;
  lastMessage: string;
  lastMessageType: string;
  lastMessageTime: string;
  unreadCount: number;
}

// ─── Report ───────────────────────────────────────────────────────────────────

export async function submitReport(
  userId: string,
  reason: ReportReason,
  details: string,
) {
  return universalApi<ReportData>({
    endpoint: `/report/${userId}`,
    method: "POST",
    data: { reason, details },
    requireAuth: true,
  });
}

export async function getMyReports() {
  return universalApi<MyReportItem[]>({
    endpoint: "/report/my",
    method: "GET",
    requireAuth: true,
  });
}

// ─── Block ────────────────────────────────────────────────────────────────────

export async function toggleBlock(userId: string) {
  return universalApi<{ action: "blocked" | "unblocked" }>({
    endpoint: `/block/${userId}`,
    method: "POST",
    requireAuth: true,
  });
}

export async function getBlockList() {
  return universalApi<BlockedUser[]>({
    endpoint: "/block",
    method: "GET",
    requireAuth: true,
  });
}

export async function getBlockStatus(userId: string) {
  return universalApi<BlockStatus>({
    endpoint: `/block/status/${userId}`,
    method: "GET",
    requireAuth: true,
  });
}

// ─── Ignore ───────────────────────────────────────────────────────────────────

export async function toggleIgnore(userId: string) {
  return universalApi<{ action: "ignored" | "unignored" }>({
    endpoint: `/ignore/${userId}`,
    method: "POST",
    requireAuth: true,
  });
}

export async function getIgnoreList() {
  return universalApi<IgnoredUser[]>({
    endpoint: "/ignore",
    method: "GET",
    requireAuth: true,
  });
}

export async function getIgnoreStatus(userId: string) {
  return universalApi<{ isIgnored: boolean }>({
    endpoint: `/ignore/status/${userId}`,
    method: "GET",
    requireAuth: true,
  });
}

export async function getIgnoredConversations() {
  return universalApi<IgnoredConversation[]>({
    endpoint: "/ignore/conversations",
    method: "GET",
    requireAuth: true,
  });
}

export async function getIgnoredMessages(
  senderId: string,
  page = 1,
  limit = 20,
) {
  return universalApi<unknown>({
    endpoint: `/ignore/messages/${senderId}?page=${page}&limit=${limit}`,
    method: "GET",
    requireAuth: true,
  });
}

export async function deleteIgnoredMessages(senderId: string) {
  return universalApi<{ message: string }>({
    endpoint: `/ignore/messages/${senderId}`,
    method: "DELETE",
    requireAuth: true,
  });
}
