import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Calendar, FileText, Pill, Activity, Brain, ArrowRight, Clock, CheckCircle2, AlertCircle, FlaskConical } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { appointmentService } from '../../services/appointmentService'
import { medicineService } from '../../services/medicineService'
import { testService } from '../../services/testService'
import { formatDateTime, smartDate } from '../../utils/formatDate'
import Badge from '../../components/common/Badge'
import { getStatusColor } from '../../utils/helpers'
import { CardSkeleton } from '../../components/common/SkeletonLoader'

export default function PatientDashboard() {
  const { user } = useAuthStore()

  const { data: apptResponse, isLoading: apptLoading } = useQuery({
    queryKey: ['appointments', 'upcoming'],
    queryFn: () => appointmentService.getAll({ status: 'confirmed' }).then(r => r),
    staleTime: 0,
    refetchOnMount: 'always',
  })

  const { data: medicines, isLoading: medLoading } = useQuery({
    queryKey: ['medicines'],
    queryFn: () => medicineService.getAll().then(r => r.data),
  })

  const { data: testsResponse, isLoading: testsLoading } = useQuery({
    queryKey: ['tests', 'upcoming'],
    queryFn: () => testService.getAll({ status: 'upcoming', limit: 3 }).then(r => r),
    staleTime: 0,
    refetchOnMount: 'always',
  })

  const upcoming = apptResponse?.data || []
  const totalAppointments = apptResponse?.pagination?.total ?? upcoming.length
  const meds = medicines || []
  const todayMeds = meds.filter(m => m.isActive)
  const upcomingTests = Array.isArray(testsResponse) ? testsResponse : (testsResponse?.data || [])

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Good {getGreeting()}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">Here's your health summary for today.</p>
        </div>
        <Link to="/patient/book-appointment" className="btn-primary">
          <Calendar className="w-4 h-4" /> Book Appointment
        </Link>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Upcoming Appts', value: totalAppointments, icon: Calendar, bg: 'bg-primary-50', color: 'text-primary-600', to: '/patient/appointments' },
          { label: 'Upcoming Tests', value: testsResponse?.pagination?.total ?? upcomingTests.length, icon: FlaskConical, bg: 'bg-teal-50', color: 'text-teal-600', to: '/patient/tests' },
          { label: 'Active Medicines', value: todayMeds.length, icon: Pill, bg: 'bg-amber-50', color: 'text-amber-600', to: '/patient/medicines' },
          { label: 'Health Score', value: '86', icon: Activity, bg: 'bg-emerald-50', color: 'text-emerald-600', to: '/patient/analytics' },
        ].map((stat) => (
          <Link key={stat.label} to={stat.to} className="stat-card hover:shadow-card-hover transition-shadow group">
            <div className={`w-11 h-11 ${stat.bg} rounded-xl flex items-center justify-center shrink-0`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-slate-900">Upcoming Appointments</h2>
            <Link to="/patient/appointments" className="text-xs text-primary-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {apptLoading ? (
            <div className="space-y-3"><CardSkeleton /><CardSkeleton /></div>
          ) : upcoming.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-400">No upcoming appointments</p>
              <Link to="/patient/book-appointment" className="text-xs text-primary-600 hover:underline mt-1 inline-block">Book one now →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map((appt) => (
                <div key={appt._id} className={`flex items-center gap-3 p-3 rounded-xl transition-all border ${appt.isFollowUp ? 'bg-emerald-50 border-emerald-200 text-emerald-950 shadow-sm' : 'bg-surface-50 border-transparent'}`}>
                  <div className={`w-10 h-10 ${appt.isFollowUp ? 'bg-emerald-100' : 'bg-primary-100'} rounded-xl flex items-center justify-center shrink-0`}>
                    <Clock className={`w-4 h-4 ${appt.isFollowUp ? 'text-emerald-600' : 'text-primary-600'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{appt.doctor?.user?.name || appt.doctor?.name || 'Doctor'}</p>
                    <p className="text-xs text-slate-400">{smartDate(appt.date)} · {appt.timeSlot}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant={appt.status === 'confirmed' ? 'green' : 'yellow'}>{appt.status}</Badge>
                    {appt.isFollowUp && (
                      <Badge variant="green" className="text-[10px] py-0.5">
                        Follow-up
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Today's Medicines */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-slate-900">Today's Medicines</h2>
            <Link to="/patient/medicines" className="text-xs text-primary-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {medLoading ? (
            <div className="space-y-3"><CardSkeleton /></div>
          ) : todayMeds.length === 0 ? (
            <div className="text-center py-8">
              <Pill className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-400">No medicines tracked</p>
              <Link to="/patient/medicines" className="text-xs text-primary-600 hover:underline mt-1 inline-block">Add medicine →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {todayMeds.slice(0, 4).map((med) => (
                <div key={med._id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-50">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                    <Pill className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">{med.name}</p>
                    <p className="text-xs text-slate-400">{med.dosage} · {med.frequency}</p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Tests */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-slate-900">Upcoming Tests</h2>
            <Link to="/patient/tests" className="text-xs text-primary-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {testsLoading ? (
            <div className="space-y-3"><CardSkeleton /><CardSkeleton /></div>
          ) : upcomingTests.length === 0 ? (
            <div className="text-center py-8">
              <FlaskConical className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-400">No upcoming tests</p>
              <Link to="/patient/book-test" className="text-xs text-primary-600 hover:underline mt-1 inline-block">Book a test →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingTests.map((test) => (
                <div key={test._id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-50">
                  <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center shrink-0">
                    <FlaskConical className="w-4 h-4 text-teal-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{test.testName}</p>
                    <p className="text-xs text-slate-400">{smartDate(test.scheduledDate)} · {test.category}</p>
                  </div>
                  <Badge variant="blue">{test.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>


      {/* Quick Actions */}
      <div className="card p-5">
        <h2 className="text-base font-semibold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((qa) => (
            <Link key={qa.label} to={qa.to} className="flex flex-col items-center gap-2.5 p-4 rounded-xl bg-surface-50 hover:bg-surface-100 transition-colors text-center group">
              <div className={`w-10 h-10 ${qa.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <qa.icon className={`w-5 h-5 ${qa.color}`} />
              </div>
              <span className="text-xs font-medium text-slate-700">{qa.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}

const quickActions = [
  { label: 'Symptom Checker', to: '/patient/symptom-checker', icon: Brain, bg: 'bg-rose-50', color: 'text-rose-500' },
  { label: 'Upload Report', to: '/patient/reports', icon: FileText, bg: 'bg-teal-50', color: 'text-teal-500' },
  { label: 'Health Analytics', to: '/patient/analytics', icon: Activity, bg: 'bg-emerald-50', color: 'text-emerald-500' },
  { label: 'Diet Planner', to: '/patient/diet', icon: Activity, bg: 'bg-violet-50', color: 'text-violet-500' },
]