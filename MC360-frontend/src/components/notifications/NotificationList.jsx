import { useNotifications } from '../../hooks/useNotifications'
import { Bell, CheckCheck, Calendar, Pill, AlertTriangle, Activity } from 'lucide-react'
import { timeAgo } from '../../utils/formatDate'

const TYPE_ICON = {
  appointment: Calendar,
  medicine: Pill,
  emergency: AlertTriangle,
  health: Activity,
}

export default function NotificationList({ onClose }) {
  const { notifications, markRead, markAllRead } = useNotifications()

  return (
    <div className="flex flex-col max-h-96">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-200">
        <p className="text-sm font-semibold text-slate-900">Notifications</p>
        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1 text-xs text-primary-600 hover:underline"
          >
            <CheckCheck className="w-3.5 h-3.5" /> Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="overflow-y-auto flex-1 divide-y divide-surface-100">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-slate-400">
            <Bell className="w-8 h-8 mb-2 text-slate-200" />
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : (
          notifications.slice(0, 15).map((n) => {
            const Icon = TYPE_ICON[n.type] || Bell
            return (
              <button
                key={n._id}
                onClick={() => { markRead(n._id); onClose?.() }}
                className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-surface-50 transition-colors ${
                  !n.isRead ? 'bg-primary-50/40' : ''
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  n.type === 'emergency' ? 'bg-red-100' : 'bg-primary-100'
                }`}>
                  <Icon className={`w-4 h-4 ${
                    n.type === 'emergency' ? 'text-red-600' : 'text-primary-600'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs leading-relaxed ${
                    !n.isRead ? 'font-semibold text-slate-900' : 'text-slate-700'
                  }`}>
                    {n.message}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{timeAgo(n.createdAt)}</p>
                </div>
                {!n.isRead && (
                  <span className="w-2 h-2 bg-primary-500 rounded-full shrink-0 mt-1.5" />
                )}
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}