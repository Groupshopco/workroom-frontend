// Provides an accessible, reusable modal dialog.
import { useEffect, useId, useRef } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import './modal.css'

type ModalProps = {
  title: string
  children: ReactNode
  onClose: () => void
  className?: string
}

export function Modal({ title, children, onClose, className }: ModalProps) {
  const titleId = useId()
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    modalRef.current?.querySelector<HTMLElement>('[autofocus], input, button')?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab' || !modalRef.current) return

      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'button:not(:disabled), input:not(:disabled), [href], [tabindex]:not([tabindex="-1"])',
      )
      const first = focusable.item(0)
      const last = focusable.item(focusable.length - 1)

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      previouslyFocused?.focus()
    }
  }, [onClose])

  const closeOnBackdrop = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose()
  }

  return createPortal(
    <div className="app-modal-backdrop" onMouseDown={closeOnBackdrop}>
      <section
        ref={modalRef}
        className={`app-modal${className ? ` ${className}` : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <h2 className="app-modal-title" id={titleId}>{title}</h2>
        {children}
      </section>
    </div>,
    document.body,
  )
}
