import React from 'react'
import { MapPin, Phone, ExternalLink, ShieldCheck, Clock, Building2, Stethoscope, Ambulance } from 'lucide-react'
import Badge from '../ui/Badge'

export default function ProviderCard({ provider, onSelect }) {
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

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
              {getIcon(provider.provider_type)}
            </div>
            <div>
              <h3 className="font-semibold text-navy-900 line-clamp-1">{provider.name}</h3>
              <p className="text-xs text-gray-500 font-medium">{provider.provider_type}</p>
            </div>
          </div>
          <Badge
            variant={provider.verification_status === 'verified' ? 'verified' : 'pending'}
          >
            {provider.verification_status === 'verified' ? 'Verified' : 'Pending Review'}
          </Badge>
        </div>

        <div className="space-y-2 text-xs text-gray-600 mb-4">
          <div className="flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
            <span className="line-clamp-2">{provider.address || `${provider.city}, ${provider.state}`}</span>
          </div>
          {provider.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <a href={`tel:${provider.phone}`} className="text-teal-600 hover:underline font-medium">
                {provider.phone}
              </a>
            </div>
          )}
        </div>

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

      <div className="pt-3 border-t border-gray-50 flex items-center justify-between text-[11px] text-gray-400">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3" />
          <span>Discovered via TinyFish</span>
        </div>
        {provider.source_url && (
          <a
            href={provider.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-teal-600 hover:text-teal-700 font-medium"
          >
            Source <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  )
}
