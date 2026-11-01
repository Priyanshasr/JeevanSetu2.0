import React, { useState, useEffect } from 'react'
import { Ambulance, AlertTriangle, Phone, MapPin, CheckCircle } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'
import api from '../../config/api'

export default function ParamedicDashboard() {
  const { user } = useAuth()
  const [requests, setRequests] = useState([])

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    try {
      const res = await api.get('/emergency/requests')
      setRequests(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
              <Ambulance className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-navy-900">{user?.full_name}</h1>
                <Badge variant="verified">EMT-Basic Certified</Badge>
              </div>
              <p className="text-xs text-gray-500 mt-1">Dispatch Node: Greater Noida & Expressway Zone</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Active SOS Alerts</div>
            <div className="text-3xl font-extrabold text-rose-600">
              {requests.filter((r) => r.status === 'active').length}
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Triage Priority</div>
            <div className="text-lg font-bold text-navy-900 mt-2">Trauma & Cardiac Focus</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Ambulance Dispatch Hotline</div>
            <div className="text-xl font-bold text-teal-600 mt-2">108 / 112 Toll Free</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-navy-900 mb-4">Emergency Incident Feed</h2>
          {requests.length === 0 ? (
            <p className="text-xs text-gray-500">No active incidents registered currently.</p>
          ) : (
            <div className="space-y-3">
              {requests.map((req) => (
                <div key={req.id} className="p-4 bg-rose-50/50 rounded-xl border border-rose-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
                    <div>
                      <span className="font-semibold text-navy-900 capitalize">{req.request_type} Alert</span>
                      <p className="text-gray-500 mt-0.5">{req.address || 'Location Coordinates Broadcasted'}</p>
                    </div>
                  </div>
                  <Badge variant="danger">{req.status.toUpperCase()}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
