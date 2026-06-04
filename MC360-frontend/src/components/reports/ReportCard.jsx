import { FileText, Eye, Download, Trash2 } from 'lucide-react'
import Card from '../common/Card'
import Badge from '../common/Badge'
import Button from '../common/Button'

const typeColors = { 'Blood Test': 'red', Imaging: 'blue', Cardiac: 'amber', Other: 'slate' }

export default function ReportCard({ report, onView, onDownload, onDelete }) {
  const data = report || {
    id: 1,
    name: 'Blood Test Report',
    type: 'Blood Test',
    date: 'Dec 10, 2024',
    doctor: 'Dr. Rahul Mehta',
    size: '1.2 MB',
  }

  return (
    <Card hover className="flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
          <FileText size={20} className="text-primary-600" />
        </div>
        <div>
          <p className="font-semibold text-slate-800">{data.name}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={typeColors[data.type] || 'slate'}>{data.type}</Badge>
            <span className="text-xs text-slate-400">{data.date} · {data.size}</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{data.doctor}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" onClick={onView}>
          <Eye size={14} /> View
        </Button>
        <Button variant="ghost" size="sm" onClick={onDownload}>
          <Download size={14} />
        </Button>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <Trash2 size={14} className="text-red-400" />
        </Button>
      </div>
    </Card>
  )
}