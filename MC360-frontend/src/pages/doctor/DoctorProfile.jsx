import { useState } from "react";
import DoctorLayout from "../../layouts/DoctorLayout";

const DoctorProfile = ({ user }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: "Dr. Priya Sharma",
    specialization: "Cardiologist",
    experience: "8",
    consultationFee: "500",
    phone: "9876543210",
    email: "priya.sharma@medconnect360.com",
    licenseNumber: "MCI-2025-XY789",
    bio: "Experienced cardiologist with 8+ years in interventional cardiology. Specializes in preventive care and heart disease management.",
    hospital: "Apollo Hospital, New Delhi",
    qualifications: "MBBS, MD (Cardiology), DM (Interventional Cardiology)",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <DoctorLayout user={user}>
      <div className="space-y-6 max-w-3xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
          <button
            onClick={() => setEditing(!editing)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${editing ? "bg-gray-200 text-gray-700 hover:bg-gray-300" : "bg-blue-600 text-white hover:bg-blue-700"}`}
          >
            {editing ? "Cancel" : "✏️ Edit Profile"}
          </button>
        </div>

        {/* Avatar + Basic */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-4xl shrink-0">👨‍⚕️</div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{form.name}</h2>
            <p className="text-blue-600 font-medium text-sm">{form.specialization}</p>
            <p className="text-gray-500 text-xs mt-1">{form.hospital}</p>
            <div className="flex gap-2 mt-2">
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">⭐ 4.9 Rating</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">✅ Verified</span>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-gray-700 mb-4">Professional Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: "name", label: "Full Name" },
              { name: "specialization", label: "Specialization" },
              { name: "experience", label: "Experience (Years)" },
              { name: "consultationFee", label: "Consultation Fee (₹)" },
              { name: "phone", label: "Phone" },
              { name: "email", label: "Email" },
              { name: "licenseNumber", label: "License Number" },
              { name: "hospital", label: "Hospital" },
            ].map((f) => (
              <div key={f.name}>
                <label className="text-xs font-semibold text-gray-500 block mb-1">{f.label}</label>
                <input
                  type="text"
                  name={f.name}
                  value={form[f.name]}
                  onChange={handleChange}
                  disabled={!editing}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400
                    ${!editing ? "bg-gray-50 text-gray-600 cursor-not-allowed" : "bg-white"}`}
                />
              </div>
            ))}
          </div>

          <div className="mt-4">
            <label className="text-xs font-semibold text-gray-500 block mb-1">Qualifications</label>
            <input
              type="text"
              name="qualifications"
              value={form.qualifications}
              onChange={handleChange}
              disabled={!editing}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400
                ${!editing ? "bg-gray-50 text-gray-600 cursor-not-allowed" : "bg-white"}`}
            />
          </div>

          <div className="mt-4">
            <label className="text-xs font-semibold text-gray-500 block mb-1">Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              disabled={!editing}
              rows={3}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400
                ${!editing ? "bg-gray-50 text-gray-600 cursor-not-allowed" : "bg-white"}`}
            />
          </div>

          {editing && (
            <button
              onClick={() => setEditing(false)}
              className="mt-5 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          )}
        </div>
      </div>
    </DoctorLayout>
  );
};

export default DoctorProfile;