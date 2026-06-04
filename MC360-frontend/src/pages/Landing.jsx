import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// ─── DATA ───────────────────────────────────────────────────────────────────

const stats = [
  { value: "50,000+", label: "Patients Served" },
  { value: "1,200+", label: "Verified Doctors" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "24/7", label: "AI Support" },
];

const features = [
  {
    icon: "🤖",
    title: "AI Symptom Checker",
    desc: "Describe your symptoms and get instant AI-powered triage with specialist recommendations.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: "🎥",
    title: "Telemedicine",
    desc: "HD video consultations with verified doctors from the comfort of your home.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: "📅",
    title: "Smart Appointment Booking",
    desc: "Real-time slot availability, instant confirmation, and automated reminders.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: "💊",
    title: "Medicine Tracker",
    desc: "Never miss a dose. Track adherence with WhatsApp reminders and OCR prescription scanning.",
    color: "bg-orange-50 text-orange-600",
  },
  {
    icon: "📊",
    title: "Health Analytics",
    desc: "Visualize your BP, glucose, weight trends with AI insights and risk predictions.",
    color: "bg-red-50 text-red-600",
  },
  {
    icon: "🔬",
    title: "AI Report Summarizer",
    desc: "Upload lab reports and get instant plain-English summaries with key findings.",
    color: "bg-teal-50 text-teal-600",
  },
  {
    icon: "🚨",
    title: "Emergency Alerts",
    desc: "Critical triage triggers instant alerts to doctors and emergency contacts.",
    color: "bg-pink-50 text-pink-600",
  },
  {
    icon: "🥗",
    title: "AI Diet Planner",
    desc: "Personalized diet plans based on your health conditions, BMI, and goals.",
    color: "bg-lime-50 text-lime-600",
  },
];

const howItWorks = [
  { step: "01", title: "Create Your Account", desc: "Sign up as a patient, doctor, or hospital admin in under 2 minutes.", icon: "👤" },
  { step: "02", title: "Check Your Symptoms", desc: "Use our AI symptom checker to get triage level and specialist suggestion.", icon: "🤖" },
  { step: "03", title: "Book Appointment", desc: "Choose a verified doctor, pick a slot, and confirm instantly.", icon: "📅" },
  { step: "04", title: "Consult & Recover", desc: "Meet in person or via HD video. Get prescriptions digitally.", icon: "💊" },
];

const specializations = [
  { name: "Cardiology", icon: "❤️" },
  { name: "Neurology", icon: "🧠" },
  { name: "Orthopedics", icon: "🦴" },
  { name: "Pediatrics", icon: "👶" },
  { name: "Dermatology", icon: "🩹" },
  { name: "Oncology", icon: "🔬" },
  { name: "Psychiatry", icon: "🧘" },
  { name: "Gynecology", icon: "🌸" },
  { name: "Ophthalmology", icon: "👁️" },
  { name: "ENT", icon: "👂" },
  { name: "General Medicine", icon: "🩺" },
  { name: "Endocrinology", icon: "⚗️" },
];

const testimonials = [
  {
    name: "Aarav Sharma",
    role: "Patient",
    avatar: "AS",
    rating: 5,
    text: "The AI symptom checker detected my condition was serious before I even saw a doctor. The telemedicine feature saved me hours of travel.",
  },
  {
    name: "Dr. Priya Mehta",
    role: "Cardiologist",
    avatar: "PM",
    rating: 5,
    text: "MedConnect360 has transformed how I manage appointments. The dashboard is intuitive and patient records are all in one place.",
  },
  {
    name: "Sneha Kapoor",
    role: "Patient",
    avatar: "SK",
    rating: 5,
    text: "The medicine tracker with WhatsApp reminders is a lifesaver. My adherence rate went from 60% to 98% in just one month.",
  },
  {
    name: "Rohan Das",
    role: "Hospital Admin",
    avatar: "RD",
    rating: 5,
    text: "Managing 50+ doctors and thousands of patient records is now seamless. The analytics dashboard gives incredible insights.",
  },
];

const faqs = [
  { q: "Is MedConnect360 free to use?", a: "Basic features including symptom checker and appointment booking are free. Premium AI features require a subscription." },
  { q: "Are the doctors verified?", a: "Yes. All doctors go through a rigorous verification process including license number validation before being listed." },
  { q: "Is my health data secure?", a: "Absolutely. We use end-to-end encryption, Firebase Auth, and comply with HIPAA-equivalent standards." },
  { q: "Can I get prescriptions digitally?", a: "Yes. Doctors can issue digital e-prescriptions directly through the platform after consultation." },
  { q: "Does the medicine tracker work for all medicines?", a: "Yes. You can add medicines manually or scan your prescription using our OCR feature to auto-populate your tracker." },
];

// ─── SUB COMPONENTS ──────────────────────────────────────────────────────────

const StarRating = ({ count = 5 }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: count }).map((_, i) => (
      <span key={i} className="text-yellow-400 text-sm">★</span>
    ))}
  </div>
);

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition"
      >
        <span className="font-semibold text-gray-800 text-sm">{q}</span>
        <span className={`text-gray-400 text-lg transition-transform duration-200 ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      {open && (
        <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
          {a}
        </div>
      )}
    </div>
  );
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

const Landing = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [symptomInput, setSymptomInput] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">

      {/* ── NAVBAR ─────────────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${scrolled ? "bg-white shadow-md" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-base">M</div>
            <span className="text-lg font-black text-blue-700">
              MedConnect<span className="text-gray-800">360</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-600">
            {["Features", "How It Works", "Specializations", "Testimonials", "FAQ"].map((l) => (
              <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`}
                className="hover:text-blue-600 transition">{l}</a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition">Sign In</Link>
            <Link to="/register" className="text-sm font-bold bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-sm">
              Get Started Free
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3 text-sm font-medium text-gray-700 shadow-lg">
            {["Features", "How It Works", "Specializations", "Testimonials", "FAQ"].map((l) => (
              <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`}
                onClick={() => setMenuOpen(false)} className="block hover:text-blue-600">{l}</a>
            ))}
            <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-blue-600 font-semibold">Sign In</Link>
            <Link to="/register" onClick={() => setMenuOpen(false)}
              className="block bg-blue-600 text-white text-center py-2.5 rounded-xl font-bold">Get Started Free</Link>
          </div>
        )}
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden
        bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20">

        {/* Background blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-bold px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              AI-Powered Smart Healthcare Platform
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-gray-900">
              Your Health,<br />
              <span className="text-blue-600">Smarter</span> &<br />
              <span className="text-indigo-600">Connected</span>
            </h1>

            <p className="text-gray-600 text-lg leading-relaxed max-w-lg">
              MedConnect360 connects patients, doctors, and hospitals with AI-driven tools —
              from symptom checking to telemedicine, medicine tracking to health analytics.
            </p>

            {/* Symptom Quick Check */}
            <div className="bg-white rounded-2xl shadow-lg p-4 flex gap-3 max-w-lg border border-gray-100">
              <input
                type="text"
                placeholder="Describe your symptoms..."
                value={symptomInput}
                onChange={(e) => setSymptomInput(e.target.value)}
                className="flex-1 text-sm focus:outline-none text-gray-700 placeholder-gray-400"
              />
              <Link
                to="/patient/symptom-checker"
                className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition whitespace-nowrap"
              >
                Check Now 🤖
              </Link>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to="/register"
                className="bg-blue-600 text-white px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition shadow-md">
                Get Started Free →
              </Link>
              <Link to="/doctors"
                className="border-2 border-gray-200 text-gray-700 px-7 py-3.5 rounded-xl font-bold text-sm hover:border-blue-400 hover:text-blue-600 transition">
                Find Doctors
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">✅ HIPAA Compliant</span>
              <span className="flex items-center gap-1">🔒 End-to-End Encrypted</span>
              <span className="flex items-center gap-1">⭐ 4.9/5 Rating</span>
            </div>
          </div>

          {/* Right — Floating Cards */}
          <div className="relative hidden lg:flex items-center justify-center h-[480px]">
            {/* Main Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 w-72 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl">👨‍⚕️</div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">Dr. Priya Sharma</p>
                  <p className="text-xs text-blue-600">Cardiologist • ⭐ 4.9</p>
                </div>
              </div>
              <div className="bg-green-50 rounded-xl p-3 text-xs text-green-700 font-semibold mb-3">
                ✅ Available Today — Next slot: 10:30 AM
              </div>
              <button className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition">
                Book Appointment
              </button>
            </div>

            {/* Floating AI Card */}
            <div className="absolute top-6 right-0 bg-white rounded-2xl shadow-lg p-4 w-52 border border-gray-100">
              <p className="text-xs font-bold text-gray-700 mb-1">🤖 AI Triage Result</p>
              <p className="text-xs text-gray-500 mb-2">Symptoms: Chest pain, dizziness</p>
              <span className="text-xs bg-orange-100 text-orange-700 font-bold px-2 py-1 rounded-full">
                ⚠️ High Priority
              </span>
              <p className="text-xs text-gray-500 mt-1">→ See Cardiologist today</p>
            </div>

            {/* Floating Metric Card */}
            <div className="absolute bottom-10 right-4 bg-white rounded-2xl shadow-lg p-4 w-48 border border-gray-100">
              <p className="text-xs font-bold text-gray-700 mb-2">📊 Health Metrics</p>
              <div className="space-y-1.5">
                {[
                  { label: "BP", value: "118/78", color: "bg-green-500", width: "w-4/5" },
                  { label: "Glucose", value: "95 mg/dL", color: "bg-blue-500", width: "w-3/4" },
                  { label: "BMI", value: "22.4", color: "bg-purple-500", width: "w-2/3" },
                ].map((m) => (
                  <div key={m.label}>
                    <div className="flex justify-between text-xs text-gray-500 mb-0.5">
                      <span>{m.label}</span><span className="font-semibold text-gray-700">{m.value}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full">
                      <div className={`h-1.5 ${m.color} rounded-full ${m.width}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Medicine Card */}
            <div className="absolute top-16 left-0 bg-white rounded-2xl shadow-lg p-3 w-44 border border-gray-100">
              <p className="text-xs font-bold text-gray-700 mb-1.5">💊 Medicine Reminder</p>
              <p className="text-xs text-gray-500">Metformin 500mg</p>
              <p className="text-xs text-blue-600 font-semibold">Due in 30 mins</p>
              <div className="flex gap-1 mt-2">
                <button className="flex-1 bg-green-500 text-white text-xs py-1 rounded-lg font-semibold">✓ Taken</button>
                <button className="flex-1 bg-gray-100 text-gray-600 text-xs py-1 rounded-lg font-semibold">Skip</button>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-400">
          <span className="text-xs">Scroll to explore</span>
          <div className="w-5 h-8 border-2 border-gray-300 rounded-full flex items-start justify-center p-1">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────────────────── */}
      <section className="bg-blue-600 py-14">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-4xl font-black mb-1">{s.value}</div>
              <div className="text-blue-200 text-sm font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────────── */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-blue-600 font-bold text-sm uppercase tracking-widest">Features</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2">
              Everything You Need in One Platform
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm">
              Powered by AI, designed for patients, doctors, and hospital admins.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title}
                className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition hover:-translate-y-1 duration-200 group">
                <div className={`w-12 h-12 rounded-2xl ${f.color} flex items-center justify-center text-2xl mb-4`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-gray-800 mb-2 text-sm">{f.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-blue-600 font-bold text-sm uppercase tracking-widest">How It Works</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2">
              Start Your Health Journey in 4 Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connector line (desktop) */}
            <div className="hidden lg:block absolute top-10 left-[12%] right-[12%] h-0.5 bg-blue-200 z-0" />

            {howItWorks.map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl mb-4 shadow-md">
                  {step.icon}
                </div>
                <span className="text-xs font-black text-blue-400 mb-1">STEP {step.step}</span>
                <h3 className="font-bold text-gray-800 text-sm mb-2">{step.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPECIALIZATIONS ────────────────────────────────────────────── */}
      <section id="specializations" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-blue-600 font-bold text-sm uppercase tracking-widest">Specializations</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2">
              Find the Right Specialist
            </h2>
            <p className="text-gray-500 mt-3 text-sm">1,200+ verified doctors across 12+ specializations</p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {specializations.map((s) => (
              <Link to="/doctors" key={s.name}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-100 hover:border-blue-300 hover:bg-blue-50 transition hover:-translate-y-1 duration-200 cursor-pointer">
                <span className="text-3xl">{s.icon}</span>
                <span className="text-xs font-semibold text-gray-700 text-center">{s.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────────────────── */}
      <section id="testimonials" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-blue-600 font-bold text-sm uppercase tracking-widest">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2">
              Loved by Patients & Doctors
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
                <StarRating count={t.rating} />
                <p className="text-gray-600 text-sm leading-relaxed mt-3 mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-black">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-blue-600 font-bold text-sm uppercase tracking-widest">FAQ</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-center">
        <div className="max-w-3xl mx-auto px-6 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black leading-tight">
            Ready to Take Control<br />of Your Health?
          </h2>
          <p className="text-blue-200 text-base">
            Join 50,000+ patients and 1,200+ doctors already using MedConnect360.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/register"
              className="bg-white text-blue-700 px-8 py-4 rounded-xl font-black text-sm hover:bg-blue-50 transition shadow-lg">
              Get Started Free →
            </Link>
            <Link to="/login"
              className="border-2 border-white/50 text-white px-8 py-4 rounded-xl font-bold text-sm hover:bg-white/10 transition">
              Sign In
            </Link>
          </div>
          <p className="text-blue-300 text-xs">No credit card required • Free forever plan available</p>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-400 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-black text-sm">M</div>
                <span className="text-white font-black text-lg">MedConnect<span className="text-blue-400">360</span></span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                AI-powered smart healthcare ecosystem connecting patients, doctors, and hospitals.
              </p>
            </div>

            {[
              {
                title: "Services",
                links: ["Book Appointment", "Telemedicine", "AI Symptom Checker", "Medicine Tracker", "Health Analytics"],
              },
              {
                title: "Company",
                links: ["About Us", "Our Team", "Careers", "Privacy Policy", "Terms of Service"],
              },
              {
                title: "Contact",
                links: ["📧 support@medconnect360.com", "📞 +91 98765 43210", "📍 New Delhi, India"],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-white font-bold text-sm mb-4">{col.title}</h4>
                <ul className="space-y-2 text-sm">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href="#" className="hover:text-blue-400 transition">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-600">
            <p>© {new Date().getFullYear()} MedConnect360. All rights reserved.</p>
            <p>Built with ❤️ by Anuradha Paswan, Kriti Yadav, Shivam, Shubham Chakma</p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;