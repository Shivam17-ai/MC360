import { Route } from 'react-router-dom'
import PatientDashboard   from '../pages/patient/PatientDashboard'
import BookAppointment    from '../pages/patient/BookAppointment'
import BookTest           from '../pages/patient/BookTest'
import MyAppointments     from '../pages/patient/MyAppointments'
import MyReports          from '../pages/patient/MyReports'
import MedicineTracker    from '../pages/patient/MedicineTracker'
import HealthAnalytics    from '../pages/patient/HealthAnalytics'
import SymptomCheckerPage from '../pages/patient/SymptomChecker'
import DietPlanner        from '../pages/patient/DietPlanner'
import PatientProfile     from '../pages/patient/Profile'
import VideoSession       from '../pages/patient/VideoSession'

const patientRoutes = [
  <Route key="p-dash"   path="/patient/dashboard"        element={<PatientDashboard />} />,
  <Route key="p-book"   path="/patient/book-appointment" element={<BookAppointment />} />,
  <Route key="p-test"   path="/patient/book-test"        element={<BookTest />} />,
  <Route key="p-appt"   path="/patient/appointments"     element={<MyAppointments />} />,
  <Route key="p-rep"    path="/patient/reports"          element={<MyReports />} />,
  <Route key="p-med"    path="/patient/medicines"        element={<MedicineTracker />} />,
  <Route key="p-ana"    path="/patient/analytics"        element={<HealthAnalytics />} />,
  <Route key="p-symp"   path="/patient/symptom-checker"  element={<SymptomCheckerPage />} />,
  <Route key="p-diet"   path="/patient/diet"             element={<DietPlanner />} />,
  <Route key="p-prof"   path="/patient/profile"          element={<PatientProfile />} />,
  <Route key="p-vid"    path="/patient/video/:sessionId" element={<VideoSession />} />,
]

export default patientRoutes