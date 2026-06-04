import { Calendar, Video, Brain, Pill, BarChart2, FileText } from 'lucide-react'

const features = [
  { icon: Calendar, title: 'Smart Appointments', desc: 'Book doctor appointments instantly with real-time slot availability.' },
  { icon: Video, title: 'Telemedicine', desc: 'Consult doctors via HD video calls from the comfort of your home.' },
  { icon: Brain, title: 'AI Symptom Checker', desc: 'Get instant AI-powered triage and risk prediction for your symptoms.' },
  { icon: Pill, title: 'Medicine Tracker', desc: 'Track medications, set reminders, and check drug interactions.' },
  { icon: BarChart2, title: 'Health Analytics', desc: 'Visualize your health trends with detailed charts and insights.' },
  { icon: FileText, title: 'Report Summarizer', desc: 'Upload reports and get AI-generated easy-to-understand summaries.' },
]

export default function FeaturesSection() {
  return (
    <section className="section-padding bg-white">
      <div className="page-container">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-4xl font-display font-bold text-slate-800">Everything you need</h2>
          <p className="text-slate-500 mt-3">One platform, complete healthcare management for patients, doctors, and hospitals.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card-hover group">
              <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                <Icon size={22} className="text-primary-600" />
              </div>
              <h3 className="font-display font-semibold text-slate-800 mb-2">{title}</h3>
              <p className="text-sm text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}