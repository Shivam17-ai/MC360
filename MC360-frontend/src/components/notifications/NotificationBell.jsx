import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import NotificationList from "./NotificationList";
import useNotificationStore from "../../store/notificationStore";

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { unreadCount } = useNotificationStore();

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="relative p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 rounded-xl transition-colors"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-96 z-50">
          <NotificationList onClose={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default NotificationBell;