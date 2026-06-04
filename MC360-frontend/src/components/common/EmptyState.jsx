import { Inbox } from 'lucide-react'

export default function EmptyState({ title = 'Nothing here yet', description = '', action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
        <Inbox size={28} className="text-slate-400" />
      </div>
      <h3 className="text-lg font-display font-semibold text-slate-700">{title}</h3>
      {description && <p className="text-slate-400 text-sm mt-1 max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}