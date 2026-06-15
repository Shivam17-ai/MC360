const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");
const { protect } = require("../middlewares/auth.middleware");

router.use(protect);

router.get("/", notificationController.getNotifications);
router.get("/unread-count", notificationController.getUnreadCount);

// Support both PUT (legacy) and PATCH (frontend uses PATCH)
router.put("/mark-all-read", notificationController.markAllAsRead);
router.patch("/read-all", notificationController.markAllAsRead);

router.put("/:id/read", notificationController.markAsRead);
router.patch("/:id/read", notificationController.markAsRead);

router.delete("/:id", notificationController.deleteNotification);

module.exports = router;