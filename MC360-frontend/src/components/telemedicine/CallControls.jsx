import {
  Mic, MicOff, Video, VideoOff, PhoneOff,
  ScreenShare, ScreenShareOff, MessageSquare,
} from 'lucide-react'
import { clsx } from 'clsx'

export default function CallControls({
  isMuted, isCameraOff, isSharing,
  onToggleMute, onToggleCamera, onToggleShare, onToggleChat, onEnd,
}) {
  return (
    <div className="flex items-center justify-center gap-3">
      <CtrlBtn
        onClick={onToggleMute}
        active={isMuted}
        icon={isMuted ? MicOff : Mic}
        label={isMuted ? 'Unmute' : 'Mute'}
      />
      <CtrlBtn
        onClick={onToggleCamera}
        active={isCameraOff}
        icon={isCameraOff ? VideoOff : Video}
        label={isCameraOff ? 'Start video' : 'Stop video'}
      />
      <CtrlBtn
        onClick={onToggleShare}
        active={isSharing}
        icon={isSharing ? ScreenShareOff : ScreenShare}
        label={isSharing ? 'Stop share' : 'Share screen'}
      />
      <CtrlBtn
        onClick={onToggleChat}
        icon={MessageSquare}
        label="Chat"
      />
      <button
        onClick={onEnd}
        title="End call"
        className="w-13 h-13 bg-red-600 hover:bg-red-700 rounded-full p-3.5 flex items-center justify-center transition-colors shadow-lg"
      >
        <PhoneOff className="w-5 h-5 text-white" />
      </button>
    </div>
  )
}

function CtrlBtn({ onClick, active, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={clsx(
        'w-11 h-11 rounded-full flex items-center justify-center transition-all',
        active
          ? 'bg-white/25 text-white'
          : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white',
      )}
    >
      <Icon className="w-5 h-5" />
    </button>
  )
}