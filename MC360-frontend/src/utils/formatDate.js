import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns'

// Format: Jan 5, 2025
export const formatDate = (date) => {
  if (!date) return '—'
  return format(new Date(date), 'MMM d, yyyy')
}

// Format: Jan 5, 2025 · 10:30 AM
export const formatDateTime = (date) => {
  if (!date) return '—'
  return format(new Date(date), 'MMM d, yyyy · hh:mm a')
}

// Format: 10:30 AM
export const formatTime = (date) => {
  if (!date) return '—'
  return format(new Date(date), 'hh:mm a')
}

// Format: 2 hours ago / yesterday / Jan 5
export const timeAgo = (date) => {
  if (!date) return '—'
  const d = new Date(date)
  if (isToday(d))     return formatDistanceToNow(d, { addSuffix: true })
  if (isYesterday(d)) return 'Yesterday'
  return formatDate(d)
}

// Format: Monday, January 5
export const formatFullDate = (date) => {
  if (!date) return '—'
  return format(new Date(date), 'EEEE, MMMM d')
}

// Format: 05/01/2025
export const formatShortDate = (date) => {
  if (!date) return '—'
  return format(new Date(date), 'dd/MM/yyyy')
}

// Parse ISO string safely
export const parseDate = (isoString) => {
  if (!isoString) return null
  return parseISO(isoString)
}

// Get age from DOB
export const getAge = (dob) => {
  if (!dob) return '—'
  const diff = Date.now() - new Date(dob).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
}