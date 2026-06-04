import DoctorLayout from "../../layouts/DoctorLayout";

const stats = [
  { label: "Today's Appointments", value: 12, icon: "📅", color: "bg-blue-50 text-blue-700" },
  { label: "Total Patients", value: 340, icon: "🧑‍⚕️", color: "bg-green-50 text-green-700" },
  { label: "Pending Reports", value: 5, icon: "📋", color: "bg-yellow-50 text-yellow-700" },
  { label: "Video Consults Today", value: 4, icon: "🎥", color: "bg-purple-50 text-purple-700" },
];

const recentPatients = [
  { name: "Aarav Sharma", age: 34, condition: "Hypertension", time: "09:00 AM", status: "completed" },
  { name: "Priya Mehta", age: 28, condition: "Fever & Cold", time: "10:00 AM", status: "completed" },
  { name: "Rohan Das", age: 45, condition: "Diabetes Follow-up", time: "11:30 AM", status: "in-progress" },
  { name: "Sneha Kapoor", age: 31, condition: "Back Pain", time: "02:00 PM", status: "pending" },
];

const statusColors = {
  completed: "bg-green-100 text-green-700",
  "in-progress": "bg-blue-100 text-blue-700",
  pending: "bg-yellow-100 text-yellow-700",
};

const DoctorDashboard = ({ user }) => (
  <DoctorLayout user={user}>
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Doctor Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Thursday, {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-2xl p-5 ${s.color} shadow-sm`}>
            <div className="text-3xl mb-2">{s.icon}</div>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-xs font-medium mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Patients */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Today's Patients</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-100">
                <th className="pb-3 font-semibold">Patient</th>
                <th className="pb-3 font-semibold">Age</th>
                <th className="pb-3 font-semibold">Condition</th>
                <th className="pb-3 font-semibold">Time</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentPatients.map((p, i) => (
                <tr key={i} className="hover:bg-gray-50 transition">
                  <td className="py-3 font-medium text-gray-800">{p.name}</td>
                  <td className="py-3 text-gray-500">{p.age}</td>
                  <td className="py-3 text-gray-600">{p.condition}</td>
                  <td className="py-3 text-gray-500">{p.time}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[p.status]}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Write Prescription", icon: "📝", color: "bg-blue-600" },
          { label: "Start Video Call", icon: "🎥", color: "bg-purple-600" },
          { label: "View Reports", icon: "📋", color: "bg-green-600" },
          { label: "Manage Schedule", icon: "📅", color: "bg-orange-500" },
        ].map((a) => (
          <button key={a.label} className={`${a.color} text-white rounded-2xl p-4 text-sm font-semibold flex flex-col items-center gap-2 hover:opacity-90 transition shadow-sm`}>
            <span className="text-2xl">{a.icon}</span>
            {a.label}
          </button>
        ))}
      </div>
    </div>
  </DoctorLayout>
);

export default DoctorDashboard;