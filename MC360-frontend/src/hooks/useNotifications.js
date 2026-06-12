import { useEffect } from 'react'
import { useNotificationStore } from '../store/notificationStore'
import { useSocketStore } from '../store/socketStore'

export const useNotifications = () => {
  const store = useNotificationStore()
  const socket = useSocketStore((s) => s.socket)

  useEffect(() => {
    store.fetch()
  }, [])

  useEffect(() => {
    if (!socket) return
    socket.on('notification:new', (n) => store.add(n))
    return () => socket.off('notification:new')
  }, [socket])

  return store
}