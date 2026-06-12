import { useState, useCallback } from 'react'
import { ScreenShare, ScreenShareOff } from 'lucide-react'

export default function useScreenShare(peerRef) {
  const [isSharing, setIsSharing] = useState(false)
  const [screenStream, setScreenStream] = useState(null)

  const startShare = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true })
      const videoTrack = stream.getVideoTracks()[0]
      const peer = peerRef.current
      if (peer) {
        const sender = peer
          .getSenders()
          .find((s) => s.track?.kind === 'video')
        sender?.replaceTrack(videoTrack)
      }
      videoTrack.onended = stopShare
      setScreenStream(stream)
      setIsSharing(true)
    } catch {}
  }, [peerRef])

  const stopShare = useCallback(() => {
    screenStream?.getTracks().forEach((t) => t.stop())
    setScreenStream(null)
    setIsSharing(false)
  }, [screenStream])

  return { isSharing, startShare, stopShare }
}