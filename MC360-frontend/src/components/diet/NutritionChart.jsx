import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const COLORS = ['#2a85ff', '#14b8a6', '#f59e0b']

export default function NutritionChart({ protein, carbs, fat }) {
  const data = [
    { name: 'Protein', value: protein || 0 },
    { name: 'Carbs', value: carbs || 0 },
    { name: 'Fat', value: fat || 0 },
  ].filter((d) => d.value > 0)

  if (!data.length) return null

  return (
    <ResponsiveContainer width="100%" height={180}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={70}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
          formatter={(v, n) => [`${v}g`, n]}
        />
        <Legend
          wrapperStyle={{ fontSize: 11 }}
          iconType="circle"
          iconSize={8}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}