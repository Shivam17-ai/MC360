import api from "./api";

const notificationService = {
  getNotifications: (params) => api.get("/notifications", { params }),

  markAsRead: (id) => api.patch(`/notifications/${id}/read`),

  markAllAsRead: () => api.patch("/notifications/mark-all-read"),

  deleteNotification: (id) => api.delete(`/notifications/${id}`),

  deleteAllRead: () => api.delete("/notifications/read"),

  getUnreadCount: () => api.get("/notifications/unread-count"),
};

export default notificationService;