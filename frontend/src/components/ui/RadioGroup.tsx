interface RadioGroupProps {
  options: { value: string; label: string }[]
  selectedValue: string
  onChange: (value: string) => void
  disabled?: boolean
  required?: boolean
}

export function RadioGroup({
  options,
  selectedValue,
  onChange,
  disabled = false,
}: RadioGroupProps) {
  return (
    <div className='flex gap-4 items-start pr-8'>
      {options.map((option) => (
        <label
          key={option.value}
          className={`flex space-x-2 cursor-pointer ${
            disabled ? 'opacity-50' : ''
          }`}
        >
          <input
            type='radio'
            value={option.value}
            checked={selectedValue === option.value}
            onChange={() => onChange(option.value)}
            className='h-4 w-4 text-default focus:ring-default border-default'
            disabled={disabled}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  )
}
