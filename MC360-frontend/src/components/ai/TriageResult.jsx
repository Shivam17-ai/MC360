import { CheckCircle2, AlertTriangle, Info } from 'lucide-react'
import Badge from '../common/Badge'

const riskVariant = { low: 'green', moderate: 'yellow', high: 'red' }
const riskBg = {
  low: 'bg-emerald-50 border-emerald-200',
  moderate: 'bg-amber-50 border-amber-200',
  high: 'bg-red-50 border-red-200',
}

export default function TriageResult({ result }) {
  if (!result) return null

  return (
    <div className="space-y-5 animate-slide-up">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">Triage Result</h3>
        <Badge variant={riskVariant[result.riskLevel] || 'gray'} dot>
          {result.riskLevel?.toUpperCase()} RISK
        </Badge>
      </div>

      <div className={`p-4 rounded-xl border ${riskBg[result.riskLevel]}`}>
        <p className="text-sm text-slate-800">{result.summary}</p>
      </div>

      {result.possibleConditions?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
            Possible Conditions
          </p>
          <div className="space-y-2">
            {result.possibleConditions.map((c, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-surface-50 rounded-xl">
                <Info className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">{c.name}</p>
                  <p className="text-xs text-slate-500">{c.description}</p>
                </div>
                {c.probability && (
                  <span className="text-xs font-medium text-slate-400 shrink-0">
                    {c.probability}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {result.recommendations?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
            Recommendations
          </p>
          <ul className="space-y-1.5">
            {result.recommendations.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.riskLevel === 'high' && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-700 font-medium">
            Seek immediate medical attention or call emergency services.
          </p>
        </div>
      )}

      <p className="text-xs text-slate-400 italic">
        AI screening only — not a medical diagnosis. Consult a doctor.
      </p>
    </div>
  )
}