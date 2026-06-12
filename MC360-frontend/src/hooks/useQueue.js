import { useEffect, useState } from 'react'
import { useSocketStore } from '../store/socketStore'
import { queueService } from '../services/queueService'

export const useQueue = (doctorId) => {
  const socket = useSocketStore((s) => s.socket)
  const [queue, setQueue] = useState([])

  useEffect(() => {
    if (!doctorId) return
    queueService.getQueue(doctorId).then((res) => setQueue(res.data || []))
  }, [doctorId])

  useEffect(() => {
    if (!socket || !doctorId) return
    socket.on(`queue:update:${doctorId}`, (data) => setQueue(data))
    return () => socket.off(`queue:update:${doctorId}`)
  }, [socket, doctorId])

  return { queue }
}