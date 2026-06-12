import { useState, useRef } from 'react'
import { Upload, FileText, X } from 'lucide-react'
import Button from '../common/Button'
import { REPORT_TYPES } from '../../utils/constants'
import toast from 'react-hot-toast'
import { reportService } from '../../services/reportService'
import { useQueryClient } from '@tanstack/react-query'

export default function ReportUpload({ onSuccess }) {
  const qc = useQueryClient()
  const inputRef = useRef()
  const [file, setFile] = useState(null)
  const [type, setType] = useState('')
  const [uploading, setUploading] = useState(false)

  const handleUpload = async () => {
    if (!file || !type) return toast.error('Select file and report type')
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('type', type)
      await reportService.upload(fd)
      qc.invalidateQueries(['reports'])
      toast.success('Report uploaded!')
      setFile(null)
      setType('')
      onSuccess?.()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="label-base">Report Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="input-base"
        >
          <option value="">Select type…</option>
          {REPORT_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div
        onClick={() => !file && inputRef.current?.click()}
        className="border-2 border-dashed border-surface-200 hover:border-primary-400 rounded-2xl p-8 text-center cursor-pointer transition-colors group"
      >
        {file ? (
          <div className="flex items-center gap-3 justify-center">
            <FileText className="w-5 h-5 text-teal-500" />
            <span className="text-sm text-slate-700 font-medium">{file.name}</span>
            <button
              onClick={(e) => { e.stopPropagation(); setFile(null) }}
              className="ml-1 text-slate-400 hover:text-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <Upload className="w-8 h-8 text-slate-300 group-hover:text-primary-400 mx-auto mb-2 transition-colors" />
            <p className="text-sm text-slate-500">Click to upload</p>
            <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG — max 10MB</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => setFile(e.target.files[0])}
          className="hidden"
        />
      </div>

      <Button
        className="w-full justify-center"
        loading={uploading}
        disabled={!file || !type}
        onClick={handleUpload}
      >
        <Upload className="w-4 h-4" /> Upload Report
      </Button>
    </div>
  )
}