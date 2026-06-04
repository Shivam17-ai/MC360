import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const sampleData = [
  { date: "Jan", systolic: 125, diastolic: 82 },
  { date: "Feb", systolic: 122, diastolic: 80 },
  { date: "Mar", systolic: 118, diastolic: 78 },
  { date: "Apr", systolic: 120, diastolic: 79 },
  { date: "May", systolic: 115, diastolic: 76 },
  { date: "Jun", systolic: 117, diastolic: 77 },
];

const BloodPressureChart = ({ data = sampleData }) => (
  <div className="bg-white p-6 rounded-2xl shadow-md">
    <h3 className="text-lg font-bold text-red-600 mb-4">Blood Pressure (mmHg)</h3>
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={[60, 160]} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="systolic" stroke="#ef4444" strokeWidth={2} />
        <Line type="monotone" dataKey="diastolic" stroke="#f97316" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default BloodPressureChart;