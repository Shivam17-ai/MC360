import { useState } from 'react'
import { useHealthMetrics } from '../../hooks/useHealthMetrics'
import {
  Activity, Plus, TrendingUp, TrendingDown, Heart, Droplets,
  Wind, Thermometer, Weight, Zap,
} from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import { formatDate } from '../../utils/formatDate'
import { useForm } from 'react-hook-form'

// Types must match the backend HealthMetric.model.js enum exactly
const METRIC_TYPES = [
  { value: 'weight',            label: 'Weight',         unit: 'kg',    color: '#2a85ff', normalRange: '50–90',          Icon: Weight },
  { value: 'blood_pressure',    label: 'Blood Pressure', unit: 'mmHg',  color: '#ef4444', normalRange: '90/60 – 120/80', Icon: Heart },
  { value: 'blood_glucose',     label: 'Glucose',        unit: 'mg/dL', color: '#f59e0b', normalRange: '70–99 (fasting)', Icon: Droplets },
  { value: 'heart_rate',        label: 'Heart Rate',     unit: 'bpm',   color: '#10b981', normalRange: '60–100',          Icon: Zap },
  { value: 'oxygen_saturation', label: 'SpO₂',           unit: '%',     color: '#8b5cf6', normalRange: '95–100',          Icon: Wind },
  { value: 'temperature',       label: 'Temperature',    unit: '°C',    color: '#f97316', normalRange: '36.1–37.2',       Icon: Thermometer },
]

// Unified vitals form fields — all optional, only submitted when filled
const VITALS_FIELDS = [
  {
    key: 'weight',
    label: 'Weight',
    unit: 'kg',
    placeholder: 'e.g. 70',
    type: 'weight',
  },
  {
    key: 'bp_systolic',
    label: 'Blood Pressure — Systolic',
    unit: 'mmHg',
    placeholder: 'e.g. 120',
    type: 'blood_pressure',
    bpPart: 'systolic',
  },
  {
    key: 'bp_diastolic',
    label: 'Blood Pressure — Diastolic',
    unit: 'mmHg',
    placeholder: 'e.g. 80',
    type: 'blood_pressure',
    bpPart: 'diastolic',
  },
  {
    key: 'blood_glucose',
    label: 'Blood Glucose',
    unit: 'mg/dL',
    placeholder: 'e.g. 90',
    type: 'blood_glucose',
  },
  {
    key: 'heart_rate',
    label: 'Heart Rate',
    unit: 'bpm',
    placeholder: 'e.g. 72',
    type: 'heart_rate',
  },
  {
    key: 'oxygen_saturation',
    label: 'SpO₂',
    unit: '%',
    placeholder: 'e.g. 98',
    type: 'oxygen_saturation',
  },
  {
    key: 'temperature',
    label: 'Temperature',
    unit: '°C',
    placeholder: 'e.g. 36.6',
    type: 'temperature',
  },
]

export default function HealthAnalytics() {
  const [activeType, setActiveType] = useState('weight')
  const [addModal, setAddModal] = useState(false)
  const { metrics, isLoading, addBulk } = useHealthMetrics(activeType)
  const { register, handleSubmit, reset } = useForm()

  const currentMeta = METRIC_TYPES.find(m => m.value === activeType)

  // For BP, value is stored as { systolic, diastolic } — display as "120/80"
  const displayValue = (m) => {
    if (m.type === 'blood_pressure' && m.value?.systolic) {
      return `${m.value.systolic}/${m.value.diastolic} ${m.unit}`
    }
    return `${m.value} ${m.unit}`
  }

  const chartData = metrics.slice(-14).map(m => ({
    date: formatDate(m.recordedAt, 'dd MMM'),
    value: m.type === 'blood_pressure' ? m.value?.systolic : parseFloat(m.value),
  }))

  const onLogVitals = async (data) => {
    const metrics = []

    // Group BP fields into a single metric with value: { systolic, diastolic }
    const systolic = data.bp_systolic ? parseFloat(data.bp_systolic) : null
    const diastolic = data.bp_diastolic ? parseFloat(data.bp_diastolic) : null
    if (systolic && diastolic) {
      metrics.push({ type: 'blood_pressure', value: { systolic, diastolic }, unit: 'mmHg' })
    }

    // All other scalar fields
    const scalarFields = ['weight', 'blood_glucose', 'heart_rate', 'oxygen_saturation', 'temperature']
    for (const field of scalarFields) {
      const raw = data[field]
      if (raw !== undefined && raw !== '') {
        const meta = VITALS_FIELDS.find(f => f.key === field)
        metrics.push({ type: field, value: parseFloat(raw), unit: meta?.unit })
      }
    }

    if (metrics.length === 0) return

    await addBulk.mutateAsync({ metrics, recordedAt: data.recordedAt || undefined })
    reset()
    setAddModal(false)
  }

  const latest = metrics[metrics.length - 1]
  const prev   = metrics[metrics.length - 2]
  const latestNum = latest ? (latest.type === 'blood_pressure' ? latest.value?.systolic : parseFloat(latest.value)) : null
  const prevNum   = prev   ? (prev.type   === 'blood_pressure' ? prev.value?.systolic   : parseFloat(prev.value))   : null
  const trend = latestNum !== null && prevNum !== null ? latestNum - prevNum : 0

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Health Analytics</h1>
          <p className="section-subtitle">Track your health metrics over time</p>
        </div>
        <Button onClick={() => setAddModal(true)}>
          <Plus className="w-4 h-4" /> Log Vitals
        </Button>
      </div>

      {/* Metric type selector */}
      <div className="flex flex-wrap gap-2">
        {METRIC_TYPES.map(mt => {
          const Icon = mt.Icon
          return (
            <button
              key={mt.value}
              onClick={() => setActiveType(mt.value)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                activeType === mt.value
                  ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                  : 'bg-white border-surface-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {mt.label}
            </button>
          )
        })}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Latest', value: latest ? displayValue(latest) : '—' },
          {
            label: 'Trend',
            value: latestNum !== null && prevNum !== null ? `${trend > 0 ? '+' : ''}${trend.toFixed(1)}` : '—',
            trend,
          },
          { label: 'Normal Range', value: currentMeta.normalRange },
        ].map(s => (
          <div key={s.label} className="card p-4">
            <p className="text-xs text-slate-400 mb-1">{s.label}</p>
            <p className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
              {s.value}
              {s.trend !== undefined && s.trend !== 0 && (
                s.trend > 0
                  ? <TrendingUp className="w-4 h-4 text-red-400" />
                  : <TrendingDown className="w-4 h-4 text-emerald-400" />
              )}
            </p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">
          {currentMeta.label} — Last 14 entries
          {currentMeta.value === 'blood_pressure' && (
            <span className="ml-2 text-xs font-normal text-slate-400">(systolic shown)</span>
          )}
        </h3>
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
              <Line
                type="monotone"
                dataKey="value"
                stroke={currentMeta.color}
                strokeWidth={2}
                dot={{ r: 4, fill: currentMeta.color }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* History */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">History — {currentMeta.label}</h3>
        {metrics.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">No records yet. Click "Log Vitals" to start!</p>
        ) : (
          <div className="space-y-2">
            {[...metrics].reverse().slice(0, 10).map(m => (
              <div key={m._id} className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-surface-50 transition-colors">
                <span className="text-sm font-medium text-slate-900">{displayValue(m)}</span>
                <span className="text-xs text-slate-400">{formatDate(m.recordedAt, 'dd MMM yyyy, hh:mm a')}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Unified Log Vitals Modal ── */}
      <Modal isOpen={addModal} onClose={() => { setAddModal(false); reset() }} title="Log Vitals" size="md">
        <form onSubmit={handleSubmit(onLogVitals)} className="space-y-5">
          <p className="text-sm text-slate-500">
            Fill in any readings you have right now — leave others blank. Only filled fields will be saved.
          </p>

          {/* Timestamp */}
          <div>
            <label className="label-base">Recorded At <span className="text-slate-400 font-normal">(optional — defaults to now)</span></label>
            <input type="datetime-local" className="input-base" {...register('recordedAt')} />
          </div>

          <div className="border-t border-surface-100 pt-4 space-y-4">

            {/* Weight */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-base flex items-center gap-1.5">
                  <Weight className="w-3.5 h-3.5 text-blue-500" /> Weight (kg)
                </label>
                <input type="number" step="0.1" className="input-base" placeholder="e.g. 70" {...register('weight')} />
              </div>
              <div>
                <label className="label-base flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-orange-500" /> Temperature (°C)
                </label>
                <input type="number" step="0.1" className="input-base" placeholder="e.g. 36.6" {...register('temperature')} />
              </div>
            </div>

            {/* Blood Pressure */}
            <div>
              <label className="label-base flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-red-500" /> Blood Pressure (mmHg)
              </label>
              <div className="grid grid-cols-2 gap-3 mt-1">
                <input type="number" className="input-base" placeholder="Systolic (e.g. 120)" {...register('bp_systolic')} />
                <input type="number" className="input-base" placeholder="Diastolic (e.g. 80)" {...register('bp_diastolic')} />
              </div>
              <p className="text-xs text-slate-400 mt-1">Both systolic and diastolic must be filled to save BP.</p>
            </div>

            {/* Glucose + Heart Rate + SpO2 */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="label-base flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-amber-500" /> Glucose (mg/dL)
                </label>
                <input type="number" step="0.1" className="input-base" placeholder="e.g. 90" {...register('blood_glucose')} />
              </div>
              <div>
                <label className="label-base flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-500" /> Heart Rate (bpm)
                </label>
                <input type="number" className="input-base" placeholder="e.g. 72" {...register('heart_rate')} />
              </div>
              <div>
                <label className="label-base flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-violet-500" /> SpO₂ (%)
                </label>
                <input type="number" step="0.1" className="input-base" placeholder="e.g. 98" {...register('oxygen_saturation')} />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => { setAddModal(false); reset() }}>Cancel</Button>
            <Button type="submit" loading={addBulk.isPending}>Save Vitals</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}