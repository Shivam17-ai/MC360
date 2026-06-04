import { X, Download, ZoomIn, ZoomOut } from 'lucide-react'
import { useState } from 'react'
import Button from '../common/Button'

export default function ReportViewer({ report, onClose }) {
  const [zoom, setZoom] = useState(100)

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex flex-col">
      {/* Toolbar */}
      <div className="bg-white px-6 py-3 flex items-center justify-between border-b border-slate-100 shrink-0">
        <div>
          <p className="font-semibold text-slate-800">{report?.name || 'Blood Test Report'}</p>
          <p className="text-xs text-slate-400">{report?.date || 'Dec 10, 2024'}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setZoom((z) => Math.max(50, z - 10))}>
            <ZoomOut size={16} />
          </Button>
          <span className="text-sm text-slate-600 w-12 text-center">{zoom}%</span>
          <Button variant="ghost" size="sm" onClick={() => setZoom((z) => Math.min(200, z + 10))}>
            <ZoomIn size={16} />
          </Button>
          <Button variant="secondary" size="sm">
            <Download size={14} /> Download
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={16} />
          </Button>
        </div>
      </div>

      {/* Viewer Area */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-6 bg-slate-100">
        <div
          className="bg-white rounded-2xl shadow-float p-8 transition-all"
          style={{ width: `${zoom}%`, maxWidth: '800px', minWidth: '300px' }}>
          <div className="space-y-4 text-sm text-slate-700">
            <div className="text-center border-b pb-4">
              <h2 className="font-display font-bold text-xl text-slate-800">MC360 Diagnostics</h2>
              <p className="text-slate-400 text-xs mt-1">Report Date: Dec 10, 2024</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div><span className="text-slate-400">Patient:</span> Shivam Kumar</div>
              <div><span className="text-slate-400">Age:</span> 26 years</div>
              <div><span className="text-slate-400">Doctor:</span> Dr. Rahul Mehta</div>
              <div><span className="text-slate-400">Blood Group:</span> B+</div>
            </div>
            <table className="w-full text-xs border-collapse mt-4">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left p-2 border border-slate-200">Test</th>
                  <th className="text-left p-2 border border-slate-200">Result</th>
                  <th className="text-left p-2 border border-slate-200">Normal Range</th>
                  <th className="text-left p-2 border border-slate-200">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { test: 'Hemoglobin', result: '13.5 g/dL', range: '13-17 g/dL', status: 'Normal' },
                  { test: 'WBC Count',  result: '7.2 K/µL',  range: '4-11 K/µL',  status: 'Normal' },
                  { test: 'Platelets',  result: '1.8 L/µL',  range: '1.5-4 L/µL', status: 'Normal' },
                  { test: 'Blood Sugar', result: '112 mg/dL', range: '70-100 mg/dL', status: 'High' },
                ].map((row) => (
                  <tr key={row.test}>
                    <td className="p-2 border border-slate-200">{row.test}</td>
                    <td className="p-2 border border-slate-200">{row.result}</td>
                    <td className="p-2 border border-slate-200">{row.range}</td>
                    <td className={`p-2 border border-slate-200 font-medium ${row.status === 'High' ? 'text-red-500' : 'text-green-600'}`}>{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}