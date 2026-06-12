import { Clock, Video } from 'lucide-react'
import Avatar from '../common/Avatar'

export default function WaitingRoom({ doctor, patient, role }) {
  const other = role === 'patient' ? doctor : patient

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center px-6">
      <div className="relative mb-6">
        <Avatar name={other?.name} size="xl" />
        <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-400 rounded-full border-2 border-white animate-pulse" />
      </div>

      <h2 className="text-xl font-bold text-slate-900 mb-1">
        Waiting for {other?.name || (role === 'patient' ? 'Doctor' : 'Patient')}
      </h2>
      <p className="text-sm text-slate-500 mb-6">
        {role === 'patient'
          ? 'Your doctor will join shortly. Please stay on this page.'
          : 'Patient is in the waiting room.'}
      </p>

      <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl">
        <Clock className="w-4 h-4 text-amber-600 animate-spin" style={{ animationDuration: '3s' }} />
        <span className="text-sm text-amber-700 font-medium">Connecting securely…</span>
      </div>

      <div className="mt-8 flex items-center gap-2 text-xs text-slate-400">
        <Video className="w-3.5 h-3.5" />
        End-to-end encrypted · HD quality
      </div>
    </div>
  )
}