import React, { useState, useEffect } from 'react'
import { Building2, Users, Bed, Activity, Phone } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'
import api from '../../config/api'

export default function HospitalDashboard() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])

  useEffect(() => {
    api.get('/appointments/').then((res) => setAppointments(res.data)).catch(console.error)
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-navy-900">{user?.full_name}</h1>
                <Badge variant="verified">Hospital Portal</Badge>
              </div>
              <p className="text-xs text-gray-500 mt-1">Gautam Buddha Nagar District Referral Facility</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Incoming OPD / Consults</div>
            <div className="text-3xl font-extrabold text-navy-900">{appointments.length}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Emergency Trauma Beds</div>
            <div className="text-3xl font-extrabold text-teal-600">24 Operational</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">TinyFish Monitor Tracking</div>
            <div className="text-sm font-semibold text-emerald-600 mt-2">● Real-time Sync Active</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-navy-900 mb-4">Patient Registrations</h2>
          {appointments.length === 0 ? (
            <p className="text-xs text-gray-500">No pending outpatient appointment bookings.</p>
          ) : (
            <div className="space-y-3">
              {appointments.map((a) => (
                <div key={a.id} className="p-4 bg-gray-50 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-navy-900 capitalize">{a.appointment_type}</span>
                    <p className="text-gray-500 mt-0.5">{a.notes || 'Hospital visit'}</p>
                  </div>
                  <Badge variant="pending">{a.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
