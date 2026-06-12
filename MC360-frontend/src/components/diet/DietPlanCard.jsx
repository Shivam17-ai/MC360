import { Salad, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

const MEALS = ['breakfast', 'lunch', 'snack', 'dinner']

export default function DietPlanCard({ plan, dayIndex }) {
  const [expanded, setExpanded] = useState(false)
  const day = plan?.days?.[dayIndex]

  if (!day) return null

  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setExpanded((p) => !p)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
            <Salad className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-slate-900">Day {dayIndex + 1}</p>
            <p className="text-xs text-slate-400">{day.totalCalories} kcal</p>
          </div>
        </div>
        {expanded
          ? <ChevronUp className="w-4 h-4 text-slate-400" />
          : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>

      {expanded && (
        <div className="px-5 pb-4 space-y-3 border-t border-surface-100">
          {MEALS.map((meal) =>
            day[meal] ? (
              <div key={meal}>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 capitalize">
                  {meal}
                </p>
                <div className="bg-surface-50 rounded-xl p-3 space-y-1">
                  <p className="text-sm font-medium text-slate-800">{day[meal].name}</p>
                  {day[meal].description && (
                    <p className="text-xs text-slate-500">{day[meal].description}</p>
                  )}
                  <div className="flex gap-3 text-xs text-slate-400 pt-1">
                    <span>{day[meal].calories} kcal</span>
                    {day[meal].protein && <span>P: {day[meal].protein}g</span>}
                    {day[meal].carbs && <span>C: {day[meal].carbs}g</span>}
                    {day[meal].fat && <span>F: {day[meal].fat}g</span>}
                  </div>
                </div>
              </div>
            ) : null,
          )}
        </div>
      )}
    </div>
  )
}