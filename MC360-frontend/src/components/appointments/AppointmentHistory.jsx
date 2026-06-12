import { useQuery } from '@tanstack/react-query'
import { appointmentService } from '../../services/appointmentService'
import { formatDate } from '../../utils/formatDate'
import Badge from '../common/Badge'
import Avatar from '../common/Avatar'
import { TableSkeleton } from '../common/SkeletonLoader'

export default function AppointmentHistory({ patientId }) {
  const { data, isLoading } = useQuery({
    queryKey: ['appointment-history', patientId],
    queryFn: () =>
      appointmentService
        .getAll({ patientId, status: 'completed', limit: 10 })
        .then((r) => r.data),
    enabled: !!patientId,
  })

  const appointments = data || []

  if (isLoading) return <TableSkeleton rows={4} cols={4} />

  return (
    <div className="space-y-2">
      {appointments.length === 0 ? (
        <p className="text-sm text-slate-400 py-4 text-center">No appointment history</p>
      ) : (
        appointments.map((appt) => (
          <div
            key={appt._id}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 transition-colors"
          >
            <Avatar
              name={appt.doctor?.name || appt.patient?.name}
              size="sm"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {appt.doctor?.name || appt.patient?.name}
              </p>
              <p className="text-xs text-slate-400">
                {formatDate(appt.date)} · {appt.slot}
              </p>
            </div>
            <Badge variant="blue">completed</Badge>
          </div>
        ))
      )}
    </div>
  )
}