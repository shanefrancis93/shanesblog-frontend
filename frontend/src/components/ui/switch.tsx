import { useState } from 'react'

interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
  children?: React.ReactNode
}

export function Switch({ checked, onChange, className = '', children }: SwitchProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full 
        ${checked ? 'bg-blue-600' : 'bg-gray-200'} 
        ${className}`}
    >
      {children}
      <span
        className={`${
          checked ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
      />
    </button>
  )
}