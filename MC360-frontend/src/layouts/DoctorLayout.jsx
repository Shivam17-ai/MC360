import { LayoutDashboard, Calendar, Users, FileText, Video, User } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'

const navItems = [
  { to: '/doctor/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/doctor/appointments', label: 'Appointments', icon: Calendar },
  { to: '/doctor/patients', label: 'Patient Records', icon: Users },
  { to: '/doctor/prescriptions', label: 'Prescriptions', icon: FileText },
  { to: '/doctor/profile', label: 'Profile', icon: User },
]

export default function DoctorLayout() {
  return <DashboardLayout navItems={navItems} />
}