import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HeartPulse, Stethoscope, Activity, CheckCircle2, ArrowRight } from 'lucide-react'

const roles = [
  {
    role: 'Patients',
    icon: HeartPulse,
    bg: 'bg-rose-50',
    color: 'text-rose-600',
    border: 'hover:border-rose-200',
    desc: 'Take charge of your health journey with all your records, appointments, and insights in one place.',
    points: [
      'Book appointments instantly',
      'Video consult from anywhere',
      'Track medications & adherence',
      'AI-powered health insights',
      'Store & manage medical reports',
    ],
  },
  {
    role: 'Doctors',
    icon: Stethoscope,
    bg: 'bg-primary-50',
    color: 'text-primary-600',
    border: 'hover:border-primary-200',
    desc: 'Streamline your practice with smart scheduling, digital prescriptions, and patient management.',
    points: [
      'Manage appointments efficiently',
      'Write digital prescriptions',
      'View complete patient history',
      'Video consultations',
      'Real-time queue management',
    ],
  },
  {
    role: 'Hospitals',
    icon: Activity,
    bg: 'bg-emerald-50',
    color: 'text-emerald-600',
    border: 'hover:border-emerald-200',
    desc: 'Get complete visibility of your operations, staff, and patient flow with powerful analytics.',
    points: [
      'Doctor & staff management',
      'Patient flow analytics',
      'Emergency monitoring',
      'Queue & bed management',
      'Revenue & performance reports',
    ],
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="badge-blue mb-4 inline-block">Services</span>
          <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
            For every role in healthcare
          </h2>
          <p className="mt-4 text-slate-500 max-w-xl mx-auto">
            Whether you're a patient, a practitioner, or an administrator —
            MC360 has a dedicated experience built for you.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid md:grid-cols-3 gap-6"
        >
          {roles.map((r, i) => (
            <motion.div
              key={r.role}
              variants={fadeUp}
              transition={{ delay: i * 0.1 }}
              className={`card p-7 flex flex-col gap-4 border hover:shadow-card-hover transition-all duration-200 ${r.border}`}
            >
              <div className={`w-12 h-12 ${r.bg} rounded-2xl flex items-center justify-center`}>
                <r.icon className={`w-6 h-6 ${r.color}`} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{r.role}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{r.desc}</p>
              </div>

              <ul className="space-y-2 mt-auto pt-2">
                {r.points.map((pt) => (
                  <li
                    key={pt}
                    className="flex items-center gap-2 text-sm text-slate-600"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    {pt}
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className="btn-secondary text-sm justify-center mt-2"
              >
                Get started <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}