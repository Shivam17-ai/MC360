import { useState } from 'react'
import { Mic, MicOff, Video, VideoOff, PhoneOff, Monitor, MessageSquare } from 'lucide-react'

export default function CallControls({ onEnd }) {
  const [mic,   setMic]   = useState(true)
  const [video, setVideo] = useState(true)
  const [share, setShare] = useState(false)

  return (
    <div className="bg-slate-800 px-6 py-4 flex items-center justify-center gap-3 border-t border-slate-700">
      {/* Mic */}
      <button onClick={() => setMic(!mic)}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${mic ? 'bg-slate-600 hover:bg-slate-500 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}
        title={mic ? 'Mute' : 'Unmute'}>
        {mic ? <Mic size={20} /> : <MicOff size={20} />}
      </button>

      {/* Camera */}
      <button onClick={() => setVideo(!video)}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${video ? 'bg-slate-600 hover:bg-slate-500 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}
        title={video ? 'Turn off camera' : 'Turn on camera'}>
        {video ? <Video size={20} /> : <VideoOff size={20} />}
      </button>

      {/* Screen Share */}
      <button onClick={() => setShare(!share)}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${share ? 'bg-primary-600 text-white' : 'bg-slate-600 hover:bg-slate-500 text-white'}`}
        title="Share Screen">
        <Monitor size={20} />
      </button>

      {/* Chat */}
      <button className="w-12 h-12 rounded-full bg-slate-600 hover:bg-slate-500 text-white flex items-center justify-center" title="Chat">
        <MessageSquare size={20} />
      </button>

      {/* End Call */}
      <button onClick={onEnd}
        className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
        title="End Call">
        <PhoneOff size={22} />
      </button>
    </div>
  )
}