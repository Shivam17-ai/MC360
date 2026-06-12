import { getInitials } from '../../utils/helpers'
import { clsx } from 'clsx'

const sizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
}

const colors = [
  'bg-blue-100 text-blue-700',
  'bg-violet-100 text-violet-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-cyan-100 text-cyan-700',
]

function getColor(name = '') {
  const idx = name.charCodeAt(0) % colors.length
  return colors[idx]
}

export default function Avatar({ name, src, size = 'md', className = '' }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={clsx('rounded-full object-cover', sizes[size], className)}
      />
    )
  }
  return (
    <div className={clsx('rounded-full flex items-center justify-center font-semibold shrink-0', sizes[size], getColor(name), className)}>
      {getInitials(name)}
    </div>
  )
}