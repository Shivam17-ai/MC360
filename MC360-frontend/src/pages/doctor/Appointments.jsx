import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { appointmentService } from '../../services/appointmentService'
import { Calendar, Video, User, Clock, CheckCircle, RefreshCcw, XCircle } from 'lucide-react'
import Avatar from '../../components/common/Avatar'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import { formatDate } from '../../utils/formatDate'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const TABS = ['today', 'upcoming', 'completed', 'cancelled']

// Build the correct query params for each tab
const getTabParams = (tab) => {
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayEnd = new Date()
  todayEnd.setHours(23, 59, 59, 999)
  const tomorrow = new Date(todayEnd.getTime() + 1)

  if (tab === 'today') {
    return { status: 'confirmed', from: todayStart.toISOString(), to: todayEnd.toISOString() }
  } else if (tab === 'upcoming') {
    return { status: 'confirmed', from: tomorrow.toISOString() }
  } else if (tab === 'completed') {
    return { status: 'completed' }
  } else {
    return { status: 'cancelled' }
  }
}

export default function DoctorAppointments() {
  const [tab, setTab] = useState('today')
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['doctor-appointments', tab, new Date().toDateString()],
    queryFn: () => appointmentService.getAll(getTabParams(tab)).then(r => r.data),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => appointmentService.updateStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['doctor-appointments'])
      toast.success('Appointment updated')
    },
    onError: () => toast.error('Failed to update status')
  })

  const cancelMutation = useMutation({
    mutationFn: ({ id, reason }) => appointmentService.cancel(id, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries(['doctor-appointments'])
      toast.success('Appointment cancelled')
    },
    onError: () => toast.error('Failed to cancel appointment')
  })

  const handleCancelStatus = (id) => {
    const reason = window.prompt("Reason for cancellation?")
    if (reason !== null) {
      cancelMutation.mutate({ id, reason })
    }
  }

  const appts = data || []

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="section-title">Appointments</h1>
        <p className="section-subtitle">Manage your consultation schedule</p>
      </div>

      <div className="flex gap-1 bg-surface-100 rounded-xl p-1 w-fit">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${tab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{t}</button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-200 bg-surface-50">
                {['Patient', 'Date & Time', 'Type', 'Reason', 'Status', 'Action'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 6 }).map((_, j) => <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded" /></td>)}</tr>
                ))
              ) : appts.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-400">No {tab} appointments</td></tr>
              ) : (
                appts.map(appt => (
                  <tr key={appt._id} className="hover:bg-surface-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={appt.patient?.user?.name} size="sm" />
                        <div>
                          <p className="font-medium text-slate-900">{appt.patient?.user?.name || '—'}</p>
                          <div className="flex flex-col gap-0.5">
                            <p className="text-[10px] font-bold text-primary-600 tracking-tight">{appt.patient?.patientId?.replace('MC360-', '')}</p>
                            <p className="text-xs text-slate-400">{appt.patient?.user?.phone}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-slate-700">{formatDate(appt.date)}</p>
                      <p className="text-xs text-slate-400">{appt.timeSlot}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={appt.type === 'telemedicine' ? 'blue' : 'gray'}>
                        {appt.type === 'telemedicine' ? <Video className="w-3 h-3" /> : <User className="w-3 h-3" />}
                        {appt.type}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-xs truncate">{appt.reason}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <Badge variant={appt.status === 'confirmed' ? 'green' : appt.status === 'completed' ? 'blue' : appt.status === 'cancelled' ? 'red' : 'gray'}>
                          {appt.status}
                        </Badge>
                        {appt.followUpRequired && <Badge variant="yellow" className="text-[10px] py-0">Revisit Required</Badge>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {appt.status === 'confirmed' && (
                          <>
                            <button
                              onClick={() => updateMutation.mutate({ id: appt._id, data: { status: 'completed', followUpRequired: false } })}
                              disabled={updateMutation.isPending}
                              className="text-emerald-600 hover:bg-emerald-50 p-1.5 rounded-lg transition-colors border border-emerald-100"
                              title="Mark Completed"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => updateMutation.mutate({ id: appt._id, data: { status: 'completed', followUpRequired: true } })}
                              disabled={updateMutation.isPending}
                              className="text-amber-600 hover:bg-amber-50 p-1.5 rounded-lg transition-colors border border-amber-100"
                              title="Mark Completed with Revisit"
                            >
                              <RefreshCcw className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleCancelStatus(appt._id)}
                              disabled={cancelMutation.isPending}
                              className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors border border-red-100"
                              title="Cancel Appointment"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}