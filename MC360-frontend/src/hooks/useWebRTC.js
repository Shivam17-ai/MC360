import { useRef, useState, useCallback } from 'react'

export const useWebRTC = (socket, sessionId) => {
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const peerRef = useRef(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isCameraOff, setIsCameraOff] = useState(false)

  const getLocalStream = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    if (localVideoRef.current) localVideoRef.current.srcObject = stream
    return stream
  }, [])

  const createPeer = useCallback((stream, initiator) => {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    })
    stream.getTracks().forEach((track) => peer.addTrack(track, stream))
    peer.ontrack = (e) => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = e.streams[0]
    }
    peer.onicecandidate = (e) => {
      if (e.candidate) socket.emit('webrtc:ice-candidate', { sessionId, candidate: e.candidate })
    }
    peer.onconnectionstatechange = () => {
      if (peer.connectionState === 'connected') setIsConnected(true)
      if (['disconnected', 'failed', 'closed'].includes(peer.connectionState)) setIsConnected(false)
    }
    peerRef.current = peer
    return peer
  }, [socket, sessionId])

  const toggleMute = useCallback(() => {
    const stream = localVideoRef.current?.srcObject
    if (!stream) return
    stream.getAudioTracks().forEach((t) => { t.enabled = !t.enabled })
    setIsMuted((p) => !p)
  }, [])

  const toggleCamera = useCallback(() => {
    const stream = localVideoRef.current?.srcObject
    if (!stream) return
    stream.getVideoTracks().forEach((t) => { t.enabled = !t.enabled })
    setIsCameraOff((p) => !p)
  }, [])

  const endCall = useCallback(() => {
    peerRef.current?.close()
    const stream = localVideoRef.current?.srcObject
    stream?.getTracks().forEach((t) => t.stop())
  }, [])

  return {
    localVideoRef, remoteVideoRef, peerRef,
    isConnected, isMuted, isCameraOff,
    getLocalStream, createPeer, toggleMute, toggleCamera, endCall,
  }
}