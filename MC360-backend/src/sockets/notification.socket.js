/**
 * notification.socket.js
 * Handles real-time notification delivery
 * Compatible with: notificationStore.js (frontend) + useNotifications.js hook
 */

const Notification = require("../models/notification.model");
const { getIO } = require("./index");

// ── Send notification to a specific user (used by jobs & controllers) ──
const sendNotification = (userId, payload) => {
  try {
    const io = getIO();
    io.to(userId.toString()).emit("notification", {
      title    : payload.title,
      message  : payload.message,
      type     : payload.type || "general",
      createdAt: new Date().toISOString(),
      isRead   : false,
    });
  } catch (err) {
    console.error("[NotificationSocket] sendNotification error:", err.message);
  }
};

// ── Socket event handlers ──────────────────────────────────────
const registerNotificationSocket = (io, socket) => {
  const userId = socket.user._id.toString();

  // Client requests unread count on connect
  socket.on("get-unread-count", async () => {
    try {
      const count = await Notification.countDocuments({ userId, isRead: false });
      socket.emit("unread-count", { count });
    } catch (err) {
      console.error("[NotificationSocket] get-unread-count error:", err.message);
    }
  });

  // Client marks a notification as read
  socket.on("mark-read", async ({ notificationId }) => {
    try {
      await Notification.findOneAndUpdate(
        { _id: notificationId, userId },
        { isRead: true }
      );
      const count = await Notification.countDocuments({ userId, isRead: false });
      socket.emit("unread-count", { count });
    } catch (err) {
      console.error("[NotificationSocket] mark-read error:", err.message);
    }
  });

  // Client marks all as read
  socket.on("mark-all-read", async () => {
    try {
      await Notification.updateMany({ userId, isRead: false }, { isRead: true });
      socket.emit("unread-count", { count: 0 });
    } catch (err) {
      console.error("[NotificationSocket] mark-all-read error:", err.message);
    }
  });
};

module.exports = { registerNotificationSocket, sendNotification };