import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

// Layouts
import PublicLayout from './components/layout/PublicLayout'
import PatientLayout from './layouts/PatientLayout'
import DoctorLayout from './layouts/DoctorLayout'
import HospitalLayout from './layouts/HospitalLayout'

// Auth
import ProtectedRoute from './components/auth/ProtectedRoute'
import RoleGuard from './components/auth/RoleGuard'

// Pages
import Landing from './pages/Landing'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard'
import BookAppointment from './pages/patient/BookAppointment'
import BookTest from './pages/patient/BookTest'
import MyAppointments from './pages/patient/MyAppointments'
import MyTests from './pages/patient/MyTests'
import MyReports from './pages/patient/MyReports'
import MedicineTracker from './pages/patient/MedicineTracker'
import HealthAnalytics from './pages/patient/HealthAnalytics'
import SymptomCheckerPage from './pages/patient/SymptomChecker'
import DietPlanner from './pages/patient/DietPlanner'
import PatientProfile from './pages/patient/Profile'
import VideoSession from './pages/patient/VideoSession'

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import DoctorAppointments from './pages/doctor/Appointments'
import PatientRecords from './pages/doctor/PatientRecords'
import Prescriptions from './pages/doctor/Prescriptions'
import VideoConsult from './pages/doctor/VideoConsult'
import DoctorProfile from './pages/doctor/DoctorProfile'

// Hospital Pages
import HospitalDashboard from './pages/hospital/HospitalDashboard'
import ManageDoctors from './pages/hospital/ManageDoctors'
import ManagePatients from './pages/hospital/ManagePatients'
import HospitalAnalytics from './pages/hospital/Analytics'
import EmergencyMonitor from './pages/hospital/EmergencyMonitor'

export default function App() {
  const { checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Patient */}
      <Route element={<ProtectedRoute><RoleGuard role="patient"><PatientLayout /></RoleGuard></ProtectedRoute>}>
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/patient/book-appointment" element={<BookAppointment />} />
        <Route path="/patient/book-test" element={<BookTest />} />
        <Route path="/patient/appointments" element={<MyAppointments />} />
        <Route path="/patient/tests" element={<MyTests />} />
        <Route path="/patient/reports" element={<MyReports />} />
        <Route path="/patient/medicines" element={<MedicineTracker />} />
        <Route path="/patient/analytics" element={<HealthAnalytics />} />
        <Route path="/patient/symptom-checker" element={<SymptomCheckerPage />} />
        <Route path="/patient/diet" element={<DietPlanner />} />
        <Route path="/patient/profile" element={<PatientProfile />} />
        <Route path="/patient/video/:sessionId" element={<VideoSession />} />
      </Route>

      {/* Doctor */}
      <Route element={<ProtectedRoute><RoleGuard role="doctor"><DoctorLayout /></RoleGuard></ProtectedRoute>}>
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/appointments" element={<DoctorAppointments />} />
        <Route path="/doctor/patients" element={<PatientRecords />} />
        <Route path="/doctor/prescriptions" element={<Prescriptions />} />
        <Route path="/doctor/video/:sessionId" element={<VideoConsult />} />
        <Route path="/doctor/profile" element={<DoctorProfile />} />
      </Route>

      {/* Hospital */}
      <Route element={<ProtectedRoute><RoleGuard role="hospital"><HospitalLayout /></RoleGuard></ProtectedRoute>}>
        <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
        <Route path="/hospital/doctors" element={<ManageDoctors />} />
        <Route path="/hospital/patients" element={<ManagePatients />} />
        <Route path="/hospital/analytics" element={<HospitalAnalytics />} />
        <Route path="/hospital/emergency" element={<EmergencyMonitor />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}