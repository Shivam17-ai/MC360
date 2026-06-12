import { LayoutDashboard, Calendar, FileText, Pill, Activity, Brain, Salad, User, Video, FlaskConical } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'

const navItems = [
  { to: '/patient/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/patient/book-appointment', label: 'Book Appointment', icon: Calendar },
  { to: '/patient/book-test', label: 'Book Test', icon: FlaskConical },
  { to: '/patient/appointments', label: 'My Appointments', icon: Calendar },
  { to: '/patient/reports', label: 'Reports', icon: FileText },
  { to: '/patient/medicines', label: 'Medicines', icon: Pill },
  { to: '/patient/analytics', label: 'Health Analytics', icon: Activity },
  { to: '/patient/symptom-checker', label: 'Symptom Checker', icon: Brain },
  { to: '/patient/diet', label: 'Diet Planner', icon: Salad },
  { to: '/patient/profile', label: 'Profile', icon: User },
]

export default function PatientLayout() {
  return <DashboardLayout navItems={navItems} />
}