import { Calendar, Pill, FileText, Activity, Clock, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Card from '../../components/common/Card'

const stats = [
  { icon: Calendar, label: 'Upcoming Appointments', value: '3', color: 'bg-blue-50 text-blue-600',   link: '/patient/appointments' },
  { icon: Pill,     label: 'Active Medicines',       value: '5', color: 'bg-green-50 text-green-600', link: '/patient/medicines' },
  { icon: FileText, label: 'Reports',                value: '8', color: 'bg-purple-50 text-purple-600', link: '/patient/reports' },
  { icon: Activity, label: 'Health Score',           value: '87%', color: 'bg-amber-50 text-amber-600', link: '/patient/analytics' },
]

const recentAppointments = [
  { doctor: 'Dr. Rahul Mehta', specialization: 'Cardiologist', date: 'Today, 3:00 PM', status: 'confirmed' },
  { doctor: 'Dr. Priya Singh', specialization: 'Dermatologist', date: 'Tomorrow, 11:00 AM', status: 'pending' },
  { doctor: 'Dr. Anil Kumar', specialization: 'General Physician', date: 'Dec 20, 9:00 AM', status: 'confirmed' },
]

const statusColors = {
  confirmed: 'badge-green',
  pending:   'badge-amber',
  cancelled: 'badge-red',
}

export default function PatientDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-800">Good morning, Shivam 👋</h1>
        <p className="text-slate-500 text-sm mt-1">Here's your health overview for today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ icon: Icon, label, value, color, link }) => (
          <Link to={link} key={label}>
            <Card hover className="flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
                <Icon size={20} />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-slate-800">{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Appointments */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-slate-800">Upcoming Appointments</h2>
          <Link to="/patient/appointments" className="text-primary-600 text-sm flex items-center gap-1 hover:underline">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="space-y-3">
          {recentAppointments.map((appt, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-sm">
                  {appt.doctor.split(' ')[1][0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{appt.doctor}</p>
                  <p className="text-xs text-slate-400">{appt.specialization}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 flex items-center gap-1"><Clock size={12} />{appt.date}</p>
                <span className={`badge mt-1 ${statusColors[appt.status]}`}>{appt.status}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card>
        <h2 className="font-display font-semibold text-slate-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Book Appointment', link: '/patient/book-appointment', emoji: '📅' },
            { label: 'Symptom Checker', link: '/patient/symptom-checker',   emoji: '🩺' },
            { label: 'Upload Report',   link: '/patient/reports',           emoji: '📄' },
            { label: 'Diet Planner',    link: '/patient/diet',              emoji: '🥗' },
          ].map(({ label, link, emoji }) => (
            <Link key={label} to={link} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-50 hover:bg-primary-50 hover:text-primary-700 transition-colors text-slate-600 text-sm font-medium text-center">
              <span className="text-2xl">{emoji}</span>
              {label}
            </Link>
          ))}
        </div>
      </Card>
    </div>
  )
}