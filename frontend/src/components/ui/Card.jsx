import React from 'react'

export default function Card({ children, header, footer, className = '' }) {
  return (
    <div className={`card ${className}`}>
      {header && <div className="mb-4 pb-4 border-b border-gray-100">{header}</div>}
      {children}
      {footer && <div className="mt-4 pt-4 border-t border-gray-100">{footer}</div>}
    </div>
  )
}
