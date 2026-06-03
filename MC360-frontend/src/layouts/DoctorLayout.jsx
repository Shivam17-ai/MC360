import { Outlet } from 'react-router-dom'

export default function DoctorLayout() {
  return (
    <div className="min-h-screen flex bg-surface-muted">
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
