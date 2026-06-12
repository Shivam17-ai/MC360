import { useState } from 'react'
import { AlertTriangle, CheckCircle2, Plus, X } from 'lucide-react'
import { medicineService } from '../../services/medicineService'
import Button from '../common/Button'
import Badge from '../common/Badge'
import toast from 'react-hot-toast'

export default function DrugInteractionChecker() {
  const [drugs, setDrugs] = useState([])
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const addDrug = () => {
    const clean = input.trim()
    if (!clean || drugs.includes(clean)) return
    setDrugs((p) => [...p, clean])
    setInput('')
  }

  const removeDrug = (d) => setDrugs((p) => p.filter((x) => x !== d))

  const check = async () => {
    if (drugs.length < 2) return toast.error('Add at least 2 drugs')
    setLoading(true)
    try {
      const res = await medicineService.checkInteraction(drugs)
      setResult(res.data)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addDrug()}
          placeholder="Enter drug name and press Enter…"
          className="input-base flex-1"
        />
        <Button onClick={addDrug} variant="secondary">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {drugs.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {drugs.map((d) => (
            <span
              key={d}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm border border-primary-200"
            >
              {d}
              <button onClick={() => removeDrug(d)}>
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      <Button
        className="w-full justify-center"
        loading={loading}
        disabled={drugs.length < 2}
        onClick={check}
      >
        <AlertTriangle className="w-4 h-4" /> Check Interactions
      </Button>

      {result && (
        <div className="space-y-3 pt-2">
          {result.interactions?.length === 0 ? (
            <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <p className="text-sm text-emerald-700 font-medium">
                No significant drug interactions found.
              </p>
            </div>
          ) : (
            result.interactions?.map((inter, i) => (
              <div
                key={i}
                className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <p className="text-sm font-semibold text-amber-800">
                    {inter.drugs?.join(' + ')}
                  </p>
                  <Badge variant="yellow" className="ml-auto">
                    {inter.severity}
                  </Badge>
                </div>
                <p className="text-sm text-amber-700">{inter.description}</p>
              </div>
            ))
          )}
          <p className="text-xs text-slate-400 italic">
            Consult your doctor or pharmacist before changing medications.
          </p>
        </div>
      )}
    </div>
  )
}