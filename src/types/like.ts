/* ── Like Types ── */

export interface LikeToggleResponse {
  action: "liked" | "unliked";
}

export interface LikeCountResponse {
  count: number;
}

export interface LikeProfileData {
  gender?: string;
  birthDate?: string;
  profession?: string;
  economicalStatus?: string;
  personality?: string;
  aboutMe?: string;
  height?: number;
  skinTone?: string;
  religion?: {
    faith?: string;
    practiceLevel?: string;
    dailyLifeStyleSummary?: string;
  };
  address?: {
    divisionId?: { _id: string; name: string };
    districtId?: { _id: string; name: string };
  };
  education?: {
    graduation?: {
      variety?: string;
      department?: string;
      institution?: string;
    };
  };
  userId?: {
    _id: string;
    name: string;
  };
}

export interface WhoLikedMeItem {
  userId: string;
  likedAt: string;
  profile: LikeProfileData | null;
}

export interface MyLikesItem {
  userId: string;
  likedAt: string;
  profile: LikeProfileData | null;
}

export interface NotificationItem {
  _id: string;
  type: string;
  message: string;
  senderId: string | { _id: string; name: string };
  senderName?: string;
  metadata?: { conversationWith?: string };
  isRead: boolean;
  createdAt: string;
}
