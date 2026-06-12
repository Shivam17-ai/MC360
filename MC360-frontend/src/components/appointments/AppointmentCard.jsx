import { Calendar, Clock, Video, User, MapPin } from 'lucide-react'
import Avatar from '../common/Avatar'
import Badge from '../common/Badge'
import Button from '../common/Button'
import { formatDate } from '../../utils/formatDate'
import { useNavigate } from 'react-router-dom'

export default function AppointmentCard({ appointment, role = 'patient', onCancel }) {
  const navigate = useNavigate()
  const other = role === 'patient' ? appointment.doctor : appointment.patient

  const statusVariant = {
    confirmed: 'green', pending: 'yellow', completed: 'blue', cancelled: 'red',
  }

  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <Avatar name={other?.name} src={other?.avatar} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-slate-900 truncate">{other?.name || '—'}</p>
              <p className="text-xs text-slate-500">
                {role === 'patient' ? other?.specialization : 'Patient'}
              </p>
            </div>
            <Badge variant={statusVariant[appointment.status] || 'gray'}>
              {appointment.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-primary-400" />
          {formatDate(appointment.date)}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-primary-400" />
          {appointment.slot}
        </span>
        <span className="flex items-center gap-1.5">
          {appointment.mode === 'video'
            ? <Video className="w-3.5 h-3.5 text-violet-400" />
            : <User className="w-3.5 h-3.5 text-slate-400" />}
          {appointment.mode === 'video' ? 'Video call' : 'In-person'}
        </span>
        {appointment.hospital && (
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">{appointment.hospital}</span>
          </span>
        )}
      </div>

      {appointment.reason && (
        <p className="text-xs text-slate-400 bg-surface-50 rounded-lg px-3 py-2 truncate">
          {appointment.reason}
        </p>
      )}

      {appointment.status === 'confirmed' && (
        <div className="flex gap-2 pt-1">
          {appointment.mode === 'video' && (
            <Button
              size="sm"
              className="flex-1 justify-center"
              onClick={() => navigate(`/${role}/video/${appointment._id}`)}
            >
              <Video className="w-3.5 h-3.5" /> Join Call
            </Button>
          )}
          {onCancel && (
            <Button
              size="sm"
              variant="secondary"
              className="flex-1 justify-center text-red-500 hover:text-red-600 hover:border-red-200"
              onClick={() => onCancel(appointment._id)}
            >
              Cancel
            </Button>
          )}
        </div>
      )}
    </div>
  )
}