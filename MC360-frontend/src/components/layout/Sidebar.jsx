import { NavLink, useNavigate } from 'react-router-dom'
import { Activity, LogOut } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import Avatar from '../common/Avatar'
import { clsx } from 'clsx'

export default function Sidebar({ navItems }) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 flex flex-col bg-white border-r border-surface-200">
      {/* Logo */}
      <div className="px-5 h-16 flex items-center gap-2.5 border-b border-surface-200 shrink-0">
        <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-teal-500 rounded-lg flex items-center justify-center">
          <Activity className="w-4 h-4 text-white" />
        </div>
        <span className="text-lg font-semibold text-slate-900">MC<span className="text-gradient">360</span></span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => clsx(isActive ? 'nav-link-active' : 'nav-link')}
          >
            <item.icon className="w-4.5 h-4.5 shrink-0" style={{ width: '18px', height: '18px' }} />
            {item.label}
            {item.badge && (
              <span className="ml-auto badge-red py-0.5">{item.badge}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-surface-200">
        <div className="flex items-center gap-3 mb-3">
          <Avatar name={user?.name} src={user?.avatar} size="sm" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="nav-link w-full text-red-500 hover:bg-red-50 hover:text-red-600">
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  )
}