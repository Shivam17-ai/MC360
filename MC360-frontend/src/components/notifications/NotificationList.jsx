import { useEffect } from "react";
import {
  CheckCheck,
  Trash2,
  Bell,
  CalendarDays,
  Pill,
  Video,
  AlertTriangle,
  FileText,
  X,
} from "lucide-react";
import useNotificationStore from "../../store/notificationStore";

const iconMap = {
  appointment: { icon: CalendarDays, color: "text-blue-600 bg-blue-100" },
  medicine: { icon: Pill, color: "text-green-600 bg-green-100" },
  video: { icon: Video, color: "text-purple-600 bg-purple-100" },
  emergency: { icon: AlertTriangle, color: "text-red-600 bg-red-100" },
  report: { icon: FileText, color: "text-amber-600 bg-amber-100" },
  default: { icon: Bell, color: "text-gray-600 bg-gray-100" },
};

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const NotificationList = ({ onClose }) => {
  const {
    notifications,
    fetchNotifications,
    markAllRead,
    markRead,
    deleteNotification,
    loading,
  } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unread = notifications.filter((n) => !n.isRead);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-800 text-sm">Notifications</h3>
          {unread.length > 0 && (
            <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">
              {unread.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unread.length > 0 && (
            <button
              onClick={markAllRead}
              title="Mark all as read"
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <CheckCheck size={15} />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-96 overflow-y-auto divide-y divide-gray-50">
        {loading ? (
          <div className="flex items-center justify-center py-10 text-gray-400 text-sm">
            Loading...
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <Bell size={28} className="mb-2 opacity-30" />
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notif) => {
            const type = notif.type || "default";
            const { icon: Icon, color } = iconMap[type] || iconMap.default;

            return (
              <div
                key={notif._id}
                onClick={() => !notif.isRead && markRead(notif._id)}
                className={`flex gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                  !notif.isRead ? "bg-blue-50/40" : ""
                }`}
              >
                {/* Icon */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}
                >
                  <Icon size={16} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <p
                      className={`text-sm leading-snug ${
                        !notif.isRead ? "font-semibold text-gray-800" : "text-gray-600"
                      }`}
                    >
                      {notif.title}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notif._id);
                      }}
                      className="p-1 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  {notif.message && (
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {timeAgo(notif.createdAt)}
                  </p>
                </div>

                {/* Unread dot */}
                {!notif.isRead && (
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-100 text-center">
          <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationList;