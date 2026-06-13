const Notification = require("../models/Notification.model");
const logger = require("../utils/logger");

module.exports = (socket, io) => {
  // Client requests unread count on connect
  socket.on("get_unread_count", async () => {
    try {
      const count = await Notification.countDocuments({ user: socket.user._id, isRead: false });
      socket.emit("unread_count", { count });
    } catch (err) {
      logger.error(`get_unread_count error: ${err.message}`);
    }
  });

  socket.on("mark_notification_read", async ({ notificationId }) => {
    try {
      await Notification.findOneAndUpdate({ _id: notificationId, user: socket.user._id }, { isRead: true, readAt: new Date() });
      const count = await Notification.countDocuments({ user: socket.user._id, isRead: false });
      socket.emit("unread_count", { count });
    } catch (err) {
      logger.error(`mark_notification_read error: ${err.message}`);
    }
  });
};