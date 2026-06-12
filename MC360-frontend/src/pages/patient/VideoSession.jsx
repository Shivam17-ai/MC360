import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useWebRTC } from '../../hooks/useWebRTC'
import { useSocketStore } from '../../store/socketStore'
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, X } from 'lucide-react'

export default function VideoSession() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const socket = useSocketStore(s => s.socket)
  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [msgInput, setMsgInput] = useState('')

  const {
    localVideoRef, remoteVideoRef, isConnected,
    isMuted, isCameraOff, getLocalStream, createPeer, toggleMute, toggleCamera, endCall,
  } = useWebRTC(socket, sessionId)

  useEffect(() => {
    if (!socket) return

    getLocalStream().then(stream => {
      socket.emit('webrtc:join', { sessionId })
      socket.on('webrtc:user-joined', async () => {
        const peer = createPeer(stream, true)
        const offer = await peer.createOffer()
        await peer.setLocalDescription(offer)
        socket.emit('webrtc:offer', { sessionId, offer })
      })
      socket.on('webrtc:offer', async ({ offer }) => {
        const peer = createPeer(stream, false)
        await peer.setRemoteDescription(offer)
        const answer = await peer.createAnswer()
        await peer.setLocalDescription(answer)
        socket.emit('webrtc:answer', { sessionId, answer })
      })
      socket.on('webrtc:answer', ({ answer }) => peer?.setRemoteDescription(answer))
      socket.on('webrtc:ice-candidate', ({ candidate }) => peer?.addIceCandidate(candidate))
      socket.on('chat:message', (msg) => setMessages(p => [...p, msg]))
    })

    return () => {
      endCall()
      socket.emit('webrtc:leave', { sessionId })
    }
  }, [socket, sessionId])

  const handleEnd = () => {
    endCall()
    socket?.emit('webrtc:leave', { sessionId })
    navigate(-1)
  }

  const sendMessage = () => {
    if (!msgInput.trim()) return
    socket?.emit('chat:message', { sessionId, message: msgInput })
    setMessages(p => [...p, { sender: 'You', message: msgInput }])
    setMsgInput('')
  }

  return (
    <div className="fixed inset-0 bg-slate-900 flex flex-col">
      {/* Video area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Remote */}
        <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
        {!isConnected && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4" />
            <p className="text-white text-sm font-medium">Waiting for the other participant…</p>
          </div>
        )}
        {/* Local (PiP) */}
        <video ref={localVideoRef} autoPlay playsInline muted className="absolute bottom-4 right-4 w-48 h-32 rounded-2xl object-cover border-2 border-white/20 shadow-2xl" />
        {/* Session info */}
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-xl px-3 py-2">
          <p className="text-white text-sm font-medium">Consultation · {sessionId?.slice(0, 8)}</p>
          {isConnected && <div className="flex items-center gap-1.5 mt-0.5"><div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse-dot" /><span className="text-xs text-emerald-300">Connected</span></div>}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 py-6 px-4 bg-slate-900/90 backdrop-blur-sm">
        <ControlBtn onClick={toggleMute} active={isMuted} icon={isMuted ? MicOff : Mic} label={isMuted ? 'Unmute' : 'Mute'} />
        <ControlBtn onClick={toggleCamera} active={isCameraOff} icon={isCameraOff ? VideoOff : Video} label={isCameraOff ? 'Start video' : 'Stop video'} />
        <button onClick={handleEnd} className="w-14 h-14 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors shadow-lg">
          <PhoneOff className="w-6 h-6 text-white" />
        </button>
        <ControlBtn onClick={() => setChatOpen(p => !p)} active={chatOpen} icon={MessageSquare} label="Chat" />
      </div>

      {/* Chat Panel */}
      {chatOpen && (
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-white/10 backdrop-blur-xl border-l border-white/10 flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <p className="text-white font-medium text-sm">Chat</p>
            <button onClick={() => setChatOpen(false)}><X className="w-4 h-4 text-white/60" /></button>
          </div>
          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            {messages.map((m, i) => (
              <div key={i} className={`text-xs ${m.sender === 'You' ? 'text-right' : ''}`}>
                <p className="text-white/50 mb-1">{m.sender}</p>
                <span className={`inline-block px-3 py-2 rounded-xl text-sm ${m.sender === 'You' ? 'bg-primary-600 text-white' : 'bg-white/20 text-white'}`}>{m.message}</span>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-white/10 flex gap-2">
            <input value={msgInput} onChange={e => setMsgInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Type a message…" className="flex-1 bg-white/10 text-white placeholder-white/40 rounded-xl px-3 py-2 text-sm border border-white/20 focus:outline-none focus:border-white/40" />
            <button onClick={sendMessage} className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function ControlBtn({ onClick, active, icon: Icon, label }) {
  return (
    <button onClick={onClick} title={label} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${active ? 'bg-white/20 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'}`}>
      <Icon className="w-5 h-5" />
    </button>
  )
}