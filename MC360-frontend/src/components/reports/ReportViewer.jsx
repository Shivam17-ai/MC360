import { X, Download } from 'lucide-react'

export default function ReportViewer({ report, onClose }) {
  if (!report) return null

  const isPdf = report.filename?.toLowerCase().endsWith('.pdf')
  const isImage = /\.(jpe?g|png|webp)$/i.test(report.filename || '')

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-5 py-3 bg-slate-800">
        <p className="text-white font-medium text-sm flex-1 truncate">
          {report.type} — {report.filename}
        </p>
        {report.url && (
          <a
            href={report.url}
            download
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <Download className="w-4 h-4" />
          </a>
        )}
        <button
          onClick={onClose}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-4">
        {isPdf && report.url ? (
          <iframe
            src={report.url}
            className="w-full max-w-4xl h-full rounded-lg"
            title={report.filename}
          />
        ) : isImage && report.url ? (
          <img
            src={report.url}
            alt={report.filename}
            className="max-h-full max-w-full object-contain rounded-lg"
          />
        ) : (
          <div className="text-white/50 text-center">
            <p className="text-lg mb-2">Preview unavailable</p>
            {report.url && (
              <a href={report.url} download className="text-primary-400 hover:underline text-sm">
                Download file
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}