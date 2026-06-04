import { useState } from "react";

const RegisterForm = ({ onSubmit }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "patient", phone: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(form);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-blue-700 mb-1">Create Account</h2>
      <p className="text-sm text-gray-500 mb-6">Join MedConnect360 today</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { name: "name", label: "Full Name", type: "text", placeholder: "John Doe" },
          { name: "email", label: "Email", type: "email", placeholder: "you@example.com" },
          { name: "phone", label: "Phone Number", type: "tel", placeholder: "+91 9876543210" },
          { name: "password", label: "Password", type: "password", placeholder: "Min 8 characters" },
        ].map((f) => (
          <div key={f.name}>
            <label className="text-xs font-semibold text-gray-600 block mb-1">{f.label}</label>
            <input
              type={f.type}
              name={f.name}
              value={form[f.name]}
              onChange={handleChange}
              placeholder={f.placeholder}
              className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
        ))}

        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Register As</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="hospital_admin">Hospital Admin</option>
          </select>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition">
          Create Account
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-4">
        Already have an account? <a href="/login" className="text-blue-600 font-semibold hover:underline">Sign In</a>
      </p>
    </div>
  );
};

export default RegisterForm;