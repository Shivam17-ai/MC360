import { Outlet } from 'react-router-dom'

export default function PatientLayout() {
  return (
    <div className="min-h-screen flex bg-surface-muted">
      {/* Sidebar will go here */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
