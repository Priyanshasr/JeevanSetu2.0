import React from 'react'

const palette = ['bg-teal-500', 'bg-navy-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500']

function getColor(name) {
  if (!name) return palette[0]
  let sum = 0
  for (let c of name) sum += c.charCodeAt(0)
  return palette[sum % palette.length]
}

function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || '?'
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
}

export default function Avatar({ name, size = 'md', className = '' }) {
  const initials = getInitials(name)
  const color = getColor(name)
  return (
    <div className={`${sizes[size]} ${color} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 ${className}`}>
      {initials}
    </div>
  )
}
