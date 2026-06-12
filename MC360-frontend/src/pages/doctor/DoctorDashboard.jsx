import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Calendar, Users, Clock, Video, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { appointmentService } from '../../services/appointmentService'
import Avatar from '../../components/common/Avatar'
import Badge from '../../components/common/Badge'
import { smartDate } from '../../utils/formatDate'

export default function DoctorDashboard() {
  const { user } = useAuthStore()

  const { data: todayAppts, isLoading: isTodayLoading } = useQuery({
    queryKey: ['doctor-appointments', 'today', new Date().toDateString()],
    queryFn: () => {
      const todayStart = new Date()
      todayStart.setHours(0, 0, 0, 0)
      const todayEnd = new Date()
      todayEnd.setHours(23, 59, 59, 999)
      return appointmentService.getAll({
        status: 'confirmed',
        from: todayStart.toISOString(),
        to: todayEnd.toISOString(),
        limit: 10,
      }).then(r => r.data)
    },
  })

  const { data: upcomingAppts, isLoading: isUpcomingLoading } = useQuery({
    queryKey: ['doctor-appointments', 'upcoming-dashboard'],
    queryFn: () => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)
      return appointmentService.getAll({
        status: 'confirmed',
        from: tomorrow.toISOString(),
        limit: 5,
      }).then(r => r.data)
    },
  })

  const appointments = todayAppts || []
  const upcoming = upcomingAppts || []

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Good morning, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-sm text-slate-500 mt-1">Here's your schedule for today.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Today's Appointments", value: appointments.length, icon: Calendar, bg: 'bg-primary-50', color: 'text-primary-600' },
          { label: 'Total Patients', value: '248', icon: Users, bg: 'bg-teal-50', color: 'text-teal-600' },
          { label: 'Upcoming', value: upcoming.length, icon: Clock, bg: 'bg-amber-50', color: 'text-amber-600' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className={`w-11 h-11 ${s.bg} rounded-xl flex items-center justify-center shrink-0`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's appointments */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-slate-900">Today's Schedule</h2>
            <Link to="/doctor/appointments" className="text-xs text-primary-600 hover:underline flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
          </div>
          {isTodayLoading ? (
            <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-10">
              <Calendar className="w-8 h-8 text-slate-200 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">No appointments today</p>
            </div>
          ) : (
            <div className="space-y-2">
              {appointments.map(appt => (
                <div key={appt._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-50 transition-colors border border-transparent hover:border-surface-100">
                  <span className="text-[11px] font-bold text-slate-500 w-16 shrink-0">{appt.timeSlot.split(' - ')[0]}</span>
                  <Avatar name={appt.patient?.user?.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{appt.patient?.user?.name || '—'}</p>
                    <p className="text-[10px] text-slate-400 truncate">{appt.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming appointments */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-slate-900">Upcoming Preview</h2>
            <Link to="/doctor/appointments?tab=upcoming" className="text-xs text-primary-600 hover:underline flex items-center gap-1">Manage <ArrowRight className="w-3 h-3" /></Link>
          </div>
          {isUpcomingLoading ? (
            <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
          ) : upcoming.length === 0 ? (
            <div className="text-center py-10">
              <Clock className="w-8 h-8 text-slate-200 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">No upcoming appointments</p>
            </div>
          ) : (
            <div className="space-y-2">
              {upcoming.map(appt => (
                <div key={appt._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-50 transition-colors border border-transparent hover:border-surface-100">
                  <div className="w-16 shrink-0 text-center">
                    <p className="text-[10px] font-bold text-primary-600 uppercase">{new Date(appt.date).toLocaleDateString('en-US', { month: 'short' })}</p>
                    <p className="text-lg font-bold text-slate-900 leading-none">{new Date(appt.date).getDate()}</p>
                  </div>
                  <Avatar name={appt.patient?.user?.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{appt.patient?.user?.name || '—'}</p>
                    <p className="text-[10px] text-slate-400 truncate">{appt.timeSlot} • {appt.type}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}