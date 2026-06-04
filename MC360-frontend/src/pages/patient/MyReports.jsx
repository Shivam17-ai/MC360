import { useState } from 'react'
import { Upload, FileText, Eye, Download } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import EmptyState from '../../components/common/EmptyState'

const reports = [
  { id: 1, name: 'Blood Test Report',    type: 'Blood Test', date: 'Dec 10, 2024', doctor: 'Dr. Rahul Mehta',  size: '1.2 MB' },
  { id: 2, name: 'Chest X-Ray',          type: 'Imaging',    date: 'Nov 25, 2024', doctor: 'Dr. Anil Kumar',   size: '3.8 MB' },
  { id: 3, name: 'Lipid Profile Report', type: 'Blood Test', date: 'Nov 10, 2024', doctor: 'Dr. Priya Singh',  size: '0.9 MB' },
]

const typeColors = { 'Blood Test': 'red', Imaging: 'blue', Cardiac: 'amber' }

export default function MyReports() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-800">My Reports</h1>
          <p className="text-slate-500 text-sm mt-1">View and manage your medical reports.</p>
        </div>
        <Button>
          <Upload size={16} /> Upload Report
        </Button>
      </div>

      {reports.length === 0 ? (
        <EmptyState title="No reports yet" description="Upload your medical reports to keep them organized." />
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <Card key={r.id} className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-primary-50 rounded-xl flex items-center justify-center">
                  <FileText size={20} className="text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{r.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={typeColors[r.type] || 'slate'}>{r.type}</Badge>
                    <span className="text-xs text-slate-400">{r.date} · {r.size}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{r.doctor}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm"><Eye size={14} /> View</Button>
                <Button variant="ghost" size="sm"><Download size={14} /></Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}