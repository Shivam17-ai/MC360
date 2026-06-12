import { Route } from 'react-router-dom'
import HospitalDashboard from '../pages/hospital/HospitalDashboard'
import ManageDoctors     from '../pages/hospital/ManageDoctors'
import ManagePatients    from '../pages/hospital/ManagePatients'
import HospitalAnalytics from '../pages/hospital/Analytics'
import EmergencyMonitor  from '../pages/hospital/EmergencyMonitor'

const hospitalRoutes = [
  <Route key="h-dash"  path="/hospital/dashboard" element={<HospitalDashboard />} />,
  <Route key="h-doc"   path="/hospital/doctors"   element={<ManageDoctors />} />,
  <Route key="h-pat"   path="/hospital/patients"  element={<ManagePatients />} />,
  <Route key="h-ana"   path="/hospital/analytics" element={<HospitalAnalytics />} />,
  <Route key="h-emer"  path="/hospital/emergency" element={<EmergencyMonitor />} />,
]

export default hospitalRoutes