import { useState, useEffect } from 'react'
import { AlertTriangle, X, Phone } from 'lucide-react'
import { useSocketStore } from '../../store/socketStore'
import { motion, AnimatePresence } from 'framer-motion'

export default function EmergencyAlertBanner() {
  const socket = useSocketStore((s) => s.socket)
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    if (!socket) return
    socket.on('emergency:new', (alert) => {
      setAlerts((p) => [{ ...alert, id: Date.now() }, ...p])
      // Auto-dismiss after 10s
      setTimeout(() => {
        setAlerts((p) => p.filter((a) => a.id !== Date.now()))
      }, 10000)
    })
    return () => socket.off('emergency:new')
  }, [socket])

  const dismiss = (id) => setAlerts((p) => p.filter((a) => a.id !== id))

  return (
    <div className="fixed top-20 right-4 z-50 space-y-3 max-w-sm w-full">
      <AnimatePresence>
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 80 }}
            className="bg-red-600 text-white rounded-2xl shadow-2xl p-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold">🚨 Emergency Alert</p>
                <p className="text-sm text-red-100 mt-0.5">{alert.patientName}</p>
                <p className="text-xs text-red-200 mt-1">{alert.description}</p>
                {alert.contactPhone && (
                  <a
                    href={`tel:${alert.contactPhone}`}
                    className="inline-flex items-center gap-1 mt-2 text-xs font-semibold bg-white/20 rounded-lg px-2 py-1 hover:bg-white/30 transition-colors"
                  >
                    <Phone className="w-3 h-3" /> {alert.contactPhone}
                  </a>
                )}
              </div>
              <button
                onClick={() => dismiss(alert.id)}
                className="p-1 rounded-lg hover:bg-white/20 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}