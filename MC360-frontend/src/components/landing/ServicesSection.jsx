const services = [
  { emoji: '🏥', title: 'For Hospitals', items: ['Manage doctors & staff', 'Patient queue system', 'Emergency monitoring', 'Analytics dashboard'] },
  { emoji: '👨‍⚕️', title: 'For Doctors', items: ['View appointments', 'Write prescriptions', 'Video consultations', 'Patient records'] },
  { emoji: '🧑‍💼', title: 'For Patients', items: ['Book appointments', 'Track medicines', 'View health reports', 'Diet planning'] },
]

export default function ServicesSection() {
  return (
    <section className="section-padding bg-surface-muted">
      <div className="page-container">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-4xl font-display font-bold text-slate-800">Built for everyone</h2>
          <p className="text-slate-500 mt-3">Tailored experiences for each role in the healthcare ecosystem.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {services.map(({ emoji, title, items }) => (
            <div key={title} className="card space-y-4">
              <div className="text-4xl">{emoji}</div>
              <h3 className="font-display font-bold text-xl text-slate-800">{title}</h3>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}