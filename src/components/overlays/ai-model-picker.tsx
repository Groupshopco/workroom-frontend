import { useEffect, useRef, useState } from 'react'
import { AppIcon } from '../app-icon'
import './ai-model-picker.css'

const modelOptions = [
  'GPT 3.5',
  'GPT 4',
  'Gemini',
  'Claude Haiku',
  'Claude Sonnet',
  'Claude Opus',
]

type AIModelPickerProps = {
  value: string
  onChange: (value: string) => void
}

export function AIModelPicker({ value, onChange }: AIModelPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const options = modelOptions.includes(value) ? modelOptions : [...modelOptions, value]

  useEffect(() => {
    if (!isOpen) return

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (event.target instanceof Node && !dropdownRef.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('mousedown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [isOpen])

  return (
    <div className="ai-model-picker" ref={dropdownRef}>
      <button
        className="ai-model-picker-trigger"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span>{value}</span>
        <AppIcon name="chevron" />
      </button>
      {isOpen && (
        <div className="ai-model-picker-options" role="listbox" aria-label="AI model">
          {options.map((option) => (
            <button
              className={`ai-model-picker-option${option === value ? ' is-selected' : ''}`}
              type="button"
              role="option"
              aria-selected={option === value}
              key={option}
              onClick={() => {
                onChange(option)
                setIsOpen(false)
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
