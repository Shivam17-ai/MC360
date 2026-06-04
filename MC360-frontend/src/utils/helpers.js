import { clsx } from 'clsx'

// Merge classnames
export const cn = (...classes) => clsx(...classes)

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

// Truncate long text
export const truncate = (str, length = 50) => {
  if (!str) return ''
  return str.length > length ? str.slice(0, length) + '...' : str
}

// Format currency (INR)
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '—'
  return new Intl.NumberFormat('en-IN', {
    style:    'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

// Generate initials from name
export const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

// Sleep / delay
export const sleep = (ms) => new Promise((res) => setTimeout(res, ms))

// Check if object is empty
export const isEmpty = (obj) => !obj || Object.keys(obj).length === 0

// Get error message from axios error
export const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    'Something went wrong'
  )
}

// Download a file from blob
export const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob)
  const a   = document.createElement('a')
  a.href    = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// Build query string from object
export const buildQuery = (params) => {
  const q = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') q.append(k, v)
  })
  return q.toString()
}