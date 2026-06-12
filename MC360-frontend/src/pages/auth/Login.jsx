import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import LoginForm from '../../components/auth/LoginForm'
import GoogleLoginButton from '../../components/auth/GoogleLoginButton'
import toast from 'react-hot-toast'
import { Activity } from 'lucide-react'

const ROLE_REDIRECT = {
  patient: '/patient/dashboard',
  doctor: '/doctor/dashboard',
  hospital: '/hospital/dashboard',
}

export default function Login() {
  const { login, isLoading } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || null

  const handleSubmit = async (data) => {
    try {
      const res = await login(data)
      toast.success(`Welcome back, ${res.user.name.split(' ')[0]}!`)
      navigate(from || ROLE_REDIRECT[res.user.role] || '/')
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-teal-500 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">MC<span className="text-gradient">360</span></span>
          </div>
        </div>

        <div className="card p-8">
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
            <p className="text-sm text-slate-500 mt-1">Sign in to your MC360 account</p>
          </div>

          <GoogleLoginButton />

          <div className="relative my-5">
            <div className="divider" />
            <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-white px-3 text-xs text-slate-400">or continue with email</span>
          </div>

          <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />

          <div className="mt-4 text-right">
            <Link to="/forgot-password" className="text-xs text-primary-600 hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 mt-5">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 font-medium hover:underline">
            Create one free
          </Link>
        </p>
      </div>
    </div>
  )
}