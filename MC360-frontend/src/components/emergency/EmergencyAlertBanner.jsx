import { AlertTriangle, X } from 'lucide-react'
import { useState } from 'react'

export default function EmergencyAlertBanner({ message = 'Emergency services are currently on high alert. Please contact 112 for immediate help.' }) {
  const [visible, setVisible] = useState(true)
  if (!visible) return null

  return (
    <div className="bg-red-500 text-white px-4 py-3 flex items-center justify-between gap-3 animate-slide-down">
      <div className="flex items-center gap-2">
        <AlertTriangle size={18} className="shrink-0" />
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button onClick={() => setVisible(false)} className="shrink-0 hover:bg-red-600 rounded-lg p-1 transition-colors">
        <X size={16} />
      </button>
    </div>
  )
}