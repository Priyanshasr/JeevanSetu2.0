import React from 'react'
import { Loader2 } from 'lucide-react'

const variants = {
  primary: 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm hover:shadow-md',
  secondary: 'bg-white hover:bg-gray-50 text-navy-700 border border-gray-200 shadow-sm hover:shadow-md',
  danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md',
  ghost: 'bg-transparent hover:bg-gray-100 text-navy-700',
  outline: 'bg-transparent border-2 border-teal-600 text-teal-600 hover:bg-teal-50',
}
const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  children,
  leftIcon,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : leftIcon}
      {children}
    </button>
  )
}
