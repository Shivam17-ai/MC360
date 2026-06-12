import { clsx } from 'clsx'

const variants = {
  blue: 'badge-blue',
  green: 'badge-green',
  red: 'badge-red',
  yellow: 'badge-yellow',
  gray: 'badge-gray',
}

export default function Badge({ children, variant = 'gray', className = '', dot = false }) {
  return (
    <span className={clsx(variants[variant], className)}>
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full', {
        'bg-primary-500': variant === 'blue',
        'bg-emerald-500': variant === 'green',
        'bg-red-500': variant === 'red',
        'bg-amber-500': variant === 'yellow',
        'bg-slate-400': variant === 'gray',
      })} />}
      {children}
    </span>
  )
}