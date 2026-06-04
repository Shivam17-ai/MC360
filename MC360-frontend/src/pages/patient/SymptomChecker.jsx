import { useState } from 'react'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import { Brain, AlertTriangle, CheckCircle } from 'lucide-react'

const commonSymptoms = ['Fever', 'Headache', 'Cough', 'Sore Throat', 'Fatigue', 'Nausea', 'Chest Pain', 'Shortness of Breath', 'Body Ache', 'Dizziness', 'Vomiting', 'Diarrhea']

export default function SymptomChecker() {
  const [selected, setSelected] = useState([])
  const [result, setResult]     = useState(null)
  const [loading, setLoading]   = useState(false)

  const toggle = (s) =>
    setSelected((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s])

  const analyze = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    const high = selected.includes('Chest Pain') || selected.includes('Shortness of Breath')
    setResult({
      severity: high ? 'High' : selected.length > 4 ? 'Moderate' : 'Low',
      suggestion: high
        ? 'Please seek emergency medical care immediately.'
        : 'Consider consulting a General Physician within 24-48 hours.',
      specialization: high ? 'Emergency / Cardiologist' : 'General Physician',
    })
    setLoading(false)
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-800">AI Symptom Checker</h1>
        <p className="text-slate-500 text-sm mt-1">Select your symptoms for an AI-powered assessment.</p>
      </div>

      <Card>
        <p className="text-sm font-medium text-slate-700 mb-3">Select your symptoms</p>
        <div className="flex flex-wrap gap-2">
          {commonSymptoms.map((s) => (
            <button key={s} onClick={() => toggle(s)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-colors ${selected.includes(s) ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-slate-600 border-slate-200 hover:border-primary-400'}`}>
              {s}
            </button>
          ))}
        </div>
        <Button className="mt-4 w-full" onClick={analyze} disabled={selected.length === 0 || loading}>
          <Brain size={16} /> {loading ? 'Analyzing...' : 'Analyze Symptoms'}
        </Button>
      </Card>

      {result && (
        <Card className="space-y-3 animate-slide-up">
          <div className="flex items-center gap-2">
            {result.severity === 'High'
              ? <AlertTriangle size={20} className="text-red-500" />
              : <CheckCircle size={20} className="text-green-500" />}
            <h3 className="font-display font-semibold text-slate-800">Assessment Result</h3>
          </div>
          <div className={`px-4 py-3 rounded-xl text-sm font-medium ${result.severity === 'High' ? 'bg-red-50 text-red-700' : result.severity === 'Moderate' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'}`}>
            Risk Level: <strong>{result.severity}</strong>
          </div>
          <p className="text-sm text-slate-600">{result.suggestion}</p>
          <p className="text-sm text-slate-500">Recommended Specialist: <strong>{result.specialization}</strong></p>
          <Button className="w-full">Book Appointment Now</Button>
        </Card>
      )}
    </div>
  )
}