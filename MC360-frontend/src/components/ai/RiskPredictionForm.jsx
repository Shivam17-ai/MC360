import { useState } from 'react'
import { Activity } from 'lucide-react'
import Button from '../common/Button'
import Input from '../common/Input'

const RISK_TYPES = [
  { value: 'diabetes', label: 'Diabetes' },
  { value: 'heart', label: 'Heart Disease' },
  { value: 'obesity', label: 'Obesity' },
]

export default function RiskPredictionForm({ onSubmit, loading }) {
  const [riskType, setRiskType] = useState('diabetes')
  const [form, setForm] = useState({
    age: '', bmi: '', glucose: '', bloodPressure: '',
    cholesterol: '', smoking: 'no', physicalActivity: 'moderate',
  })

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  return (
    <div className="space-y-5">
      <div>
        <label className="label-base">Risk Type</label>
        <div className="flex gap-2">
          {RISK_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setRiskType(t.value)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${
                riskType === t.value
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'border-surface-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Age"
          type="number"
          placeholder="e.g. 45"
          value={form.age}
          onChange={(e) => set('age', e.target.value)}
        />
        <Input
          label="BMI"
          type="number"
          step="0.1"
          placeholder="e.g. 24.5"
          value={form.bmi}
          onChange={(e) => set('bmi', e.target.value)}
        />
        <Input
          label="Fasting Glucose (mg/dL)"
          type="number"
          placeholder="e.g. 95"
          value={form.glucose}
          onChange={(e) => set('glucose', e.target.value)}
        />
        <Input
          label="Blood Pressure (systolic)"
          type="number"
          placeholder="e.g. 120"
          value={form.bloodPressure}
          onChange={(e) => set('bloodPressure', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label-base">Smoking</label>
          <select
            value={form.smoking}
            onChange={(e) => set('smoking', e.target.value)}
            className="input-base"
          >
            <option value="no">Non-smoker</option>
            <option value="yes">Smoker</option>
            <option value="former">Former smoker</option>
          </select>
        </div>
        <div>
          <label className="label-base">Physical Activity</label>
          <select
            value={form.physicalActivity}
            onChange={(e) => set('physicalActivity', e.target.value)}
            className="input-base"
          >
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <Button
        className="w-full justify-center"
        loading={loading}
        onClick={() => onSubmit({ ...form, riskType })}
      >
        <Activity className="w-4 h-4" /> Predict Risk
      </Button>
    </div>
  )
}