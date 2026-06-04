import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">M</div>
            <span className="text-white font-bold text-lg">MedConnect<span className="text-blue-400">360</span></span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            AI-powered smart healthcare ecosystem connecting patients, doctors, and hospitals seamlessly.
          </p>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-3">Services</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            {["Book Appointment", "Telemedicine", "AI Symptom Checker", "Medicine Tracker", "Health Analytics"].map((s) => (
              <li key={s}><Link to="#" className="hover:text-blue-400 transition">{s}</Link></li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            {["About Us", "Our Team", "Careers", "Privacy Policy", "Terms of Service"].map((c) => (
              <li key={c}><Link to="#" className="hover:text-blue-400 transition">{c}</Link></li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-3">Contact</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>📧 support@medconnect360.com</li>
            <li>📞 +91 98765 43210</li>
            <li>📍 New Delhi, India</li>
          </ul>
          <div className="flex gap-3 mt-4">
            {["𝕏", "in", "f", "▶"].map((icon, i) => (
              <button key={i} className="w-8 h-8 rounded-full bg-gray-700 hover:bg-blue-600 flex items-center justify-center text-xs text-white transition">
                {icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 pt-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-500">
        <p>© {new Date().getFullYear()} MedConnect360. All rights reserved.</p>
        <p>Built with ❤️ by Anuradha Paswan, Kriti Yadav, Shivam, Shubham Chakma</p>
      </div>
    </div>
  </footer>
);

export default Footer;