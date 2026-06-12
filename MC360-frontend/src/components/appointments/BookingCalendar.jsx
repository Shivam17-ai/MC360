import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  format, addMonths, subMonths, startOfMonth, endOfMonth,
  eachDayOfInterval, isSameDay, isToday, isBefore, startOfDay,
} from 'date-fns'
import { clsx } from 'clsx'

export default function BookingCalendar({ selected, onSelect, disabledDates = [] }) {
  const [viewMonth, setViewMonth] = useState(new Date())

  const monthStart = startOfMonth(viewMonth)
  const monthEnd = endOfMonth(viewMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Pad start
  const startPad = monthStart.getDay()
  const paddedDays = [...Array(startPad).fill(null), ...days]

  const isDisabled = (day) =>
    isBefore(startOfDay(day), startOfDay(new Date())) ||
    disabledDates.some((d) => isSameDay(d, day))

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setViewMonth(subMonths(viewMonth, 1))}
          className="p-1.5 rounded-lg hover:bg-surface-100 text-slate-500 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-semibold text-slate-900">
          {format(viewMonth, 'MMMM yyyy')}
        </span>
        <button
          onClick={() => setViewMonth(addMonths(viewMonth, 1))}
          className="p-1.5 rounded-lg hover:bg-surface-100 text-slate-500 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Week labels */}
      <div className="grid grid-cols-7 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <div key={d} className="text-center text-xs font-medium text-slate-400 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {paddedDays.map((day, i) => {
          if (!day) return <div key={`pad-${i}`} />
          const disabled = isDisabled(day)
          const sel = selected && isSameDay(day, selected)
          const today = isToday(day)

          return (
            <button
              key={day.toString()}
              onClick={() => !disabled && onSelect(day)}
              disabled={disabled}
              className={clsx(
                'h-9 w-full rounded-xl text-sm font-medium transition-all',
                disabled && 'text-slate-300 cursor-not-allowed',
                !disabled && !sel && !today && 'text-slate-700 hover:bg-primary-50 hover:text-primary-700',
                today && !sel && 'bg-surface-100 text-primary-600 font-semibold',
                sel && 'bg-primary-600 text-white shadow-glow-blue',
              )}
            >
              {format(day, 'd')}
            </button>
          )
        })}
      </div>
    </div>
  )
}