import { TOKEN_KEY, USER_KEY } from './constants'

// ── Token ─────────────────────────────────────────
export const getToken = () => localStorage.getItem(TOKEN_KEY)

export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token)

export const removeToken = () => localStorage.removeItem(TOKEN_KEY)

// ── User ──────────────────────────────────────────
export const getUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const setUser = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user))

export const removeUser = () => localStorage.removeItem(USER_KEY)

// ── Clear all auth data ───────────────────────────
export const clearAuth = () => {
  removeToken()
  removeUser()
}

// ── Generic ───────────────────────────────────────
export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

export const getItem = (key) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const removeItem = (key) => localStorage.removeItem(key)