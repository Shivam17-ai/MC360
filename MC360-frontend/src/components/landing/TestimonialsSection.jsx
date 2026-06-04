const testimonials = [
  { name: 'Priya Sharma', role: 'Patient', text: 'MC360 made booking appointments so easy. The AI symptom checker is incredibly accurate!' },
  { name: 'Dr. Rahul Mehta', role: 'Cardiologist', text: 'Managing my appointments and prescriptions has never been smoother. Highly recommend.' },
  { name: 'Apollo Hospital', role: 'Hospital Admin', text: 'The analytics dashboard gives us real-time insights that have improved our operations significantly.' },
]

export default function TestimonialsSection() {
  return (
    <section className="section-padding bg-white">
      <div className="page-container">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-4xl font-display font-bold text-slate-800">Trusted by thousands</h2>
          <p className="text-slate-500 mt-3">Here's what our users have to say about MC360.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map(({ name, role, text }) => (
            <div key={name} className="card space-y-4">
              <p className="text-slate-600 text-sm leading-relaxed">"{text}"</p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-sm">
                  {name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{name}</p>
                  <p className="text-xs text-slate-400">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}