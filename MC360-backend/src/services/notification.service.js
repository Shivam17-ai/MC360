const Notification = require("../models/Notification.model");
const User = require("../models/User.model");
const { sendEmail } = require("../utils/sendEmail");
const logger = require("../utils/logger");

// Create and broadcast in-app notification
const createNotification = async ({
  userId,
  title,
  message,
  type = "general",
  priority = "medium",
  data = null,
  link = null,
  channels = {},
}) => {
  const notification = await Notification.create({
    user: userId,
    title,
    message,
    type,
    priority,
    data,
    link,
    channels: { inApp: true, ...channels },
  });

  // Emit via socket if available
  try {
    const io = require("../sockets").getIO();
    if (io) {
      io.to(`user_${userId}`).emit("notification", notification);
    }
  } catch {}

  return notification;
};

// Get user notifications
const getUserNotifications = async (userId, { page = 1, limit = 20, unreadOnly = false } = {}) => {
  const filter = { user: userId };
  if (unreadOnly) filter.isRead = false;

  const skip = (page - 1) * limit;
  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Notification.countDocuments(filter),
    Notification.countDocuments({ user: userId, isRead: false }),
  ]);

  return {
    notifications,
    total,
    unreadCount,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

const markAsRead = async (notificationId, userId) => {
  return Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { isRead: true, readAt: new Date() },
    { new: true }
  );
};

const markAllAsRead = async (userId) => {
  return Notification.updateMany({ user: userId, isRead: false }, { isRead: true, readAt: new Date() });
};

const deleteNotification = async (notificationId, userId) => {
  return Notification.findOneAndDelete({ _id: notificationId, user: userId });
};

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};