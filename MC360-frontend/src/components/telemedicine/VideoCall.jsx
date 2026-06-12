import { useRef, useEffect } from 'react'

export default function VideoCall({ localRef, remoteRef, isConnected }) {
  return (
    <div className="relative w-full h-full bg-slate-900 rounded-2xl overflow-hidden">
      {/* Remote stream */}
      <video
        ref={remoteRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />

      {!isConnected && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900">
          <div className="w-14 h-14 border-4 border-white/10 border-t-primary-500 rounded-full animate-spin mb-4" />
          <p className="text-white/60 text-sm">Connecting…</p>
        </div>
      )}

      {/* Local PiP */}
      <video
        ref={localRef}
        autoPlay
        playsInline
        muted
        className="absolute bottom-3 right-3 w-36 h-24 rounded-xl object-cover border border-white/20 shadow-xl"
      />
    </div>
  )
}