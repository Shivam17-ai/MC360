import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

const perks = [
  'Free for individual patients',
  'No credit card required',
  'Set up in under 5 minutes',
  'Cancel anytime',
]

export default function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary-600 via-primary-700 to-teal-600 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-300 rounded-full translate-y-1/2 blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="space-y-6"
        >
          <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
            Get Started Today
          </span>

          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            Ready to take control<br />of your health?
          </h2>

          <p className="text-primary-100 text-lg max-w-xl mx-auto leading-relaxed">
            Join over 50,000 patients and 2,400 doctors already using MC360
            to make healthcare simpler, smarter, and more connected.
          </p>

          {/* Perks */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {perks.map((p) => (
              <span key={p} className="flex items-center gap-1.5 text-sm text-primary-100">
                <CheckCircle2 className="w-4 h-4 text-teal-300 shrink-0" />
                {p}
              </span>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-7 py-3.5 rounded-xl hover:bg-primary-50 transition-colors shadow-lg"
            >
              Create free account
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 border border-white/30 text-white px-7 py-3.5 rounded-xl hover:bg-white/10 transition-colors font-medium"
            >
              Sign in
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}