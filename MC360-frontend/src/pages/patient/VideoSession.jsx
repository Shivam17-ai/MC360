import { useState } from 'react'
import { Mic, MicOff, Video, VideoOff, PhoneOff, Monitor } from 'lucide-react'
import Button from '../../components/common/Button'

export default function VideoSession() {
  const [mic,   setMic]   = useState(true)
  const [video, setVideo] = useState(true)

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Main Video */}
      <div className="flex-1 relative flex items-center justify-center">
        <div className="w-full h-full bg-slate-800 flex items-center justify-center">
          <div className="text-center text-white space-y-3">
            <div className="w-24 h-24 rounded-full bg-primary-600 flex items-center justify-center text-4xl font-bold mx-auto">R</div>
            <p className="font-display font-semibold text-xl">Dr. Rahul Mehta</p>
            <p className="text-slate-400 text-sm">Cardiologist · Connected</p>
          </div>
        </div>

        {/* Self Preview */}
        <div className="absolute bottom-4 right-4 w-36 h-24 bg-slate-700 rounded-xl flex items-center justify-center border-2 border-slate-600">
          {video
            ? <p className="text-white text-xs">Your Camera</p>
            : <VideoOff size={24} className="text-slate-400" />}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-slate-800 px-6 py-4 flex items-center justify-center gap-4">
        <button onClick={() => setMic(!mic)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${mic ? 'bg-slate-600 text-white' : 'bg-red-500 text-white'}`}>
          {mic ? <Mic size={20} /> : <MicOff size={20} />}
        </button>
        <button onClick={() => setVideo(!video)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${video ? 'bg-slate-600 text-white' : 'bg-red-500 text-white'}`}>
          {video ? <Video size={20} /> : <VideoOff size={20} />}
        </button>
        <button className="w-12 h-12 rounded-full bg-slate-600 text-white flex items-center justify-center">
          <Monitor size={20} />
        </button>
        <button className="w-14 h-14 rounded-full bg-red-500 text-white flex items-center justify-center">
          <PhoneOff size={22} />
        </button>
      </div>
    </div>
  )
}