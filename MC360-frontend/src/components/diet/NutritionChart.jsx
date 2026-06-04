import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = ['#0e8af5', '#22c55e', '#f59e0b', '#ef4444']

export default function NutritionChart({ data }) {
  const chartData = data || [
    { name: 'Protein', value: 25 },
    { name: 'Carbs', value: 50 },
    { name: 'Fats', value: 20 },
    { name: 'Fiber', value: 5 },
  ]

  return (
    <div className="card">
      <h3 className="font-display font-semibold text-slate-800 mb-4">Nutrition Breakdown</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={3} dataKey="value">
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => `${v}%`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}