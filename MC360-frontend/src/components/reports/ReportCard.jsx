import { FileText, Eye, Trash2, Download, Sparkles } from 'lucide-react'
import Button from '../common/Button'
import { formatDate } from '../../utils/formatDate'

export default function ReportCard({ report, onView, onDelete, onSummarize }) {
  return (
    <div className="card p-5 flex flex-col gap-3 group">
      <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center">
        <FileText className="w-6 h-6 text-teal-500" />
      </div>

      <div>
        <h3 className="font-semibold text-slate-900 text-sm leading-snug">
          {report.type}
        </h3>
        <p className="text-xs text-slate-400 mt-0.5 truncate">{report.filename}</p>
        <p className="text-xs text-slate-400 mt-1">{formatDate(report.createdAt)}</p>
      </div>

      <div className="flex gap-1.5 flex-wrap pt-1 mt-auto">
        {onView && (
          <Button size="sm" variant="ghost" onClick={() => onView(report)}>
            <Eye className="w-3.5 h-3.5" /> View
          </Button>
        )}
        {onSummarize && (
          <Button size="sm" variant="ghost" onClick={() => onSummarize(report._id)}>
            <Sparkles className="w-3.5 h-3.5 text-violet-500" /> AI
          </Button>
        )}
        {onDelete && (
          <Button
            size="sm"
            variant="ghost"
            className="text-red-400 hover:text-red-600 hover:bg-red-50"
            onClick={() => onDelete(report._id)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
    </div>
  )
}