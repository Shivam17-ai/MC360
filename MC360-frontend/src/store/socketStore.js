import { create } from 'zustand'
import { io } from 'socket.io-client'
import { config } from '../config/env'

export const useSocketStore = create((set, get) => ({
  socket: null,
  isConnected: false,

  connect: (token) => {
    if (get().socket) return
    const socket = io(config.socketUrl, {
      auth: { token },
      // Start with polling then upgrade to WebSocket — ensures it works
      // through all proxies and CORS environments (local + Render)
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 10000,
      timeout: 20000,
    })
    socket.on('connect', () => set({ isConnected: true }))
    socket.on('disconnect', () => set({ isConnected: false }))
    socket.on('connect_error', (err) => {
      // Silently handle — don't spam console; real-time features degrade gracefully
      console.debug('[Socket] connect error:', err.message)
    })
    set({ socket })
  },

  disconnect: () => {
    const { socket } = get()
    if (socket) {
      socket.off('connect_error')
      socket.disconnect()
      set({ socket: null, isConnected: false })
    }
  },
}))