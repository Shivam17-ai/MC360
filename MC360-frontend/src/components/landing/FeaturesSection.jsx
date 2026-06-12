import { motion } from 'framer-motion'
import {
  Calendar, Video, Brain, Pill, FileText,
  Activity, FlaskConical, Shield, Zap,
} from 'lucide-react'

const features = [
  {
    icon: Calendar,
    title: 'Smart Appointment Booking',
    desc: 'Book in-person or video appointments with real-time slot availability and instant confirmation.',
    color: 'text-primary-600',
    bg: 'bg-primary-50',
  },
  {
    icon: Video,
    title: 'Telemedicine',
    desc: 'HD video consultations with encrypted, HIPAA-compliant calls and integrated digital prescriptions.',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
  },
  {
    icon: Brain,
    title: 'AI Symptom Checker',
    desc: 'Describe your symptoms and get instant AI-powered triage and risk assessment.',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
  },
  {
    icon: Pill,
    title: 'Medicine Tracker',
    desc: 'Never miss a dose. Set reminders, track adherence, and check drug interactions automatically.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    icon: FileText,
    title: 'Digital Reports',
    desc: 'Upload, store, and share medical reports securely. AI summarizes complex lab results instantly.',
    color: 'text-teal-600',
    bg: 'bg-teal-50',
  },
  {
    icon: Activity,
    title: 'Health Analytics',
    desc: 'Track blood pressure, glucose, weight, and more with trend charts and intelligent alerts.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: FlaskConical,
    title: 'Lab Test Booking',
    desc: 'Book diagnostic tests at partner labs with home sample collection options.',
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
  },
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    desc: 'End-to-end encryption, role-based access, and full audit trails protect every record.',
    color: 'text-slate-600',
    bg: 'bg-slate-100',
  },
  {
    icon: Zap,
    title: 'Real-Time Alerts',
    desc: 'Instant emergency alerts, queue updates, and critical health notifications via push and WhatsApp.',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-surface-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="badge-blue mb-4 inline-block">Features</span>
          <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
            Everything healthcare needs
          </h2>
          <p className="mt-4 text-slate-500 leading-relaxed">
            Built for patients who want control, doctors who want efficiency,
            and hospitals that need real-time insights.
          </p>
        </div>

        {/* Grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              className="card-hover p-6 flex gap-4"
            >
              <div className={`w-11 h-11 ${f.bg} rounded-xl flex items-center justify-center shrink-0`}>
                <f.icon className={`w-5 h-5 ${f.color}`} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 mb-1">
                  {f.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}