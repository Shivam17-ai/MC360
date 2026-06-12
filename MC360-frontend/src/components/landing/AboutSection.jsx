import { motion } from 'framer-motion'
import { ShieldCheck, Zap, HeartHandshake, Globe } from 'lucide-react'

const values = [
  {
    icon: ShieldCheck,
    title: 'Privacy First',
    desc: 'Every record is encrypted end-to-end. We follow HIPAA-aligned practices and never sell your data.',
    bg: 'bg-primary-50',
    color: 'text-primary-600',
  },
  {
    icon: Zap,
    title: 'Built for Speed',
    desc: 'From booking to consultation in minutes. No queues, no paperwork, no friction.',
    bg: 'bg-amber-50',
    color: 'text-amber-600',
  },
  {
    icon: HeartHandshake,
    title: 'Patient-Centered',
    desc: 'Every feature is designed around the patient experience, not institutional convenience.',
    bg: 'bg-rose-50',
    color: 'text-rose-600',
  },
  {
    icon: Globe,
    title: 'Always Accessible',
    desc: 'Available on web and mobile, 24/7. Your health data is always a tap away.',
    bg: 'bg-emerald-50',
    color: 'text-emerald-600',
  },
]

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="space-y-6"
          >
            <span className="badge-blue inline-block">About MC360</span>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight leading-tight">
              Healthcare that works<br />
              <span className="text-gradient">for everyone</span>
            </h2>
            <p className="text-slate-500 leading-relaxed">
              MC360 was built out of frustration with fragmented healthcare — 
              paper records, missed appointments, no visibility into your own 
              health data. We set out to build one platform that connects every 
              stakeholder and makes quality care accessible anywhere.
            </p>
            <p className="text-slate-500 leading-relaxed">
              Today, over 50,000 patients and 2,400 doctors across 180+ hospitals 
              use MC360 to deliver and receive better healthcare. Our AI-first 
              approach means the platform gets smarter for every user, every day.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              {[
                { value: '50K+', label: 'Active Patients' },
                { value: '2,400+', label: 'Verified Doctors' },
                { value: '180+', label: 'Partner Hospitals' },
                { value: '99.9%', label: 'Platform Uptime' },
              ].map(({ value, label }) => (
                <div key={label} className="bg-surface-50 rounded-xl p-4">
                  <p className="text-2xl font-bold text-slate-900">{value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Values grid */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="grid grid-cols-2 gap-4"
          >
            {values.map((v) => (
              <div key={v.title} className="card p-5 space-y-3">
                <div className={`w-11 h-11 ${v.bg} rounded-xl flex items-center justify-center`}>
                  <v.icon className={`w-5 h-5 ${v.color}`} />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">{v.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}