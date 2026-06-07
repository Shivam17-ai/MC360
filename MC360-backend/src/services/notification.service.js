import Notification from "../models/Notification.model.js";

/**
 * Create a notification
 */
export const createNotification = async ({ userId, type, title, message, relatedId }) => {
  return await Notification.create({ userId, type, title, message, relatedId });
};

/**
 * Get all notifications for a user
 */
export const getUserNotifications = async (userId, limit = 20) => {
  return await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

/**
 * Mark one as read
 */
export const markNotificationRead = async (notificationId, userId) => {
  const notif = await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { isRead: true },
    { new: true }
  );
  if (!notif) throw new Error("Notification not found");
  return notif;
};

/**
 * Mark all as read for a user
 */
export const markAllNotificationsRead = async (userId) => {
  await Notification.updateMany({ userId, isRead: false }, { isRead: true });
  return { message: "All notifications marked as read" };
};

/**
 * Delete a notification
 */
export const deleteNotification = async (notificationId, userId) => {
  const notif = await Notification.findOneAndDelete({ _id: notificationId, userId });
  if (!notif) throw new Error("Notification not found");
  return { message: "Notification deleted" };
};

/**
 * Clear all notifications for a user
 */
export const clearAllNotifications = async (userId) => {
  await Notification.deleteMany({ userId });
  return { message: "All notifications cleared" };
};

/**
 * Get unread count
 */
export const getUnreadCount = async (userId) => {
  return await Notification.countDocuments({ userId, isRead: false });
};