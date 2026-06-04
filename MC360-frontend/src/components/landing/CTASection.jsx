import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="section-padding gradient-health">
      <div className="page-container text-center text-white space-y-6">
        <h2 className="text-4xl font-display font-bold">Ready to take control of your health?</h2>
        <p className="text-white/75 max-w-xl mx-auto">
          Join thousands of patients, doctors, and hospitals already using MC360 to deliver better healthcare.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/register" className="btn bg-white text-primary-700 hover:bg-primary-50 shadow-float">
            Get Started Free <ArrowRight size={16} />
          </Link>
          <Link to="/login" className="btn bg-white/10 text-white border border-white/20 hover:bg-white/20">
            Sign In
          </Link>
        </div>
      </div>
    </section>
  )
}