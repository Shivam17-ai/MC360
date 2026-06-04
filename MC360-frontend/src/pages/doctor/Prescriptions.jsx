import { useState } from "react";
import DoctorLayout from "../../layouts/DoctorLayout";

const samplePrescriptions = [
  { id: 1, patient: "Aarav Sharma", date: "2025-07-20", medicines: ["Amlodipine 5mg OD", "Telmisartan 40mg OD"], notes: "Reduce salt intake. Follow up in 1 month." },
  { id: 2, patient: "Priya Mehta", date: "2025-07-15", medicines: ["Paracetamol 500mg TDS", "Cetirizine 10mg OD"], notes: "Rest for 3 days. Drink fluids." },
  { id: 3, patient: "Rohan Das", date: "2025-07-10", medicines: ["Metformin 500mg BD", "Glimepiride 1mg OD"], notes: "Monitor blood glucose daily." },
];

const emptyForm = { patient: "", medicines: [""], notes: "", date: new Date().toISOString().split("T")[0] };

const Prescriptions = ({ user }) => {
  const [prescriptions, setPrescriptions] = useState(samplePrescriptions);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const addMedicineField = () => setForm({ ...form, medicines: [...form.medicines, ""] });

  const updateMedicine = (i, val) => {
    const updated = [...form.medicines];
    updated[i] = val;
    setForm({ ...form, medicines: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPrescriptions([{ id: Date.now(), ...form }, ...prescriptions]);
    setForm(emptyForm);
    setShowForm(false);
  };

  return (
    <DoctorLayout user={user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Prescriptions</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
          >
            + New Prescription
          </button>
        </div>

        {/* New Prescription Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-4 border border-blue-100">
            <h2 className="font-bold text-gray-700">New Prescription</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Patient Name</label>
                <input
                  type="text"
                  value={form.patient}
                  onChange={(e) => setForm({ ...form, patient: e.target.value })}
                  className="border rounded-xl px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="border rounded-xl px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-2">Medicines</label>
              {form.medicines.map((m, i) => (
                <input
                  key={i}
                  type="text"
                  value={m}
                  onChange={(e) => updateMedicine(i, e.target.value)}
                  placeholder={`Medicine ${i + 1} (e.g. Paracetamol 500mg TDS)`}
                  className="border rounded-xl px-4 py-2 text-sm w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              ))}
              <button type="button" onClick={addMedicineField} className="text-xs text-blue-600 font-semibold hover:underline">
                + Add Another Medicine
              </button>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Notes / Instructions</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                className="border rounded-xl px-4 py-2 text-sm w-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition">Save</button>
              <button type="button" onClick={() => setShowForm(false)} className="border border-gray-300 px-6 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">Cancel</button>
            </div>
          </form>
        )}

        {/* Prescriptions List */}
        <div className="space-y-4">
          {prescriptions.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-bold text-gray-800">{p.patient}</p>
                  <p className="text-xs text-gray-400">{p.date}</p>
                </div>
                <button className="text-xs text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition font-semibold">
                  📄 Download PDF
                </button>
              </div>
              <div className="mb-2">
                <p className="text-xs font-semibold text-gray-500 mb-1">Medicines:</p>
                <ul className="space-y-1">
                  {p.medicines.map((m, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-bold">{i + 1}</span>
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
              {p.notes && (
                <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 mt-2">📝 {p.notes}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </DoctorLayout>
  );
};

export default Prescriptions;