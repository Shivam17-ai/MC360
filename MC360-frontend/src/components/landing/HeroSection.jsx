import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, Activity, HeartPulse, Stethoscope,
  Brain, Star, Users,
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

export default function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-mesh">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(42,133,255,0.08),transparent)]" />

      <div className="relative max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          <motion.div variants={fadeUp}>
            <span className="badge-blue px-3 py-1 text-xs font-semibold tracking-wide uppercase">
              AI-Powered Healthcare Platform
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight"
          >
            Your health,<br />
            <span className="text-gradient">fully connected</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-lg text-slate-500 leading-relaxed max-w-lg"
          >
            MC360 brings patients, doctors, and hospitals onto one intelligent
            platform — appointments, telemedicine, AI diagnostics, and
            real-time health tracking, all in one place.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
            <Link to="/register" className="btn-primary text-base px-6 py-3">
              Get started free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/login" className="btn-secondary text-base px-6 py-3">
              Sign in
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="flex items-center gap-6 pt-2"
          >
            {[
              { icon: Users, label: '50K+ patients' },
              { icon: Stethoscope, label: '2K+ doctors' },
              { icon: Star, label: '4.9 rating' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-slate-500">
                <Icon className="w-4 h-4 text-primary-500" />
                <span className="font-medium">{label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right — visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="hidden lg:block"
        >
          <HeroVisual />
        </motion.div>
      </div>
    </section>
  )
}

function HeroVisual() {
  return (
    <div className="relative h-[520px]">
      {/* Health overview card */}
      <div className="absolute top-8 right-0 w-80 card p-5 shadow-card-hover">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
            <HeartPulse className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Health Overview</p>
            <p className="text-xs text-slate-400">Updated just now</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Heart Rate', value: '72 bpm' },
            { label: 'Blood Pressure', value: '118/76' },
            { label: 'Glucose', value: '95 mg/dL' },
            { label: 'SpO₂', value: '98%' },
          ].map((m) => (
            <div key={m.label} className="bg-surface-50 rounded-xl p-3">
              <p className="text-xs text-slate-400 mb-1">{m.label}</p>
              <p className="text-sm font-semibold text-slate-900">{m.value}</p>
              <span className="badge-green mt-1 text-xs">Normal</span>
            </div>
          ))}
        </div>
      </div>

      {/* Appointment card */}
      <div className="absolute top-64 left-0 w-72 card p-4 shadow-card-hover">
        <p className="text-xs text-slate-400 mb-3 font-medium uppercase tracking-wide">
          Next Appointment
        </p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Dr. Priya Sharma</p>
            <p className="text-xs text-slate-400">Cardiologist · Today 3:00 PM</p>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <span className="badge-green">Confirmed</span>
          <span className="badge-blue">Video Call</span>
        </div>
      </div>

      {/* AI triage card */}
      <div className="absolute bottom-4 right-8 w-64 card p-4 shadow-card-hover">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-4 h-4 text-violet-500" />
          <p className="text-xs font-semibold text-slate-700">AI Triage</p>
        </div>
        <p className="text-xs text-slate-500">Based on your symptoms, risk level is</p>
        <p className="text-lg font-bold text-emerald-600 mt-1">Low Risk</p>
        <div className="mt-2 h-1.5 bg-surface-100 rounded-full overflow-hidden">
          <div className="h-full w-1/4 bg-emerald-400 rounded-full" />
        </div>
      </div>
    </div>
  )
}