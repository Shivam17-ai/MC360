import { useEffect, useCallback } from "react";
import useNotificationStore from "../store/notificationStore";
import useSocketStore from "../store/socketStore";

/**
 * useNotifications
 * Connects to notification store and listens to real-time socket events.
 *
 * Usage:
 *   const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
 */
const useNotifications = () => {
  const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markRead,
    markAllRead,
    deleteNotification,
    addNotification,
  } = useNotificationStore();

  const { socket } = useSocketStore();

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Real-time socket listener
  useEffect(() => {
    if (!socket) return;

    const handler = (notification) => {
      addNotification(notification);
    };

    socket.on("notification", handler);
    return () => socket.off("notification", handler);
  }, [socket]);

  return {
    notifications,
    unreadCount,
    loading,
    markRead,
    markAllRead,
    deleteNotification,
    refetch: fetchNotifications,
  };
};

export default useNotifications;