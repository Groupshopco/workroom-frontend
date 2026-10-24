import { useEffect, useRef, useState } from 'react'
import { AppIcon } from '../app-icon'
import './sort-dropdown.css'

const SORT_OPTIONS = [
  { value: 'recent', label: 'Most recent' },
  { value: 'favorites', label: 'Favorites' },
  { value: 'oldest', label: 'Oldest to Newest' },
  { value: 'newest', label: 'Newest to Oldest' },
] as const

export type SortOption = (typeof SORT_OPTIONS)[number]['value']

type SortDropdownProps = {
  value: SortOption
  onChange: (value: SortOption) => void
  label?: string
  className?: string
}

export function SortDropdown({
  value,
  onChange,
  label = 'Sort items',
  className,
}: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const selectedOption = SORT_OPTIONS.find((option) => option.value === value)

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
    <div className={`sort-dropdown${className ? ` ${className}` : ''}`} ref={dropdownRef}>
      <button
        className="sort-dropdown-trigger"
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <AppIcon name="chevron" />
        <span>{selectedOption?.label}</span>
      </button>
      {isOpen && (
        <div className="sort-dropdown-options" role="menu" aria-label={label}>
          {SORT_OPTIONS.map((option) => (
            <button
              className={`sort-dropdown-option${value === option.value ? ' is-selected' : ''}`}
              type="button"
              role="menuitemradio"
              aria-checked={value === option.value}
              key={option.value}
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
