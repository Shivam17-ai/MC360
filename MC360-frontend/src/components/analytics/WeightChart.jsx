import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const sampleData = [
  { date: "Jan", weight: 75 },
  { date: "Feb", weight: 74 },
  { date: "Mar", weight: 72 },
  { date: "Apr", weight: 71 },
  { date: "May", weight: 70 },
  { date: "Jun", weight: 69 },
];

const WeightChart = ({ data = sampleData }) => (
  <div className="bg-white p-6 rounded-2xl shadow-md">
    <h3 className="text-lg font-bold text-blue-700 mb-4">Weight Tracker (kg)</h3>
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={["auto", "auto"]} />
        <Tooltip />
        <Area type="monotone" dataKey="weight" stroke="#3b82f6" fill="url(#weightGrad)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default WeightChart;