import { Clock, Hash } from 'lucide-react'
import Card from '../common/Card'
import Badge from '../common/Badge'

export default function QueueToken({ token }) {
  const data = token || {
    number: 'A-042',
    department: 'Cardiology',
    doctor: 'Dr. Rahul Mehta',
    estimatedWait: '25 mins',
    ahead: 4,
    status: 'waiting',
  }

  const statusColors = { waiting: 'amber', called: 'green', completed: 'blue', skipped: 'red' }

  return (
    <Card className="max-w-sm mx-auto text-center space-y-4">
      <p className="text-xs text-slate-500 uppercase tracking-widest">Your Token</p>
      <div className="w-24 h-24 rounded-full bg-primary-50 border-4 border-primary-200 flex items-center justify-center mx-auto">
        <span className="text-2xl font-display font-bold text-primary-700">{data.number}</span>
      </div>
      <div>
        <p className="font-display font-semibold text-slate-800">{data.doctor}</p>
        <p className="text-sm text-slate-400">{data.department}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-50 rounded-xl p-3">
          <p className="text-xs text-slate-400">Estimated Wait</p>
          <p className="font-semibold text-slate-800 flex items-center justify-center gap-1 mt-1">
            <Clock size={14} /> {data.estimatedWait}
          </p>
        </div>
        <div className="bg-slate-50 rounded-xl p-3">
          <p className="text-xs text-slate-400">Ahead of You</p>
          <p className="font-semibold text-slate-800 flex items-center justify-center gap-1 mt-1">
            <Hash size={14} /> {data.ahead}
          </p>
        </div>
      </div>
      <Badge variant={statusColors[data.status]} className="mx-auto capitalize">{data.status}</Badge>
    </Card>
  )
}