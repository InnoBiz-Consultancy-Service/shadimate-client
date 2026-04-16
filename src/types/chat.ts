export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: "text" | "image" | "file" | "voice";
  status: "sent" | "delivered" | "seen";
  createdAt: string;
  // optimistic flag — temp message যতক্ষণ server confirm না করে
  _optimistic?: boolean;
  updatedAt?: string;
}

export interface Conversation {
  userId: string | null;
  name: string | null;
  avatar?: string | null;
  lastMessage: string | null;
  lastMessageType: string | null;
  lastMessageTime: string;
  status?: string;
  unreadCount: number;
  isLocked: boolean;
}

export interface MessageMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}