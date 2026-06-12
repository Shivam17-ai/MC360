import { useState } from 'react'
import { useMedicines } from '../../hooks/useMedicines'
import { medicineService } from '../../services/medicineService'
import { Pill, Plus, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Modal from '../../components/common/Modal'
import Badge from '../../components/common/Badge'
import { FREQUENCY_OPTIONS } from '../../utils/constants'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { medicineSchema } from '../../utils/validators'
import toast from 'react-hot-toast'
import { formatDate } from '../../utils/formatDate'
import { useMutation } from '@tanstack/react-query'

export default function MedicineTracker() {
  const { medicines, isLoading, create, remove } = useMedicines()
  const [addModal, setAddModal] = useState(false)
  const [interactionModal, setInteractionModal] = useState(false)
  const [interactionResult, setInteractionResult] = useState(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(medicineSchema),
  })

  const checkInteraction = useMutation({
    mutationFn: () => medicineService.checkInteraction(medicines.map(m => m.name)),
    onSuccess: (res) => { setInteractionResult(res.data); setInteractionModal(true) },
    onError: (e) => toast.error(e.message),
  })

  const onAdd = async (data) => {
    await create.mutateAsync(data)
    reset()
    setAddModal(false)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Medicine Tracker</h1>
          <p className="section-subtitle">Track medications and adherence</p>
        </div>
        <div className="flex gap-3">
          {medicines.length > 1 && (
            <Button variant="secondary" onClick={() => checkInteraction.mutate()} loading={checkInteraction.isPending}>
              <AlertTriangle className="w-4 h-4" /> Check Interactions
            </Button>
          )}
          <Button onClick={() => setAddModal(true)}>
            <Plus className="w-4 h-4" /> Add Medicine
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="card p-5 space-y-3"><div className="skeleton h-4 w-1/2" /><div className="skeleton h-3 w-2/3" /></div>)}
        </div>
      ) : medicines.length === 0 ? (
        <div className="card p-16 text-center">
          <Pill className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400 mb-4">No medicines tracked yet</p>
          <Button onClick={() => setAddModal(true)} variant="secondary">Add your first medicine</Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {medicines.map(med => (
            <div key={med._id} className="card p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center">
                  <Pill className="w-5 h-5 text-amber-500" />
                </div>
                <button onClick={() => remove.mutate(med._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{med.name}</h3>
                <p className="text-sm text-slate-500 mt-0.5">{med.dosage}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="yellow">{med.frequency?.replace(/_/g, ' ')}</Badge>
                {med.isActive ? <Badge variant="green" dot>Active</Badge> : <Badge variant="gray">Inactive</Badge>}
              </div>
              <div className="text-xs text-slate-400 pt-1 border-t border-surface-100">
                Started: {formatDate(med.startDate)}
                {med.endDate && ` · Ends: ${formatDate(med.endDate)}`}
              </div>
              {med.notes && <p className="text-xs text-slate-500 bg-surface-50 rounded-lg p-2">{med.notes}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Add Medicine">
        <form onSubmit={handleSubmit(onAdd)} className="space-y-4">
          <Input label="Medicine Name" placeholder="e.g. Metformin 500mg" error={errors.name?.message} {...register('name')} />
          <Input label="Dosage" placeholder="e.g. 1 tablet" error={errors.dosage?.message} {...register('dosage')} />
          <div>
            <label className="label-base">Frequency</label>
            <select className="input-base" {...register('frequency')}>
              <option value="">Select frequency</option>
              {FREQUENCY_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
            {errors.frequency && <p className="mt-1.5 text-xs text-red-500">{errors.frequency.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" error={errors.startDate?.message} {...register('startDate')} />
            <Input label="End Date (optional)" type="date" {...register('endDate')} />
          </div>
          <div>
            <label className="label-base">Notes (optional)</label>
            <textarea rows={2} className="input-base resize-none" placeholder="Take after meals…" {...register('notes')} />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" type="button" onClick={() => setAddModal(false)}>Cancel</Button>
            <Button type="submit" loading={create.isPending}>Add Medicine</Button>
          </div>
        </form>
      </Modal>

      {/* Interaction Modal */}
      <Modal isOpen={interactionModal} onClose={() => setInteractionModal(false)} title="Drug Interaction Check">
        {interactionResult && (
          <div className="space-y-4">
            {interactionResult.interactions?.length === 0 ? (
              <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <p className="text-sm text-emerald-700">No significant drug interactions found between your current medicines.</p>
              </div>
            ) : (
              interactionResult.interactions?.map((inter, i) => (
                <div key={i} className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-sm font-semibold text-amber-800 mb-1 flex items-center gap-2"><AlertTriangle className="w-4 h-4" />{inter.drugs?.join(' + ')}</p>
                  <p className="text-sm text-amber-700">{inter.description}</p>
                  <Badge variant="yellow" className="mt-2">{inter.severity}</Badge>
                </div>
              ))
            )}
            <p className="text-xs text-slate-400 italic">Always consult your doctor or pharmacist before changing medications.</p>
          </div>
        )}
      </Modal>
    </div>
  )
}