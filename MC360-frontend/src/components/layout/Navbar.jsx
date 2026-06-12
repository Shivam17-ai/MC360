import { Link } from 'react-router-dom'
import { Activity } from 'lucide-react'

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-b border-surface-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 font-semibold text-slate-900">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-teal-500 rounded-lg flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg">MC<span className="text-gradient">360</span></span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {['Features', 'Services', 'About', 'Contact'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="btn-ghost text-sm">
              {item}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-secondary text-sm">Sign in</Link>
          <Link to="/register" className="btn-primary text-sm">Get started</Link>
        </div>
      </div>
    </header>
  )
}