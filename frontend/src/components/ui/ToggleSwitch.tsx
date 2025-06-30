import { useState } from 'react'

interface ToggleSwitchProps {
  value: boolean
  onChange: (value: boolean) => void
  disabled?: boolean
}

export function ToggleSwitch({
  value = true,
  onChange,
  disabled = false,
}: ToggleSwitchProps) {
  const [isActive, setIsActive] = useState(value)

  const handleToggle = () => {
    const newValue = !isActive
    setIsActive(newValue)
    onChange?.(newValue)
  }

  return (
    <div className='flex items-center gap-4'>
      <button
        type='button'
        onClick={handleToggle}
        className='relative inline-flex h-6 w-16 items-center rounded-full transition-colors focus:outline-none bg-gray-200 cursor-pointer'
        disabled={disabled}
      >
        <span
          className={`absolute left-5 text-slate-700 transition-all duration-300 text-xs ${
            isActive ? 'opacity-100 -translate-x-2' : 'opacity-0 translate-x-0'
          }`}
        >
          Ativo
        </span>

        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-indigo-700 transition-transform duration-300 ease-in-out ${
            isActive ? 'translate-x-11' : 'translate-x-1'
          }`}
        />

        <span
          className={`absolute left-6 text-slate-700 transition-all duration-300 text-xs ${
            isActive ? 'opacity-0 -translate-x-2' : 'opacity-100 translate-x-0'
          }`}
        >
          Inativo
        </span>
      </button>
    </div>
  )
}
