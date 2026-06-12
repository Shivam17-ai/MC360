import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Rahul Mehta',
    role: 'Patient, Mumbai',
    text: "MC360 completely changed how I manage my diabetes. The glucose tracking and medication reminders have been a lifesaver. I haven't missed a single dose in 3 months.",
  },
  {
    name: 'Dr. Priya Sharma',
    role: 'Cardiologist, AIIMS Delhi',
    text: "My practice has become so much more efficient. I can see patient history before consultations and write digital prescriptions instantly. My patients love the video call feature.",
  },
  {
    name: 'Apollo MedCenter',
    role: 'Hospital Administrator',
    text: "The analytics dashboard gives us real-time visibility into patient flow and doctor utilization. We've cut wait times by 40% since implementing MC360.",
  },
  {
    name: 'Sunita Agarwal',
    role: 'Patient, Bangalore',
    text: "Booking an appointment used to take days. Now I find a doctor, check slots, and confirm in under 2 minutes. The symptom checker helped me catch a vitamin deficiency early.",
  },
  {
    name: 'Dr. Arun Kapoor',
    role: 'General Physician, Pune',
    text: "The prescription module and patient record access save me at least an hour every day. I can focus entirely on the consultation instead of paperwork.",
  },
  {
    name: 'City Care Hospital',
    role: 'Operations Head, Chennai',
    text: "Emergency monitoring and real-time queue management have transformed our OPD. Staff response time improved by 60% in the first month alone.",
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
}

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-surface-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="badge-yellow mb-4 inline-block">Testimonials</span>
          <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
            Trusted by thousands
          </h2>
          <p className="mt-4 text-slate-500">
            Hear from patients, doctors, and hospital teams using MC360 every day.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              variants={fadeUp}
              transition={{ delay: i * 0.07 }}
              className="card p-6 flex flex-col gap-4"
            >
              {/* Stars */}
              <div className="flex">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-slate-600 leading-relaxed flex-1">
                "{t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t border-surface-100">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-teal-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {t.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}