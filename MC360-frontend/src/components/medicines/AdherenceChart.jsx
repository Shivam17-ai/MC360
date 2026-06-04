import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-lg text-sm">
        <p className="font-medium text-gray-700">{label}</p>
        <p className="text-blue-600 font-semibold">{value}% adherence</p>
      </div>
    );
  }
  return null;
};

const AdherenceChart = ({ data = [] }) => {
  // data shape: [{ day: "Mon", adherence: 85 }, ...]
  const fallback = [
    { day: "Mon", adherence: 100 },
    { day: "Tue", adherence: 66 },
    { day: "Wed", adherence: 100 },
    { day: "Thu", adherence: 33 },
    { day: "Fri", adherence: 100 },
    { day: "Sat", adherence: 66 },
    { day: "Sun", adherence: 100 },
  ];

  const chartData = data.length ? data : fallback;

  const getColor = (value) => {
    if (value >= 80) return "#22c55e";
    if (value >= 50) return "#f59e0b";
    return "#ef4444";
  };

  const avg =
    chartData.reduce((sum, d) => sum + (d.adherence || 0), 0) / chartData.length;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-800">Medication Adherence</h3>
          <p className="text-xs text-gray-500 mt-0.5">Last 7 days</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-800">{Math.round(avg)}%</p>
          <p className="text-xs text-gray-500">avg adherence</p>
        </div>
      </div>

      {/* Color legend */}
      <div className="flex gap-4 mb-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" /> ≥80%
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> 50–79%
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" /> &lt;50%
        </span>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} barSize={28} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
          <Bar dataKey="adherence" radius={[6, 6, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={index} fill={getColor(entry.adherence)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AdherenceChart;