import { motion } from 'framer-motion'
import { Users, Stethoscope, Building2, TrendingUp } from 'lucide-react'

const stats = [
  {
    icon: Users,
    value: '50,000+',
    label: 'Active Patients',
    sub: 'across India',
    bg: 'bg-primary-50',
    color: 'text-primary-600',
  },
  {
    icon: Stethoscope,
    value: '2,400+',
    label: 'Verified Doctors',
    sub: '32 specializations',
    bg: 'bg-teal-50',
    color: 'text-teal-600',
  },
  {
    icon: Building2,
    value: '180+',
    label: 'Partner Hospitals',
    sub: '12 cities',
    bg: 'bg-violet-50',
    color: 'text-violet-600',
  },
  {
    icon: TrendingUp,
    value: '99.9%',
    label: 'Platform Uptime',
    sub: 'enterprise SLA',
    bg: 'bg-emerald-50',
    color: 'text-emerald-600',
  },
]

export default function StatsSection() {
  return (
    <section className="border-y border-surface-200 bg-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.45 }}
              className="flex flex-col items-center text-center gap-3"
            >
              <div className={`w-12 h-12 ${s.bg} rounded-2xl flex items-center justify-center`}>
                <s.icon className={`w-6 h-6 ${s.color}`} />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 tracking-tight">
                  {s.value}
                </p>
                <p className="text-sm font-medium text-slate-700 mt-0.5">{s.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{s.sub}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}