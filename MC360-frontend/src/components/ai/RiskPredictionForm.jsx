import { useState } from "react";

const fields = [
  { name: "age", label: "Age", type: "number" },
  { name: "weight", label: "Weight (kg)", type: "number" },
  { name: "height", label: "Height (cm)", type: "number" },
  { name: "bloodPressure", label: "Blood Pressure (mmHg)", type: "text" },
  { name: "glucoseLevel", label: "Glucose Level (mg/dL)", type: "number" },
  { name: "cholesterol", label: "Cholesterol (mg/dL)", type: "number" },
];

const RiskPredictionForm = ({ onSubmit }) => {
  const [form, setForm] = useState({});

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md max-w-lg space-y-4">
      <h2 className="text-xl font-bold text-blue-700">Health Risk Prediction</h2>
      <div className="grid grid-cols-2 gap-4">
        {fields.map((f) => (
          <div key={f.name}>
            <label className="text-xs font-semibold text-gray-600 block mb-1">{f.label}</label>
            <input
              type={f.type}
              name={f.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
        ))}
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
        Predict Risk
      </button>
    </form>
  );
};

export default RiskPredictionForm;