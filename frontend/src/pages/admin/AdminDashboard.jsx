import React, { useState, useEffect } from 'react'
import { 
  ShieldCheck, 
  Users, 
  Building2, 
  Activity, 
  CheckCircle, 
  XCircle, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Globe 
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import api from '../../config/api'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('providers')
  const [providers, setProviders] = useState([])
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState(null)
  const [monitors, setMonitors] = useState([])
  const [tasks, setTasks] = useState([])

  // New Monitor Modal
  const [modalOpen, setModalOpen] = useState(false)
  const [monitorName, setMonitorName] = useState('')
  const [targetUrl, setTargetUrl] = useState('')
  const [monitorPurpose, setMonitorPurpose] = useState('Track facility updates and emergency contact revisions')

  useEffect(() => {
    loadAll()
  }, [])

  const loadAll = async () => {
    try {
      const [pRes, uRes, sRes, mRes, tRes] = await Promise.all([
        api.get('/admin/providers'),
        api.get('/admin/users'),
        api.get('/admin/tinyfish-activity'),
        api.get('/tinyfish/monitors'),
        api.get('/tinyfish/tasks'),
      ])
      setProviders(pRes.data)
      setUsers(uRes.data)
      setStats(sRes.data)
      setMonitors(mRes.data)
      setTasks(tRes.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleVerifyProvider = async (id, approved) => {
    try {
      await api.put(`/admin/providers/${id}/verify?approved=${approved}`)
      loadAll()
    } catch (err) {
      alert('Action failed')
    }
  }

  const handleCreateMonitor = async (e) => {
    e.preventDefault()
    try {
      await api.post('/tinyfish/monitors', {
        name: monitorName,
        type: 'fetch',
        target_url: targetUrl,
        purpose: monitorPurpose,
      })
      setModalOpen(false)
      setMonitorName('')
      setTargetUrl('')
      loadAll()
    } catch (err) {
      alert('Failed to register monitor')
    }
  }

  const handleDeleteMonitor = async (id) => {
    try {
      await api.delete(`/tinyfish/monitors/${id}`)
      loadAll()
    } catch (err) {
      alert('Failed to delete monitor')
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-navy-900">Administrator Console</h1>
                <Badge variant="verified">Super Admin Access</Badge>
              </div>
              <p className="text-xs text-gray-500 mt-1">Platform moderation, data quality review, & TinyFish web monitoring</p>
            </div>
          </div>
          <Button onClick={loadAll} variant="secondary" className="text-xs">
            <RefreshCw className="w-4 h-4 mr-1.5" /> Refresh Data
          </Button>
        </div>

        {/* System KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Total Users</div>
            <div className="text-3xl font-extrabold text-navy-900">{users.length}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Providers Indexed</div>
            <div className="text-3xl font-extrabold text-teal-600">{providers.length}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">TinyFish AI Runs</div>
            <div className="text-3xl font-extrabold text-navy-900">{stats?.total_tasks || tasks.length}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Active Web Monitors</div>
            <div className="text-3xl font-extrabold text-emerald-600">{monitors.length}</div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-2 border-b border-gray-200 pb-2 text-sm font-semibold text-gray-500">
          <button
            onClick={() => setActiveTab('providers')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'providers' ? 'bg-teal-600 text-white' : 'hover:bg-white text-navy-900'
            }`}
          >
            Provider Quality & Verification
          </button>
          <button
            onClick={() => setActiveTab('monitors')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'monitors' ? 'bg-teal-600 text-white' : 'hover:bg-white text-navy-900'
            }`}
          >
            TinyFish Website Monitors
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'tasks' ? 'bg-teal-600 text-white' : 'hover:bg-white text-navy-900'
            }`}
          >
            AI Discovery Logs
          </button>
        </div>

        {/* Tab 1: Providers Verification */}
        {activeTab === 'providers' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-navy-900 mb-4">Facility Directory Moderation</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 uppercase text-gray-500 font-semibold border-b border-gray-100">
                  <tr>
                    <th className="p-3">Facility Name</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">City</th>
                    <th className="p-3">Discovered Via</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {providers.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/50">
                      <td className="p-3 font-semibold text-navy-900 max-w-xs truncate">{p.name}</td>
                      <td className="p-3 text-gray-600">{p.provider_type}</td>
                      <td className="p-3 text-gray-600">{p.city}</td>
                      <td className="p-3 capitalize font-mono text-[11px]">{p.discovered_by}</td>
                      <td className="p-3">
                        <Badge variant={p.verification_status === 'verified' ? 'verified' : 'pending'}>
                          {p.verification_status}
                        </Badge>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        {p.verification_status !== 'verified' && (
                          <button
                            onClick={() => handleVerifyProvider(p.id, true)}
                            className="text-emerald-600 hover:text-emerald-700 font-semibold"
                          >
                            Approve
                          </button>
                        )}
                        {p.verification_status !== 'rejected' && (
                          <button
                            onClick={() => handleVerifyProvider(p.id, false)}
                            className="text-rose-600 hover:text-rose-700 font-semibold"
                          >
                            Reject
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Monitors */}
        {activeTab === 'monitors' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-navy-900">Configured Website Monitors</h2>
                <p className="text-xs text-gray-500">Autonomous recurring monitors watching provider URLs</p>
              </div>
              <Button onClick={() => setModalOpen(true)} variant="primary">
                <Plus className="w-4 h-4 mr-1.5" /> Add Target Website Monitor
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {monitors.map((m) => (
                <div key={m.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-navy-900 text-sm">{m.name}</h4>
                    <p className="text-xs text-gray-500 font-mono mt-1 break-all">{m.target_url || m.search_query}</p>
                    <p className="text-xs text-gray-600 mt-2"><strong>Purpose:</strong> {m.purpose}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-[11px] font-mono bg-navy-50 text-navy-700 px-2 py-0.5 rounded">
                        {m.schedule_cron}
                      </span>
                      <Badge variant="verified">{m.status}</Badge>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteMonitor(m.id)}
                    className="text-gray-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: AI Discovery Logs */}
        {activeTab === 'tasks' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-navy-900 mb-4">TinyFish Autonomous Task Execution Audit</h2>
            <div className="space-y-2">
              {tasks.map((t) => (
                <div key={t.id} className="p-3.5 bg-gray-50 rounded-xl flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-3 truncate max-w-[70%]">
                    <span className="uppercase font-bold text-teal-600">[{t.task_type}]</span>
                    <span className="text-navy-900 truncate">{t.query}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">{t.duration_seconds}s</span>
                    <Badge variant={t.status === 'completed' ? 'verified' : 'pending'}>
                      {t.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Monitor Modal */}
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Register TinyFish Website Monitor">
          <form onSubmit={handleCreateMonitor} className="space-y-4">
            <Input
              label="Friendly Name"
              placeholder="e.g. GIMS Greater Noida Portal Monitor"
              required
              value={monitorName}
              onChange={(e) => setMonitorName(e.target.value)}
            />
            <Input
              label="Target Website URL"
              type="url"
              placeholder="https://gims.ac.in"
              required
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
            />
            <Input
              label="Change Detection Purpose"
              placeholder="Detect contact updates or new emergency phone numbers"
              required
              value={monitorPurpose}
              onChange={(e) => setMonitorPurpose(e.target.value)}
            />
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Create Monitor
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
