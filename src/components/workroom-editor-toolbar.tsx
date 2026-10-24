// Provides workroom title editing, CSV import, and editor actions.
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { AppIcon } from './app-icon'
import { Modal } from './overlays/modal'

type WorkroomEditorToolbarProps = {
  title: string
  isCommandCenterOpen: boolean
  onTitleChange: (title: string) => void
  onImport: (file: File) => void
  onToggleCommandCenter: () => void
}

export function WorkroomEditorToolbar({
  title,
  isCommandCenterOpen,
  onTitleChange,
  onImport,
  onToggleCommandCenter,
}: WorkroomEditorToolbarProps) {
  const [isAutoRunEnabled, setIsAutoRunEnabled] = useState(true)
  const [isWorkroomMenuOpen, setIsWorkroomMenuOpen] = useState(false)
  const [isImportMenuOpen, setIsImportMenuOpen] = useState(false)
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false)
  const [draftTitle, setDraftTitle] = useState(title)
  const importInput = useRef<HTMLInputElement>(null)
  const importMenu = useRef<HTMLDivElement>(null)
  const titleGroup = useRef<HTMLDivElement>(null)
  const closeRenameModal = useCallback(() => setIsRenameModalOpen(false), [])

  useEffect(() => {
    if (!isImportMenuOpen) return

    const closeMenuOnOutsideClick = (event: MouseEvent) => {
      if (event.target instanceof Node && !importMenu.current?.contains(event.target)) {
        setIsImportMenuOpen(false)
      }
    }
    const closeMenuOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsImportMenuOpen(false)
    }

    document.addEventListener('mousedown', closeMenuOnOutsideClick)
    document.addEventListener('keydown', closeMenuOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeMenuOnOutsideClick)
      document.removeEventListener('keydown', closeMenuOnEscape)
    }
  }, [isImportMenuOpen])

  useEffect(() => {
    if (!isWorkroomMenuOpen) return

    const closeMenuOnOutsideClick = (event: MouseEvent) => {
      if (event.target instanceof Node && !titleGroup.current?.contains(event.target)) {
        setIsWorkroomMenuOpen(false)
      }
    }
    const closeMenuOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsWorkroomMenuOpen(false)
    }

    document.addEventListener('mousedown', closeMenuOnOutsideClick)
    document.addEventListener('keydown', closeMenuOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeMenuOnOutsideClick)
      document.removeEventListener('keydown', closeMenuOnEscape)
    }
  }, [isWorkroomMenuOpen])

  return (
    <>
      <div className="spreadsheet-editor-topbar">
        <div className="spreadsheet-editor-heading">
          <nav className="spreadsheet-breadcrumbs" aria-label="Breadcrumb">
            <Link to="/dashboard">Home</Link>
            <span aria-hidden="true">/</span>
          </nav>
          <div className="spreadsheet-title-group" ref={titleGroup}>
            <span className="spreadsheet-title" style={{ width: `${Math.max(title.length, 12)}ch` }}>
              {title}
            </span>
            <button
              className="spreadsheet-title-edit"
              type="button"
              aria-label="Edit workroom name"
              aria-expanded={isWorkroomMenuOpen}
              aria-haspopup="menu"
              onClick={() => setIsWorkroomMenuOpen((open) => !open)}
            >
              <AppIcon name="pencil" />
            </button>
            {isWorkroomMenuOpen && (
              <div className="workroom-name-menu" role="group" aria-label="Workroom actions">
                <button
                  className="workroom-name-menu-item is-highlighted"
                  type="button"
                  onClick={() => {
                    setIsWorkroomMenuOpen(false)
                    setDraftTitle(title)
                    setIsRenameModalOpen(true)
                  }}
                >
                  <AppIcon name="pencil" />
                  <span>Edit Workroom name</span>
                </button>
                <div className="workroom-name-menu-item">
                  <AppIcon name="copy" />
                  <span>Duplicate Workroom</span>
                </div>
                <div className="workroom-name-menu-item">
                  <AppIcon name="star" />
                  <span>Favorite</span>
                </div>
                <div className="workroom-name-menu-item">
                  <AppIcon name="share" />
                  <span>Share</span>
                </div>
                <div className="workroom-name-menu-divider" />
                <div className="workroom-name-menu-item is-danger">
                  <AppIcon name="trash" />
                  <span>Delete workroom</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="spreadsheet-editor-actions">
          <button
            className="spreadsheet-auto-run"
            type="button"
            aria-pressed={isAutoRunEnabled}
            onClick={() => setIsAutoRunEnabled((enabled) => !enabled)}
          >
            <span>Auto-run</span>
            <span className={`spreadsheet-toggle${isAutoRunEnabled ? ' is-on' : ''}`} aria-hidden="true">
              <span />
            </span>
          </button>
          <div className="spreadsheet-import-menu-wrap" ref={importMenu}>
            <button
              className="spreadsheet-import-button"
              type="button"
              aria-expanded={isImportMenuOpen}
              aria-haspopup="menu"
              onClick={() => setIsImportMenuOpen((open) => !open)}
            >
              <AppIcon name="plus" />
              <span>Import new</span>
            </button>
            {isImportMenuOpen && (
              <div className="spreadsheet-import-menu" role="menu" aria-label="Import options">
                <button
                  className="spreadsheet-import-menu-item is-highlighted"
                  type="button"
                  role="menuitem"
                  disabled
                  title="Excel import is not available yet"
                >
                  Import from excel
                </button>
                <button
                  className="spreadsheet-import-menu-item"
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setIsImportMenuOpen(false)
                    importInput.current?.click()
                  }}
                >
                  Import csv files
                </button>
              </div>
            )}
            <input
              ref={importInput}
              className="spreadsheet-file-input"
              type="file"
              accept=".csv,text/csv"
              aria-label="Import CSV file"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) onImport(file)
                event.target.value = ''
              }}
            />
          </div>
          {!isCommandCenterOpen && (
            <button
              className="spreadsheet-command-button"
              type="button"
              aria-label="Open command center"
              aria-expanded={false}
              title="Open command center"
              onClick={onToggleCommandCenter}
            >
              <AppIcon name="eye" />
              <span>AI Command center</span>
            </button>
          )}
        </div>
      </div>

      {isRenameModalOpen && (
        <Modal title="Edit Workroom name" onClose={closeRenameModal}>
          <form
            className="rename-workroom-form"
            onSubmit={(event) => {
              event.preventDefault()
              const newTitle = draftTitle.trim()
              if (!newTitle) return
              onTitleChange(newTitle)
              setIsRenameModalOpen(false)
            }}
          >
            <label className="rename-workroom-label" htmlFor="rename-workroom-input">
              Workroom name
            </label>
            <input
              autoFocus
              className="rename-workroom-input"
              id="rename-workroom-input"
              value={draftTitle}
              placeholder="Enter your workroom name here"
              onChange={(event) => setDraftTitle(event.target.value)}
            />
            <div className="rename-workroom-actions">
              <button
                className="rename-workroom-cancel"
                type="button"
                onClick={() => setIsRenameModalOpen(false)}
              >
                Cancel
              </button>
              <button className="rename-workroom-save" type="submit" disabled={!draftTitle.trim()}>
                Save
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}
