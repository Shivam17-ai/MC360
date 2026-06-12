import { Pill, Trash2, Edit2, CheckCircle2, Clock } from 'lucide-react'
import Badge from '../common/Badge'
import { formatDate } from '../../utils/formatDate'

export default function MedicineCard({ medicine, onDelete, onEdit, onLog }) {
  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
          <Pill className="w-5 h-5 text-amber-500" />
        </div>
        <div className="flex gap-1.5">
          {onEdit && (
            <button
              onClick={() => onEdit(medicine)}
              className="p-1.5 rounded-lg hover:bg-surface-100 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(medicine._id)}
              className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-slate-900">{medicine.name}</h3>
        <p className="text-sm text-slate-500 mt-0.5">{medicine.dosage}</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Badge variant="yellow">
          <Clock className="w-3 h-3" />
          {medicine.frequency?.replace(/_/g, ' ')}
        </Badge>
        <Badge variant={medicine.isActive ? 'green' : 'gray'} dot>
          {medicine.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </div>

      <div className="text-xs text-slate-400 border-t border-surface-100 pt-2">
        Started: {formatDate(medicine.startDate)}
        {medicine.endDate && ` · Ends: ${formatDate(medicine.endDate)}`}
      </div>

      {medicine.notes && (
        <p className="text-xs text-slate-500 bg-surface-50 rounded-lg px-3 py-2">
          {medicine.notes}
        </p>
      )}

      {onLog && medicine.isActive && (
        <button
          onClick={() => onLog(medicine._id)}
          className="flex items-center justify-center gap-2 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-medium transition-colors border border-emerald-200"
        >
          <CheckCircle2 className="w-3.5 h-3.5" /> Mark as Taken
        </button>
      )}
    </div>
  )
}