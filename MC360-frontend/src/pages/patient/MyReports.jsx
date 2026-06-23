import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reportService } from '../../services/reportService'
import { formatDate } from '../../utils/formatDate'
import {
  FileText, Upload, Trash2, Eye, Sparkles, X,
  FlaskConical, Pill, FileHeart, Scan, Syringe, Shield, File,
  ExternalLink, AlertCircle,
} from 'lucide-react'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Badge from '../../components/common/Badge'
import toast from 'react-hot-toast'
import { REPORT_TYPES } from '../../utils/constants'

// Icon mapping per report type
const TYPE_ICONS = {
  'lab-report':        { Icon: FlaskConical, bg: 'bg-blue-50',   color: 'text-blue-500' },
  'prescription':      { Icon: Pill,         bg: 'bg-green-50',  color: 'text-green-500' },
  'discharge-summary': { Icon: FileHeart,    bg: 'bg-rose-50',   color: 'text-rose-500' },
  'imaging':           { Icon: Scan,         bg: 'bg-violet-50', color: 'text-violet-500' },
  'vaccination':       { Icon: Syringe,      bg: 'bg-amber-50',  color: 'text-amber-500' },
  'insurance':         { Icon: Shield,       bg: 'bg-teal-50',   color: 'text-teal-500' },
  'other':             { Icon: File,         bg: 'bg-slate-50',  color: 'text-slate-400' },
}

const getTypeLabel = (value) => REPORT_TYPES.find(t => t.value === value)?.label ?? value

const getTypeIcon = (type) => TYPE_ICONS[type] ?? TYPE_ICONS['other']

const formatFileSize = (bytes) => {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function MyReports() {
  const qc = useQueryClient()
  const [uploadModal, setUploadModal] = useState(false)
  const [viewReport, setViewReport] = useState(null)
  const [summaryModal, setSummaryModal] = useState(null)
  const [filterType, setFilterType] = useState('')

  // Form state
  const [file, setFile]   = useState(null)
  const [type, setType]   = useState('')
  const [title, setTitle] = useState('')
  const [desc, setDesc]   = useState('')
  const [uploading, setUploading] = useState(false)

  // Fetch reports — getAll() now returns the axios response data directly
  const { data: rawData, isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: () => reportService.getAll(),
  })

  // Backend uses paginatedResponse → { success, data: [...], pagination }
  const reports = rawData?.data ?? rawData ?? []

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
    if (!file) return toast.error('Please select a file')
    if (!type) return toast.error('Please select a report type')
    if (!title.trim()) return toast.error('Please enter a report title')

    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('type', type)
    fd.append('title', title.trim())
    if (desc.trim()) fd.append('description', desc.trim())

    try {
      await reportService.upload(fd)
      qc.invalidateQueries(['reports'])
      setUploadModal(false)
      setFile(null); setType(''); setTitle(''); setDesc('')
      toast.success('Report uploaded successfully!')
    } catch (e) {
      toast.error(e?.response?.data?.message ?? e.message ?? 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const closeUploadModal = () => {
    setUploadModal(false)
    setFile(null); setType(''); setTitle(''); setDesc('')
  }

  const isPdf = (report) => report.fileType === 'application/pdf' || report.fileUrl?.toLowerCase().endsWith('.pdf')

  // Filtered list
  const filtered = filterType ? reports.filter(r => r.type === filterType) : reports

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">My Reports</h1>
          <p className="section-subtitle">All your medical reports in one place</p>
        </div>
        <Button onClick={() => setUploadModal(true)}>
          <Upload className="w-4 h-4" /> Upload Report
        </Button>
      </div>

      {/* Filter tabs */}
      {reports.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterType('')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${!filterType ? 'bg-primary-600 text-white border-primary-600' : 'bg-white border-surface-200 text-slate-600 hover:border-slate-300'}`}
          >
            All ({reports.length})
          </button>
          {REPORT_TYPES.map(t => {
            const count = reports.filter(r => r.type === t.value).length
            if (count === 0) return null
            return (
              <button
                key={t.value}
                onClick={() => setFilterType(t.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${filterType === t.value ? 'bg-primary-600 text-white border-primary-600' : 'bg-white border-surface-200 text-slate-600 hover:border-slate-300'}`}
              >
                {t.label} ({count})
              </button>
            )
          })}
        </div>
      )}

      {/* Reports grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-5 space-y-3">
              <div className="skeleton h-12 w-12 rounded-xl" />
              <div className="skeleton h-4 w-2/3" />
              <div className="skeleton h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-16 text-center">
          <FileText className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400 mb-4">
            {filterType ? `No ${getTypeLabel(filterType)} reports found` : 'No reports uploaded yet'}
          </p>
          {!filterType && (
            <Button onClick={() => setUploadModal(true)} variant="secondary">Upload your first report</Button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(report => {
            const { Icon, bg, color } = getTypeIcon(report.type)
            return (
              <div key={report._id} className="card p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <button
                    onClick={() => deleteReport.mutate(report._id)}
                    disabled={deleteReport.isPending}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 text-sm line-clamp-1">{report.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{getTypeLabel(report.type)}</p>
                  {report.description && (
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{report.description}</p>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 border-t border-surface-100 pt-2">
                  <span>{formatDate(report.date || report.createdAt)}</span>
                  {report.fileSize && <span>{formatFileSize(report.fileSize)}</span>}
                </div>

                {report.aiSummary && (
                  <div className="bg-violet-50 rounded-lg px-2.5 py-1.5">
                    <p className="text-xs text-violet-600 font-medium flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> AI Summary available
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setViewReport(report)} className="flex-1 justify-center">
                    <Eye className="w-3.5 h-3.5" /> View
                  </Button>
                  <Button
                    size="sm" variant="ghost"
                    onClick={() => summarize.mutate(report._id)}
                    loading={summarize.isPending}
                    className="flex-1 justify-center"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> AI
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Upload Modal ── */}
      <Modal isOpen={uploadModal} onClose={closeUploadModal} title="Upload Medical Report">
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="label-base">Report Title <span className="text-red-400">*</span></label>
            <input
              type="text"
              className="input-base"
              placeholder="e.g. Blood Test – June 2025"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          {/* Report Type */}
          <div>
            <label className="label-base">Report Type <span className="text-red-400">*</span></label>
            <select value={type} onChange={e => setType(e.target.value)} className="input-base">
              <option value="">Select type…</option>
              {REPORT_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="label-base">Notes (optional)</label>
            <textarea
              rows={2}
              className="input-base resize-none"
              placeholder="Any additional notes…"
              value={desc}
              onChange={e => setDesc(e.target.value)}
            />
          </div>

          {/* File drop zone */}
          <div>
            <label className="label-base">File <span className="text-red-400">*</span></label>
            <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${file ? 'border-primary-400 bg-primary-50' : 'border-surface-200 hover:border-primary-300'}`}>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                onChange={e => setFile(e.target.files[0])}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer block">
                {file ? (
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="w-8 h-8 text-primary-500" />
                    <p className="text-sm font-medium text-primary-700">{file.name}</p>
                    <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">Click to select or drag & drop</p>
                    <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG, WebP · Max 10 MB</p>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={closeUploadModal}>Cancel</Button>
            <Button loading={uploading} onClick={handleUpload}>
              <Upload className="w-4 h-4" /> Upload Report
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── View Report Modal ── */}
      <Modal isOpen={!!viewReport} onClose={() => setViewReport(null)} title={viewReport?.title ?? 'Report'} size="lg">
        {viewReport && (
          <div className="space-y-4">
            {/* Meta */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-surface-50 rounded-xl p-3">
                <p className="text-xs text-slate-400 mb-0.5">Type</p>
                <p className="font-medium text-slate-800">{getTypeLabel(viewReport.type)}</p>
              </div>
              <div className="bg-surface-50 rounded-xl p-3">
                <p className="text-xs text-slate-400 mb-0.5">Date</p>
                <p className="font-medium text-slate-800">{formatDate(viewReport.date || viewReport.createdAt)}</p>
              </div>
              {viewReport.description && (
                <div className="col-span-2 bg-surface-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-0.5">Notes</p>
                  <p className="text-slate-700">{viewReport.description}</p>
                </div>
              )}
              {viewReport.reportId && (
                <div className="bg-surface-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-0.5">Report ID</p>
                  <p className="font-mono text-xs text-slate-600">{viewReport.reportId}</p>
                </div>
              )}
              {viewReport.fileSize && (
                <div className="bg-surface-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-0.5">File Size</p>
                  <p className="font-medium text-slate-800">{formatFileSize(viewReport.fileSize)}</p>
                </div>
              )}
            </div>

            {/* AI Summary (if exists) */}
            {viewReport.aiSummary && (
              <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-violet-600 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> AI Summary
                </p>
                <p className="text-sm text-slate-700 leading-relaxed">{viewReport.aiSummary}</p>
              </div>
            )}

            {/* File preview / link */}
            <div className="border border-surface-200 rounded-xl overflow-hidden">
              {isPdf(viewReport) ? (
                <div className="flex flex-col items-center justify-center gap-3 py-10 bg-surface-50">
                  <FileText className="w-12 h-12 text-slate-300" />
                  <p className="text-sm text-slate-500">PDF preview not available in browser</p>
                  <a
                    href={viewReport.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary flex items-center gap-2 text-sm"
                  >
                    <ExternalLink className="w-4 h-4" /> Open PDF
                  </a>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={viewReport.fileUrl}
                    alt={viewReport.title}
                    className="w-full max-h-80 object-contain bg-surface-50"
                    onError={e => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.nextSibling.style.display = 'flex'
                    }}
                  />
                  <div
                    className="hidden flex-col items-center justify-center gap-2 py-10 bg-surface-50"
                  >
                    <AlertCircle className="w-8 h-8 text-slate-300" />
                    <p className="text-sm text-slate-400">Preview unavailable</p>
                    <a href={viewReport.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-600 underline flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" /> Open original
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <Button
                variant="ghost"
                onClick={() => { summarize.mutate(viewReport._id) }}
                loading={summarize.isPending}
              >
                <Sparkles className="w-4 h-4" /> Generate AI Summary
              </Button>
              <a href={viewReport.fileUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary">
                  <ExternalLink className="w-4 h-4" /> Open in new tab
                </Button>
              </a>
            </div>
          </div>
        )}
      </Modal>

      {/* ── AI Summary Modal (from card action) ── */}
      <Modal isOpen={!!summaryModal} onClose={() => setSummaryModal(null)} title="AI Report Summary">
        {summaryModal && (
          <div className="space-y-3">
            <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-violet-600 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> AI Analysis
              </p>
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
            <p className="text-xs text-slate-400 italic">
              This is an AI-generated summary. Always consult your doctor for medical advice.
            </p>
          </div>
        )}
      </Modal>
    </div>
  )
}