import { useState } from 'react'
import { FlaskConical, MapPin, Clock, CheckCircle2 } from 'lucide-react'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import toast from 'react-hot-toast'
import api from '../../services/api'

const TEST_CATEGORIES = [
  { label: 'Blood Tests', tests: ['Complete Blood Count (CBC)', 'Lipid Profile', 'Blood Sugar (Fasting)', 'HbA1c', 'Thyroid Profile (T3/T4/TSH)', 'Liver Function Test', 'Kidney Function Test'] },
  { label: 'Imaging', tests: ['Chest X-Ray', 'Abdominal Ultrasound', 'ECG', 'ECHO', 'MRI Brain', 'CT Scan Abdomen'] },
  { label: 'Urine & Stool', tests: ['Urine Routine & Microscopy', 'Urine Culture', 'Stool Routine'] },
]

export default function BookTest() {
  const [selected, setSelected] = useState([])
  const [date, setDate] = useState('')
  const [homeCollection, setHomeCollection] = useState(false)
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [booked, setBooked] = useState(false)

  const toggleTest = (test) => {
    setSelected(prev => prev.includes(test) ? prev.filter(t => t !== test) : [...prev, test])
  }

  const handleSubmit = async () => {
    if (!selected.length) return toast.error('Select at least one test')
    if (!date) return toast.error('Select a preferred date')
    setLoading(true)
    try {
      await api.post('/tests/book', { tests: selected, date, homeCollection, address })
      setBooked(true)
      toast.success('Test booked successfully!')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  if (booked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-5">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Tests Booked!</h2>
        <p className="text-slate-500 mb-2">You'll receive a confirmation on your registered mobile number.</p>
        <p className="badge-green mb-6">Lab staff will contact you within 2 hours</p>
        <Button variant="secondary" onClick={() => { setBooked(false); setSelected([]); setDate('') }}>Book More Tests</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="section-title">Book Diagnostic Test</h1>
        <p className="section-subtitle">Select tests and schedule at a lab or home collection</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {TEST_CATEGORIES.map(cat => (
            <div key={cat.label} className="card p-5">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-teal-500" /> {cat.label}
              </h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {cat.tests.map(test => (
                  <label key={test} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selected.includes(test) ? 'border-primary-500 bg-primary-50' : 'border-surface-200 hover:border-slate-300'}`}>
                    <input type="checkbox" checked={selected.includes(test)} onChange={() => toggleTest(test)} className="w-4 h-4 accent-primary-600" />
                    <span className="text-sm text-slate-700">{test}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="card p-5 space-y-4">
            <h3 className="font-semibold text-slate-900">Booking Details</h3>
            <div>
              <label className="label-base">Preferred Date</label>
              <input type="date" min={new Date().toLocaleDateString('en-CA')} value={date} onChange={e => setDate(e.target.value)} className="input-base" />
            </div>
            <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${homeCollection ? 'border-primary-500 bg-primary-50' : 'border-surface-200'}`}>
              <input type="checkbox" checked={homeCollection} onChange={e => setHomeCollection(e.target.checked)} className="w-4 h-4 accent-primary-600" />
              <div>
                <p className="text-sm font-medium text-slate-700 flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-primary-500" /> Home Collection</p>
                <p className="text-xs text-slate-400">Lab staff visits your home</p>
              </div>
            </label>
            {homeCollection && (
              <Input label="Collection Address" placeholder="Enter your full address" value={address} onChange={e => setAddress(e.target.value)} />
            )}

            {selected.length > 0 && (
              <div className="bg-surface-50 rounded-xl p-3 space-y-1.5">
                <p className="text-xs font-semibold text-slate-600 mb-2">Selected Tests ({selected.length})</p>
                {selected.map(t => (
                  <div key={t} className="flex items-center gap-2 text-xs text-slate-600">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" /> {t}
                  </div>
                ))}
              </div>
            )}

            <Button className="w-full justify-center" loading={loading} onClick={handleSubmit} disabled={!selected.length || !date}>
              Confirm Booking
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}