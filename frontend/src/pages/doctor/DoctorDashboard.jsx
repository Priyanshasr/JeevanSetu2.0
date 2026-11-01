import React, { useState, useEffect } from 'react'
import { Stethoscope, Users, FileText, Calendar, CheckCircle2, Clock } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import api from '../../config/api'
import { useAuth } from '../../context/AuthContext'

export default function DoctorDashboard() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [records, setRecords] = useState([])

  useEffect(() => {
    loadAppointments()
    loadRecords()
  }, [])

  const loadAppointments = async () => {
    try {
      const res = await api.get('/appointments/')
      setAppointments(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const loadRecords = async () => {
    try {
      const res = await api.get('/medical-records/')
      setRecords(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/appointments/${id}/status`, { status })
      loadAppointments()
    } catch (err) {
      alert('Failed to update status')
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 font-bold">
              <Stethoscope className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-navy-900">{user?.full_name}</h1>
                <Badge variant="verified">Registered Practitioner</Badge>
              </div>
              <p className="text-xs text-gray-500 mt-1">Specialization: General Medicine & Internal Diagnostics</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Appointment Requests</div>
            <div className="text-3xl font-extrabold text-navy-900">{appointments.length}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Authorized Patient Records</div>
            <div className="text-3xl font-extrabold text-teal-600">{records.length}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Verification Status</div>
            <div className="text-lg font-bold text-emerald-600 mt-2">Active & Verified</div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-navy-900 mb-4">Patient Consult Requests</h2>
          {appointments.length === 0 ? (
            <p className="text-xs text-gray-500">No active patient appointment requests at this moment.</p>
          ) : (
            <div className="space-y-3">
              {appointments.map((appt) => (
                <div key={appt.id} className="p-4 bg-gray-50/70 rounded-xl border border-gray-200/60 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-navy-900 capitalize">{appt.appointment_type}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{appt.notes || 'Routine consultation'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {appt.status === 'requested' ? (
                      <>
                        <Button onClick={() => handleStatusChange(appt.id, 'confirmed')} variant="primary" className="text-xs px-3 py-1.5">
                          Confirm
                        </Button>
                        <Button onClick={() => handleStatusChange(appt.id, 'cancelled')} variant="danger" className="text-xs px-3 py-1.5">
                          Decline
                        </Button>
                      </>
                    ) : (
                      <Badge variant="verified">{appt.status.toUpperCase()}</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
