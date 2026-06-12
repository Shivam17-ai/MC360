import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useNotifications } from '../../hooks/useNotifications'
import { useSocket } from '../../hooks/useSocket'
import NotificationBell from '../notifications/NotificationBell'

export default function DashboardLayout({ navItems }) {
  useSocket()
  useNotifications()

  return (
    <div className="flex min-h-screen bg-surface-50">
      <Sidebar navItems={navItems} />
      <main className="flex-1 min-w-0">
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-surface-200 px-6 h-16 flex items-center justify-end gap-3">
          <NotificationBell />
        </div>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}