const notificationService = require("../services/notification.service");
const { successResponse, errorResponse } = require("../utils/response");

const getNotifications = async (req, res, next) => {
  try {
    const result = await notificationService.getUserNotifications(req.user._id, {
      page: req.query.page,
      limit: req.query.limit,
      unreadOnly: req.query.unread === "true",
    });
    return successResponse(res, result);
  } catch (err) { next(err); }
};

const markAsRead = async (req, res, next) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id, req.user._id);
    if (!notification) return errorResponse(res, "Notification not found.", 404);
    return successResponse(res, { notification }, "Marked as read.");
  } catch (err) { next(err); }
};

const markAllAsRead = async (req, res, next) => {
  try {
    await notificationService.markAllAsRead(req.user._id);
    return successResponse(res, {}, "All notifications marked as read.");
  } catch (err) { next(err); }
};

const deleteNotification = async (req, res, next) => {
  try {
    await notificationService.deleteNotification(req.params.id, req.user._id);
    return successResponse(res, {}, "Notification deleted.");
  } catch (err) { next(err); }
};

const getUnreadCount = async (req, res, next) => {
  try {
    const Notification = require("../models/Notification.model");
    const count = await Notification.countDocuments({ user: req.user._id, isRead: false });
    return successResponse(res, { count });
  } catch (err) { next(err); }
};

module.exports = { getNotifications, markAsRead, markAllAsRead, deleteNotification, getUnreadCount };