import { Route } from 'react-router-dom'
import HospitalLayout from '../layouts/HospitalLayout.jsx'
import HospitalDashboard from '../pages/hospital/HospitalDashboard.jsx'
import ManageDoctors from '../pages/hospital/ManageDoctors.jsx'
import ManagePatients from '../pages/hospital/ManagePatients.jsx'
import Analytics from '../pages/hospital/Analytics.jsx'
import EmergencyMonitor from '../pages/hospital/EmergencyMonitor.jsx'

const hospitalRoutes = (
  <Route path="/hospital" element={<HospitalLayout />}>
    <Route index element={<HospitalDashboard />} />
    <Route path="doctors" element={<ManageDoctors />} />
    <Route path="patients" element={<ManagePatients />} />
    <Route path="analytics" element={<Analytics />} />
    <Route path="emergency" element={<EmergencyMonitor />} />
  </Route>
)

export default hospitalRoutes
