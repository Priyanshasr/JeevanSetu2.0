import React from 'react'
import { CheckCircle, Clock, XCircle, Info, AlertTriangle, Globe } from 'lucide-react'

const config = {
  verified: { class: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800', icon: <CheckCircle size={12} className="mr-1" /> },
  source_available: { class: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-800 border border-sky-200/60', icon: <Globe size={12} className="mr-1" /> },
  pending: { class: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200/60', icon: <Clock size={12} className="mr-1" /> },
  rejected: { class: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800', icon: <XCircle size={12} className="mr-1" /> },
  info: { class: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800', icon: <Info size={12} className="mr-1" /> },
  warning: { class: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800', icon: <AlertTriangle size={12} className="mr-1" /> },
  active: { class: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800', icon: <CheckCircle size={12} className="mr-1" /> },
}

export default function Badge({ variant = 'info', children, className = '' }) {
  const { class: cls, icon } = config[variant] || config.info
  return (
    <span className={`${cls} ${className}`}>
      {icon}{children}
    </span>
  )
}
