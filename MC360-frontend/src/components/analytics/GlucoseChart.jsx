import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const sampleData = [
  { date: "Mon", glucose: 95 },
  { date: "Tue", glucose: 102 },
  { date: "Wed", glucose: 98 },
  { date: "Thu", glucose: 110 },
  { date: "Fri", glucose: 92 },
  { date: "Sat", glucose: 88 },
  { date: "Sun", glucose: 96 },
];

const GlucoseChart = ({ data = sampleData }) => (
  <div className="bg-white p-6 rounded-2xl shadow-md">
    <h3 className="text-lg font-bold text-amber-600 mb-4">Blood Glucose (mg/dL)</h3>
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={[60, 140]} />
        <Tooltip />
        <ReferenceLine y={100} stroke="#f59e0b" strokeDasharray="4 4" label="Normal" />
        <Bar dataKey="glucose" fill="#fbbf24" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default GlucoseChart;