import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

// Public pages
import LandingPage from './pages/public/LandingPage'
import AboutPage from './pages/public/AboutPage'
import HowItWorksPage from './pages/public/HowItWorksPage'
import ServicesPage from './pages/public/ServicesPage'
import ContactPage from './pages/public/ContactPage'

// Auth pages
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

// Dashboard pages
import PatientDashboard from './pages/patient/PatientDashboard'
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import HospitalDashboard from './pages/hospital/HospitalDashboard'
import ParamedicDashboard from './pages/paramedic/ParamedicDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'

import PageLoader from './components/ui/PageLoader'

function ProtectedRoute({ children, allowedRole }) {
  const { isAuthenticated, loading, role } = useAuth()
  if (loading) return <PageLoader />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (allowedRole && role !== allowedRole) {
    const dashMap = {
      patient: '/patient/dashboard',
      doctor: '/doctor/dashboard',
      hospital: '/hospital/dashboard',
      paramedic: '/paramedic/dashboard',
      admin: '/admin/dashboard',
    }
    return <Navigate to={dashMap[role] || '/'} replace />
  }
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/patient/dashboard"
        element={<ProtectedRoute allowedRole="patient"><PatientDashboard /></ProtectedRoute>}
      />
      <Route
        path="/doctor/dashboard"
        element={<ProtectedRoute allowedRole="doctor"><DoctorDashboard /></ProtectedRoute>}
      />
      <Route
        path="/hospital/dashboard"
        element={<ProtectedRoute allowedRole="hospital"><HospitalDashboard /></ProtectedRoute>}
      />
      <Route
        path="/paramedic/dashboard"
        element={<ProtectedRoute allowedRole="paramedic"><ParamedicDashboard /></ProtectedRoute>}
      />
      <Route
        path="/admin/dashboard"
        element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
