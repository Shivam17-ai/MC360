import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const sampleData = [
  { month: "Jan", weight: 72, bp: 120, glucose: 95 },
  { month: "Feb", weight: 71, bp: 118, glucose: 98 },
  { month: "Mar", weight: 70, bp: 122, glucose: 92 },
  { month: "Apr", weight: 69, bp: 115, glucose: 90 },
  { month: "May", weight: 68, bp: 117, glucose: 88 },
  { month: "Jun", weight: 68, bp: 119, glucose: 91 },
];

const HealthTrendsChart = ({ data = sampleData }) => (
  <div className="bg-white p-6 rounded-2xl shadow-md">
    <h3 className="text-lg font-bold text-blue-700 mb-4">Health Trends</h3>
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="bp" stroke="#10b981" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="glucose" stroke="#f59e0b" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default HealthTrendsChart;