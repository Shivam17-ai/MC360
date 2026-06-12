import { Route } from 'react-router-dom'
import DoctorDashboard   from '../pages/doctor/DoctorDashboard'
import DoctorAppointments from '../pages/doctor/Appointments'
import PatientRecords    from '../pages/doctor/PatientRecords'
import Prescriptions     from '../pages/doctor/Prescriptions'
import VideoConsult      from '../pages/doctor/VideoConsult'
import DoctorProfile     from '../pages/doctor/DoctorProfile'

const doctorRoutes = [
  <Route key="d-dash"  path="/doctor/dashboard"        element={<DoctorDashboard />} />,
  <Route key="d-appt"  path="/doctor/appointments"     element={<DoctorAppointments />} />,
  <Route key="d-pat"   path="/doctor/patients"         element={<PatientRecords />} />,
  <Route key="d-presc" path="/doctor/prescriptions"    element={<Prescriptions />} />,
  <Route key="d-vid"   path="/doctor/video/:sessionId" element={<VideoConsult />} />,
  <Route key="d-prof"  path="/doctor/profile"          element={<DoctorProfile />} />,
]

export default doctorRoutes