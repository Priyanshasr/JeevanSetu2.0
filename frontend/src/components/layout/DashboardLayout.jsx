import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Heart, LayoutDashboard, Search, FileText, Calendar, AlertTriangle,
  Shield, User, Bell, LogOut, ChevronLeft, ChevronRight, Menu, X,
  Users, Building2, Activity, FileCheck, Settings, Stethoscope,
  Ambulance, ClipboardList, BookOpen, MapPin
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Avatar from '../ui/Avatar'

const navByRole = {
  patient: [
    { icon: LayoutDashboard, label: 'Dashboard', tab: 'discovery' },
    { icon: FileText, label: 'My Records', tab: 'records' },
    { icon: Calendar, label: 'Appointments', tab: 'appointments' },
    { icon: Shield, label: 'Gov. Schemes', tab: 'schemes' },
  ],
  doctor: [
    { icon: LayoutDashboard, label: 'Dashboard', tab: 'home' },
    { icon: Users, label: 'My Patients', tab: 'patients' },
    { icon: FileText, label: 'Patient Records', tab: 'records' },
    { icon: Calendar, label: 'Appointments', tab: 'appointments' },
  ],
  hospital: [
    { icon: LayoutDashboard, label: 'Dashboard', tab: 'home' },
    { icon: Building2, label: 'Provider Profile', tab: 'profile' },
    { icon: Stethoscope, label: 'Services', tab: 'services' },
    { icon: Calendar, label: 'Appointments', tab: 'appointments' },
  ],
  paramedic: [
    { icon: LayoutDashboard, label: 'Dashboard', tab: 'home' },
    { icon: Ambulance, label: 'Assistance Requests', tab: 'requests' },
    { icon: AlertTriangle, label: 'Emergency Contacts', tab: 'emergency' },
  ],
  admin: [
    { icon: LayoutDashboard, label: 'Overview', tab: 'home' },
    { icon: Building2, label: 'Providers', tab: 'providers' },
    { icon: Settings, label: 'Monitoring', tab: 'monitors' },
    { icon: Activity, label: 'TinyFish Activity', tab: 'tasks' },
  ],
}

export default function DashboardLayout({ children, activeTab, onTabChange }) {
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const role = user?.role || 'patient'
  const navItems = navByRole[role] || navByRole.patient

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-gray-100 ${collapsed ? 'justify-center' : ''}`}>
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0 shadow-sm">
            <Heart size={16} className="text-white fill-white" />
          </div>
          {!collapsed && <span className="font-bold text-navy-900">JeevanSetu <span className="text-teal-600">2.0</span></span>}
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-4">
        {navItems.map(({ icon: Icon, label, tab }) => (
          <button
            key={tab}
            type="button"
            onClick={() => {
              if (typeof onTabChange === 'function') onTabChange(tab)
              setMobileOpen(false)
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-teal-50 text-teal-700 border-r-2 border-teal-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            } ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? label : undefined}
          >
            <Icon size={18} className="flex-shrink-0" />
            {!collapsed && label}
          </button>
        ))}
      </nav>

      {/* User + Logout */}
      <div className={`border-t border-gray-100 p-4 ${collapsed ? 'flex justify-center' : ''}`}>
        {!collapsed && (
          <div className="flex items-center gap-3 mb-3">
            <Avatar name={user?.full_name || user?.email} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.full_name || 'User'}</p>
              <p className="text-xs text-gray-500 capitalize">{role}</p>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={logout}
          className={`flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors ${collapsed ? '' : 'w-full'}`}
        >
          <LogOut size={16} />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-gray-100 shadow-sm transition-all duration-300 relative ${collapsed ? 'w-16' : 'w-64'}`}
      >
        <SidebarContent />
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-20 -right-3 w-6 h-6 bg-white border border-gray-200 rounded-full shadow flex items-center justify-center hover:bg-gray-50 z-10"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="bg-black/50 flex-1" onClick={() => setMobileOpen(false)} />
          <aside className="w-64 bg-white h-full flex flex-col shadow-xl ml-auto">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-semibold text-navy-900 capitalize">
              {navItems.find(n => n.tab === activeTab)?.label || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-xs text-teal-600 hover:underline font-medium">
              View Website
            </Link>
            <Avatar name={user?.full_name || user?.email} size="sm" />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
