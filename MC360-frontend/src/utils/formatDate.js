import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns'

export const formatDate = (date, fmt = 'dd MMM yyyy') => {
  if (!date) return '—'
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, fmt)
}

export const formatDateTime = (date) => {
  if (!date) return '—'
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'dd MMM yyyy, hh:mm a')
}

export const formatTime = (date) => {
  if (!date) return '—'
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'hh:mm a')
}

export const timeAgo = (date) => {
  if (!date) return '—'
  const d = typeof date === 'string' ? parseISO(date) : date
  return formatDistanceToNow(d, { addSuffix: true })
}

export const smartDate = (date) => {
  if (!date) return '—'
  const d = typeof date === 'string' ? parseISO(date) : date
  if (isToday(d)) return `Today, ${format(d, 'hh:mm a')}`
  if (isYesterday(d)) return `Yesterday, ${format(d, 'hh:mm a')}`
  return format(d, 'dd MMM yyyy')
}