import { useEffect, useState } from 'react'
import { useSocketStore } from '../../store/socketStore'
import api from '../../services/api'
import { useQuery } from '@tanstack/react-query'
import { AlertTriangle, MapPin, Clock, Phone, CheckCircle2 } from 'lucide-react'
import Badge from '../../components/common/Badge'
import { smartDate } from '../../utils/formatDate'
import toast from 'react-hot-toast'

export default function EmergencyMonitor() {
  const socket = useSocketStore(s => s.socket)
  const [alerts, setAlerts] = useState([])

  const { data, isLoading } = useQuery({
    queryKey: ['emergency-alerts'],
    queryFn: () => api.get('/emergency/alerts').then(r => r.data),
    onSuccess: (d) => setAlerts(d || []),
  })

  useEffect(() => {
    if (!socket) return
    socket.on('emergency:new', (alert) => {
      setAlerts(prev => [alert, ...prev])
      toast.error(`🚨 Emergency alert: ${alert.patientName}`, { duration: 8000 })
    })
    return () => socket.off('emergency:new')
  }, [socket])

  const resolve = async (id) => {
    await api.patch(`/emergency/alerts/${id}/resolve`)
    setAlerts(prev => prev.map(a => a._id === id ? { ...a, status: 'resolved' } : a))
    toast.success('Alert resolved')
  }

  const activeAlerts = alerts.filter(a => a.status !== 'resolved')
  const resolved = alerts.filter(a => a.status === 'resolved')

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <h1 className="section-title">Emergency Monitor</h1>
          <p className="section-subtitle">Real-time emergency alerts and critical cases</p>
        </div>
        {activeAlerts.length > 0 && (
          <span className="ml-auto px-3 py-1 bg-red-100 text-red-700 text-sm font-bold rounded-full animate-pulse">
            {activeAlerts.length} Active
          </span>
        )}
      </div>

      {/* Active alerts */}
      {activeAlerts.length === 0 ? (
        <div className="card p-12 text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-300 mx-auto mb-3" />
          <p className="text-slate-400">No active emergency alerts</p>
        </div>
      ) : (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-red-600 uppercase tracking-wide">Active Alerts</h2>
          {activeAlerts.map(alert => (
            <div key={alert._id} className="border-2 border-red-200 bg-red-50 rounded-2xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">{alert.patientName}</h3>
                    <p className="text-sm text-red-700 font-medium mt-0.5">{alert.type}</p>
                  </div>
                  <Badge variant="red">CRITICAL</Badge>
                </div>
                <p className="text-sm text-slate-600 mt-2">{alert.description}</p>
                <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-500">
                  {alert.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{alert.location}</span>}
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{smartDate(alert.createdAt)}</span>
                  {alert.contactPhone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{alert.contactPhone}</span>}
                </div>
              </div>
              <button onClick={() => resolve(alert._id)} className="btn-secondary text-xs shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> Resolve
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Resolved */}
      {resolved.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Resolved ({resolved.length})</h2>
          {resolved.slice(0, 5).map(alert => (
            <div key={alert._id} className="card p-4 flex items-center gap-4 opacity-70">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700">{alert.patientName}</p>
                <p className="text-xs text-slate-400">{alert.type} · {smartDate(alert.createdAt)}</p>
              </div>
              <Badge variant="green">Resolved</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}