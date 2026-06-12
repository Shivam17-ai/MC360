import { useState } from 'react'
import { useHealthMetrics } from '../../hooks/useHealthMetrics'
import { Activity, Plus, TrendingUp, TrendingDown } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import Badge from '../../components/common/Badge'
import { formatDate } from '../../utils/formatDate'
import { useForm } from 'react-hook-form'

const METRIC_TYPES = [
  { value: 'weight', label: 'Weight', unit: 'kg', color: '#2a85ff', normalRange: '50–90' },
  { value: 'blood_pressure', label: 'Blood Pressure', unit: 'mmHg', color: '#ef4444', normalRange: '90/60 – 120/80' },
  { value: 'glucose', label: 'Blood Glucose', unit: 'mg/dL', color: '#f59e0b', normalRange: '70–99 (fasting)' },
  { value: 'heart_rate', label: 'Heart Rate', unit: 'bpm', color: '#10b981', normalRange: '60–100' },
  { value: 'oxygen', label: 'SpO₂', unit: '%', color: '#8b5cf6', normalRange: '95–100' },
]

export default function HealthAnalytics() {
  const [activeType, setActiveType] = useState('weight')
  const [addModal, setAddModal] = useState(false)
  const { metrics, isLoading, add } = useHealthMetrics(activeType)
  const { register, handleSubmit, reset } = useForm()

  const currentMeta = METRIC_TYPES.find(m => m.value === activeType)

  const chartData = metrics.slice(-14).map(m => ({
    date: formatDate(m.recordedAt, 'dd MMM'),
    value: parseFloat(m.value),
  }))

  const onAdd = async (data) => {
    await add.mutateAsync({ ...data, type: activeType, unit: currentMeta.unit })
    reset()
    setAddModal(false)
  }

  const latest = metrics[metrics.length - 1]
  const prev = metrics[metrics.length - 2]
  const trend = latest && prev ? parseFloat(latest.value) - parseFloat(prev.value) : 0

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Health Analytics</h1>
          <p className="section-subtitle">Track your health metrics over time</p>
        </div>
        <Button onClick={() => setAddModal(true)}>
          <Plus className="w-4 h-4" /> Log Metric
        </Button>
      </div>

      {/* Type selector */}
      <div className="flex flex-wrap gap-2">
        {METRIC_TYPES.map(mt => (
          <button
            key={mt.value}
            onClick={() => setActiveType(mt.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${activeType === mt.value ? 'bg-primary-600 text-white border-primary-600' : 'bg-white border-surface-200 text-slate-600 hover:border-slate-300'}`}
          >
            {mt.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Latest', value: latest ? `${latest.value} ${currentMeta.unit}` : '—' },
          { label: 'Trend', value: latest && prev ? `${trend > 0 ? '+' : ''}${trend.toFixed(1)}` : '—', trend },
          { label: 'Normal Range', value: currentMeta.normalRange },
        ].map(s => (
          <div key={s.label} className="card p-4">
            <p className="text-xs text-slate-400 mb-1">{s.label}</p>
            <p className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
              {s.value}
              {s.trend !== undefined && s.trend !== 0 && (
                s.trend > 0 ? <TrendingUp className="w-4 h-4 text-red-400" /> : <TrendingDown className="w-4 h-4 text-emerald-400" />
              )}
            </p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">{currentMeta.label} — Last 14 entries</h3>
        {isLoading ? (
          <div className="skeleton h-56 rounded-xl" />
        ) : chartData.length < 2 ? (
          <div className="h-56 flex flex-col items-center justify-center text-slate-400">
            <Activity className="w-8 h-8 mb-2 text-slate-200" />
            <p className="text-sm">Log at least 2 entries to see trends</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
              <Line type="monotone" dataKey="value" stroke={currentMeta.color} strokeWidth={2} dot={{ r: 4, fill: currentMeta.color }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* History */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">History</h3>
        {metrics.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">No records yet. Start logging!</p>
        ) : (
          <div className="space-y-2">
            {[...metrics].reverse().slice(0, 10).map(m => (
              <div key={m._id} className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-surface-50 transition-colors">
                <span className="text-sm font-medium text-slate-900">{m.value} {m.unit}</span>
                <span className="text-xs text-slate-400">{formatDate(m.recordedAt, 'dd MMM yyyy, hh:mm a')}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title={`Log ${currentMeta.label}`} size="sm">
        <form onSubmit={handleSubmit(onAdd)} className="space-y-4">
          <Input label={`${currentMeta.label} (${currentMeta.unit})`} type="number" step="0.1" placeholder={`e.g. ${currentMeta.normalRange.split('–')[0]}`} {...register('value', { required: true })} />
          <Input label="Recorded At (optional)" type="datetime-local" {...register('recordedAt')} />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" type="button" onClick={() => setAddModal(false)}>Cancel</Button>
            <Button type="submit" loading={add.isPending}>Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}