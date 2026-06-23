import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns'

const getValidDate = (date) => {
  if (!date) return null
  try {
    const d = typeof date === 'string' ? parseISO(date) : date
    if (d instanceof Date && !isNaN(d.getTime())) {
      return d
    }
  } catch (e) {
    // Return null on failure to parse
  }
  return null
}

export const formatDate = (date, fmt = 'dd MMM yyyy') => {
  const d = getValidDate(date)
  if (!d) return '—'
  try {
    return format(d, fmt)
  } catch (e) {
    return '—'
  }
}

export const formatDateTime = (date) => {
  const d = getValidDate(date)
  if (!d) return '—'
  try {
    return format(d, 'dd MMM yyyy, hh:mm a')
  } catch (e) {
    return '—'
  }
}

export const formatTime = (date) => {
  const d = getValidDate(date)
  if (!d) return '—'
  try {
    return format(d, 'hh:mm a')
  } catch (e) {
    return '—'
  }
}

export const timeAgo = (date) => {
  const d = getValidDate(date)
  if (!d) return '—'
  try {
    return formatDistanceToNow(d, { addSuffix: true })
  } catch (e) {
    return '—'
  }
}

export const smartDate = (date) => {
  const d = getValidDate(date)
  if (!d) return '—'
  try {
    if (isToday(d)) return `Today, ${format(d, 'hh:mm a')}`
    if (isYesterday(d)) return `Yesterday, ${format(d, 'hh:mm a')}`
    return format(d, 'dd MMM yyyy')
  } catch (e) {
    return '—'
  }
}