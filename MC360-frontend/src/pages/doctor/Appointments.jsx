import { useState } from "react";
import DoctorLayout from "../../layouts/DoctorLayout";

const sampleAppointments = [
  { id: 1, patient: "Aarav Sharma", age: 34, type: "consultation", date: "2025-08-01", time: "09:00 AM", status: "confirmed", symptoms: "Chest pain, dizziness" },
  { id: 2, patient: "Priya Mehta", age: 28, type: "telemedicine", date: "2025-08-01", time: "10:30 AM", status: "confirmed", symptoms: "Fever, cold" },
  { id: 3, patient: "Rohan Das", age: 45, type: "consultation", date: "2025-08-02", time: "11:00 AM", status: "pending", symptoms: "Diabetes follow-up" },
  { id: 4, patient: "Sneha Kapoor", age: 31, type: "consultation", date: "2025-08-03", time: "02:00 PM", status: "completed", symptoms: "Back pain" },
  { id: 5, patient: "Vikram Nair", age: 52, type: "telemedicine", date: "2025-08-03", time: "04:00 PM", status: "cancelled", symptoms: "Knee pain" },
];

const statusColors = {
  confirmed: "bg-blue-100 text-blue-700",
  pending: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const Appointments = ({ user }) => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = sampleAppointments.filter((a) => {
    const matchStatus = filter === "all" || a.status === filter;
    const matchSearch = a.patient.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <DoctorLayout user={user}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search patient name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 flex-1"
          />
          <div className="flex gap-2 flex-wrap">
            {["all", "confirmed", "pending", "completed", "cancelled"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition
                  ${filter === s ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  {["Patient", "Age", "Type", "Date", "Time", "Symptoms", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-10 text-gray-400">No appointments found</td></tr>
                ) : (
                  filtered.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-4 font-medium text-gray-800">{a.patient}</td>
                      <td className="px-5 py-4 text-gray-500">{a.age}</td>
                      <td className="px-5 py-4 capitalize text-gray-600">{a.type}</td>
                      <td className="px-5 py-4 text-gray-600">{a.date}</td>
                      <td className="px-5 py-4 text-gray-600">{a.time}</td>
                      <td className="px-5 py-4 text-gray-500 max-w-xs truncate">{a.symptoms}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[a.status]}`}>{a.status}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button className="text-xs text-blue-600 hover:underline font-medium">View</button>
                          {a.type === "telemedicine" && a.status === "confirmed" && (
                            <button className="text-xs text-purple-600 hover:underline font-medium">Join</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
};

export default Appointments;