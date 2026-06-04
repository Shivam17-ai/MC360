import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Clock, Heart } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center gradient-health overflow-hidden">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative page-container py-24 text-white">
        <div className="max-w-3xl space-y-6">
          <span className="badge bg-white/20 text-white text-sm px-4 py-1.5">🏥 Your Complete Healthcare Companion</span>
          <h1 className="text-5xl sm:text-6xl font-display font-bold leading-tight text-balance">
            Healthcare at Your <span className="text-primary-300">Fingertips</span>
          </h1>
          <p className="text-lg text-white/80 max-w-xl">
            Book appointments, consult doctors online, track medicines, analyze health data — all in one platform.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link to="/register" className="btn bg-white text-primary-700 hover:bg-primary-50 shadow-float">
              Get Started Free <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="btn bg-white/10 text-white border border-white/20 hover:bg-white/20">
              Sign In
            </Link>
          </div>
          <div className="flex flex-wrap gap-6 pt-4">
            {[
              { icon: Shield, label: 'HIPAA Compliant' },
              { icon: Clock, label: '24/7 Support' },
              { icon: Heart, label: 'AI-Powered Care' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-white/80 text-sm">
                <Icon size={16} /> {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}