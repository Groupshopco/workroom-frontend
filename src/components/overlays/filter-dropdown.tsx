import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AppIcon } from '../app-icon'
import './filter-dropdown.css'

export type FilterDropdownAction =
  | 'sort-ascending'
  | 'sort-descending'
  | 'add-left'
  | 'add-right'
  | 'pin-left'
  | 'pin-right'
  | 'unpin'
  | 'autosize'
  | 'autosize-all'
  | 'reset'
  | 'delete'

type FilterDropdownProps = {
  columnName: string
  isActive?: boolean
  isPinned: boolean
  canDelete: boolean
  onAction: (action: FilterDropdownAction) => void
}

export function FilterDropdown({
  columnName,
  isActive = false,
  isPinned,
  canDelete,
  onAction,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPinMenuOpen, setIsPinMenuOpen] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [pinMenuPosition, setPinMenuPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const pinItemRef = useRef<HTMLButtonElement>(null)
  const pinMenuRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current || !menuRef.current) return

    const trigger = triggerRef.current.getBoundingClientRect()
    const menu = menuRef.current.getBoundingClientRect()
    setPosition({
      top: Math.max(8, Math.min(trigger.bottom + 4, window.innerHeight - menu.height - 8)),
      left: Math.max(8, Math.min(trigger.right - menu.width + 4, window.innerWidth - menu.width - 8)),
    })
  }, [isOpen])

  useLayoutEffect(() => {
    if (!isOpen || !isPinMenuOpen || !pinItemRef.current || !pinMenuRef.current) return

    const item = pinItemRef.current.getBoundingClientRect()
    const submenu = pinMenuRef.current.getBoundingClientRect()
    const left = item.right + 4 + submenu.width > window.innerWidth
      ? item.left - submenu.width - 4
      : item.right + 4
    setPinMenuPosition({
      top: Math.max(8, Math.min(item.top - 5, window.innerHeight - submenu.height - 8)),
      left: Math.max(8, left),
    })
  }, [isOpen, isPinMenuOpen])

  useEffect(() => {
    if (!isOpen) {
      setIsPinMenuOpen(false)
      return
    }

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!(event.target instanceof Node)) return
      if (
        triggerRef.current?.contains(event.target)
        || menuRef.current?.contains(event.target)
        || pinMenuRef.current?.contains(event.target)
      ) return
      setIsOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isPinMenuOpen) setIsPinMenuOpen(false)
        else setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [isOpen, isPinMenuOpen])

  const runAction = (action: FilterDropdownAction) => {
    setIsOpen(false)
    setIsPinMenuOpen(false)
    onAction(action)
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={`Filter ${columnName}`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className={isOpen || isActive ? 'is-selected' : ''}
        onClick={(event) => {
          event.stopPropagation()
          setIsOpen((open) => !open)
        }}
      >
        <AppIcon name="filter" />
      </button>
      {isOpen && createPortal(
        <>
          <div
            ref={menuRef}
            className="filter-dropdown-menu"
            role="menu"
            aria-label={`${columnName} filter`}
            style={{ top: position.top, left: position.left }}
          >
            <button type="button" role="menuitem" onClick={() => runAction('sort-ascending')}>
              Sort Ascending
            </button>
            <button type="button" role="menuitem" onClick={() => runAction('sort-descending')}>
              Sort Descending
            </button>
            <hr />
            <button type="button" role="menuitem" onClick={() => runAction('add-left')}>
              Add Column Left
            </button>
            <button type="button" role="menuitem" onClick={() => runAction('add-right')}>
              Add Column Right
            </button>
            <hr />
            <button
              ref={pinItemRef}
              type="button"
              role="menuitem"
              aria-haspopup="menu"
              aria-expanded={isPinMenuOpen}
              className="has-submenu"
              onClick={() => setIsPinMenuOpen((open) => !open)}
            >
              Pin Column
              <AppIcon name="chevron" />
            </button>
            <hr />
            <button type="button" role="menuitem" onClick={() => runAction('autosize')}>
              Autosize This Column
            </button>
            <button type="button" role="menuitem" onClick={() => runAction('autosize-all')}>
              Autosize All Columns
            </button>
            <button type="button" role="menuitem" onClick={() => runAction('reset')}>
              Reset Columns
            </button>
            <hr />
            <button
              className="is-danger"
              type="button"
              role="menuitem"
              disabled={!canDelete}
              onClick={() => runAction('delete')}
            >
              Delete Column
            </button>
          </div>
          {isPinMenuOpen && (
            <div
              ref={pinMenuRef}
              className="filter-dropdown-menu filter-dropdown-submenu"
              role="menu"
              aria-label="Pin column"
              style={{ top: pinMenuPosition.top, left: pinMenuPosition.left }}
            >
              <button type="button" role="menuitem" onClick={() => runAction('pin-left')}>
                Pin Left
              </button>
              <button type="button" role="menuitem" onClick={() => runAction('pin-right')}>
                Pin Right
              </button>
              {isPinned && (
                <button type="button" role="menuitem" onClick={() => runAction('unpin')}>
                  Unpin Column
                </button>
              )}
            </div>
          )}
        </>,
        document.body,
      )}
    </>
  )
}
