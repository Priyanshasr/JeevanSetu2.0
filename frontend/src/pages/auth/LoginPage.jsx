import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HeartPulse, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(email, password)
      const dashMap = {
        patient: '/patient/dashboard',
        doctor: '/doctor/dashboard',
        hospital: '/hospital/dashboard',
        paramedic: '/paramedic/dashboard',
        admin: '/admin/dashboard',
      }
      navigate(dashMap[user.role] || '/patient/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (roleEmail, rolePass) => {
    setEmail(roleEmail)
    setPassword(rolePass)
  }

  return (
    <div className="min-h-screen bg-soft-blue flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/20">
              <HeartPulse className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-2xl text-navy-900 tracking-tight">JeevanSetu 2.0</span>
          </Link>
          <h1 className="text-xl font-bold text-navy-900">Sign in to your account</h1>
          <p className="text-xs text-gray-500 mt-1">Access healthcare discovery and coordination tools</p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-teal-900/5">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl mb-6">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              required
              placeholder="e.g. ravi.kumar@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" variant="primary" className="w-full mt-2" loading={loading}>
              Sign In
            </Button>
          </form>

          {/* Quick Demo Fill Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-center mb-3">
              One-Click Demo Accounts
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => fillDemo('ravi.kumar@example.com', 'Patient@1234')}
                className="p-2 bg-gray-50 hover:bg-teal-50 hover:text-teal-700 rounded-lg border border-gray-200/60 font-medium transition-colors text-left"
              >
                👤 Patient (Ravi)
              </button>
              <button
                type="button"
                onClick={() => fillDemo('dr.priya@example.com', 'Doctor@1234')}
                className="p-2 bg-gray-50 hover:bg-teal-50 hover:text-teal-700 rounded-lg border border-gray-200/60 font-medium transition-colors text-left"
              >
                👨‍⚕️ Doctor (Dr. Priya)
              </button>
              <button
                type="button"
                onClick={() => fillDemo('admin@jeevansetu.in', 'Admin@1234')}
                className="p-2 bg-gray-50 hover:bg-teal-50 hover:text-teal-700 rounded-lg border border-gray-200/60 font-medium transition-colors text-left"
              >
                🛡️ Administrator
              </button>
              <button
                type="button"
                onClick={() => fillDemo('paramedic.amit@example.com', 'Paramedic@1234')}
                className="p-2 bg-gray-50 hover:bg-teal-50 hover:text-teal-700 rounded-lg border border-gray-200/60 font-medium transition-colors text-left"
              >
                🚑 Paramedic (Amit)
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-teal-600 hover:text-teal-700">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
