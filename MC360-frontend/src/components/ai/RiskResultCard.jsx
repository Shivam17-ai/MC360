import { TrendingUp, TrendingDown, Minus, ShieldAlert } from 'lucide-react'
import { getRiskColor } from '../../utils/helpers'

export default function RiskResultCard({ result }) {
  if (!result) return null

  const level = result.riskLevel
  const score = result.riskScore

  const Icon =
    level === 'high' ? TrendingUp
      : level === 'low' ? TrendingDown
        : Minus

  const bgMap = {
    low: 'from-emerald-50 to-teal-50 border-emerald-200',
    moderate: 'from-amber-50 to-yellow-50 border-amber-200',
    high: 'from-red-50 to-rose-50 border-red-200',
  }

  return (
    <div className={`card p-6 bg-gradient-to-br ${bgMap[level] || ''} space-y-4 animate-slide-up`}>
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          level === 'high' ? 'bg-red-100' : level === 'low' ? 'bg-emerald-100' : 'bg-amber-100'
        }`}>
          <Icon className={`w-6 h-6 ${getRiskColor(level)}`} />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            {result.riskType} Risk
          </p>
          <p className={`text-2xl font-bold ${getRiskColor(level)}`}>
            {level?.charAt(0).toUpperCase() + level?.slice(1)} Risk
          </p>
        </div>
        {score !== undefined && (
          <div className="ml-auto text-right">
            <p className="text-3xl font-bold text-slate-900">{score}%</p>
            <p className="text-xs text-slate-400">Risk score</p>
          </div>
        )}
      </div>

      {result.message && (
        <p className="text-sm text-slate-700">{result.message}</p>
      )}

      {result.factors?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-600 mb-2">Contributing Factors</p>
          <div className="flex flex-wrap gap-1.5">
            {result.factors.map((f, i) => (
              <span key={i} className="px-2.5 py-1 bg-white/80 rounded-full text-xs text-slate-600 border border-white">
                {f}
              </span>
            ))}
          </div>
        </div>
      )}

      {result.recommendations?.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-slate-600">Recommendations</p>
          {result.recommendations.map((r, i) => (
            <p key={i} className="text-xs text-slate-600 flex items-start gap-2">
              <ShieldAlert className="w-3.5 h-3.5 text-primary-500 shrink-0 mt-0.5" />
              {r}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}