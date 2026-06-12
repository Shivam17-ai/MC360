import { Activity } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-surface-900 text-slate-400 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-teal-500 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-white">MC360</span>
            </Link>
            <p className="text-sm leading-relaxed">
              Complete healthcare management for patients, doctors, and hospitals.
            </p>
          </div>
          {[
            { title: 'Product', links: ['Features', 'Services', 'Pricing', 'Changelog'] },
            { title: 'Company', links: ['About', 'Careers', 'Blog', 'Press'] },
            { title: 'Legal', links: ['Privacy', 'Terms', 'Cookies', 'Security'] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-white mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm hover:text-white transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="divider border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs">© 2025 MC360. All rights reserved.</p>
          <p className="text-xs">Built with care for better healthcare.</p>
        </div>
      </div>
    </footer>
  )
}