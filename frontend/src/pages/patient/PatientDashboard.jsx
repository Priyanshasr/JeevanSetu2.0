import React, { useState, useEffect } from 'react'
import { 
  Search, 
  Sparkles, 
  FileText, 
  Calendar, 
  AlertTriangle, 
  ShieldCheck, 
  Plus, 
  Upload, 
  MapPin, 
  Activity, 
  CheckCircle2, 
  Clock, 
  Download, 
  Share2 
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import ProviderSearch from '../../components/discovery/ProviderSearch'
import ProviderCard from '../../components/discovery/ProviderCard'
import TinyFishActivityPanel from '../../components/discovery/TinyFishActivityPanel'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import api from '../../config/api'
import { useAuth } from '../../context/AuthContext'

export default function PatientDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('discovery')
  
  // Provider Discovery State
  const [providers, setProviders] = useState([])
  const [loadingProviders, setLoadingProviders] = useState(false)
  const [isDiscovering, setIsDiscovering] = useState(false)
  const [activeTask, setActiveTask] = useState(null)
  const [taskHistory, setTaskHistory] = useState([])

  // Medical Records State
  const [records, setRecords] = useState([])
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [recordTitle, setRecordTitle] = useState('')
  const [recordType, setRecordType] = useState('prescription')
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  // Appointments State
  const [appointments, setAppointments] = useState([])
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false)
  const [appointmentNotes, setAppointmentNotes] = useState('')

  // Emergency SOS State
  const [sosActive, setSosActive] = useState(false)
  const [emergencyData, setEmergencyData] = useState(null)

  // Schemes State
  const [schemes, setSchemes] = useState([])

  useEffect(() => {
    loadProviders()
    loadTinyFishTasks()
    loadRecords()
    loadAppointments()
    loadSchemes()
  }, [])

  const loadProviders = async (filters = {}) => {
    setLoadingProviders(true)
    try {
      const res = await api.get('/providers/', { params: filters })
      setProviders(res.data)
    } catch (err) {
      console.error('Failed to load providers:', err)
    } finally {
      setLoadingProviders(false)
    }
  }

  const loadTinyFishTasks = async () => {
    try {
      const res = await api.get('/tinyfish/tasks')
      setTaskHistory(res.data)
    } catch (err) {
      console.error('Failed to load TinyFish tasks:', err)
    }
  }

  const loadRecords = async () => {
    try {
      const res = await api.get('/medical-records/')
      setRecords(res.data)
    } catch (err) {
      console.error('Failed to load records:', err)
    }
  }

  const loadAppointments = async () => {
    try {
      const res = await api.get('/appointments/')
      setAppointments(res.data)
    } catch (err) {
      console.error('Failed to load appointments:', err)
    }
  }

  const loadSchemes = async () => {
    try {
      const res = await api.get('/schemes/')
      setSchemes(res.data)
    } catch (err) {
      console.error('Failed to load schemes:', err)
    }
  }

  // Trigger TinyFish Autonomous Web Discovery
  const handleTinyFishDiscover = async ({ query, location, providerType }) => {
    setIsDiscovering(true)
    setActiveTask({
      task_type: 'search + fetch',
      query: `Discovering "${query}" in ${location}`,
    })
    try {
      const res = await api.post('/tinyfish/discover', {
        query,
        location,
        provider_type: providerType,
      })
      await loadProviders({ city: location })
      await loadTinyFishTasks()
    } catch (err) {
      alert(`TinyFish Discovery error: ${err.response?.data?.detail || err.message}`)
    } finally {
      setIsDiscovering(false)
      setActiveTask(null)
    }
  }

  const handleFileUpload = async (e) => {
    e.preventDefault()
    if (!selectedFile) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('title', recordTitle)
      formData.append('record_type', recordType)
      formData.append('file', selectedFile)

      await api.post('/medical-records/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setUploadModalOpen(false)
      setRecordTitle('')
      setSelectedFile(null)
      loadRecords()
    } catch (err) {
      alert(err.response?.data?.detail || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleBookAppointment = async (e) => {
    e.preventDefault()
    try {
      await api.post('/appointments/', {
        appointment_type: 'consultation',
        notes: appointmentNotes,
      })
      setAppointmentModalOpen(false)
      setAppointmentNotes('')
      loadAppointments()
    } catch (err) {
      alert('Failed to request appointment')
    }
  }

  const triggerSOS = async () => {
    if (!window.confirm('Trigger Emergency Ambulance Assistance now? Responders will be alerted.')) return
    try {
      const res = await api.post('/emergency/request', {
        request_type: 'ambulance',
        description: 'Urgent medical assistance requested via Patient SOS',
      })
      setEmergencyData(res.data)
      setSosActive(true)
    } catch (err) {
      alert('Emergency request failed. Please dial 108 or 112 directly.')
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-navy-900 to-navy-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold mb-3">
              <span>Patient Portal Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">Welcome back, {user?.full_name}</h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-1">
              Find nearby facilities, view verified doctors, and manage encrypted health records.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={triggerSOS}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-rose-600/30 active:scale-95 animate-pulse"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Emergency SOS</span>
            </button>
            <Button
              onClick={() => setUploadModalOpen(true)}
              variant="secondary"
              className="flex-1 md:flex-initial text-xs bg-white/10 hover:bg-white/20 border-white/20 text-white"
            >
              <Upload className="w-4 h-4 mr-1.5" /> Upload Report
            </Button>
          </div>
        </div>

        {/* SOS Alert Banner */}
        {sosActive && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <h4 className="font-bold text-sm">Emergency Dispatch Initiated</h4>
                <p className="text-xs text-rose-700">
                  Ambulance helpline: 108 / 102. Emergency Coordinator response active.
                </p>
              </div>
            </div>
            <button
              onClick={() => setSosActive(false)}
              className="text-xs font-semibold underline text-rose-700"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto border-b border-gray-200 pb-2 text-sm font-semibold text-gray-500">
          {[
            { id: 'discovery', label: 'Smart Provider Discovery', icon: Search },
            { id: 'records', label: 'Medical Reports & Consent', icon: FileText },
            { id: 'appointments', label: 'My Appointments', icon: Calendar },
            { id: 'schemes', label: 'Government Schemes', icon: ShieldCheck },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'hover:bg-white hover:text-navy-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab 1: Discovery */}
        {activeTab === 'discovery' && (
          <div className="space-y-6">
            <ProviderSearch
              onSearch={(filters) => loadProviders({ query: filters.query, city: filters.location, provider_type: filters.providerType })}
              onTinyFishDiscover={handleTinyFishDiscover}
              isDiscovering={isDiscovering}
            />

            <TinyFishActivityPanel activeTask={activeTask} taskHistory={taskHistory} />

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-navy-900">Available Healthcare Facilities</h2>
                <p className="text-xs text-gray-500">
                  Showing {providers.length} facilities verified or discovered in database
                </p>
              </div>
            </div>

            {loadingProviders ? (
              <div className="text-center py-12 text-sm text-gray-500">Loading healthcare facilities...</div>
            ) : providers.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                <Search className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <h3 className="font-semibold text-navy-900 mb-1">No facilities found in this area</h3>
                <p className="text-xs text-gray-500 mb-4">
                  Run a TinyFish AI discovery to scan district portals and index new clinics.
                </p>
                <Button
                  onClick={() => handleTinyFishDiscover({ query: 'hospitals & PHC', location: 'Greater Noida', providerType: 'all' })}
                  variant="primary"
                >
                  <Sparkles className="w-4 h-4 mr-1.5" /> Run TinyFish Discovery
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {providers.map((p) => (
                  <ProviderCard key={p.id} provider={p} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Records */}
        {activeTab === 'records' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-navy-900">Medical Reports & Diagnostics</h2>
                <p className="text-xs text-gray-500">
                  Private storage protected with role-based access tokens
                </p>
              </div>
              <Button onClick={() => setUploadModalOpen(true)} variant="primary">
                <Plus className="w-4 h-4 mr-1.5" /> Upload New Report
              </Button>
            </div>

            {records.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                <FileText className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <h3 className="font-semibold text-navy-900 mb-1">No records uploaded yet</h3>
                <p className="text-xs text-gray-500 mb-4">
                  Upload PDF prescriptions or scan images to share with authorized doctors.
                </p>
                <Button onClick={() => setUploadModalOpen(true)} variant="secondary">
                  Upload First Report
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {records.map((rec) => (
                  <div key={rec.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-navy-900">{rec.title}</h4>
                        <p className="text-xs text-gray-500 capitalize">{rec.record_type} • {rec.file_name}</p>
                      </div>
                    </div>
                    <Badge variant={rec.is_shared ? 'verified' : 'pending'}>
                      {rec.is_shared ? 'Doctor Shared' : 'Private'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Appointments */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-navy-900">Your Consultations & Follow-ups</h2>
                <p className="text-xs text-gray-500">Track requested and confirmed consultations</p>
              </div>
              <Button onClick={() => setAppointmentModalOpen(true)} variant="primary">
                <Plus className="w-4 h-4 mr-1.5" /> Request Appointment
              </Button>
            </div>

            {appointments.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <h3 className="font-semibold text-navy-900 mb-1">No appointments requested</h3>
                <p className="text-xs text-gray-500 mb-4">Book an in-person or teleconsultation with a specialist.</p>
                <Button onClick={() => setAppointmentModalOpen(true)} variant="secondary">
                  Request Appointment
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.map((appt) => (
                  <div key={appt.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-sm text-navy-900 capitalize">{appt.appointment_type}</h4>
                      <p className="text-xs text-gray-500 mt-1">{appt.notes || 'General health evaluation'}</p>
                    </div>
                    <Badge variant={appt.status === 'confirmed' ? 'verified' : 'pending'}>
                      {appt.status.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Schemes */}
        {activeTab === 'schemes' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-navy-900">Government Healthcare Schemes</h2>
              <p className="text-xs text-gray-500">
                Official entitlement programs covering rural citizens and low-income families
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {schemes.map((sch) => (
                <div key={sch.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-teal-600 uppercase tracking-wider">{sch.tagline}</span>
                    <h3 className="text-lg font-bold text-navy-900 mt-1 mb-2">{sch.name}</h3>
                    <div className="bg-teal-50 text-teal-800 text-xs px-3 py-1.5 rounded-lg font-semibold inline-block mb-4">
                      Coverage: {sch.coverage}
                    </div>

                    <div className="space-y-2 text-xs text-gray-600 mb-4">
                      <p><strong>Eligibility:</strong> {sch.beneficiary}</p>
                      <div>
                        <strong>Key Benefits:</strong>
                        <ul className="list-disc pl-4 mt-1 space-y-1">
                          {sch.services_included.map((srv, idx) => (
                            <li key={idx}>{srv}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="font-medium text-gray-500">Helpline: <strong className="text-navy-900">{sch.helpline}</strong></span>
                    <a
                      href={sch.portal_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:underline font-semibold"
                    >
                      Official Portal →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Modal */}
        <Modal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} title="Upload Medical Document">
          <form onSubmit={handleFileUpload} className="space-y-4">
            <Input
              label="Document Title"
              placeholder="e.g. Blood Test Report, OPD Prescription"
              required
              value={recordTitle}
              onChange={(e) => setRecordTitle(e.target.value)}
            />
            <div>
              <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-2">
                Document Category
              </label>
              <select
                value={recordType}
                onChange={(e) => setRecordType(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-navy-900"
              >
                <option value="prescription">Prescription</option>
                <option value="lab">Lab Diagnostic Report</option>
                <option value="scan">Radiology / Scan (X-Ray, MRI)</option>
                <option value="discharge">Hospital Discharge Summary</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-2">
                File (PDF or Image)
              </label>
              <input
                type="file"
                required
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="w-full text-xs text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="secondary" onClick={() => setUploadModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={uploading}>
                Upload Securely
              </Button>
            </div>
          </form>
        </Modal>

        {/* Appointment Modal */}
        <Modal isOpen={appointmentModalOpen} onClose={() => setAppointmentModalOpen(false)} title="Request Consultation">
          <form onSubmit={handleBookAppointment} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-2">
                Symptoms / Notes
              </label>
              <textarea
                rows={3}
                required
                placeholder="Describe reason for consultation or required follow-up..."
                value={appointmentNotes}
                onChange={(e) => setAppointmentNotes(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-navy-900"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="secondary" onClick={() => setAppointmentModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Submit Request
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
