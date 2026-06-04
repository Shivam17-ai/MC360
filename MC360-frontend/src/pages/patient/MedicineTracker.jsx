import { useState } from 'react'
import { Plus, Check, Clock } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'

const medicines = [
  { id: 1, name: 'Metformin',   dose: '500mg', frequency: 'Twice Daily', time: ['8:00 AM', '8:00 PM'], taken: true },
  { id: 2, name: 'Amlodipine', dose: '5mg',   frequency: 'Once Daily',  time: ['9:00 AM'],            taken: false },
  { id: 3, name: 'Atorvastatin', dose: '10mg', frequency: 'Once Daily', time: ['9:00 PM'],             taken: false },
  { id: 4, name: 'Vitamin D3',  dose: '60K IU', frequency: 'Weekly',    time: ['Sunday morning'],     taken: true },
]

export default function MedicineTracker() {
  const [list, setList] = useState(medicines)

  const toggleTaken = (id) =>
    setList((prev) => prev.map((m) => m.id === id ? { ...m, taken: !m.taken } : m))

  const takenCount = list.filter((m) => m.taken).length

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-800">Medicine Tracker</h1>
          <p className="text-slate-500 text-sm mt-1">{takenCount}/{list.length} taken today</p>
        </div>
        <Button><Plus size={16} /> Add Medicine</Button>
      </div>

      {/* Progress */}
      <Card>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-slate-700">Today's Progress</p>
          <p className="text-sm font-bold text-primary-600">{Math.round((takenCount / list.length) * 100)}%</p>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div className="bg-primary-600 h-2 rounded-full transition-all" style={{ width: `${(takenCount / list.length) * 100}%` }} />
        </div>
      </Card>

      <div className="space-y-3">
        {list.map((med) => (
          <Card key={med.id} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button onClick={() => toggleTaken(med.id)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${med.taken ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                <Check size={18} />
              </button>
              <div>
                <p className={`font-semibold ${med.taken ? 'line-through text-slate-400' : 'text-slate-800'}`}>{med.name}</p>
                <p className="text-xs text-slate-400">{med.dose} · {med.frequency}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex flex-wrap gap-1 justify-end">
                {med.time.map((t) => (
                  <span key={t} className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-lg">
                    <Clock size={11} />{t}
                  </span>
                ))}
              </div>
              <Badge variant={med.taken ? 'green' : 'amber'} className="mt-1">{med.taken ? 'Taken' : 'Pending'}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}