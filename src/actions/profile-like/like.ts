"use server";

import { universalApi } from "@/actions/universal-api";
import type {
  LikeToggleResponse,
  LikeCountResponse,
  WhoLikedMeItem,
  MyLikesItem,
} from "@/types/like";

export async function toggleLike(targetUserId: string) {
  return universalApi<LikeToggleResponse>({
    endpoint: `/likes/${targetUserId}`,
    method: "POST",
    requireAuth: true,
  });
}

export async function getLikeCount(userId: string) {
  return universalApi<LikeCountResponse>({
    endpoint: `/likes/count/${userId}`,
  });
}

export async function getWhoLikedMe() {
  return universalApi<WhoLikedMeItem[]>({
    endpoint: `/likes/who-liked-me`,
  });
}

export async function getMyLikes() {
  return universalApi<MyLikesItem[]>({
    endpoint: `/likes/my-likes`,
  });
}

export async function getNotifications(page = 1, limit = 20) {
  return universalApi<unknown>({
    endpoint: `/notifications?page=${page}&limit=${limit}`,
  });
}

export async function getUnreadNotificationCount() {
  return universalApi<{ unreadCount: number }>({
    endpoint: `/notifications/unread-count`,
  });
}

export async function markAllNotificationsRead() {
  return universalApi({
    endpoint: `/notifications/mark-all-read`,
    method: "PATCH",
  });
}

export async function markNotificationRead(id: string) {
  return universalApi({
    endpoint: `/notifications/${id}/read`,
    method: "PATCH",
  });
}

export async function deleteNotification(id: string) {
  return universalApi({
    endpoint: `/notifications/${id}`,
    method: "DELETE",
  });
}
