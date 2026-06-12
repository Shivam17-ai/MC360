import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { prescriptionService } from '../../services/prescriptionService'
import api from '../../services/api'
import { Plus, FileText, Download } from 'lucide-react'
import Avatar from '../../components/common/Avatar'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import { formatDate } from '../../utils/formatDate'
import toast from 'react-hot-toast'

export default function Prescriptions() {
  const qc = useQueryClient()
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ patientId: '', diagnosis: '', medicines: [{ name: '', dosage: '', duration: '', instructions: '' }], advice: '' })

  const { data, isLoading } = useQuery({
    queryKey: ['prescriptions'],
    queryFn: () => api.get('/prescriptions').then(r => r.data || []),
  })

  const create = useMutation({
    mutationFn: (data) => prescriptionService.create(data),
    onSuccess: () => {
      qc.invalidateQueries(['prescriptions'])
      toast.success('Prescription created')
      setModal(false)
      setForm({ patientId: '', diagnosis: '', medicines: [{ name: '', dosage: '', duration: '', instructions: '' }], advice: '' })
    },
    onError: e => toast.error(e.response?.data?.message || e.message),
  })

  const addMed = () => setForm(p => ({ ...p, medicines: [...p.medicines, { name: '', dosage: '', duration: '', instructions: '' }] }))
  const updateMed = (i, field, val) => setForm(p => ({ ...p, medicines: p.medicines.map((m, idx) => idx === i ? { ...m, [field]: val } : m) }))

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Prescriptions</h1>
          <p className="section-subtitle">Create and manage digital prescriptions</p>
        </div>
        <Button onClick={() => setModal(true)}><Plus className="w-4 h-4" /> New Prescription</Button>
      </div>

      <div className="space-y-3">
        {isLoading ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="card p-5 space-y-2"><div className="skeleton h-4 w-1/3" /><div className="skeleton h-3 w-1/2" /></div>) :
          (data || []).map(rx => (
            <div key={rx._id} className="card p-5 flex items-start gap-4">
              <Avatar name={rx.patient?.user?.name || rx.patient?.name} size="md" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900">{rx.patient?.user?.name || rx.patient?.name || 'Unknown Patient'}</h3>
                <p className="text-sm text-slate-500 mt-0.5">{rx.diagnosis}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {rx.medicines?.slice(0, 3).map((m, i) => <Badge key={i} variant="blue">{m.name}</Badge>)}
                  {rx.medicines?.length > 3 && <Badge variant="gray">+{rx.medicines.length - 3} more</Badge>}
                </div>
                <p className="text-xs text-slate-400 mt-2">{formatDate(rx.createdAt)}</p>
              </div>
              <Button size="sm" variant="secondary" onClick={() => prescriptionService.download(rx._id)}><Download className="w-3.5 h-3.5" /></Button>
            </div>
          ))}
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title="New Prescription" size="lg">
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div className="bg-primary-50/50 border border-primary-100 p-3 rounded-xl">
            <p className="text-xs text-primary-700 leading-relaxed">
              <strong>Prescription Policy:</strong> A full diagnosis is mandatory for the first prescription. Subsequent refills can omit the diagnosis if the patient has had a check-up within the last 90 days.
            </p>
          </div>
          <Input label="Patient ID" placeholder="Patient's ID" value={form.patientId} onChange={e => setForm(p => ({ ...p, patientId: e.target.value }))} />
          <Input label="Diagnosis" placeholder="e.g. Type 2 Diabetes" value={form.diagnosis} onChange={e => setForm(p => ({ ...p, diagnosis: e.target.value }))} />
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="label-base mb-0">Medicines</label>
              <button onClick={addMed} className="text-xs text-primary-600 font-medium hover:underline flex items-center gap-1"><Plus className="w-3 h-3" />Add</button>
            </div>
            <div className="space-y-3">
              {form.medicines.map((m, i) => (
                <div key={i} className="grid grid-cols-2 gap-2 p-3 bg-surface-50 rounded-xl">
                  <Input placeholder="Medicine name" value={m.name} onChange={e => updateMed(i, 'name', e.target.value)} />
                  <Input placeholder="Dosage (e.g. 500mg)" value={m.dosage} onChange={e => updateMed(i, 'dosage', e.target.value)} />
                  <Input placeholder="Duration (e.g. 7 days)" value={m.duration} onChange={e => updateMed(i, 'duration', e.target.value)} />
                  <Input placeholder="Instructions (after meals…)" value={m.instructions} onChange={e => updateMed(i, 'instructions', e.target.value)} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="label-base">Additional Advice</label>
            <textarea rows={2} className="input-base resize-none" placeholder="Any additional advice…" value={form.advice} onChange={e => setForm(p => ({ ...p, advice: e.target.value }))} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
            <Button loading={create.isPending} onClick={() => create.mutate(form)}>Create Prescription</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}