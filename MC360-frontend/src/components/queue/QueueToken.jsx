import { Clock, Users, CheckCircle2 } from 'lucide-react'
import Badge from '../common/Badge'

export default function QueueToken({ token, position, totalAhead }) {
  if (!token) return null

  const statusVariant = {
    waiting: 'yellow',
    in_progress: 'blue',
    done: 'green',
    skipped: 'gray',
  }

  return (
    <div className="card p-6 text-center space-y-4">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
        Your Queue Token
      </p>

      <div className="w-24 h-24 bg-primary-50 rounded-3xl flex items-center justify-center mx-auto">
        <span className="text-4xl font-bold text-primary-700 font-mono">
          {token.tokenNumber}
        </span>
      </div>

      <div>
        <Badge
          variant={statusVariant[token.status] || 'gray'}
          dot
          className="text-sm px-3 py-1"
        >
          {token.status?.replace(/_/g, ' ')}
        </Badge>
      </div>

      {token.status === 'waiting' && (
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="bg-surface-50 rounded-xl p-3">
            <Users className="w-4 h-4 text-slate-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-slate-900">{totalAhead || 0}</p>
            <p className="text-xs text-slate-400">ahead of you</p>
          </div>
          <div className="bg-surface-50 rounded-xl p-3">
            <Clock className="w-4 h-4 text-slate-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-slate-900">
              ~{(totalAhead || 0) * 10}
            </p>
            <p className="text-xs text-slate-400">mins wait</p>
          </div>
        </div>
      )}

      {token.status === 'in_progress' && (
        <div className="p-4 bg-primary-50 border border-primary-200 rounded-xl">
          <p className="text-primary-700 font-semibold text-sm">
            It's your turn! Please proceed.
          </p>
        </div>
      )}

      {token.status === 'done' && (
        <div className="flex items-center justify-center gap-2 text-emerald-600">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium">Consultation complete</span>
        </div>
      )}
    </div>
  )
}