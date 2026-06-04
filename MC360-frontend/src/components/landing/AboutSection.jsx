import { CheckCircle } from 'lucide-react'

const points = [
  'Founded by healthcare professionals and engineers',
  'AI-powered diagnostics and triage system',
  'End-to-end encrypted patient data',
  'Available on web and mobile',
]

export default function AboutSection() {
  return (
    <section className="section-padding bg-surface-muted">
      <div className="page-container">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <h2 className="text-4xl font-display font-bold text-slate-800">About MC360</h2>
            <p className="text-slate-500 leading-relaxed">
              MC360 is a next-generation healthcare platform designed to bridge the gap between patients, doctors, and hospitals. We leverage AI and modern technology to make quality healthcare accessible to everyone.
            </p>
            <ul className="space-y-3">
              {points.map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm text-slate-700">
                  <CheckCircle size={18} className="text-accent-500 shrink-0 mt-0.5" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Years of Experience', value: '5+' },
              { label: 'Cities Covered', value: '80+' },
              { label: 'Daily Consultations', value: '10K+' },
              { label: 'Patient Satisfaction', value: '98%' },
            ].map(({ label, value }) => (
              <div key={label} className="card text-center">
                <p className="text-3xl font-display font-bold text-primary-600">{value}</p>
                <p className="text-xs text-slate-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}