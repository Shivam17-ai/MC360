import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reportService } from '../../services/reportService'
import { formatDate } from '../../utils/formatDate'
import { FileText, Upload, Trash2, Eye, Sparkles, Download } from 'lucide-react'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Badge from '../../components/common/Badge'
import toast from 'react-hot-toast'
import { REPORT_TYPES } from '../../utils/constants'

export default function MyReports() {
  const qc = useQueryClient()
  const [uploadModal, setUploadModal] = useState(false)
  const [viewReport, setViewReport] = useState(null)
  const [summaryModal, setSummaryModal] = useState(null)
  const [file, setFile] = useState(null)
  const [type, setType] = useState('')
  const [uploading, setUploading] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: () => reportService.getAll().then(r => r.data),
  })

  const deleteReport = useMutation({
    mutationFn: reportService.delete,
    onSuccess: () => { qc.invalidateQueries(['reports']); toast.success('Report deleted') },
    onError: (e) => toast.error(e.message),
  })

  const summarize = useMutation({
    mutationFn: reportService.summarize,
    onSuccess: (res) => setSummaryModal(res.data),
    onError: (e) => toast.error(e.message),
  })

  const handleUpload = async () => {
    if (!file || !type) return toast.error('Select file and type')
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('type', type)
    try {
      await reportService.upload(fd)
      qc.invalidateQueries(['reports'])
      setUploadModal(false)
      setFile(null); setType('')
      toast.success('Report uploaded!')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setUploading(false)
    }
  }

  const reports = data || []

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">My Reports</h1>
          <p className="section-subtitle">All your medical reports in one place</p>
        </div>
        <Button onClick={() => setUploadModal(true)}>
          <Upload className="w-4 h-4" /> Upload Report
        </Button>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="card p-5 space-y-3"><div className="skeleton h-12 rounded-xl" /><div className="skeleton h-4 w-2/3" /><div className="skeleton h-3 w-1/2" /></div>)}
        </div>
      ) : reports.length === 0 ? (
        <div className="card p-16 text-center">
          <FileText className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400 mb-4">No reports uploaded yet</p>
          <Button onClick={() => setUploadModal(true)} variant="secondary">Upload your first report</Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map(report => (
            <div key={report._id} className="card p-5 flex flex-col gap-3">
              <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-teal-500" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">{report.type}</h3>
                <p className="text-xs text-slate-400">{report.filename}</p>
                <p className="text-xs text-slate-400 mt-1">{formatDate(report.createdAt)}</p>
              </div>
              <div className="flex gap-2 pt-1 mt-auto">
                <Button size="sm" variant="ghost" onClick={() => setViewReport(report)}>
                  <Eye className="w-3.5 h-3.5" /> View
                </Button>
                <Button size="sm" variant="ghost" onClick={() => summarize.mutate(report._id)} loading={summarize.isPending}>
                  <Sparkles className="w-3.5 h-3.5" /> AI Summary
                </Button>
                <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => deleteReport.mutate(report._id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Modal isOpen={uploadModal} onClose={() => setUploadModal(false)} title="Upload Report">
        <div className="space-y-4">
          <div>
            <label className="label-base">Report Type</label>
            <select value={type} onChange={e => setType(e.target.value)} className="input-base">
              <option value="">Select type…</option>
              {REPORT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="label-base">Upload File (PDF / Image)</label>
            <div className="border-2 border-dashed border-surface-200 rounded-xl p-8 text-center hover:border-primary-400 transition-colors">
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setFile(e.target.files[0])} className="hidden" id="file-upload" />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">{file ? file.name : 'Click to select or drag & drop'}</p>
                <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG up to 10MB</p>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setUploadModal(false)}>Cancel</Button>
            <Button loading={uploading} onClick={handleUpload}>Upload</Button>
          </div>
        </div>
      </Modal>

      {/* AI Summary Modal */}
      <Modal isOpen={!!summaryModal} onClose={() => setSummaryModal(null)} title="AI Report Summary">
        {summaryModal && (
          <div className="space-y-3">
            <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-violet-600 mb-2 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> AI Analysis</p>
              <p className="text-sm text-slate-700 leading-relaxed">{summaryModal.summary}</p>
            </div>
            {summaryModal.keyFindings?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-2">Key Findings</p>
                <ul className="space-y-1.5">
                  {summaryModal.keyFindings.map((f, i) => (
                    <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                      <span className="w-4 h-4 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5">{i + 1}</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="text-xs text-slate-400 italic">This is an AI-generated summary. Always consult your doctor for medical advice.</p>
          </div>
        )}
      </Modal>
    </div>
  )
}