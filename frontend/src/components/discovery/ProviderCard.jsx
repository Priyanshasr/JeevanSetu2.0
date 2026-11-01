import React, { useState } from 'react'
import { MapPin, Phone, ExternalLink, Clock, Building2, Stethoscope, Ambulance, Bed, ChevronDown, ChevronUp, ShieldAlert, PhoneCall } from 'lucide-react'
import Badge from '../ui/Badge'

export default function ProviderCard({ provider }) {
  const [showDepartments, setShowDepartments] = useState(false)

  const getIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'doctor':
        return <Stethoscope className="w-5 h-5 text-teal-600" />
      case 'ambulance':
        return <Ambulance className="w-5 h-5 text-red-500" />
      default:
        return <Building2 className="w-5 h-5 text-navy-700" />
    }
  }

  const services = Array.isArray(provider.services)
    ? provider.services
    : typeof provider.services === 'string'
    ? (() => {
        try {
          return JSON.parse(provider.services)
        } catch {
          return [provider.services]
        }
      })()
    : []

  const departmentContacts = provider.department_contacts && typeof provider.department_contacts === 'object'
    ? provider.department_contacts
    : typeof provider.department_contacts === 'string'
    ? (() => {
        try {
          return JSON.parse(provider.department_contacts)
        } catch {
          return {}
        }
      })()
    : {}

  const hasDepartments = Object.keys(departmentContacts).length > 0

  // Status mapping
  const getStatusBadge = (status) => {
    if (status === 'verified') {
      return <Badge variant="verified">Verified Facility</Badge>
    }
    if (status === 'pending') {
      return <Badge variant="pending">Pending Verification</Badge>
    }
    return <Badge variant="source_available">Source Available</Badge>
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
              {getIcon(provider.provider_type)}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-navy-900 text-sm leading-snug break-words">{provider.name}</h3>
              <p className="text-xs text-gray-500 font-medium">{provider.provider_type}</p>
            </div>
          </div>
          <div className="shrink-0">
            {getStatusBadge(provider.verification_status)}
          </div>
        </div>

        {/* Capacity if available */}
        {provider.capacity && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50/80 text-teal-800 text-[11px] font-semibold mb-3">
            <Bed className="w-3.5 h-3.5 text-teal-600" />
            <span>Facility Capacity: {provider.capacity}</span>
          </div>
        )}

        {/* Location & Contact Info */}
        <div className="space-y-2 text-xs text-gray-600 mb-4">
          <div className="flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
            <span className="line-clamp-2">{provider.address || `${provider.city}, ${provider.state}`}</span>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            {provider.phone ? (
              <a href={`tel:${provider.phone}`} className="text-teal-600 hover:underline font-semibold tracking-wide">
                {provider.phone} {provider.name.includes('GIMS') && '(Emergency Desk)'}
              </a>
            ) : (
              <span className="text-gray-400 italic text-[11px]">Contact not provided in official directory</span>
            )}
          </div>
        </div>

        {/* GIMS Department Contacts Dropdown */}
        {hasDepartments && (
          <div className="mb-4 bg-gray-50/80 border border-gray-100 rounded-xl p-3">
            <button
              type="button"
              onClick={() => setShowDepartments(!showDepartments)}
              className="w-full flex items-center justify-between text-xs font-semibold text-navy-900 hover:text-teal-700 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-teal-600" />
                <span>Department Emergency & Helplines ({Object.keys(departmentContacts).length})</span>
              </span>
              {showDepartments ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showDepartments && (
              <div className="mt-2.5 pt-2 border-t border-gray-200/60 space-y-1.5 text-[11px]">
                {Object.entries(departmentContacts).map(([dept, num]) => (
                  <div key={dept} className="flex items-center justify-between py-0.5">
                    <span className="text-gray-600">{dept}:</span>
                    <a href={`tel:${num}`} className="font-semibold text-teal-700 hover:underline">
                      {num}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Services Badges */}
        {services.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {services.slice(0, 4).map((srv, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-navy-50 text-navy-700 text-[11px] font-medium"
              >
                {srv}
              </span>
            ))}
            {services.length > 4 && (
              <span className="px-1.5 py-0.5 text-[11px] text-gray-400 font-medium">
                +{services.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-gray-50 flex items-center justify-between text-[11px] text-gray-400">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3" />
          <span>Last checked: {provider.last_checked || '2026-11-01'}</span>
        </div>
        {provider.source_url && (
          <a
            href={provider.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-teal-600 hover:text-teal-700 font-medium hover:underline"
          >
            Official Source <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  )
}
