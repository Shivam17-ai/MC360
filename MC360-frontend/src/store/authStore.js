import { create } from 'zustand'
import { authService } from '../services/authService'
import { storage } from '../utils/storage'
import { queryClient } from '../config/queryClient'
import { useNotificationStore } from './notificationStore'

export const useAuthStore = create((set, get) => ({
  user: storage.get('user'),
  token: storage.get('token'),
  isLoading: false,
  isInitialized: false,
  isAuthenticated: !!storage.get('token'),

  checkAuth: async () => {
    const token = storage.get('token')
    let user = storage.get('user')
    if (user && user.user) {
      user = user.user // Unwrap nested user if stored by previous bugged version
    }
    
    if (token && user) {
      // Sync state with storage immediately if not already set
      if (!get().isAuthenticated) {
        set({ token, user, isAuthenticated: true })
      }
      try {
        const fresh = await authService.getMe()
        set({ user: fresh.data?.user, isAuthenticated: true, isInitialized: true })
        storage.set('user', fresh.data?.user)
      } catch (err) {
        console.error("Auth check failed:", err)
        if (err.status === 401) {
          get().logout()
        } else {
          set({ isInitialized: true })
        }
      }
    } else {
      set({ isAuthenticated: false, isInitialized: true })
    }
  },

  login: async (credentials) => {
    set({ isLoading: true })
    try {
      const res = await authService.login(credentials)
      storage.set('token', res.data.accessToken)
      storage.set('user', res.data.user)
      set({ user: res.data.user, token: res.data.accessToken, isAuthenticated: true, isLoading: false, isInitialized: true })
      return res.data
    } catch (err) {
      set({ isLoading: false })
      throw err
    }
  },

  register: async (data) => {
    set({ isLoading: true })
    try {
      const res = await authService.register(data)
      storage.set('token', res.data.accessToken)
      storage.set('user', res.data.user)
      set({ user: res.data.user, token: res.data.accessToken, isAuthenticated: true, isLoading: false, isInitialized: true })
      return res.data
    } catch (err) {
      set({ isLoading: false })
      throw err
    }
  },

  googleLogin: async (token) => {
    set({ isLoading: true })
    try {
      const res = await authService.googleLogin(token)
      storage.set('token', res.data.accessToken)
      storage.set('user', res.data.user)
      set({ user: res.data.user, token: res.data.accessToken, isAuthenticated: true, isLoading: false, isInitialized: true })
      return res.data
    } catch (err) {
      set({ isLoading: false })
      throw err
    }
  },

  logout: () => {
    storage.clear()
    queryClient.clear()
    useNotificationStore.getState().reset()
    set({ user: null, token: null, isAuthenticated: false })
  },

  updateUser: (data) => {
    const user = { ...get().user, ...data }
    storage.set('user', user)
    set({ user })
  },
}))