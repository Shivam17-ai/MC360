import { Route } from 'react-router-dom'
import DoctorLayout from '../layouts/DoctorLayout.jsx'
import DoctorDashboard from '../pages/doctor/DoctorDashboard.jsx'
import Appointments from '../pages/doctor/Appointments.jsx'
import PatientRecords from '../pages/doctor/PatientRecords.jsx'
import Prescriptions from '../pages/doctor/Prescriptions.jsx'
import VideoConsult from '../pages/doctor/VideoConsult.jsx'
import DoctorProfile from '../pages/doctor/DoctorProfile.jsx'

const doctorRoutes = (
  <Route path="/doctor" element={<DoctorLayout />}>
    <Route index element={<DoctorDashboard />} />
    <Route path="appointments" element={<Appointments />} />
    <Route path="patients" element={<PatientRecords />} />
    <Route path="prescriptions" element={<Prescriptions />} />
    <Route path="video/:sessionId" element={<VideoConsult />} />
    <Route path="profile" element={<DoctorProfile />} />
  </Route>
)

export default doctorRoutes
