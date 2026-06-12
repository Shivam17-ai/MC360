import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Cell,
} from 'recharts'

const NORMAL_RANGE = { min: 70, max: 99 }

export default function GlucoseChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
          unit=" mg"
        />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
          formatter={(v) => [`${v} mg/dL`, 'Glucose']}
        />
        <ReferenceLine y={NORMAL_RANGE.max} stroke="#f59e0b" strokeDasharray="4 4" />
        <ReferenceLine y={NORMAL_RANGE.min} stroke="#10b981" strokeDasharray="4 4" />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={
                entry.value > NORMAL_RANGE.max ? '#ef4444'
                  : entry.value < NORMAL_RANGE.min ? '#f59e0b'
                    : '#10b981'
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}