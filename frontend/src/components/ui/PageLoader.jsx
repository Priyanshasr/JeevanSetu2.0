import React from 'react'
import LoadingSpinner from './LoadingSpinner'

export default function PageLoader({ message = 'Loading...' }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-soft-blue z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">J</span>
          </div>
          <span className="text-xl font-bold text-navy-900">JeevanSetu 2.0</span>
        </div>
        <LoadingSpinner size={40} />
        <p className="text-gray-500 text-sm">{message}</p>
      </div>
    </div>
  )
}
