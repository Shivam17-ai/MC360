import { useState } from "react";
import DoctorLayout from "../../layouts/DoctorLayout";

const samplePatients = [
  { id: 1, name: "Aarav Sharma", age: 34, gender: "Male", phone: "9876543210", bloodGroup: "O+", condition: "Hypertension", lastVisit: "2025-07-20" },
  { id: 2, name: "Priya Mehta", age: 28, gender: "Female", phone: "9812345678", bloodGroup: "A+", condition: "Anemia", lastVisit: "2025-07-15" },
  { id: 3, name: "Rohan Das", age: 45, gender: "Male", phone: "9901234567", bloodGroup: "B+", condition: "Diabetes Type 2", lastVisit: "2025-07-10" },
  { id: 4, name: "Sneha Kapoor", age: 31, gender: "Female", phone: "9823456789", bloodGroup: "AB+", condition: "Migraine", lastVisit: "2025-06-30" },
];

const PatientRecords = ({ user }) => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = samplePatients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.condition.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DoctorLayout user={user}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Patient Records</h1>

        <input
          type="text"
          placeholder="Search by name or condition..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full max-w-md"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelected(p)}
              className="bg-white rounded-2xl shadow-sm p-5 cursor-pointer hover:shadow-md transition border border-gray-100 hover:border-blue-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                    {p.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.age} yrs • {p.gender}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2 py-1 bg-red-50 text-red-600 rounded-full">{p.bloodGroup}</span>
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <p>📞 {p.phone}</p>
                <p>🩺 {p.condition}</p>
                <p>📅 Last Visit: {p.lastVisit}</p>
              </div>
              <button className="mt-3 text-xs text-blue-600 font-semibold hover:underline">View Full History →</button>
            </div>
          ))}
        </div>

        {/* Patient Detail Modal */}
        {selected && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">{selected.name}</h2>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
              </div>
              <div className="space-y-2 text-sm text-gray-700">
                <p><span className="font-semibold">Age:</span> {selected.age}</p>
                <p><span className="font-semibold">Gender:</span> {selected.gender}</p>
                <p><span className="font-semibold">Phone:</span> {selected.phone}</p>
                <p><span className="font-semibold">Blood Group:</span> {selected.bloodGroup}</p>
                <p><span className="font-semibold">Condition:</span> {selected.condition}</p>
                <p><span className="font-semibold">Last Visit:</span> {selected.lastVisit}</p>
              </div>
              <div className="flex gap-3 mt-5">
                <button className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition">Write Prescription</button>
                <button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">View Reports</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DoctorLayout>
  );
};

export default PatientRecords;