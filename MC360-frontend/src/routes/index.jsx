import { Routes, Route, Navigate } from 'react-router-dom'
import patientRoutes from './patientRoutes.jsx'
import doctorRoutes from './doctorRoutes.jsx'
import hospitalRoutes from './hospitalRoutes.jsx'

// Pages (lazy-loadable later)
import Landing from '../pages/Landing.jsx'
import Login from '../pages/auth/Login.jsx'
import Register from '../pages/auth/Register.jsx'
import ForgotPassword from '../pages/auth/ForgotPassword.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Role routes */}
      {patientRoutes}
      {doctorRoutes}
      {hospitalRoutes}

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
