// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import Link from "next/link";
// import {
//   Bell,
//   Heart,
//   Sparkles,
//   Eye,
//   CheckCheck,
//   Trash2,
//   Loader2,
//   ArrowRight,
//   User,
//   Clock,
// } from "lucide-react";
// import type { NotificationItem } from "@/types/like";
// import {
//   deleteNotification,
//   getNotifications,
//   markAllNotificationsRead,
//   markNotificationRead,
// } from "@/actions/profile-like/like";
// import {
//   getProfileVisitCount,
//   getProfileVisitors,
// } from "@/actions/profile-visit/profile-visit";

// function timeAgo(dateStr: string): string {
//   const diff = Date.now() - new Date(dateStr).getTime();
//   const mins = Math.floor(diff / 60000);
//   if (mins < 1) return "just now";
//   if (mins < 60) return `${mins} min ago`;
//   const hrs = Math.floor(mins / 60);
//   if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
//   const days = Math.floor(hrs / 24);
//   if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
//   return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? "s" : ""} ago`;
// }

// function senderName(n: NotificationItem): string {
//   if (n.senderName) return n.senderName;
//   if (typeof n.senderId === "object" && n.senderId !== null)
//     return (n.senderId as { name: string }).name;
//   return "Someone";
// }

// function NotifIcon({ type, isRead }: { type: string; isRead: boolean }) {
//   const baseClasses =
//     "w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200";

//   if (type === "like") {
//     return (
//       <div
//         className={`${baseClasses} ${isRead ? "bg-pink-50 border border-pink-100" : "bg-gradient-to-br from-pink-500 to-rose-500 shadow-md"}`}
//       >
//         <Heart
//           size={16}
//           className={isRead ? "text-pink-500" : "text-white"}
//           fill={isRead ? "none" : "white"}
//         />
//       </div>
//     );
//   }
//   if (type === "profile_visit") {
//     return (
//       <div
//         className={`${baseClasses} ${isRead ? "bg-indigo-50 border border-indigo-100" : "bg-gradient-to-br from-indigo-500 to-purple-500 shadow-md"}`}
//       >
//         <Eye size={15} className={isRead ? "text-indigo-500" : "text-white"} />
//       </div>
//     );
//   }
//   if (type === "match") {
//     return (
//       <div
//         className={`${baseClasses} ${isRead ? "bg-amber-50 border border-amber-100" : "bg-gradient-to-br from-amber-500 to-orange-500 shadow-md"}`}
//       >
//         <Sparkles
//           size={16}
//           className={isRead ? "text-amber-500" : "text-white"}
//         />
//       </div>
//     );
//   }
//   return (
//     <div
//       className={`${baseClasses} ${isRead ? "bg-emerald-50 border border-emerald-100" : "bg-gradient-to-br from-emerald-500 to-teal-500 shadow-md"}`}
//     >
//       <Heart size={14} className={isRead ? "text-emerald-500" : "text-white"} />
//     </div>
//   );
// }

// function notifText(
//   n: NotificationItem,
//   isRead: boolean,
// ): { main: string; sub?: string; badge?: string } {
//   const name = senderName(n);

//   if (n.type === "like") {
//     return {
//       main: `${name} liked you`,
//       sub: "They're interested in you",
//       badge: !isRead ? "New like" : undefined,
//     };
//   }
//   if (n.type === "profile_visit") {
//     return {
//       main: `${name} visited your profile`,
//       sub: "Check who's looking at you",
//       badge: !isRead ? "New visitor" : undefined,
//     };
//   }
//   if (n.type === "match") {
//     return {
//       main: `You matched with ${name}! 🎉`,
//       sub: "Start a conversation now",
//       badge: !isRead ? "New match" : undefined,
//     };
//   }
//   return { main: `${name} interacted with your profile`, sub: "Tap to view" };
// }

// function getNotifLink(n: NotificationItem): string {
//   if (n.type === "match" && n.metadata?.matchedUserId) {
//     return `/chat/${n.metadata.matchedUserId}`;
//   }
//   if (n.type === "like" && n.senderId) {
//     const userId = typeof n.senderId === "string" ? n.senderId : n.senderId._id;
//     return `/profile/${userId}`;
//   }
//   if (n.type === "profile_visit" && n.senderId) {
//     const userId = typeof n.senderId === "string" ? n.senderId : n.senderId._id;
//     return `/profile/${userId}`;
//   }
//   return "#";
// }

// type Tab = "likesMe" | "matches" | "visitors";

// const TABS: {
//   key: Tab;
//   label: string;
//   icon: React.ElementType;
//   description: string;
// }[] = [
//   {
//     key: "likesMe",
//     label: "Likes Me",
//     icon: Heart,
//     description: "People who liked you",
//   },
//   {
//     key: "matches",
//     label: "Matches",
//     icon: Sparkles,
//     description: "Mutual likes",
//   },
//   {
//     key: "visitors",
//     label: "Visitors",
//     icon: Eye,
//     description: "Profile views",
//   },
// ];

// function filterByTab(notifs: NotificationItem[], tab: Tab): NotificationItem[] {
//   if (tab === "likesMe") return notifs.filter((n) => n.type === "like");
//   if (tab === "visitors")
//     return notifs.filter((n) => n.type === "profile_visit");
//   if (tab === "matches") return notifs.filter((n) => n.type === "match");
//   return notifs;
// }

// // Visitor Component
// interface Visitor {
//   id: string;
//   name: string;
//   avatar?: string;
//   visitedAt: string;
//   isPremium?: boolean;
// }

// function VisitorsList() {
//   const [visitors, setVisitors] = useState<Visitor[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [totalCount, setTotalCount] = useState(0);

//   useEffect(() => {
//     const fetchVisitors = async () => {
//       setLoading(true);
//       try {
//         const res = await getProfileVisitors();
//         if (res.success && res.data) {
//           setVisitors(res.data.visitors || []);
//           setTotalCount(res.data.meta.total || 0);
//         }
//       } catch (error) {
//         console.error("Failed to fetch visitors:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchVisitors();
//   }, []);

//   if (loading) {
//     return (
//       <div className="space-y-3">
//         {[1, 2, 3].map((i) => (
//           <div
//             key={i}
//             className="bg-white rounded-2xl border border-slate-100 p-4 animate-pulse"
//           >
//             <div className="flex gap-3">
//               <div className="w-10 h-10 rounded-full bg-slate-200" />
//               <div className="flex-1">
//                 <div className="h-4 bg-slate-200 rounded w-32 mb-2" />
//                 <div className="h-3 bg-slate-100 rounded w-24" />
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   if (visitors.length === 0) {
//     return (
//       <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-10 text-center">
//         <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
//           <Eye size={32} className="text-slate-300" strokeWidth={1.5} />
//         </div>
//         <h2 className="font-syne text-slate-700 text-xl font-bold mb-2">
//           No Visitors Yet
//         </h2>
//         <p className="text-slate-400 text-sm max-w-xs mx-auto">
//           When someone visits your profile, they&apos;ll appear here. Complete
//           your profile to get more attention!
//         </p>
//         <Link
//           href="/profiles"
//           className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand to-accent hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
//         >
//           Browse Profiles
//           <ArrowRight size={16} />
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-2">
//       {/* Total count badge */}
//       <div className="flex items-center justify-between mb-4">
//         <p className="font-outfit text-xs text-slate-400">
//           Total {totalCount} visitor{totalCount !== 1 ? "s" : ""}
//         </p>
//       </div>

//       {visitors.map((visitor, idx) => (
//         <Link
//           key={visitor.id}
//           href={`/profile/${visitor.id}`}
//           className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3 transition-all duration-300 shadow-sm hover:shadow-md hover:border-brand/20 no-underline group"
//           style={{
//             animationDelay: `${idx * 50}ms`,
//             animation: "fadeInUp 0.3s ease-out forwards",
//           }}
//         >
//           {/* Avatar */}
//           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand/20 to-accent/20 flex items-center justify-center shrink-0">
//             {visitor.avatar ? (
//               <img
//                 src={visitor.avatar}
//                 alt={visitor.name}
//                 className="w-full h-full rounded-full object-cover"
//               />
//             ) : (
//               <User size={18} className="text-brand" />
//             )}
//           </div>

//           {/* Info */}
//           <div className="flex-1">
//             <div className="flex items-center gap-2 flex-wrap">
//               <p className="font-outfit text-sm font-semibold text-slate-800">
//                 {visitor.name}
//               </p>
//               {visitor.isPremium && (
//                 <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-600">
//                   Premium
//                 </span>
//               )}
//             </div>
//             <div className="flex items-center gap-1 mt-1">
//               <Clock size={10} className="text-slate-300" />
//               <p className="font-outfit text-[10px] text-slate-400">
//                 {timeAgo(visitor.visitedAt)}
//               </p>
//             </div>
//           </div>

//           {/* Arrow */}
//           <ArrowRight
//             size={14}
//             className="text-slate-300 group-hover:text-brand group-hover:translate-x-0.5 transition-all"
//           />
//         </Link>
//       ))}
//     </div>
//   );
// }

// export default function NotificationsPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const tabParam = searchParams.get("tab");

//   const [notifications, setNotifications] = useState<NotificationItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [markingAll, setMarkingAll] = useState(false);
//   const [visitCount, setVisitCount] = useState<number | null>(null);
//   const [activeTab, setActiveTab] = useState<Tab>(() => {
//     if (tabParam === "visitors") return "visitors";
//     if (tabParam === "matches") return "matches";
//     if (tabParam === "likesMe") return "likesMe";
//     return "likesMe";
//   });

//   const getUnreadCountByTab = (tab: Tab) => {
//     if (tab === "likesMe")
//       return notifications.filter((n) => n.type === "like" && !n.isRead).length;
//     if (tab === "matches")
//       return notifications.filter((n) => n.type === "match" && !n.isRead)
//         .length;
//     return 0;
//   };

//   const totalUnread = notifications.filter((n) => !n.isRead).length;
//   const filtered = filterByTab(notifications, activeTab);

//   // Visitors ট্যাবের জন্য আলাদা কন্টেন্ট দেখাবে
//   const showVisitorsTab = activeTab === "visitors";

//   const fetch = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await getNotifications();
//       if (res.success && res.data) {
//         const d = res.data as { data?: NotificationItem[] };
//         setNotifications(d.data || []);
//       }
//     } catch (error) {
//       console.error("Failed to fetch notifications:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const fetchVisitCount = useCallback(async () => {
//     try {
//       const res = await getProfileVisitCount();
//       if (res.success && res.data) {
//         setVisitCount((res.data as { count: number }).count);
//       }
//     } catch (error) {
//       console.error("Failed to fetch visit count:", error);
//     }
//   }, []);

//   useEffect(() => {
//     fetch();
//     fetchVisitCount();
//   }, [fetch, fetchVisitCount]);

//   const handleTabChange = (tab: Tab) => {
//     setActiveTab(tab);
//     const params = new URLSearchParams(searchParams);
//     if (tab === "likesMe") {
//       params.delete("tab");
//     } else {
//       params.set("tab", tab);
//     }
//     const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
//     router.push(newUrl, { scroll: false });
//   };

//   const handleMarkAll = async () => {
//     setMarkingAll(true);
//     try {
//       await markAllNotificationsRead();
//       setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
//     } finally {
//       setMarkingAll(false);
//     }
//   };

//   const handleMarkOne = async (id: string) => {
//     await markNotificationRead(id);
//     setNotifications((prev) =>
//       prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
//     );
//   };

//   const handleDelete = async (id: string) => {
//     await deleteNotification(id);
//     setNotifications((prev) => prev.filter((n) => n._id !== id));
//   };

//   return (
//     <div className="font-outfit min-h-screen px-4 py-6 md:py-8 max-w-3xl mx-auto bg-gradient-to-br from-slate-50 via-white to-slate-50">
//       {/* Header */}
//       <div className="relative mb-8">
//         <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-brand/5 to-accent/5 rounded-full blur-3xl" />
//         <div className="flex items-center justify-between flex-wrap gap-3">
//           <div>
//             <h1 className="font-syne text-slate-900 text-3xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
//               Notifications
//             </h1>
//             <p className="text-slate-400 text-sm mt-1 font-medium">
//               Stay updated with your connections
//             </p>
//           </div>
//           {!showVisitorsTab && totalUnread > 0 && (
//             <button
//               onClick={handleMarkAll}
//               disabled={markingAll}
//               className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:text-brand hover:border-brand/30 transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50 cursor-pointer"
//             >
//               {markingAll ? (
//                 <Loader2 size={14} className="animate-spin" />
//               ) : (
//                 <CheckCheck size={14} />
//               )}
//               <span className="hidden sm:inline">
//                 {markingAll ? "Marking..." : "Mark all read"}
//               </span>
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Tabs - with unread counts only */}
//       <div className="grid grid-cols-3 gap-1.5 mb-8 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
//         {TABS.map(({ key, label, icon: Icon }) => {
//           const unreadCount = getUnreadCountByTab(key);
//           const isActive = activeTab === key;
//           return (
//             <button
//               key={key}
//               onClick={() => handleTabChange(key)}
//               className={`group relative flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
//                 isActive
//                   ? "bg-gradient-to-br from-brand/10 to-accent/5 text-brand shadow-inner"
//                   : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
//               }`}
//             >
//               <div
//                 className={`relative transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-105"}`}
//               >
//                 <Icon size={18} strokeWidth={isActive ? 2 : 1.75} />
//               </div>
//               <span
//                 className={`text-xs font-bold ${isActive ? "text-brand" : "text-slate-600"}`}
//               >
//                 {label}
//               </span>
//               {key !== "visitors" && unreadCount > 0 && (
//                 <span
//                   className={`absolute -top-1 -right-1 text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-sm ${
//                     isActive ? "bg-brand text-white" : "bg-red-500 text-white"
//                   }`}
//                 >
//                   {unreadCount}
//                 </span>
//               )}
//               {key === "visitors" && visitCount && visitCount > 0 && (
//                 <span
//                   className={`absolute -top-1 -right-1 text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-sm ${
//                     isActive ? "bg-brand text-white" : "bg-blue-500 text-white"
//                   }`}
//                 >
//                   {visitCount}
//                 </span>
//               )}
//             </button>
//           );
//         })}
//       </div>

//       {/* Visitors Tab Content - Separate Component */}
//       {showVisitorsTab ? (
//         <VisitorsList />
//       ) : (
//         <>
//           {/* Loading State for Notifications */}
//           {loading && (
//             <div className="space-y-3">
//               {[1, 2, 3].map((i) => (
//                 <div
//                   key={i}
//                   className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm animate-pulse"
//                 >
//                   <div className="flex gap-3">
//                     <div className="w-10 h-10 rounded-full bg-slate-200" />
//                     <div className="flex-1 space-y-2">
//                       <div className="h-4 bg-slate-200 rounded w-3/4" />
//                       <div className="h-3 bg-slate-100 rounded w-1/2" />
//                       <div className="h-2 bg-slate-100 rounded w-1/4" />
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Empty State for Notifications */}
//           {!loading && filtered.length === 0 && (
//             <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-10 text-center relative overflow-hidden">
//               <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-brand/5 to-transparent rounded-full" />
//               <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent/5 to-transparent rounded-full" />

//               <div className="relative z-10">
//                 <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
//                   {activeTab === "likesMe" && (
//                     <Heart
//                       size={32}
//                       className="text-slate-300"
//                       strokeWidth={1.5}
//                     />
//                   )}
//                   {activeTab === "matches" && (
//                     <Sparkles
//                       size={32}
//                       className="text-slate-300"
//                       strokeWidth={1.5}
//                     />
//                   )}
//                 </div>
//                 <h2 className="font-syne text-slate-700 text-xl font-bold mb-2">
//                   No {activeTab === "likesMe" ? "Likes Yet" : "Matches Yet"}
//                 </h2>
//                 <p className="text-slate-400 text-sm max-w-xs mx-auto">
//                   {activeTab === "likesMe" &&
//                     "When someone likes you, they'll appear here. Complete your profile to get more attention!"}
//                   {activeTab === "matches" &&
//                     "Matches happen when you both like each other. Keep exploring!"}
//                 </p>
//                 {activeTab === "likesMe" && (
//                   <Link
//                     href="/search"
//                     className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand to-accent hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
//                   >
//                     Browse Profiles
//                     <ArrowRight size={16} />
//                   </Link>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Notification List */}
//           {!loading && filtered.length > 0 && (
//             <div className="space-y-3">
//               {filtered.map((n, idx) => {
//                 const { main, sub, badge } = notifText(n, n.isRead);
//                 const link = getNotifLink(n);
//                 const isClickable = link !== "#";

//                 const inner = (
//                   <div
//                     className={`bg-white rounded-2xl border p-4 flex items-start gap-3 transition-all duration-300 shadow-sm hover:shadow-md ${
//                       !n.isRead
//                         ? "border-l-4 border-l-brand border-brand/20 bg-gradient-to-r from-brand/[0.02] to-transparent"
//                         : "border-slate-100 hover:border-slate-200"
//                     }`}
//                     style={{
//                       animationDelay: `${idx * 50}ms`,
//                       animation: "fadeInUp 0.3s ease-out forwards",
//                     }}
//                   >
//                     <NotifIcon type={n.type} isRead={n.isRead} />

//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-2 flex-wrap">
//                         <p
//                           className={`font-outfit text-sm leading-relaxed ${!n.isRead ? "text-slate-800 font-semibold" : "text-slate-600"}`}
//                         >
//                           {main}
//                         </p>
//                         {badge && (
//                           <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-brand/10 text-brand uppercase tracking-wide">
//                             {badge}
//                           </span>
//                         )}
//                       </div>
//                       {sub && (
//                         <p className="font-outfit text-xs text-slate-400 mt-0.5">
//                           {sub}
//                         </p>
//                       )}
//                       <p className="font-outfit text-[10px] text-slate-300 mt-1.5 flex items-center gap-1">
//                         <span className="inline-block w-1 h-1 rounded-full bg-slate-300" />
//                         {timeAgo(n.createdAt)}
//                       </p>
//                     </div>

//                     <div className="flex items-center gap-2 shrink-0">
//                       {!n.isRead && (
//                         <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
//                       )}
//                       <button
//                         onClick={(e) => {
//                           e.preventDefault();
//                           e.stopPropagation();
//                           handleDelete(n._id);
//                         }}
//                         className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 cursor-pointer"
//                         aria-label="Delete notification"
//                       >
//                         <Trash2 size={14} />
//                       </button>
//                     </div>
//                   </div>
//                 );

//                 if (isClickable) {
//                   return (
//                     <Link
//                       key={n._id}
//                       href={link}
//                       onClick={() => !n.isRead && handleMarkOne(n._id)}
//                       className="no-underline block"
//                     >
//                       {inner}
//                     </Link>
//                   );
//                 }

//                 return (
//                   <div
//                     key={n._id}
//                     onClick={() => !n.isRead && handleMarkOne(n._id)}
//                     className="cursor-pointer"
//                   >
//                     {inner}
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </>
//       )}

//       <style jsx>{`
//         @keyframes fadeInUp {
//           from {
//             opacity: 0;
//             transform: translateY(10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Bell,
  Heart,
  Sparkles,
  Eye,
  CheckCheck,
  Trash2,
  Loader2,
  ArrowRight,
  User,
  Clock,
} from "lucide-react";
import type { NotificationItem } from "@/types/like";
import {
  deleteNotification,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/actions/profile-like/like";
import {
  getProfileVisitCount,
  getProfileVisitors,
} from "@/actions/profile-visit/profile-visit";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? "s" : ""} ago`;
}

function senderName(n: NotificationItem): string {
  if (n.senderName) return n.senderName;
  if (typeof n.senderId === "object" && n.senderId !== null)
    return (n.senderId as { name: string }).name;
  return "Someone";
}

function NotifIcon({ type, isRead }: { type: string; isRead: boolean }) {
  const baseClasses =
    "w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200";

  if (type === "like") {
    return (
      <div
        className={`${baseClasses} ${isRead ? "bg-pink-50 border border-pink-100" : "bg-gradient-to-br from-pink-500 to-rose-500 shadow-md"}`}
      >
        <Heart
          size={16}
          className={isRead ? "text-pink-500" : "text-white"}
          fill={isRead ? "none" : "white"}
        />
      </div>
    );
  }
  if (type === "profile_visit") {
    return (
      <div
        className={`${baseClasses} ${isRead ? "bg-indigo-50 border border-indigo-100" : "bg-gradient-to-br from-indigo-500 to-purple-500 shadow-md"}`}
      >
        <Eye size={15} className={isRead ? "text-indigo-500" : "text-white"} />
      </div>
    );
  }
  if (type === "match") {
    return (
      <div
        className={`${baseClasses} ${isRead ? "bg-amber-50 border border-amber-100" : "bg-gradient-to-br from-amber-500 to-orange-500 shadow-md"}`}
      >
        <Sparkles
          size={16}
          className={isRead ? "text-amber-500" : "text-white"}
        />
      </div>
    );
  }
  return (
    <div
      className={`${baseClasses} ${isRead ? "bg-emerald-50 border border-emerald-100" : "bg-gradient-to-br from-emerald-500 to-teal-500 shadow-md"}`}
    >
      <Heart size={14} className={isRead ? "text-emerald-500" : "text-white"} />
    </div>
  );
}

function notifText(
  n: NotificationItem,
  isRead: boolean,
): { main: string; sub?: string; badge?: string } {
  const name = senderName(n);

  if (n.type === "like") {
    return {
      main: `${name} liked you`,
      sub: "They're interested in you",
      badge: !isRead ? "New like" : undefined,
    };
  }
  if (n.type === "profile_visit") {
    return {
      main: `${name} visited your profile`,
      sub: "Check who's looking at you",
      badge: !isRead ? "New visitor" : undefined,
    };
  }
  if (n.type === "match") {
    return {
      main: `You matched with ${name}! 🎉`,
      sub: "Start a conversation now",
      badge: !isRead ? "New match" : undefined,
    };
  }
  return { main: `${name} interacted with your profile`, sub: "Tap to view" };
}

function getNotifLink(n: NotificationItem): string {
  if (n.type === "match" && n.metadata?.matchedUserId) {
    return `/chat/${n.metadata.matchedUserId}`;
  }
  if (n.type === "like" && n.senderId) {
    const userId = typeof n.senderId === "string" ? n.senderId : n.senderId._id;
    return `/profile/${userId}`;
  }
  if (n.type === "profile_visit" && n.senderId) {
    const userId = typeof n.senderId === "string" ? n.senderId : n.senderId._id;
    return `/profile/${userId}`;
  }
  return "#";
}

type Tab = "likesMe" | "matches" | "visitors";

const TABS: {
  key: Tab;
  label: string;
  icon: React.ElementType;
  description: string;
}[] = [
  {
    key: "likesMe",
    label: "Likes Me",
    icon: Heart,
    description: "People who liked you",
  },
  {
    key: "matches",
    label: "Matches",
    icon: Sparkles,
    description: "Mutual likes",
  },
  {
    key: "visitors",
    label: "Visitors",
    icon: Eye,
    description: "Profile views",
  },
];

function filterByTab(notifs: NotificationItem[], tab: Tab): NotificationItem[] {
  if (tab === "likesMe") return notifs.filter((n) => n.type === "like");
  if (tab === "visitors")
    return notifs.filter((n) => n.type === "profile_visit");
  if (tab === "matches") return notifs.filter((n) => n.type === "match");
  return notifs;
}

// Visitor Component
interface Visitor {
  id: string;
  name: string;
  avatar?: string;
  visitedAt: string;
  isPremium?: boolean;
}

function VisitorsList() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchVisitors = async () => {
      setLoading(true);
      try {
        const res = await getProfileVisitors();
        if (res.success && res.data) {
          setVisitors(res.data.visitors || []);
          setTotalCount(res.data.meta.total || 0);
        }
      } catch (error) {
        console.error("Failed to fetch visitors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVisitors();
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-100 p-4 animate-pulse"
          >
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200" />
              <div className="flex-1">
                <div className="h-4 bg-slate-200 rounded w-32 mb-2" />
                <div className="h-3 bg-slate-100 rounded w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (visitors.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-10 text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
          <Eye size={32} className="text-slate-300" strokeWidth={1.5} />
        </div>
        <h2 className="font-syne text-slate-700 text-xl font-bold mb-2">
          No Visitors Yet
        </h2>
        <p className="text-slate-400 text-sm max-w-xs mx-auto">
          When someone visits your profile, they&apos;ll appear here. Complete
          your profile to get more attention!
        </p>
        <Link
          href="/profiles"
          className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand to-accent hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
        >
          Browse Profiles
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Total count badge */}
      <div className="flex items-center justify-between mb-4">
        <p className="font-outfit text-xs text-slate-400">
          Total {totalCount} visitor{totalCount !== 1 ? "s" : ""}
        </p>
      </div>

      {visitors.map((visitor, idx) => (
        <Link
          key={visitor.id}
          href={`/profile/${visitor.id}`}
          className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3 transition-all duration-300 shadow-sm hover:shadow-md hover:border-brand/20 no-underline group"
          style={{
            animationDelay: `${idx * 50}ms`,
            animation: "fadeInUp 0.3s ease-out forwards",
          }}
        >
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand/20 to-accent/20 flex items-center justify-center shrink-0">
            {visitor.avatar ? (
              <img
                src={visitor.avatar}
                alt={visitor.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User size={18} className="text-brand" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-outfit text-sm font-semibold text-slate-800">
                {visitor.name}
              </p>
              {visitor.isPremium && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-600">
                  Premium
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Clock size={10} className="text-slate-300" />
              <p className="font-outfit text-[10px] text-slate-400">
                {timeAgo(visitor.visitedAt)}
              </p>
            </div>
          </div>

          {/* Arrow */}
          <ArrowRight
            size={14}
            className="text-slate-300 group-hover:text-brand group-hover:translate-x-0.5 transition-all"
          />
        </Link>
      ))}
    </div>
  );
}

export default function NotificationsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab");

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);
  const [visitCount, setVisitCount] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    if (tabParam === "visitors") return "visitors";
    if (tabParam === "matches") return "matches";
    if (tabParam === "likesMe") return "likesMe";
    return "likesMe";
  });

  const getUnreadCountByTab = (tab: Tab) => {
    if (tab === "likesMe")
      return notifications.filter((n) => n.type === "like" && !n.isRead).length;
    if (tab === "matches")
      return notifications.filter((n) => n.type === "match" && !n.isRead)
        .length;
    return 0;
  };

  const totalUnread = notifications.filter((n) => !n.isRead).length;
  const filtered = filterByTab(notifications, activeTab);

  // Visitors ট্যাবের জন্য আলাদা কন্টেন্ট দেখাবে
  const showVisitorsTab = activeTab === "visitors";

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getNotifications();
      if (res.success && res.data) {
        const d = res.data as { data?: NotificationItem[] };
        setNotifications(d.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchVisitCount = useCallback(async () => {
    try {
      const res = await getProfileVisitCount();
      if (res.success && res.data) {
        setVisitCount((res.data as { count: number }).count);
      }
    } catch (error) {
      console.error("Failed to fetch visit count:", error);
    }
  }, []);

  useEffect(() => {
    fetch();
    fetchVisitCount();
  }, [fetch, fetchVisitCount]);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams);
    if (tab === "likesMe") {
      params.delete("tab");
    } else {
      params.set("tab", tab);
    }
    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
    router.push(newUrl, { scroll: false });
  };

  const handleMarkAll = async () => {
    setMarkingAll(true);
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } finally {
      setMarkingAll(false);
    }
  };

  const handleMarkOne = async (id: string) => {
    await markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
    );
  };

  const handleDelete = async (id: string) => {
    await deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n._id !== id));
  };

  return (
    <div className="font-outfit min-h-screen px-4 py-6 md:py-8 max-w-3xl mx-auto bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="relative mb-8">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-brand/5 to-accent/5 rounded-full blur-3xl" />
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-syne text-slate-900 text-3xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
              Notifications
            </h1>
            <p className="text-slate-400 text-sm mt-1 font-medium">
              Stay updated with your connections
            </p>
          </div>
          {!showVisitorsTab && totalUnread > 0 && (
            <button
              onClick={handleMarkAll}
              disabled={markingAll}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:text-brand hover:border-brand/30 transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50 cursor-pointer"
            >
              {markingAll ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <CheckCheck size={14} />
              )}
              <span className="hidden sm:inline">
                {markingAll ? "Marking..." : "Mark all read"}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs - with unread counts only */}
      <div className="grid grid-cols-3 gap-1.5 mb-8 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
        {TABS.map(({ key, label, icon: Icon }) => {
          const unreadCount = getUnreadCountByTab(key);
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => handleTabChange(key)}
              className={`group relative flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-gradient-to-br from-brand/10 to-accent/5 text-brand shadow-inner"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div
                className={`relative transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-105"}`}
              >
                <Icon size={18} strokeWidth={isActive ? 2 : 1.75} />
              </div>
              <span
                className={`text-xs font-bold ${isActive ? "text-brand" : "text-slate-600"}`}
              >
                {label}
              </span>
              {key !== "visitors" && unreadCount > 0 && (
                <span
                  className={`absolute -top-1 -right-1 text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-sm ${
                    isActive ? "bg-brand text-white" : "bg-red-500 text-white"
                  }`}
                >
                  {unreadCount}
                </span>
              )}
              {key === "visitors" && visitCount && visitCount > 0 && (
                <span
                  className={`absolute -top-1 -right-1 text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-sm ${
                    isActive ? "bg-brand text-white" : "bg-blue-500 text-white"
                  }`}
                >
                  {visitCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Visitors Tab Content - Separate Component */}
      {showVisitorsTab ? (
        <VisitorsList />
      ) : (
        <>
          {/* Loading State for Notifications */}
          {loading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm animate-pulse"
                >
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-3/4" />
                      <div className="h-3 bg-slate-100 rounded w-1/2" />
                      <div className="h-2 bg-slate-100 rounded w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State for Notifications */}
          {!loading && filtered.length === 0 && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-10 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-brand/5 to-transparent rounded-full" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent/5 to-transparent rounded-full" />

              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  {activeTab === "likesMe" && (
                    <Heart
                      size={32}
                      className="text-slate-300"
                      strokeWidth={1.5}
                    />
                  )}
                  {activeTab === "matches" && (
                    <Sparkles
                      size={32}
                      className="text-slate-300"
                      strokeWidth={1.5}
                    />
                  )}
                </div>
                <h2 className="font-syne text-slate-700 text-xl font-bold mb-2">
                  No {activeTab === "likesMe" ? "Likes Yet" : "Matches Yet"}
                </h2>
                <p className="text-slate-400 text-sm max-w-xs mx-auto">
                  {activeTab === "likesMe" &&
                    "When someone likes you, they'll appear here. Complete your profile to get more attention!"}
                  {activeTab === "matches" &&
                    "Matches happen when you both like each other. Keep exploring!"}
                </p>
                {activeTab === "likesMe" && (
                  <Link
                    href="/search"
                    className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand to-accent hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                  >
                    Browse Profiles
                    <ArrowRight size={16} />
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Notification List */}
          {!loading && filtered.length > 0 && (
            <div className="space-y-3">
              {filtered.map((n, idx) => {
                const { main, sub, badge } = notifText(n, n.isRead);
                const link = getNotifLink(n);
                const isClickable = link !== "#";

                const inner = (
                  <div
                    className={`bg-white rounded-2xl border p-4 flex items-start gap-3 transition-all duration-300 shadow-sm hover:shadow-md ${
                      !n.isRead
                        ? "border-l-4 border-l-brand border-brand/20 bg-gradient-to-r from-brand/[0.02] to-transparent"
                        : "border-slate-100 hover:border-slate-200"
                    }`}
                    style={{
                      animationDelay: `${idx * 50}ms`,
                      animation: "fadeInUp 0.3s ease-out forwards",
                    }}
                  >
                    <NotifIcon type={n.type} isRead={n.isRead} />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p
                          className={`font-outfit text-sm leading-relaxed ${!n.isRead ? "text-slate-800 font-semibold" : "text-slate-600"}`}
                        >
                          {main}
                        </p>
                        {badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-brand/10 text-brand uppercase tracking-wide">
                            {badge}
                          </span>
                        )}
                      </div>
                      {sub && (
                        <p className="font-outfit text-xs text-slate-400 mt-0.5">
                          {sub}
                        </p>
                      )}
                      <p className="font-outfit text-[10px] text-slate-600 mt-1.5 flex items-center gap-1">
                        <span className="inline-block w-1 h-1 rounded-full bg-slate-300" />
                        {timeAgo(n.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {!n.isRead && (
                        <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                      )}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDelete(n._id);
                        }}
                        className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 cursor-pointer"
                        aria-label="Delete notification"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );

                if (isClickable) {
                  return (
                    <Link
                      key={n._id}
                      href={link}
                      onClick={() => !n.isRead && handleMarkOne(n._id)}
                      className="no-underline block"
                    >
                      {inner}
                    </Link>
                  );
                }

                return (
                  <div
                    key={n._id}
                    onClick={() => !n.isRead && handleMarkOne(n._id)}
                    className="cursor-pointer"
                  >
                    {inner}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
