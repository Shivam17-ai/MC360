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
      transports: ['websocket'],
    })
    socket.on('connect', () => set({ isConnected: true }))
    socket.on('disconnect', () => set({ isConnected: false }))
    set({ socket })
  },

  disconnect: () => {
    const { socket } = get()
    if (socket) {
      socket.disconnect()
      set({ socket: null, isConnected: false })
    }
  },
}))