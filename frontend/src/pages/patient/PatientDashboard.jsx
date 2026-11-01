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
  Share2, 
  Info, 
  Building2, 
  Phone, 
  PhoneCall, 
  Mail, 
  ExternalLink, 
  Database 
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
  const [activeTypeFilter, setActiveTypeFilter] = useState('all')

  // Emergency SOS & Helplines State (Task 3)
  const [sosActive, setSosActive] = useState(false)
  const [emergencyData, setEmergencyData] = useState(null)
  const [emergencyDirectory, setEmergencyDirectory] = useState({ general_helplines: [], hospital_specific: [] })
  const [loadingEmergency, setLoadingEmergency] = useState(false)

  // Government Authorities & HMIS Data Sources State (Task 1 & Task 2)
  const [authorities, setAuthorities] = useState([])
  const [dataSources, setDataSources] = useState([])
  const [loadingAuthorities, setLoadingAuthorities] = useState(false)

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

  // Schemes State
  const [schemes, setSchemes] = useState([])

  useEffect(() => {
    loadProviders()
    loadTinyFishTasks()
    loadRecords()
    loadAppointments()
    loadSchemes()
    loadAuthoritiesAndSources()
    loadEmergencyDirectory()
  }, [])

  const loadProviders = async (filters = {}) => {
    setLoadingProviders(true)
    if (filters.provider_type) {
      setActiveTypeFilter(filters.provider_type)
    }
    try {
      const params = {}
      if (filters.query) params.query = filters.query
      if (filters.city && filters.city !== 'All') params.city = filters.city
      if (filters.provider_type && filters.provider_type !== 'all') params.provider_type = filters.provider_type

      const res = await api.get('/providers/', { params })
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

  const loadAuthoritiesAndSources = async () => {
    setLoadingAuthorities(true)
    try {
      const [authRes, srcRes] = await Promise.all([
        api.get('/providers/authorities'),
        api.get('/providers/data-sources'),
      ])
      setAuthorities(authRes.data)
      setDataSources(srcRes.data)
    } catch (err) {
      console.error('Failed to load authorities or data sources:', err)
    } finally {
      setLoadingAuthorities(false)
    }
  }

  const loadEmergencyDirectory = async () => {
    setLoadingEmergency(true)
    try {
      const res = await api.get('/emergency/nearby-providers')
      setEmergencyDirectory(res.data)
    } catch (err) {
      console.error('Failed to load emergency directory:', err)
    } finally {
      setLoadingEmergency(false)
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
      await api.post('/tinyfish/discover', {
        query,
        location: location === 'All' ? 'Gautam Buddha Nagar' : location,
        provider_type: providerType,
      })
      await loadProviders({ city: location, provider_type: providerType })
      await loadTinyFishTasks()
    } catch (err) {
      alert(`TinyFish Discovery notice: ${err.response?.data?.detail || err.message}`)
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
    setActiveTab('emergency')
    try {
      const res = await api.post('/emergency/request', {
        request_type: 'ambulance',
        description: 'Urgent medical assistance requested via Patient SOS',
      })
      setEmergencyData(res.data)
      setSosActive(true)
    } catch (err) {
      setSosActive(true)
    }
  }

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-navy-900 to-navy-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold mb-3">
              <span>Patient Coordination Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">Welcome, {user?.full_name}</h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-1">
              Search verified public district hospitals, emergency helplines, and manage medical reports.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={triggerSOS}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-rose-600/30 active:scale-95 animate-pulse"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Emergency 108 / SOS</span>
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
                  National Emergency: <strong>112</strong> | National Ambulance Service: <strong>108</strong> | Maternal Care: <strong>102</strong>
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
            { id: 'discovery', label: 'Healthcare Facility Discovery', icon: Search },
            { id: 'emergency', label: 'Emergency Helplines', icon: AlertTriangle },
            { id: 'authorities', label: 'Government Healthcare Directory & HMIS', icon: Building2 },
            { id: 'records', label: 'Medical Reports & Consent', icon: FileText },
            { id: 'appointments', label: 'My Consultations', icon: Calendar },
            { id: 'schemes', label: 'Government Healthcare Schemes', icon: ShieldCheck },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
                activeTab === tab
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

            {/* Quick Access Tiles to Emergency, Authorities, and HMIS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setActiveTab('emergency')}
                className="p-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100/80 border border-rose-200/80 text-left transition-all group flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">24x7 Helplines</span>
                  <span className="text-xs font-bold text-navy-900 group-hover:text-rose-700">Emergency & Ambulance</span>
                </div>
                <AlertTriangle className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={() => setActiveTab('authorities')}
                className="p-3.5 rounded-2xl bg-teal-50 hover:bg-teal-100/80 border border-teal-200/80 text-left transition-all group flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider block">District & State</span>
                  <span className="text-xs font-bold text-navy-900 group-hover:text-teal-700">Govt. Healthcare Directory</span>
                </div>
                <Building2 className="w-4 h-4 text-teal-600 group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={() => setActiveTab('authorities')}
                className="p-3.5 rounded-2xl bg-sky-50 hover:bg-sky-100/80 border border-sky-200/80 text-left transition-all group flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider block">GoI Statistics</span>
                  <span className="text-xs font-bold text-navy-900 group-hover:text-sky-700">HMIS Infrastructure Data</span>
                </div>
                <Database className="w-4 h-4 text-sky-600 group-hover:scale-110 transition-transform" />
              </button>
            </div>

            {/* Official Directory Transparency Banner */}
            <div className="bg-sky-50 border border-sky-200/70 rounded-2xl p-4 flex items-start gap-3 text-xs text-sky-900">
              <Info className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-sky-950 mb-0.5">District Directory Transparency & Verification Notice</p>
                <p className="text-sky-800 leading-relaxed">
                  Hospital and clinic information is extracted from official district portals (<a href="https://gbnagar.nic.in/public-utility-category/hospitals/" target="_blank" rel="noopener noreferrer" className="underline font-semibold">gbnagar.nic.in</a>) and institutional portals (<a href="https://www.gims.ac.in/hospital.html" target="_blank" rel="noopener noreferrer" className="underline font-semibold">gims.ac.in</a>). All entries are marked <strong>Source Available / Pending Verification</strong> until independent clinical credentialing is performed.
                </p>
              </div>
            </div>

            <TinyFishActivityPanel activeTask={activeTask} taskHistory={taskHistory} />

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-navy-900">Official District Healthcare Facilities</h2>
                <p className="text-xs text-gray-500">
                  Showing {providers.length} facilities verified against public district records
                </p>
              </div>
            </div>

            {loadingProviders ? (
              <div className="text-center py-12 text-sm text-gray-500">Loading healthcare facilities...</div>
            ) : providers.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 max-w-2xl mx-auto space-y-4">
                <Building2 className="w-10 h-10 text-gray-400 mx-auto" />
                <h3 className="font-bold text-navy-900 text-base">
                  {activeTypeFilter === 'PHC' || activeTypeFilter === 'CHC'
                    ? 'PHC & CHC Status Confirmation'
                    : 'No matching facilities found'}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed max-w-lg mx-auto">
                  {activeTypeFilter === 'PHC' || activeTypeFilter === 'CHC' ? (
                    <span>
                      Individual government PHC and CHC listings are currently awaiting official district confirmation. Verified district hospital and tertiary facilities are shown under Government Hospitals.
                    </span>
                  ) : (
                    <span>
                      No facility matched the current filter. Try selecting <strong>All Locations</strong> or <strong>All Facility Types</strong>.
                    </span>
                  )}
                </p>
                <Button
                  onClick={() => loadProviders({ city: 'All', provider_type: 'all' })}
                  variant="secondary"
                  className="text-xs"
                >
                  Show All Verified Facilities
                </Button>
              </div>
            ) : (
              <>
                {/* Specific notice when looking for PHC or CHC alongside results */}
                {(activeTypeFilter === 'PHC' || activeTypeFilter === 'CHC') && (
                  <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
                    <Info className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>
                      Individual government PHC and CHC listings are currently awaiting official district confirmation. Verified district hospital and tertiary facilities are shown above.
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {providers.map((p) => (
                    <ProviderCard key={p.id} provider={p} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Tab 2: Emergency Helplines (Task 3) */}
        {activeTab === 'emergency' && (
          <div className="space-y-6">
            {/* Disclaimer & Telephony routing note */}
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 text-rose-900">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-rose-950">
                    Emergency Telecom Dispatch Notice & Verification
                  </h3>
                  <p className="text-xs text-rose-800 leading-relaxed">
                    Clicking any emergency number dials directly into official national, state, or hospital emergency desks. Emergency services operate via official telephonic networks. JeevanSetu directs phone connections and does not operate proprietary live GPS ambulance dispatch.
                  </p>
                </div>
              </div>
            </div>

            {/* General Public Emergency Helplines */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2">
                    <PhoneCall className="w-5 h-5 text-rose-600" />
                    General Public Emergency Numbers (24x7)
                  </h2>
                  <p className="text-xs text-gray-500">
                    National and state emergency response services across Gautam Buddha Nagar & Uttar Pradesh
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {emergencyDirectory.general_helplines?.map((hl, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-rose-200 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                          {hl.category}
                        </span>
                        <Badge variant="verified">Official Helpline</Badge>
                      </div>
                      <h3 className="font-bold text-navy-900 text-base mb-1">{hl.name}</h3>
                      <p className="text-xs text-gray-500">{hl.notes}</p>
                    </div>

                    <a
                      href={`tel:${hl.phone.replace(/[^0-9]/g, '')}`}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm transition-all shadow-md shadow-rose-600/20 active:scale-95"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Dial {hl.phone}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Hospital-Specific Emergency Numbers */}
            <div className="pt-4 border-t border-gray-200/70">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-teal-600" />
                  Hospital-Specific Emergency & Ambulance Contacts
                </h2>
                <p className="text-xs text-gray-500">
                  Verified direct emergency desks and institutional ambulance lines (clearly distinguished from general emergency numbers)
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {emergencyDirectory.hospital_specific?.map((hs, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <span className="text-[11px] font-bold text-teal-600 uppercase tracking-wider">
                        {hs.type}
                      </span>
                      <h3 className="font-bold text-navy-900 text-sm mt-1 mb-1">{hs.hospital}</h3>
                      <p className="text-xs font-semibold text-gray-700">
                        Department: {hs.department}
                      </p>
                    </div>

                    <a
                      href={`tel:${hs.phone.replace(/[^0-9]/g, '')}`}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-sm transition-all shadow-md active:scale-95"
                    >
                      <Phone className="w-4 h-4 text-teal-400" />
                      <span>Call {hs.phone}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Government Authorities & HMIS Infrastructure (Task 1 & Task 2) */}
        {activeTab === 'authorities' && (
          <div className="space-y-8">
            {/* Government Healthcare Authority Directory */}
            <div>
              <div className="mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/60 text-teal-700 text-xs font-semibold mb-2">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Task 1 — Official Authority Directory</span>
                </div>
                <h2 className="text-xl font-extrabold text-navy-900">
                  Government Healthcare Authority Directory
                </h2>
                <p className="text-xs text-gray-500">
                  Official district and state health administration authorities. Official designations are prioritized over personal names to accommodate administrative rotations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {authorities.map((auth) => (
                  <div
                    key={auth.id}
                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
                          {auth.jurisdiction}
                        </span>
                        <Badge
                          variant={
                            auth.verification_status && auth.verification_status.includes('Pending')
                              ? 'pending'
                              : 'source_available'
                          }
                        >
                          {auth.verification_status && auth.verification_status.includes('Pending')
                            ? 'Pending Verification'
                            : 'Official Source Cited'}
                        </Badge>
                      </div>

                      <h3 className="text-lg font-bold text-navy-900 mb-1">{auth.designation}</h3>
                      <p className="text-xs text-gray-600 font-medium mb-3">
                        {auth.official_reference}
                      </p>

                      {auth.notice && (
                        <p className="text-[11px] bg-amber-50 text-amber-800 p-2.5 rounded-xl border border-amber-200/60 mb-4">
                          {auth.notice}
                        </p>
                      )}

                      <div className="space-y-2.5 text-xs text-gray-600">
                        {auth.address && (
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                            <span>{auth.address}</span>
                          </div>
                        )}

                        {auth.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                            <a
                              href={`mailto:${auth.email}`}
                              className="text-teal-600 hover:underline font-semibold"
                            >
                              {auth.email}
                            </a>
                          </div>
                        )}

                        {auth.office_phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                            <a
                              href={`tel:${auth.office_phone}`}
                              className="text-navy-900 hover:underline font-semibold"
                            >
                              {auth.office_phone}
                            </a>
                          </div>
                        )}

                        {auth.phone && !auth.office_phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                            <a
                              href={`tel:${auth.phone}`}
                              className="text-navy-900 hover:underline font-semibold"
                            >
                              {auth.phone}
                            </a>
                          </div>
                        )}

                        {auth.phones && Array.isArray(auth.phones) && (
                          <div className="pt-1">
                            <p className="font-semibold text-gray-700 mb-1.5">Official Helplines / Desks:</p>
                            <div className="flex flex-wrap gap-2">
                              {auth.phones.map((p, pIdx) => {
                                const isObj = typeof p === 'object'
                                const label = isObj ? p.label : `Line ${pIdx + 1}`
                                const number = isObj ? p.number : p
                                return (
                                  <a
                                    key={pIdx}
                                    href={`tel:${number.replace(/[^0-9]/g, '')}`}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-navy-900 font-medium hover:bg-teal-50 hover:border-teal-200 text-xs transition-colors"
                                  >
                                    <Phone className="w-3 h-3 text-teal-600" />
                                    <span>{label}: {number}</span>
                                  </a>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                      <span>Source: {auth.source ? new URL(auth.source).hostname : 'Official Source'}</span>
                      {auth.source && (
                        <a
                          href={auth.source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-600 hover:underline inline-flex items-center gap-1 font-semibold"
                        >
                          <span>Official Citation</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Healthcare Infrastructure & Aggregate Data Sources (Task 2) */}
            <div className="pt-4 border-t border-gray-200/80">
              <div className="mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/60 text-teal-700 text-xs font-semibold mb-2">
                  <Database className="w-3.5 h-3.5" />
                  <span>Task 2 — Official Data Sources & Infrastructure Intelligence</span>
                </div>
                <h2 className="text-xl font-extrabold text-navy-900">
                  Healthcare Infrastructure Data Sources
                </h2>
                <p className="text-xs text-gray-500">
                  Transparent mapping of official national and district data sources with designated usage scope and data boundaries.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {dataSources.map((ds) => (
                  <div
                    key={ds.id}
                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-teal-600 uppercase tracking-wider">
                          {ds.scope}
                        </span>
                        <Badge variant="source_available">Official Source</Badge>
                      </div>

                      <h3 className="font-bold text-navy-900 text-base mb-2">{ds.label}</h3>

                      <div className="bg-sky-50/70 border border-sky-100 p-3 rounded-xl mb-4 text-xs text-sky-950">
                        <p className="font-semibold mb-1">Intended Scope & Use Cases:</p>
                        <ul className="list-disc pl-4 space-y-1 text-sky-900 text-[11px]">
                          {ds.use_cases?.map((uc, uIdx) => (
                            <li key={uIdx}>{uc}</li>
                          ))}
                        </ul>
                      </div>

                      <p className="text-xs text-gray-600 leading-relaxed">
                        <strong>Data Policy:</strong> {ds.data_notice}
                      </p>
                    </div>

                    <a
                      href={ds.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-navy-900 font-semibold text-xs transition-all active:scale-95"
                    >
                      <span>Open Official Portal</span>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Records */}
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

        {/* Tab 5: Appointments */}
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

        {/* Tab 6: Schemes */}
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
