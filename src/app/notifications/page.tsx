"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth-store";
import MagicLinkModal from "@/components/layout/magic-link-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronRight,
  Bell,
  ShieldCheck,
  CheckCircle2,
  CheckCheck,
  DollarSign,
  MessageCircle,
  Star,
  Wallet,
  ShoppingCart,
  TrendingDown,
  ArrowRight,
  Eye,
  CircleDot,
} from "lucide-react";
import { useNotificationStore } from "@/lib/notification-store";

type NotificationType =
  | "task_interest"
  | "worker_picked"
  | "payment_received"
  | "new_message"
  | "task_completed"
  | "review_received"
  | "escrow_released"
  | "listing_sold"
  | "price_drop";

type FilterTab = "all" | "unread" | "tasks" | "payments" | "messages";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  read: boolean;
  link: string;
}

const typeConfig: Record<
  NotificationType,
  { icon: typeof Bell; color: string; bg: string; label: string; category: string }
> = {
  task_interest: {
    icon: Bell,
    color: "text-amber-600",
    bg: "bg-amber-100",
    label: "Interest",
    category: "tasks",
  },
  worker_picked: {
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-100",
    label: "Picked",
    category: "tasks",
  },
  payment_received: {
    icon: DollarSign,
    color: "text-emerald-600",
    bg: "bg-emerald-100",
    label: "Payment",
    category: "payments",
  },
  new_message: {
    icon: MessageCircle,
    color: "text-sky-600",
    bg: "bg-sky-100",
    label: "Message",
    category: "messages",
  },
  task_completed: {
    icon: CheckCircle2,
    color: "text-teal-600",
    bg: "bg-teal-100",
    label: "Completed",
    category: "tasks",
  },
  review_received: {
    icon: Star,
    color: "text-orange-500",
    bg: "bg-orange-100",
    label: "Review",
    category: "tasks",
  },
  escrow_released: {
    icon: Wallet,
    color: "text-emerald-600",
    bg: "bg-emerald-100",
    label: "Released",
    category: "payments",
  },
  listing_sold: {
    icon: ShoppingCart,
    color: "text-emerald-600",
    bg: "bg-emerald-100",
    label: "Sold",
    category: "payments",
  },
  price_drop: {
    icon: TrendingDown,
    color: "text-rose-500",
    bg: "bg-rose-100",
    label: "Price Drop",
    category: "payments",
  },
};

const sampleNotifications: Notification[] = [
  { id: "n1", type: "task_interest", title: "8 people are interested in your task", body: "'Plumbing Repair Needed' has 8 new applicants. Swipe to pick the best one!", time: "2m ago", read: false, link: "/dashboard/pick-worker" },
  { id: "n2", type: "worker_picked", title: "You've been picked!", body: "Emeka Okafor selected you for 'WordPress Website Redesign'. Check escrow payment.", time: "15m ago", read: false, link: "/dashboard/tasks" },
  { id: "n3", type: "payment_received", title: "Payment received", body: "₦75,000 has been deposited into escrow for 'Landing Page Design'.", time: "30m ago", read: false, link: "/dashboard/wallet" },
  { id: "n4", type: "new_message", title: "New message from Amina", body: "I can deliver the logo by Friday. Does that work for you?", time: "1h ago", read: false, link: "/dashboard/messages" },
  { id: "n5", type: "task_completed", title: "Task completed!", body: "Data Analysis project has been marked as completed. Rate your experience.", time: "2h ago", read: true, link: "/reviews" },
  { id: "n6", type: "review_received", title: "New 5-star review!", body: "Kwame Mensah left you a 5-star review: 'Excellent work, highly recommended!'", time: "3h ago", read: true, link: "/dashboard/profile" },
  { id: "n7", type: "escrow_released", title: "Escrow released", body: "₦50,000 from 'Logo Design' has been released to your wallet.", time: "5h ago", read: true, link: "/dashboard/wallet" },
  { id: "n8", type: "listing_sold", title: "Item sold!", body: "Your 'iPhone 14 Pro Max' listing has been sold for ₦650,000.", time: "6h ago", read: true, link: "/dashboard/listings" },
  { id: "n9", type: "task_interest", title: "3 more people interested", body: "'Move Furniture' task now has 5 applicants total.", time: "8h ago", read: true, link: "/dashboard/pick-worker" },
  { id: "n10", type: "price_drop", title: "Price dropped!", body: "MacBook Air M2 you saved dropped from ₦900,000 to ₦800,000.", time: "1d ago", read: true, link: "/favorites" },
  { id: "n11", type: "new_message", title: "Message from Fatima", body: "Thanks for the payment! I'll start working on the social media campaign today.", time: "1d ago", read: true, link: "/dashboard/messages" },
  { id: "n12", type: "payment_received", title: "Withdrawal processed", body: "₦300,000 withdrawal to your GTBank account is being processed.", time: "2d ago", read: true, link: "/dashboard/wallet" },
];

export default function NotificationsPage() {
  const { user } = useAuthStore();
  const setUnreadNotificationCount = useNotificationStore((s) => s.setUnreadNotificationCount);
  const clearUnreadMessages = useNotificationStore((s) => s.clearUnreadMessages);
  const [showLogin, setShowLogin] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync unread count to notification store whenever notifications change
  useEffect(() => {
    const unread = notifications.filter((n) => !n.read).length;
    setUnreadNotificationCount(unread);
  }, [notifications, setUnreadNotificationCount]);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/notifications?userId=${user?.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.notifications && data.notifications.length > 0) {
            setNotifications(data.notifications);
            setLoading(false);
            return;
          }
        }
      } catch {
        // fallback to sample data
      }
      setNotifications(sampleNotifications);
      setLoading(false);
    };

    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const filteredNotifications = useMemo(() => {
    switch (activeTab) {
      case "unread":
        return notifications.filter((n) => !n.read);
      case "tasks":
        return notifications.filter((n) => {
          const config = typeConfig[n.type];
          return config?.category === "tasks";
        });
      case "payments":
        return notifications.filter((n) => {
          const config = typeConfig[n.type];
          return config?.category === "payments";
        });
      case "messages":
        return notifications.filter((n) => {
          const config = typeConfig[n.type];
          return config?.category === "messages";
        });
      default:
        return notifications;
    }
  }, [notifications, activeTab]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      // Sync to store immediately to ensure badge updates before navigation
      const unread = updated.filter((n) => !n.read).length;
      setUnreadNotificationCount(unread);
      return updated;
    });
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadNotificationCount(0);
    clearUnreadMessages();
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto space-y-6">
          <div className="h-20 w-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto">
            <Bell className="h-10 w-10 text-amber-500" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Sign in to view notifications
          </h1>
          <p className="text-muted-foreground text-lg">
            Log in to stay updated on task applications, payments, messages, and
            important marketplace activity.
          </p>
          <Button
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={() => setShowLogin(true)}
          >
            <ShieldCheck className="h-5 w-5 mr-2" />
            Sign In to Continue
          </Button>
          <MagicLinkModal open={showLogin} onOpenChange={setShowLogin} />
        </div>
      </div>
    );
  }

  const filterTabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "All", count: notifications.length },
    { key: "unread", label: "Unread", count: unreadCount },
    { key: "tasks", label: "Tasks", count: notifications.filter((n) => typeConfig[n.type]?.category === "tasks").length },
    { key: "payments", label: "Payments", count: notifications.filter((n) => typeConfig[n.type]?.category === "payments").length },
    { key: "messages", label: "Messages", count: notifications.filter((n) => typeConfig[n.type]?.category === "messages").length },
  ];

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b bg-muted/30 mb-0">
        <div className="container mx-auto px-4 py-2.5 max-w-6xl">
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link href="/browse" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="text-foreground font-medium">Notifications</span>
          </nav>
        </div>
      </div>
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Bell className="h-5 w-5 text-amber-600" />
            </div>
            Notifications
            {unreadCount > 0 && (
              <Badge className="bg-rose-500 hover:bg-rose-600 text-white ml-1">
                {unreadCount}
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground mt-1 ml-[52px]">
            Stay updated on your marketplace activity
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={markAllRead}
          >
            <CheckCheck className="h-4 w-4" />
            Mark All Read
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span
                className={`ml-1 text-xs ${
                  activeTab === tab.key
                    ? "text-emerald-200"
                    : "text-muted-foreground/60"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-4 flex gap-4">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-20 w-20 rounded-full bg-amber-50 flex items-center justify-center mb-6">
            <Bell className="h-10 w-10 text-amber-300" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">All caught up!</h2>
          <p className="text-muted-foreground max-w-sm mb-6">
            {activeTab === "all"
              ? "You have no notifications right now. We'll let you know when something important happens."
              : `No ${activeTab} notifications to show. Check back later for updates.`}
          </p>
          <Button asChild variant="outline">
            <Link href="/browse">
              Browse Marketplace
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Group: Today */}
          {filteredNotifications.filter((n) => !n.time.includes("d")).length > 0 &&
            filteredNotifications.filter((n) => n.time.includes("d")).length > 0 && (
              <div className="sticky top-0 z-10 bg-background/95 backdrop-blur py-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
                  Today
                </p>
              </div>
            )}

          {filteredNotifications.map((notification) => {
            const config = typeConfig[notification.type];
            const IconComp = config.icon;

            const content = (
              <Card
                className={`overflow-hidden transition-all cursor-pointer ${
                  !notification.read
                    ? "border-l-4 border-l-emerald-500 bg-emerald-50/30 shadow-sm"
                    : "hover:bg-muted/30"
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <CardContent className="p-4 flex gap-4">
                  {/* Type icon */}
                  <div
                    className={`h-10 w-10 rounded-full ${config.bg} flex items-center justify-center shrink-0`}
                  >
                    <IconComp className={`h-5 w-5 ${config.color}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <h3
                        className={`text-sm leading-snug ${
                          !notification.read ? "font-semibold" : "font-medium text-muted-foreground"
                        }`}
                      >
                        {notification.title}
                      </h3>
                      <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0 mt-0.5">
                        {notification.time}
                      </span>
                    </div>
                    <p
                      className={`text-sm mt-1 leading-relaxed ${
                        !notification.read
                          ? "text-muted-foreground"
                          : "text-muted-foreground/70"
                      }`}
                    >
                      {notification.body}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant="secondary"
                        className={`text-[10px] ${config.bg} ${config.color} border-0`}
                      >
                        {config.label}
                      </Badge>
                      {!notification.read && (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                          <CircleDot className="h-3 w-3" />
                          New
                        </span>
                      )}
                      {notification.link && (
                        <span className="flex items-center gap-0.5 text-[10px] text-emerald-600 ml-auto font-medium">
                          View
                          <ArrowRight className="h-3 w-3" />
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );

            if (notification.link) {
              return (
                <Link key={notification.id} href={notification.link}>
                  {content}
                </Link>
              );
            }
            return <div key={notification.id}>{content}</div>;
          })}
        </div>
      )}
    </div>
    </>
  );
}