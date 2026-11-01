import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HeartPulse, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [role, setRole] = useState('patient')
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    city: 'Greater Noida',
    state: 'Uttar Pradesh',
    specialization: 'General Medicine',
    registrationNumber: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await register({
        full_name: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: role,
        city: formData.city,
        state: formData.state,
        specialization: formData.specialization,
        registration_number: formData.registrationNumber,
      })
      const dashMap = {
        patient: '/patient/dashboard',
        doctor: '/doctor/dashboard',
        hospital: '/hospital/dashboard',
        paramedic: '/paramedic/dashboard',
        admin: '/admin/dashboard',
      }
      navigate(dashMap[user.role] || '/patient/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please check inputs.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-soft-blue flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/20">
              <HeartPulse className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-2xl text-navy-900 tracking-tight">JeevanSetu 2.0</span>
          </Link>
          <h1 className="text-xl font-bold text-navy-900">Create your account</h1>
          <p className="text-xs text-gray-500 mt-1">Select your role to get customized portal access</p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-teal-900/5">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl mb-6">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Role Selection Tabs */}
          <div className="grid grid-cols-4 gap-2 mb-6 bg-gray-50 p-1.5 rounded-xl border border-gray-200/60">
            {['patient', 'doctor', 'hospital', 'paramedic'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`py-2 text-xs font-semibold rounded-lg capitalize transition-all ${
                  role === r
                    ? 'bg-white text-navy-900 shadow-sm'
                    : 'text-gray-500 hover:text-navy-900'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              required
              placeholder={role === 'hospital' ? 'Hospital / Clinic Name' : 'e.g. Ramesh Kumar'}
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email Address"
                type="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Input
                label="Phone Number"
                required
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <Input
              label="Password"
              type="password"
              required
              placeholder="Minimum 8 characters"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />

            {role === 'doctor' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <Input
                  label="Medical Council Reg. No."
                  placeholder="DMC / MCI number"
                  required
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                />
                <Input
                  label="Specialization"
                  placeholder="e.g. Cardiology"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
              <Input
                label="State"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
            </div>

            <Button type="submit" variant="primary" className="w-full mt-4" loading={loading}>
              Create {role.charAt(0).toUpperCase() + role.slice(1)} Account
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-teal-600 hover:text-teal-700">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
