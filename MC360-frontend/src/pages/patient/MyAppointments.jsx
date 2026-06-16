import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { appointmentService } from '../../services/appointmentService'
import { formatDate, formatTime } from '../../utils/formatDate'
import { getStatusColor } from '../../utils/helpers'
import { Calendar, Video, User, X, Clock } from 'lucide-react'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import Avatar from '../../components/common/Avatar'
import Modal from '../../components/common/Modal'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { APPOINTMENT_STATUS } from '../../utils/constants'

const TABS = ['upcoming', 'completed', 'cancelled']

// Map UI tab names to the actual DB status values
const TAB_STATUS_MAP = {
  upcoming: 'confirmed',
  completed: 'completed',
  cancelled: 'cancelled',
}

export default function MyAppointments() {
  const [activeTab, setActiveTab] = useState('upcoming')
  const [cancelId, setCancelId] = useState(null)
  const qc = useQueryClient()
  const navigate = useNavigate()

  const { data, isLoading, error } = useQuery({
    queryKey: ['appointments', activeTab],
    staleTime: 0,
    queryFn: async () => {
      const body = await appointmentService.getAll({ status: TAB_STATUS_MAP[activeTab] })
      console.log('🔍 [MyAppointments] raw body:', body)
      console.log('🔍 [MyAppointments] body.data:', body?.data)
      if (Array.isArray(body?.data)) return body.data
      if (Array.isArray(body)) return body
      return []
    },
  })

  const cancel = useMutation({
    mutationFn: (id) => appointmentService.cancel(id),
    onSuccess: () => {
      toast.success('Appointment cancelled')
      qc.invalidateQueries(['appointments'])
      setCancelId(null)
    },
    onError: (e) => toast.error(e.message),
  })

  const appointments = Array.isArray(data) ? data : []

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="section-title">My Appointments</h1>
        <p className="section-subtitle">Manage all your past and upcoming consultations</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-100 rounded-xl p-1 w-fit">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {error ? (
          <div className="card p-8 text-center border border-red-200 bg-red-50">
            <p className="text-red-600 font-medium">Error loading appointments</p>
            <p className="text-red-400 text-sm mt-1">{error.message}</p>
          </div>
        ) : isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card p-5">
              <div className="flex gap-4">
                <div className="skeleton w-12 h-12 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-1/3" />
                  <div className="skeleton h-3 w-1/2" />
                </div>
              </div>
            </div>
          ))
        ) : appointments.length === 0 ? (
          <div className="card p-16 text-center">
            <Calendar className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400">No {activeTab} appointments</p>
          </div>
        ) : (
          appointments.map(appt => (
            <div key={appt._id} className="card p-5">
              <div className="flex items-start gap-4">
                <Avatar name={appt.doctor?.user?.name} src={appt.doctor?.user?.avatar} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-900">{appt.doctor?.user?.name || 'Doctor'}</h3>
                      <p className="text-sm text-slate-500">{appt.doctor?.specialization}</p>
                    </div>
                    <Badge variant={appt.status === 'confirmed' ? 'green' : appt.status === 'completed' ? 'blue' : appt.status === 'cancelled' ? 'red' : 'yellow'}>
                      {appt.status === 'confirmed' ? 'upcoming' : appt.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(appt.date)}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{appt.timeSlot}</span>
                    <span className="flex items-center gap-1">{appt.type === 'telemedicine' ? <Video className="w-3 h-3" /> : <User className="w-3 h-3" />}{appt.type}</span>
                  </div>
                  {appt.reason && <p className="text-xs text-slate-400 mt-2 bg-surface-50 rounded-lg px-3 py-1.5">Reason: {appt.reason}</p>}
                </div>
                {appt.status === 'confirmed' && (
                  <div className="flex gap-2 shrink-0">
                    {appt.type === 'telemedicine' && (
                      <Button size="sm" onClick={() => navigate(`/patient/video/${appt._id}`)}>
                        <Video className="w-3.5 h-3.5" /> Join
                      </Button>
                    )}
                    <Button size="sm" variant="secondary" onClick={() => setCancelId(appt._id)}>
                      <X className="w-3.5 h-3.5" /> Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={!!cancelId} onClose={() => setCancelId(null)} title="Cancel Appointment" size="sm">
        <p className="text-sm text-slate-600 mb-5">Are you sure you want to cancel this appointment? This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setCancelId(null)}>Keep it</Button>
          <Button variant="danger" loading={cancel.isPending} onClick={() => cancel.mutate(cancelId)}>Yes, Cancel</Button>
        </div>
      </Modal>
    </div>
  )
}