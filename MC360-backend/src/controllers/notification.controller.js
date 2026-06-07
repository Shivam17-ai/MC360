import Notification from '../models/Notification.model.js'
import { sendSuccess, sendError, sendNotFound } from '../utils/response.js'
import { paginate } from '../utils/paginate.js'

// ── Get My Notifications ──────────────────────────────────────────────────────
export const getMyNotifications = async (req, res) => {
  try {
    const result = await paginate(Notification, { user: req.user.id }, {
      page:  req.query.page,
      limit: req.query.limit || 20,
      sort:  { createdAt: -1 },
    })
    return sendSuccess(res, result)
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Mark As Read ──────────────────────────────────────────────────────────────
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isRead: true },
      { new: true }
    )
    if (!notification) return sendNotFound(res, 'Notification not found')
    return sendSuccess(res, notification)
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Mark All As Read ──────────────────────────────────────────────────────────
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user.id, isRead: false }, { isRead: true })
    return sendSuccess(res, null, 'All notifications marked as read')
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Get Unread Count ──────────────────────────────────────────────────────────
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({ user: req.user.id, isRead: false })
    return sendSuccess(res, { count })
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Delete Notification ───────────────────────────────────────────────────────
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({ _id: req.params.id, user: req.user.id })
    if (!notification) return sendNotFound(res, 'Notification not found')
    return sendSuccess(res, null, 'Notification deleted')
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Clear All Notifications ───────────────────────────────────────────────────
export const clearAll = async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user.id })
    return sendSuccess(res, null, 'All notifications cleared')
  } catch (err) {
    return sendError(res, err.message)
  }
}