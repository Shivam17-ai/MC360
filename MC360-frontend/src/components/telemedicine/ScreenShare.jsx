import { useState } from 'react'
import { Monitor, MonitorOff } from 'lucide-react'
import Button from '../common/Button'

export default function ScreenShare() {
  const [sharing, setSharing] = useState(false)

  const toggle = async () => {
    if (!sharing) {
      try {
        await navigator.mediaDevices.getDisplayMedia({ video: true })
        setSharing(true)
      } catch {
        setSharing(false)
      }
    } else {
      setSharing(false)
    }
  }

  return (
    <Button
      variant={sharing ? 'danger' : 'secondary'}
      onClick={toggle}
      className="gap-2"
    >
      {sharing ? <MonitorOff size={16} /> : <Monitor size={16} />}
      {sharing ? 'Stop Sharing' : 'Share Screen'}
    </Button>
  )
}