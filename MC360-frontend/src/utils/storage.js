const PREFIX = 'mc360_'

export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(PREFIX + key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value))
    } catch {}
  },
  remove: (key) => {
    localStorage.removeItem(PREFIX + key)
  },
  clear: () => {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k))
  },
}