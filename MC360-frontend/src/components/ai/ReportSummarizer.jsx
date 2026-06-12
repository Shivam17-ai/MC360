import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { aiService } from '../../services/aiService'
import Button from '../common/Button'
import toast from 'react-hot-toast'

export default function ReportSummarizer({ reportId, initialSummary }) {
  const [summary, setSummary] = useState(initialSummary || null)
  const [loading, setLoading] = useState(false)

  const handleSummarize = async () => {
    setLoading(true)
    try {
      const res = await aiService.summarizeReport(reportId)
      setSummary(res.data)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {!summary ? (
        <Button
          variant="secondary"
          className="w-full justify-center"
          loading={loading}
          onClick={handleSummarize}
        >
          <Sparkles className="w-4 h-4 text-violet-500" />
          Generate AI Summary
        </Button>
      ) : (
        <div className="space-y-3 animate-slide-up">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-500" />
            <p className="text-xs font-semibold text-violet-600 uppercase tracking-wide">AI Analysis</p>
          </div>

          <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
            <p className="text-sm text-slate-700 leading-relaxed">{summary.summary}</p>
          </div>

          {summary.keyFindings?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-2">Key Findings</p>
              <ul className="space-y-1.5">
                {summary.keyFindings.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="w-5 h-5 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs shrink-0 font-semibold">
                      {i + 1}
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {summary.abnormalValues?.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
              <p className="text-xs font-semibold text-amber-700 mb-2">Values Requiring Attention</p>
              <div className="flex flex-wrap gap-2">
                {summary.abnormalValues.map((v, i) => (
                  <span key={i} className="badge-yellow">{v}</span>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-slate-400 italic">
            AI-generated summary. Consult your doctor for medical advice.
          </p>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSummarize}
            loading={loading}
          >
            <Sparkles className="w-3.5 h-3.5" /> Regenerate
          </Button>
        </div>
      )}
    </div>
  )
}