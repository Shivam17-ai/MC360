import { useState } from 'react'
import { Brain, Plus, X } from 'lucide-react'
import Button from '../common/Button'

const COMMON = [
  'Headache', 'Fever', 'Cough', 'Fatigue', 'Nausea',
  'Chest pain', 'Shortness of breath', 'Dizziness',
]

export default function SymptomChecker({ onAnalyze, loading }) {
  const [symptoms, setSymptoms] = useState([])
  const [input, setInput] = useState('')

  const add = (s) => {
    const clean = s.trim()
    if (!clean || symptoms.includes(clean)) return
    setSymptoms((p) => [...p, clean])
    setInput('')
  }

  const remove = (s) => setSymptoms((p) => p.filter((x) => x !== s))

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add(input)}
          placeholder="Type a symptom and press Enter…"
          className="input-base flex-1"
        />
        <Button onClick={() => add(input)} variant="secondary">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {COMMON.filter((s) => !symptoms.includes(s)).map((s) => (
          <button
            key={s}
            onClick={() => add(s)}
            className="px-3 py-1.5 text-xs bg-surface-100 hover:bg-primary-50 hover:text-primary-700 text-slate-600 rounded-full border border-surface-200 hover:border-primary-300 transition-all"
          >
            + {s}
          </button>
        ))}
      </div>

      {symptoms.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {symptoms.map((s) => (
            <span
              key={s}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm border border-primary-200"
            >
              {s}
              <button onClick={() => remove(s)}>
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      <Button
        className="w-full justify-center"
        loading={loading}
        disabled={symptoms.length === 0}
        onClick={() => onAnalyze(symptoms)}
      >
        <Brain className="w-4 h-4" /> Analyze Symptoms
      </Button>
    </div>
  )
}