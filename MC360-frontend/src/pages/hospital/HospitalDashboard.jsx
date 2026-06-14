import { useQuery } from '@tanstack/react-query'
import { Users, UserCheck, Calendar, AlertTriangle, TrendingUp, Activity } from 'lucide-react'
import api from '../../services/api'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function HospitalDashboard() {
  const { data: stats } = useQuery({
    queryKey: ['hospital-stats'],
    queryFn: () => api.get('/hospitals/me/stats').then(r => r.data),
  })

  const s = stats || {}

  const statCards = [
    { label: 'Total Patients', value: s.totalPatients || '0', icon: Users, bg: 'bg-primary-50', color: 'text-primary-600', trend: '+5%' },
    { label: 'Active Doctors', value: s.totalDoctors || '0', icon: UserCheck, bg: 'bg-teal-50', color: 'text-teal-600', trend: '' },
    { label: "Today's Appointments", value: s.todayAppointments || '0', icon: Calendar, bg: 'bg-amber-50', color: 'text-amber-600', trend: '' },
    { label: 'Emergency Alerts', value: s.emergencyAlerts || '0', icon: AlertTriangle, bg: 'bg-red-50', color: 'text-red-600', trend: '' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Hospital Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Overview of your facility operations</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(stat => (
          <div key={stat.label} className="stat-card">
            <div className={`w-11 h-11 ${stat.bg} rounded-xl flex items-center justify-center shrink-0`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.label}</p>
              {stat.trend && <span className="text-xs text-emerald-600 font-medium">{stat.trend} this month</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Patient Visits — Last 30 Days</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={s.visitTrends || MOCK_VISITS}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
            <Line type="monotone" dataKey="visits" stroke="#2a85ff" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Department breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Department Activity</h3>
          <div className="space-y-3">
            {(s.departments || MOCK_DEPTS).map(d => (
              <div key={d.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-700">{d.name}</span>
                  <span className="text-slate-500 font-medium">{d.count} patients</span>
                </div>
                <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500 rounded-full" style={{ width: `${d.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Quick Summary</h3>
          <div className="space-y-3">
            {[
              { label: 'Bed Occupancy', value: `${s.bedOccupancy !== undefined ? s.bedOccupancy : 72}%`, ok: true },
              { label: 'Avg Wait Time', value: `${s.avgWaitTime !== undefined ? s.avgWaitTime : 18} mins` },
              { label: 'Appointments Today', value: s.todayAppointments !== undefined ? s.todayAppointments : 0 },
              { label: 'New Patients (this week)', value: s.newPatientsWeek !== undefined ? s.newPatientsWeek : 0 },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between px-3 py-2.5 bg-surface-50 rounded-xl">
                <span className="text-sm text-slate-600">{item.label}</span>
                <span className="text-sm font-semibold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const MOCK_VISITS = Array.from({ length: 14 }, (_, i) => ({ date: `Jun ${i + 1}`, visits: Math.floor(Math.random() * 60) + 40 }))
const MOCK_DEPTS = [
  { name: 'General Medicine', count: 120, percent: 80 },
  { name: 'Cardiology', count: 65, percent: 43 },
  { name: 'Orthopedics', count: 48, percent: 32 },
  { name: 'Pediatrics', count: 90, percent: 60 },
]