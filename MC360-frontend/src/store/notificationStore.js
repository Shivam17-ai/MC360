import { create } from "zustand";

const useNotificationStore = create((set, get) => ({
  // ── State ────────────────────────────────────────────────────────────
  notifications: [],
  unreadCount: 0,
  isOpen: false,

  // ── Actions ──────────────────────────────────────────────────────────

  setOpen: (val) => set({ isOpen: val }),

  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),

  addNotification: (notification) => {
    const newNotif = {
      id: Date.now(),
      isRead: false,
      createdAt: new Date().toISOString(),
      ...notification,
    };
    set((state) => ({
      notifications: [newNotif, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),

  removeNotification: (id) =>
    set((state) => {
      const target = state.notifications.find((n) => n.id === id);
      return {
        notifications: state.notifications.filter((n) => n.id !== id),
        unreadCount: target && !target.isRead
          ? Math.max(0, state.unreadCount - 1)
          : state.unreadCount,
      };
    }),

  clearAll: () => set({ notifications: [], unreadCount: 0 }),

  setNotifications: (notifications) => {
    const unread = notifications.filter((n) => !n.isRead).length;
    set({ notifications, unreadCount: unread });
  },

  // ── Selectors ────────────────────────────────────────────────────────

  getUnread: () => get().notifications.filter((n) => !n.isRead),

  getByType: (type) => get().notifications.filter((n) => n.type === type),
}));

export default useNotificationStore;