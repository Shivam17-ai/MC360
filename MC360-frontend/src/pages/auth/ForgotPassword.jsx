import { useState } from "react";
import { Link } from "react-router-dom";
import { resetPassword } from "../../config/firebase";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError("Please enter your email address"); return; }
    setLoading(true);
    setError("");
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email address.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">

      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-lg">M</div>
            <span className="text-xl font-black text-blue-700">MedConnect<span className="text-gray-800">360</span></span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">

          {!sent ? (
            <>
              {/* Icon */}
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5">
                🔐
              </div>

              <h2 className="text-2xl font-black text-gray-800 text-center mb-1">Forgot Password?</h2>
              <p className="text-sm text-gray-500 text-center mb-6">
                No worries! Enter your email and we'll send you a reset link.
              </p>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5 flex items-center gap-2">
                  <span>⚠️</span> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    placeholder="you@example.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Sending...
                    </span>
                  ) : "Send Reset Link 📧"}
                </button>
              </form>
            </>
          ) : (
            /* ── Success State ── */
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto">
                ✅
              </div>
              <h2 className="text-2xl font-black text-gray-800">Check Your Email!</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                We've sent a password reset link to{" "}
                <span className="font-bold text-gray-700">{email}</span>.
                Check your inbox and follow the instructions.
              </p>

              <div className="bg-blue-50 rounded-xl p-4 text-xs text-gray-600 text-left space-y-1.5">
                <p className="font-semibold text-blue-700 mb-1">Didn't get the email?</p>
                <p>• Check your spam or junk folder</p>
                <p>• Make sure you entered the correct email</p>
                <p>• Wait a few minutes and try again</p>
              </div>

              <button
                onClick={() => { setSent(false); setEmail(""); }}
                className="w-full border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition"
              >
                Try a Different Email
              </button>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 mt-6">
            <Link
              to="/login"
              className="flex items-center gap-1.5 text-sm text-blue-600 font-semibold hover:underline"
            >
              ← Back to Sign In
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              to="/register"
              className="text-sm text-gray-500 font-medium hover:text-blue-600 hover:underline"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;