import { create } from "zustand";

interface NotificationState {
  unreadMessageCount: number;
  unreadNotificationCount: number;
  setUnreadMessageCount: (count: number) => void;
  setUnreadNotificationCount: (count: number) => void;
  clearUnreadMessages: () => void;
  clearUnreadNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  unreadMessageCount: 0,
  unreadNotificationCount: 0,
  setUnreadMessageCount: (count: number) => set({ unreadMessageCount: count }),
  setUnreadNotificationCount: (count: number) =>
    set({ unreadNotificationCount: count }),
  clearUnreadMessages: () => set({ unreadMessageCount: 0 }),
  clearUnreadNotifications: () => set({ unreadNotificationCount: 0 }),
}));
