import { NavLink } from "react-router-dom";

const patientLinks = [
  { to: "/patient/dashboard", icon: "🏠", label: "Dashboard" },
  { to: "/patient/appointments", icon: "📅", label: "Appointments" },
  { to: "/patient/book", icon: "➕", label: "Book Appointment" },
  { to: "/patient/reports", icon: "📋", label: "My Reports" },
  { to: "/patient/medicines", icon: "💊", label: "Medicine Tracker" },
  { to: "/patient/analytics", icon: "📊", label: "Health Analytics" },
  { to: "/patient/symptom-checker", icon: "🤖", label: "Symptom Checker" },
  { to: "/patient/diet", icon: "🥗", label: "Diet Planner" },
  { to: "/patient/profile", icon: "👤", label: "Profile" },
];

const doctorLinks = [
  { to: "/doctor/dashboard", icon: "🏠", label: "Dashboard" },
  { to: "/doctor/appointments", icon: "📅", label: "Appointments" },
  { to: "/doctor/patients", icon: "🧑‍⚕️", label: "Patient Records" },
  { to: "/doctor/prescriptions", icon: "📝", label: "Prescriptions" },
  { to: "/doctor/video", icon: "🎥", label: "Video Consult" },
  { to: "/doctor/profile", icon: "👤", label: "Profile" },
];

const hospitalLinks = [
  { to: "/hospital/dashboard", icon: "🏥", label: "Dashboard" },
  { to: "/hospital/doctors", icon: "👨‍⚕️", label: "Manage Doctors" },
  { to: "/hospital/patients", icon: "🧑‍🤝‍🧑", label: "Manage Patients" },
  { to: "/hospital/analytics", icon: "📊", label: "Analytics" },
  { to: "/hospital/emergency", icon: "🚨", label: "Emergency Monitor" },
];

const roleLinks = { patient: patientLinks, doctor: doctorLinks, hospital_admin: hospitalLinks };

const Sidebar = ({ role = "patient", isOpen = true, onClose }) => {
  const links = roleLinks[role] || patientLinks;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={onClose} />
      )}

      <aside className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-40 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:shadow-none md:z-auto`}>

        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-100">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">M</div>
          <span className="text-base font-bold text-blue-700">MedConnect<span className="text-gray-800">360</span></span>
        </div>

        {/* Role Badge */}
        <div className="px-6 py-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            {role === "hospital_admin" ? "Hospital Admin" : role}
          </span>
        </div>

        {/* Nav Links */}
        <nav className="px-3 space-y-1 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition
                ${isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"}`
              }
            >
              <span className="text-base">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Logout */}
        <div className="absolute bottom-0 left-0 right-0 px-3 py-4 border-t border-gray-100">
          <button className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 w-full transition">
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;