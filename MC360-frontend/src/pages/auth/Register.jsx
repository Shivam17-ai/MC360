import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerWithEmail, loginWithGoogle, getIdToken } from "../../config/firebase";
import useAuthStore from "../../store/authStore";

const roles = [
  { value: "patient", label: "Patient", icon: "🧑‍💼", desc: "Book appointments, track health" },
  { value: "doctor", label: "Doctor", icon: "👨‍⚕️", desc: "Manage patients, consultations" },
  { value: "hospital_admin", label: "Hospital Admin", icon: "🏥", desc: "Manage hospital operations" },
];

const Register = () => {
  const navigate = useNavigate();
  const { login, setLoading, setError, isLoading, error, clearError } = useAuthStore();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "patient",
  });
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    clearError();
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (role) => {
    clearError();
    setForm({ ...form, role });
  };

  const validateStep1 = () => {
    if (!form.name.trim()) { setError("Full name is required"); return false; }
    if (!form.email.trim()) { setError("Email is required"); return false; }
    if (!form.phone.trim()) { setError("Phone number is required"); return false; }
    return true;
  };

  const validateStep2 = () => {
    if (form.password.length < 8) { setError("Password must be at least 8 characters"); return false; }
    if (form.password !== form.confirmPassword) { setError("Passwords do not match"); return false; }
    return true;
  };

  const handleNext = () => {
    clearError();
    if (validateStep1()) setStep(2);
  };

  const redirectByRole = (role) => {
    if (role === "doctor") navigate("/doctor/dashboard");
    else if (role === "hospital_admin") navigate("/hospital/dashboard");
    else navigate("/patient/dashboard");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setLoading(true);
    clearError();
    try {
      const result = await registerWithEmail(form.email, form.password, form.name);
      const token = await getIdToken();

      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          uid: result.user.uid,
          name: form.name,
          email: form.email,
          phone: form.phone,
          role: form.role,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      login(data.user, data.token, data.refreshToken);
      redirectByRole(data.user.role);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    clearError();
    try {
      const result = await loginWithGoogle();
      const token = await getIdToken();

      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/firebase-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          uid: result.user.uid,
          email: result.user.email,
          name: result.user.displayName,
          role: form.role,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Google signup failed");

      login(data.user, data.token, data.refreshToken);
      redirectByRole(data.user.role);
    } catch (err) {
      setError(err.message || "Google signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-10">

      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-lg">M</div>
            <span className="text-xl font-black text-blue-700">MedConnect<span className="text-gray-800">360</span></span>
          </Link>
          <p className="text-gray-500 text-sm mt-2">Create your free account</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-gray-800">
              {step === 1 ? "Get Started 🚀" : "Almost Done 🔒"}
            </h2>
            {/* Step indicator */}
            <div className="flex items-center gap-2">
              {[1, 2].map((s) => (
                <div key={s} className={`w-8 h-2 rounded-full transition-all ${s <= step ? "bg-blue-600" : "bg-gray-200"}`} />
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5 flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <div className="space-y-4">
              {/* Role Selector */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-2">I am a...</label>
                <div className="grid grid-cols-3 gap-2">
                  {roles.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => handleRoleSelect(r.value)}
                      className={`p-3 rounded-xl border-2 text-center transition
                        ${form.role === r.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"}`}
                    >
                      <div className="text-xl mb-1">{r.icon}</div>
                      <div className="text-xs font-bold text-gray-700">{r.label}</div>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-1.5">
                  {roles.find((r) => r.value === form.role)?.desc}
                </p>
              </div>

              {[
                { name: "name", label: "Full Name", type: "text", placeholder: "John Doe" },
                { name: "email", label: "Email Address", type: "email", placeholder: "you@example.com" },
                { name: "phone", label: "Phone Number", type: "tel", placeholder: "+91 9876543210" },
              ].map((f) => (
                <div key={f.name}>
                  <label className="text-xs font-semibold text-gray-600 block mb-1.5">{f.label}</label>
                  <input
                    type={f.type}
                    name={f.name}
                    value={form[f.name]}
                    onChange={handleChange}
                    placeholder={f.placeholder}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                    required
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={handleNext}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition shadow-md"
              >
                Continue →
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <hr className="flex-1 border-gray-200" />
                <span className="text-xs text-gray-400 font-medium">or</span>
                <hr className="flex-1 border-gray-200" />
              </div>

              {/* Google */}
              <button
                type="button"
                onClick={handleGoogle}
                disabled={isLoading}
                className="w-full border border-gray-200 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign up with Google
              </button>
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min 8 characters"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-semibold"
                  >
                    {showPass ? "Hide" : "Show"}
                  </button>
                </div>

                {/* Password strength */}
                {form.password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all ${
                          form.password.length >= i * 2
                            ? form.password.length >= 8 ? "bg-green-500" : "bg-yellow-400"
                            : "bg-gray-200"
                        }`} />
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">
                      {form.password.length < 4 ? "Too short" : form.password.length < 8 ? "Moderate" : "Strong password ✓"}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition
                    ${form.confirmPassword && form.password !== form.confirmPassword
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"}`}
                  required
                />
                {form.confirmPassword && form.password !== form.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                )}
              </div>

              {/* Summary */}
              <div className="bg-blue-50 rounded-xl p-4 text-xs text-gray-600 space-y-1">
                <p className="font-semibold text-blue-700 mb-2">Account Summary</p>
                <p>👤 <span className="font-medium">{form.name}</span></p>
                <p>📧 {form.email}</p>
                <p>📞 {form.phone}</p>
                <p>🏷️ Registering as: <span className="font-medium capitalize">{form.role.replace("_", " ")}</span></p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setStep(1); clearError(); }}
                  className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition shadow-md disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Creating...
                    </span>
                  ) : "Create Account 🚀"}
                </button>
              </div>
            </form>
          )}

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">Sign In</Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          By registering, you agree to our{" "}
          <a href="#" className="hover:underline text-gray-500">Terms of Service</a> &{" "}
          <a href="#" className="hover:underline text-gray-500">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default Register;