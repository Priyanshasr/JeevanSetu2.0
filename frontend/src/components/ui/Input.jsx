import React, { forwardRef } from 'react'

const Input = forwardRef(function Input({
  label,
  error,
  iconLeft,
  className = '',
  required,
  ...props
}, ref) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {iconLeft && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {iconLeft}
          </div>
        )}
        <input
          ref={ref}
          className={`input-field ${iconLeft ? 'pl-10' : ''} ${error ? 'border-red-400 focus:ring-red-400' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
})

export default Input
