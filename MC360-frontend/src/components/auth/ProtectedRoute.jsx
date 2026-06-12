import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { FullPageSpinner } from '../common/Spinner'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading, isInitialized } = useAuthStore()
  const location = useLocation()

  // During initial refresh, if we have a session but haven't validated it yet, stay put or show spinner
  if (isLoading || (!isInitialized && isAuthenticated)) {
    return <FullPageSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}