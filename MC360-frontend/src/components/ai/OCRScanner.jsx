import { useState, useRef } from 'react'
import { Scan, Upload, X, FileText } from 'lucide-react'
import { aiService } from '../../services/aiService'
import Button from '../common/Button'
import toast from 'react-hot-toast'

export default function OCRScanner({ onResult }) {
  const [preview, setPreview] = useState(null)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef()

  const handleFile = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result)
    reader.readAsDataURL(f)
  }

  const handleScan = async () => {
    if (!file) return
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('image', file)
      const res = await aiService.scanOCR(fd)
      onResult?.(res.data)
      toast.success('Text extracted successfully')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {!preview ? (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-surface-200 hover:border-primary-400 rounded-2xl p-10 text-center cursor-pointer transition-colors group"
        >
          <Scan className="w-10 h-10 text-slate-300 group-hover:text-primary-400 mx-auto mb-3 transition-colors" />
          <p className="text-sm font-medium text-slate-600">Click to upload a prescription or report</p>
          <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG, PDF</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*,.pdf"
            onChange={handleFile}
            className="hidden"
          />
        </div>
      ) : (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full rounded-2xl object-cover max-h-64"
          />
          <button
            onClick={() => { setPreview(null); setFile(null) }}
            className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {file && (
        <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl">
          <FileText className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-sm text-slate-600 truncate flex-1">{file.name}</span>
          <Button size="sm" loading={loading} onClick={handleScan}>
            <Scan className="w-3.5 h-3.5" /> Scan
          </Button>
        </div>
      )}
    </div>
  )
}