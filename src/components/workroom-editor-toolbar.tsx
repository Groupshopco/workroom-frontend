// Provides workroom title editing, CSV import, and editor actions.
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { AppIcon } from './app-icon'
import { Modal } from './modal'

type WorkroomEditorToolbarProps = {
  title: string
  onTitleChange: (title: string) => void
  onImport: (file: File) => void
}

export function WorkroomEditorToolbar({
  title,
  onTitleChange,
  onImport,
}: WorkroomEditorToolbarProps) {
  const [isAutoRunEnabled, setIsAutoRunEnabled] = useState(true)
  const [isCommandCenterOpen, setIsCommandCenterOpen] = useState(false)
  const [isWorkroomMenuOpen, setIsWorkroomMenuOpen] = useState(false)
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false)
  const [draftTitle, setDraftTitle] = useState(title)
  const importInput = useRef<HTMLInputElement>(null)
  const titleGroup = useRef<HTMLDivElement>(null)
  const closeRenameModal = useCallback(() => setIsRenameModalOpen(false), [])

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
          <button
            className="spreadsheet-import-button"
            type="button"
            onClick={() => importInput.current?.click()}
          >
            <AppIcon name="plus" />
            <span>Import new</span>
          </button>
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
          <button
            className={`spreadsheet-command-button${isCommandCenterOpen ? ' is-open' : ''}`}
            type="button"
            aria-expanded={isCommandCenterOpen}
            onClick={() => setIsCommandCenterOpen((open) => !open)}
          >
            <AppIcon name="eye" />
            <span>AI Command center</span>
          </button>
        </div>
      </div>

      {isCommandCenterOpen && (
        <div className="spreadsheet-command-panel">
          <strong>AI Command center</strong>
          <p>Describe what you want to do with this spreadsheet.</p>
          <input aria-label="Describe a spreadsheet task" placeholder="Ask Workroom AI..." />
        </div>
      )}

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
