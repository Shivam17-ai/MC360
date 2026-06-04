import { useState } from 'react'
import CallControls from './CallControls.jsx'

export default function VideoCall({ session }) {
  const [callActive, setCallActive] = useState(true)

  if (!callActive) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center text-white space-y-3">
          <p className="text-2xl font-display font-bold">Call Ended</p>
          <p className="text-slate-400">Duration: 12:34</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Remote Video */}
      <div className="flex-1 relative bg-slate-800 flex items-center justify-center">
        <div className="text-center text-white space-y-3">
          <div className="w-28 h-28 rounded-full bg-primary-600 flex items-center justify-center text-5xl font-bold mx-auto">
            {session?.doctorName?.[0] || 'D'}
          </div>
          <p className="font-display font-semibold text-xl">{session?.doctorName || 'Dr. Rahul Mehta'}</p>
          <p className="text-slate-400 text-sm animate-pulse">● Connected · 00:12:34</p>
        </div>

        {/* Self Preview */}
        <div className="absolute bottom-4 right-4 w-40 h-28 bg-slate-700 rounded-xl border-2 border-slate-600 flex items-center justify-center">
          <p className="text-white text-xs">You</p>
        </div>
      </div>

      <CallControls onEnd={() => setCallActive(false)} />
    </div>
  )
}