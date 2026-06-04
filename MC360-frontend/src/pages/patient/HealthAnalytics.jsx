import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Card from '../../components/common/Card'

const bpData = [
  { date: 'Dec 1', systolic: 120, diastolic: 80 },
  { date: 'Dec 5', systolic: 125, diastolic: 82 },
  { date: 'Dec 10', systolic: 118, diastolic: 78 },
  { date: 'Dec 15', systolic: 122, diastolic: 81 },
  { date: 'Dec 18', systolic: 119, diastolic: 79 },
]

const weightData = [
  { date: 'Nov', weight: 74 },
  { date: 'Dec 1', weight: 73.2 },
  { date: 'Dec 8', weight: 72.8 },
  { date: 'Dec 15', weight: 72.1 },
  { date: 'Dec 18', weight: 71.8 },
]

export default function HealthAnalytics() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-display font-bold text-slate-800">Health Analytics</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Blood Pressure', value: '119/79', unit: 'mmHg', color: 'text-blue-600' },
          { label: 'Weight',         value: '71.8',   unit: 'kg',   color: 'text-green-600' },
          { label: 'Blood Sugar',    value: '98',      unit: 'mg/dL', color: 'text-amber-600' },
          { label: 'Heart Rate',     value: '72',      unit: 'bpm',  color: 'text-red-600' },
        ].map(({ label, value, unit, color }) => (
          <Card key={label}>
            <p className="text-xs text-slate-500">{label}</p>
            <p className={`text-2xl font-display font-bold mt-1 ${color}`}>{value}</p>
            <p className="text-xs text-slate-400">{unit}</p>
          </Card>
        ))}
      </div>

      {/* BP Chart */}
      <Card>
        <h3 className="font-display font-semibold text-slate-800 mb-4">Blood Pressure Trend</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={bpData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="systolic"  stroke="#0e8af5" strokeWidth={2} dot={{ r: 4 }} name="Systolic" />
            <Line type="monotone" dataKey="diastolic" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} name="Diastolic" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Weight Chart */}
      <Card>
        <h3 className="font-display font-semibold text-slate-800 mb-4">Weight Trend</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={weightData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} domain={['auto', 'auto']} />
            <Tooltip />
            <Line type="monotone" dataKey="weight" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} name="Weight (kg)" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}