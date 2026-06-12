import { clsx } from 'clsx'
import Spinner from '../common/Spinner'

export default function SlotPicker({ slots, selected, onSelect, loading }) {
  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <Spinner />
      </div>
    )
  }

  if (!slots || slots.length === 0) {
    return (
      <p className="text-sm text-slate-400 text-center py-4">
        No slots available for this date
      </p>
    )
  }

  const morning = slots.filter((s) => {
    const h = parseInt(s.split(':')[0])
    return h < 12
  })
  const afternoon = slots.filter((s) => {
    const h = parseInt(s.split(':')[0])
    return h >= 12 && h < 17
  })
  const evening = slots.filter((s) => {
    const h = parseInt(s.split(':')[0])
    return h >= 17
  })

  const Section = ({ label, items }) =>
    items.length ? (
      <div>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
          {label}
        </p>
        <div className="flex flex-wrap gap-2">
          {items.map((slot) => (
            <button
              key={slot}
              onClick={() => onSelect(slot)}
              className={clsx(
                'px-3 py-1.5 rounded-lg border text-xs font-medium transition-all',
                selected === slot
                  ? 'bg-primary-600 text-white border-primary-600 shadow-glow-blue'
                  : 'border-surface-200 text-slate-600 hover:border-primary-400 hover:text-primary-600',
              )}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>
    ) : null

  return (
    <div className="space-y-4">
      <Section label="Morning" items={morning} />
      <Section label="Afternoon" items={afternoon} />
      <Section label="Evening" items={evening} />
    </div>
  )
}