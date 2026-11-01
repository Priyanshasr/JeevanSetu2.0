import React from 'react'

const colors = {
  active: 'bg-green-500',
  inactive: 'bg-gray-400',
  pending: 'bg-yellow-500',
  error: 'bg-red-500',
  running: 'bg-blue-500 animate-pulse',
}

export default function StatusIndicator({ status = 'inactive', label, className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className={`w-2 h-2 rounded-full ${colors[status] || colors.inactive}`} />
      {label && <span className="text-sm text-gray-600">{label}</span>}
    </div>
  )
}
