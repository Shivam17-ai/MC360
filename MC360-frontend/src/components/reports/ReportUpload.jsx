import { useState, useRef } from 'react'
import { Upload, X, FileText, CheckCircle } from 'lucide-react'
import Button from '../common/Button'

export default function ReportUpload({ onUpload }) {
  const [dragging, setDragging]   = useState(false)
  const [file, setFile]           = useState(null)
  const [uploaded, setUploaded]   = useState(false)
  const [loading, setLoading]     = useState(false)
  const inputRef                  = useRef()

  const handleFile = (f) => {
    if (f) setFile(f)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleUpload = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setLoading(false)
    setUploaded(true)
    onUpload?.(file)
  }

  if (uploaded) {
    return (
      <div className="card text-center space-y-3 py-10">
        <CheckCircle size={40} className="text-green-500 mx-auto" />
        <p className="font-semibold text-slate-800">Report Uploaded Successfully!</p>
        <p className="text-sm text-slate-400">{file?.name}</p>
        <Button variant="secondary" onClick={() => { setFile(null); setUploaded(false) }}>
          Upload Another
        </Button>
      </div>
    )
  }

  return (
    <div className="card space-y-4">
      <h3 className="font-display font-semibold text-slate-800">Upload Report</h3>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors ${dragging ? 'border-primary-500 bg-primary-50' : 'border-slate-200 hover:border-primary-400 hover:bg-slate-50'}`}>
        <Upload size={32} className="mx-auto text-slate-400 mb-3" />
        <p className="text-sm font-medium text-slate-700">Drag & drop or click to upload</p>
        <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG up to 10MB</p>
        <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
          onChange={(e) => handleFile(e.target.files[0])} />
      </div>

      {/* Selected File */}
      {file && (
        <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
          <div className="flex items-center gap-3">
            <FileText size={18} className="text-primary-600" />
            <div>
              <p className="text-sm font-medium text-slate-800">{file.name}</p>
              <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <button onClick={() => setFile(null)} className="text-slate-400 hover:text-red-500 transition-colors">
            <X size={16} />
          </button>
        </div>
      )}

      <Button className="w-full" disabled={!file || loading} onClick={handleUpload}>
        {loading ? 'Uploading...' : 'Upload Report'}
      </Button>
    </div>
  )
}