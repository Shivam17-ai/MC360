import { useQuery } from '@tanstack/react-query'
import api from '../../services/api'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#2a85ff', '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6']

export default function HospitalAnalytics() {
  const { data: analytics } = useQuery({
    queryKey: ['hospital-analytics'],
    queryFn: () => api.get('/hospital/analytics').then(r => r.data),
  })

  const a = analytics || {}

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="section-title">Analytics</h1>
        <p className="section-subtitle">Comprehensive hospital performance insights</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Appointments over time */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Monthly Appointments</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={a.monthlyAppointments || MOCK_MONTHLY}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="count" fill="#2a85ff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Specialization distribution */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Patients by Specialization</h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="60%" height={180}>
              <PieChart>
                <Pie data={a.bySpecialization || MOCK_SPEC} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value">
                  {(a.bySpecialization || MOCK_SPEC).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {(a.bySpecialization || MOCK_SPEC).map((item, i) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-slate-600">{item.name}</span>
                  <span className="ml-auto font-medium text-slate-800">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue trend */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Revenue Trend (₹)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={a.revenue || MOCK_REVENUE}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={v => `₹${v.toLocaleString()}`} />
              <Line type="monotone" dataKey="revenue" stroke="#14b8a6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Key metrics */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Key Metrics</h3>
          <div className="space-y-3">
            {[
              { label: 'Patient Satisfaction', value: `${a.satisfaction || 94}%`, bar: a.satisfaction || 94 },
              { label: 'Appointment Completion', value: `${a.completionRate || 89}%`, bar: a.completionRate || 89 },
              { label: 'Doctor Utilization', value: `${a.doctorUtilization || 76}%`, bar: a.doctorUtilization || 76 },
              { label: 'Bed Occupancy', value: `${a.bedOccupancy || 72}%`, bar: a.bedOccupancy || 72 },
            ].map(m => (
              <div key={m.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">{m.label}</span>
                  <span className="font-semibold text-slate-900">{m.value}</span>
                </div>
                <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${m.bar}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const MOCK_MONTHLY = ['Jan','Feb','Mar','Apr','May','Jun'].map(m => ({ month: m, count: Math.floor(Math.random() * 200) + 100 }))
const MOCK_SPEC = [{ name: 'Gen. Medicine', value: 42 }, { name: 'Cardiology', value: 28 }, { name: 'Ortho', value: 18 }, { name: 'Pediatrics', value: 35 }, { name: 'Others', value: 20 }]
const MOCK_REVENUE = ['Jan','Feb','Mar','Apr','May','Jun'].map(m => ({ month: m, revenue: Math.floor(Math.random() * 500000) + 300000 }))