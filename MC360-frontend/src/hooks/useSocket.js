import { useEffect } from 'react'
import { useSocketStore } from '../store/socketStore'
import { useAuthStore } from '../store/authStore'

export const useSocket = () => {
  const { connect, disconnect, socket, isConnected } = useSocketStore()
  const { token, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated && token) {
      connect(token)
    }
    return () => disconnect()
  }, [isAuthenticated, token])

  return { socket, isConnected }
}