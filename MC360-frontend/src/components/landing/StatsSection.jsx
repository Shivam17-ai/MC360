const stats = [
  { value: '50K+', label: 'Patients Served' },
  { value: '1,200+', label: 'Doctors Onboard' },
  { value: '300+', label: 'Hospitals' },
  { value: '99.9%', label: 'Uptime' },
]

export default function StatsSection() {
  return (
    <section className="section-padding gradient-primary">
      <div className="page-container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center">
          {stats.map(({ value, label }) => (
            <div key={label}>
              <p className="text-4xl font-display font-bold">{value}</p>
              <p className="text-white/70 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}