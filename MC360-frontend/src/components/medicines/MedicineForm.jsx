import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { medicineSchema } from '../../utils/validators'
import Input from '../common/Input'
import Button from '../common/Button'
import { FREQUENCY_OPTIONS } from '../../utils/constants'

export default function MedicineForm({ onSubmit, loading, defaultValues }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(medicineSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Medicine Name"
        placeholder="e.g. Metformin 500mg"
        error={errors.name?.message}
        {...register('name')}
      />
      <Input
        label="Dosage"
        placeholder="e.g. 1 tablet"
        error={errors.dosage?.message}
        {...register('dosage')}
      />
      <div>
        <label className="label-base">Frequency</label>
        <select className="input-base" {...register('frequency')}>
          <option value="">Select frequency…</option>
          {FREQUENCY_OPTIONS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
        {errors.frequency && (
          <p className="mt-1.5 text-xs text-red-500">{errors.frequency.message}</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Start Date"
          type="date"
          error={errors.startDate?.message}
          {...register('startDate')}
        />
        <Input
          label="End Date (optional)"
          type="date"
          {...register('endDate')}
        />
      </div>
      <div>
        <label className="label-base">Notes (optional)</label>
        <textarea
          rows={2}
          className="input-base resize-none"
          placeholder="Take after meals…"
          {...register('notes')}
        />
      </div>
      <Button type="submit" loading={loading} className="w-full justify-center">
        {defaultValues ? 'Update' : 'Add'} Medicine
      </Button>
    </form>
  )
}