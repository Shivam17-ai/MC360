import { LayoutDashboard, UserCheck, Users, BarChart3, AlertTriangle } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'

const navItems = [
  { to: '/hospital/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/hospital/doctors', label: 'Manage Doctors', icon: UserCheck },
  { to: '/hospital/patients', label: 'Manage Patients', icon: Users },
  { to: '/hospital/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/hospital/emergency', label: 'Emergency Monitor', icon: AlertTriangle },
]

export default function HospitalLayout() {
  return <DashboardLayout navItems={navItems} />
}