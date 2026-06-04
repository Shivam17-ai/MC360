import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginWithEmail, loginWithGoogle, getIdToken } from "../../config/firebase";
import useAuthStore from "../../store/authStore";

const Login = () => {
  const navigate = useNavigate();
  const { login, setLoading, setError, isLoading, error, clearError } = useAuthStore();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    clearError();
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const redirectByRole = (role) => {
    if (role === "doctor") navigate("/doctor/dashboard");
    else if (role === "hospital_admin") navigate("/hospital/dashboard");
    else navigate("/patient/dashboard");
  };

  // ── Email Login ────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearError();
    try {
      const result = await loginWithEmail(form.email, form.password);
      const token = await getIdToken();

      // Call backend to get user + role
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/firebase-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ uid: result.user.uid, email: result.user.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      login(data.user, data.token, data.refreshToken);
      redirectByRole(data.user.role);
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  // ── Google Login ───────────────────────────────────────────────────
  const handleGoogle = async () => {
    setLoading(true);
    clearError();
    try {
      const result = await loginWithGoogle();
      const token = await getIdToken();

      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/firebase-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ uid: result.user.uid, email: result.user.email, name: result.user.displayName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Google login failed");

      login(data.user, data.token, data.refreshToken);
      redirectByRole(data.user.role);
    } catch (err) {
      setError(err.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">

      {/* Background blobs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-lg">M</div>
            <span className="text-xl font-black text-blue-700">MedConnect<span className="text-gray-800">360</span></span>
          </Link>
          <p className="text-gray-500 text-sm mt-2">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-black text-gray-800 mb-1">Welcome Back 👋</h2>
          <p className="text-sm text-gray-500 mb-6">Enter your credentials to continue</p>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5 flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
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
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs text-blue-500 hover:text-blue-700 font-semibold hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in...
                </span>
              ) : "Sign In →"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <hr className="flex-1 border-gray-200" />
            <span className="text-xs text-gray-400 font-medium">or continue with</span>
            <hr className="flex-1 border-gray-200" />
          </div>

          {/* Google */}
          <button
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
            Continue with Google
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 font-bold hover:underline">Create Account</Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          By signing in, you agree to our{" "}
          <a href="#" className="hover:underline text-gray-500">Terms of Service</a> &{" "}
          <a href="#" className="hover:underline text-gray-500">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default Login;