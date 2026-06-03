import { Route } from 'react-router-dom'
import PatientLayout from '../layouts/PatientLayout.jsx'
import PatientDashboard from '../pages/patient/PatientDashboard.jsx'
import BookAppointment from '../pages/patient/BookAppointment.jsx'
import BookTest from '../pages/patient/BookTest.jsx'
import MyAppointments from '../pages/patient/MyAppointments.jsx'
import MyReports from '../pages/patient/MyReports.jsx'
import MedicineTracker from '../pages/patient/MedicineTracker.jsx'
import HealthAnalytics from '../pages/patient/HealthAnalytics.jsx'
import SymptomChecker from '../pages/patient/SymptomChecker.jsx'
import DietPlanner from '../pages/patient/DietPlanner.jsx'
import Profile from '../pages/patient/Profile.jsx'
import VideoSession from '../pages/patient/VideoSession.jsx'

const patientRoutes = (
  <Route path="/patient" element={<PatientLayout />}>
    <Route index element={<PatientDashboard />} />
    <Route path="book-appointment" element={<BookAppointment />} />
    <Route path="book-test" element={<BookTest />} />
    <Route path="appointments" element={<MyAppointments />} />
    <Route path="reports" element={<MyReports />} />
    <Route path="medicines" element={<MedicineTracker />} />
    <Route path="analytics" element={<HealthAnalytics />} />
    <Route path="symptom-checker" element={<SymptomChecker />} />
    <Route path="diet" element={<DietPlanner />} />
    <Route path="profile" element={<Profile />} />
    <Route path="video/:sessionId" element={<VideoSession />} />
  </Route>
)

export default patientRoutes
