export const classNames = (...classes) => classes.filter(Boolean).join(' ')

export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : ''

export const truncate = (str, length = 60) =>
  str && str.length > length ? str.slice(0, length) + '…' : str

export const getInitials = (name) => {
  if (!name) return '??'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export const formatPhone = (phone) => {
  if (!phone) return '—'
  return phone.replace(/(\d{5})(\d{5})/, '$1 $2')
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export const getStatusColor = (status) => {
  const map = {
    pending: 'badge-yellow',
    confirmed: 'badge-blue',
    completed: 'badge-green',
    cancelled: 'badge-red',
    waiting: 'badge-yellow',
    in_progress: 'badge-blue',
    done: 'badge-green',
  }
  return map[status] || 'badge-gray'
}

export const getRiskColor = (level) => {
  const map = { low: 'text-emerald-600', moderate: 'text-amber-600', high: 'text-red-600' }
  return map[level] || 'text-slate-600'
}