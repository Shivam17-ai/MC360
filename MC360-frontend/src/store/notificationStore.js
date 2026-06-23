import { create } from 'zustand'
import { notificationService } from '../services/notificationService'

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,

  fetch: async () => {
    try {
      const res = await notificationService.getAll()
      // axios interceptor returns res.data, so res = { success, data: { notifications, unreadCount, ... } }
      const list = res.data?.notifications || []
      const unread = res.data?.unreadCount ?? list.filter((n) => !n.isRead).length
      set({ notifications: list, unreadCount: unread })
    } catch {}
  },

  markRead: async (id) => {
    await notificationService.markRead(id)
    set((s) => ({
      notifications: s.notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      unreadCount: Math.max(0, s.unreadCount - 1),
    }))
  },

  markAllRead: async () => {
    await notificationService.markAllRead()
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    }))
  },

  add: (notification) => {
    set((s) => ({
      notifications: [notification, ...s.notifications],
      unreadCount: s.unreadCount + 1,
    }))
  },

  reset: () => {
    set({ notifications: [], unreadCount: 0 })
  },
}))