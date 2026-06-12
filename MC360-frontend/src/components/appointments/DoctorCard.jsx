import { Star, Clock, MapPin, Video, User } from 'lucide-react'
import Avatar from '../common/Avatar'
import Badge from '../common/Badge'
import Button from '../common/Button'

export default function DoctorCard({ doctor, onSelect, selected }) {
  return (
    <div
      onClick={() => onSelect?.(doctor)}
      className={`card-hover p-5 cursor-pointer transition-all ${
        selected ? 'ring-2 ring-primary-500 bg-primary-50/30' : ''
      }`}
    >
      <div className="flex gap-4">
        <Avatar name={doctor.name} src={doctor.avatar} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-slate-900">{doctor.name}</h3>
              <p className="text-sm text-slate-500">{doctor.specialization}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold text-slate-700">
                {doctor.rating || '4.8'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {doctor.experience || '—'} yrs exp
            </span>
            {doctor.hospital && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span className="truncate max-w-[120px]">{doctor.hospital?.name}</span>
              </span>
            )}
            <span className="font-medium text-slate-700">
              ₹{doctor.consultationFee || '500'}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-3">
            <Badge variant="green" dot>Available</Badge>
            {doctor.offersVideo && <Badge variant="blue"><Video className="w-3 h-3" />Video</Badge>}
            {doctor.offersInPerson !== false && <Badge variant="gray"><User className="w-3 h-3" />In-person</Badge>}
          </div>
        </div>
      </div>

      {onSelect && (
        <div className="mt-4 pt-4 border-t border-surface-100">
          <Button
            size="sm"
            variant={selected ? 'primary' : 'secondary'}
            className="w-full justify-center"
          >
            {selected ? 'Selected' : 'Select Doctor'}
          </Button>
        </div>
      )}
    </div>
  )
}