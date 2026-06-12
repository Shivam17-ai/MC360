import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

const ROLE_REDIRECTS = {
  patient: '/patient/dashboard',
  doctor: '/doctor/dashboard',
  hospital: '/hospital/dashboard',
}

export default function RoleGuard({ role, children }) {
  const { user } = useAuthStore()

  if (!user) return null
  if (user.role !== role) {
    return <Navigate to={ROLE_REDIRECTS[user.role] || '/'} replace />
  }
  return children
}