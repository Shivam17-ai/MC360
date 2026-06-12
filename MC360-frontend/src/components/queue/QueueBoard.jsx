import { Users, ArrowRight } from 'lucide-react'
import Badge from '../common/Badge'

export default function QueueBoard({ queue, currentToken, onNext, onSkip, isDoctor }) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-surface-200">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary-500" />
          <h3 className="text-sm font-semibold text-slate-900">Live Queue</h3>
          <span className="badge-blue">{queue.filter((q) => q.status === 'waiting').length} waiting</span>
        </div>
        {isDoctor && currentToken && (
          <button onClick={onNext} className="btn-primary text-xs gap-1.5 px-3 py-1.5">
            Next <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      <div className="divide-y divide-surface-100 max-h-80 overflow-y-auto">
        {queue.length === 0 ? (
          <div className="px-5 py-8 text-center text-slate-400 text-sm">
            Queue is empty
          </div>
        ) : (
          queue.map((item, i) => (
            <div
              key={item._id}
              className={`flex items-center gap-4 px-5 py-3 ${
                item.status === 'in_progress' ? 'bg-primary-50' : ''
              }`}
            >
              <span className="w-8 h-8 rounded-xl bg-surface-100 flex items-center justify-center text-sm font-bold text-slate-600 font-mono shrink-0">
                {item.tokenNumber}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {item.patient?.name || `Patient #${i + 1}`}
                </p>
              </div>
              <Badge
                variant={
                  item.status === 'in_progress' ? 'blue'
                    : item.status === 'done' ? 'green'
                      : item.status === 'skipped' ? 'gray'
                        : 'yellow'
                }
              >
                {item.status?.replace(/_/g, ' ')}
              </Badge>
              {isDoctor && item.status === 'waiting' && onSkip && (
                <button
                  onClick={() => onSkip(item._id)}
                  className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Skip
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}