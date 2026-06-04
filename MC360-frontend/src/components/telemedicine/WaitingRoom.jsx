import { Clock, User } from 'lucide-react'
import Card from '../common/Card'
import Spinner from '../common/Spinner'

export default function WaitingRoom({ session }) {
  const data = session || {
    doctorName: 'Dr. Rahul Mehta',
    specialization: 'Cardiologist',
    scheduledTime: '3:00 PM',
    waitTime: '~5 mins',
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <Card className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-700 font-bold text-2xl flex items-center justify-center mx-auto">
          {data.doctorName.split(' ')[1][0]}
        </div>
        <div>
          <h2 className="font-display font-bold text-xl text-slate-800">{data.doctorName}</h2>
          <p className="text-slate-400 text-sm">{data.specialization}</p>
        </div>
        <div className="bg-primary-50 rounded-2xl p-5 space-y-3">
          <Spinner size="md" className="mx-auto" />
          <p className="font-semibold text-primary-700">Waiting for doctor to join...</p>
          <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1"><Clock size={14} /> {data.scheduledTime}</span>
            <span className="flex items-center gap-1"><User size={14} /> Est. {data.waitTime}</span>
          </div>
        </div>
        <p className="text-xs text-slate-400">Please ensure your camera and microphone are working. The doctor will join shortly.</p>
      </Card>
    </div>
  )
}