import React from 'react'

export default function LoadingSpinner({ size = 24, className = '' }) {
  return (
    <div
      className={`animate-spin rounded-full border-2 border-gray-200 ${className}`}
      style={{
        width: size,
        height: size,
        borderTopColor: '#0d9488',
      }}
    />
  )
}
