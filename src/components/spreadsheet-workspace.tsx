// Manages spreadsheet tabs, cells, rows, columns, search, and filters.
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AppIcon } from './app-icon'
import '../styles/column-prompt.css'
import type { WorkroomColumnPromptConfig, WorkroomSheet } from '../lib/workrooms'

type SpreadsheetWorkspaceProps = {
  sheets: WorkroomSheet[]
  onChange: (sheets: WorkroomSheet[]) => void
}

const emptyRow = (columnCount: number) => Array.from({ length: columnCount }, () => '')

function createSheet(index: number): WorkroomSheet {
  return {
    id: crypto.randomUUID(),
    name: `Sheet ${index}`,
    columns: ['Column 1', 'Column 2', 'Column 3'],
    rows: [['', '', '']],
  }
}

export function SpreadsheetWorkspace({ sheets, onChange }: SpreadsheetWorkspaceProps) {
  const [activeSheetId, setActiveSheetId] = useState(sheets[0]?.id ?? '')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [filterColumn, setFilterColumn] = useState<number | null>(null)
  const [filterText, setFilterText] = useState('')
  const [isColumnPromptOpen, setIsColumnPromptOpen] = useState(false)
  const [columnPromptPosition, setColumnPromptPosition] = useState({ top: 8, left: 8 })
  const [columnTitle, setColumnTitle] = useState('')
  const [columnContext, setColumnContext] = useState('')
  const [columnModel, setColumnModel] = useState('GPT - 4o mini')
  const [isColumnAutoRunEnabled, setIsColumnAutoRunEnabled] = useState(false)
  const [isColumnFocusMode, setIsColumnFocusMode] = useState(false)
  const [columnPrompt, setColumnPrompt] = useState('')
  const [columnAttachmentName, setColumnAttachmentName] = useState('')
  const addColumnButton = useRef<HTMLButtonElement>(null)
  const columnPromptDialog = useRef<HTMLFormElement>(null)
  const columnAttachmentInput = useRef<HTMLInputElement>(null)
  const activeSheet = sheets.find(({ id }) => id === activeSheetId) ?? sheets[0]

  const updateSheet = (updatedSheet: WorkroomSheet) => {
    onChange(sheets.map((sheet) => sheet.id === updatedSheet.id ? updatedSheet : sheet))
  }

  const addSheet = () => {
    const sheet = createSheet(sheets.length + 1)
    onChange([...sheets, sheet])
    setActiveSheetId(sheet.id)
  }

  const closeSheet = (sheetId: string) => {
    if (sheets.length === 1) return
    const remainingSheets = sheets.filter(({ id }) => id !== sheetId)
    onChange(remainingSheets)
    if (activeSheetId === sheetId) setActiveSheetId(remainingSheets[0].id)
  }

  useLayoutEffect(() => {
    if (!isColumnPromptOpen || !addColumnButton.current || !columnPromptDialog.current) return

    const buttonBounds = addColumnButton.current.getBoundingClientRect()
    const dialogBounds = columnPromptDialog.current.getBoundingClientRect()
    setColumnPromptPosition({
      top: Math.max(
        8,
        Math.min(buttonBounds.bottom + 12, window.innerHeight - dialogBounds.height - 8),
      ),
      left: Math.max(
        8,
        Math.min(buttonBounds.left - 40, window.innerWidth - dialogBounds.width - 8),
      ),
    })
  }, [isColumnPromptOpen])

  useEffect(() => {
    if (!isColumnPromptOpen) return

    const closeOnOutsideClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (columnPromptDialog.current?.contains(target) || addColumnButton.current?.contains(target)) return
      setIsColumnPromptOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsColumnPromptOpen(false)
    }

    document.addEventListener('mousedown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [isColumnPromptOpen])

  if (!activeSheet) return null

  const addColumn = (config: WorkroomColumnPromptConfig) => {
    const title = columnTitle.trim()
    if (!title) return
    updateSheet({
      ...activeSheet,
      columns: [...activeSheet.columns, title],
      rows: activeSheet.rows.map((row) => [...row, '']),
      columnPrompts: [
        ...activeSheet.columns.map((_, index) => activeSheet.columnPrompts?.[index] ?? null),
        config,
      ],
    })
    setColumnTitle('')
    setColumnContext('')
    setColumnPrompt('')
    setColumnAttachmentName('')
    setIsColumnAutoRunEnabled(false)
    setIsColumnFocusMode(false)
    setIsColumnPromptOpen(false)
  }

  const addRow = () => {
    updateSheet({
      ...activeSheet,
      rows: [...activeSheet.rows, emptyRow(activeSheet.columns.length)],
    })
  }

  const renameColumn = (columnIndex: number) => {
    const currentName = activeSheet.columns[columnIndex]
    const name = window.prompt('Rename column', currentName)?.trim()
    if (!name || name === currentName) return

    updateSheet({
      ...activeSheet,
      columns: activeSheet.columns.map((column, index) => (
        index === columnIndex ? name : column
      )),
    })
  }

  const toggleSearch = () => {
    setIsSearchOpen((open) => !open)
    setSearchText('')
  }

  const visibleRows = activeSheet.rows
    .map((row, index) => ({ row, index }))
    .filter(({ row }) => {
      const matchesColumn = filterColumn === null
        || !filterText
        || row[filterColumn]?.toLocaleLowerCase().includes(filterText.toLocaleLowerCase())
      const matchesSearch = !searchText
        || row.some((cell) => cell.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()))
      return matchesColumn && matchesSearch
    })

  const updateCell = (rowIndex: number, columnIndex: number, value: string) => {
    const rows = activeSheet.rows.map((row, index) => (
      index === rowIndex
        ? row.map((cell, cellIndex) => cellIndex === columnIndex ? value : cell)
        : row
    ))
    updateSheet({ ...activeSheet, rows })
  }

  return (
    <div className="spreadsheet-workspace">
      <div className="spreadsheet-sheet-tabs" role="tablist" aria-label="Spreadsheets">
        {sheets.map((sheet) => (
          <div
            className={`spreadsheet-sheet-tab${sheet.id === activeSheet.id ? ' is-active' : ''}`}
            key={sheet.id}
          >
            <button
              className="spreadsheet-sheet-select"
              type="button"
              role="tab"
              aria-selected={sheet.id === activeSheet.id}
              onClick={() => setActiveSheetId(sheet.id)}
            >
              {sheet.name}
            </button>
            <button
              className="spreadsheet-sheet-close"
              type="button"
              aria-label={`Close ${sheet.name}`}
              onClick={() => closeSheet(sheet.id)}
              disabled={sheets.length === 1}
            >
              <AppIcon name="close" />
            </button>
          </div>
        ))}
        <button
          className="spreadsheet-add-sheet"
          type="button"
          onClick={addSheet}
          aria-label="Add spreadsheet"
        >
          <AppIcon name="plus" />
        </button>
      </div>

      <div className="spreadsheet-toolbar" aria-label="Spreadsheet tools">
        <button
          type="button"
          className="spreadsheet-tool-button"
          aria-expanded={isSearchOpen}
          onClick={toggleSearch}
        >
          <AppIcon name="search" />
          <span>Search</span>
        </button>
        <span className="spreadsheet-toolbar-divider" />
        <button type="button" className="spreadsheet-tool-button" disabled>
          <AppIcon name="undo" />
          <span>Undo</span>
        </button>
        <button type="button" className="spreadsheet-tool-button" disabled>
          <AppIcon name="redo" />
          <span>Redo</span>
        </button>
        {isSearchOpen && (
          <label className="spreadsheet-filter-input">
            <AppIcon name="search" />
            <input
              aria-label="Search spreadsheet"
              placeholder="Search..."
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />
            <button type="button" aria-label="Close search" onClick={toggleSearch}>
              <AppIcon name="close" />
            </button>
          </label>
        )}
        {filterColumn !== null && (
          <label className="spreadsheet-filter-input">
            <AppIcon name="search" />
            <input
              aria-label={`Filter ${activeSheet.columns[filterColumn]}`}
              placeholder={`Filter ${activeSheet.columns[filterColumn]}...`}
              value={filterText}
              onChange={(event) => setFilterText(event.target.value)}
            />
            <button
              type="button"
              aria-label="Clear column filter"
              onClick={() => {
                setFilterColumn(null)
                setFilterText('')
              }}
            >
              <AppIcon name="close" />
            </button>
          </label>
        )}
      </div>

      <div className="spreadsheet-grid-scroll">
        <table className="spreadsheet-grid">
          <thead>
            <tr>
              <th className="spreadsheet-row-number" aria-label="Row number">1</th>
              {activeSheet.columns.map((column, columnIndex) => (
                <th key={`${columnIndex}-${column}`}>
                  <span className="spreadsheet-column-name">{column}</span>
                  <span className="spreadsheet-column-actions">
                    <button
                      type="button"
                      aria-label={`Filter ${column}`}
                      className={filterColumn === columnIndex ? 'is-selected' : ''}
                      onClick={() => {
                        setFilterColumn(filterColumn === columnIndex ? null : columnIndex)
                        setFilterText('')
                      }}
                    >
                      <AppIcon name="filter" />
                    </button>
                    <button
                      type="button"
                      aria-label={`More options for ${column}`}
                      onClick={() => renameColumn(columnIndex)}
                    >
                      <AppIcon name="more" />
                    </button>
                  </span>
                </th>
              ))}
              <th className="spreadsheet-add-column-cell">
                <button
                  ref={addColumnButton}
                  type="button"
                  onClick={() => setIsColumnPromptOpen(true)}
                  aria-label="Configure and add column"
                  aria-expanded={isColumnPromptOpen}
                >
                  <AppIcon name="plus" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map(({ row, index }) => (
              <tr key={index}>
                <th className="spreadsheet-row-number" scope="row">{index + 2}</th>
                {row.map((value, columnIndex) => (
                  <td key={columnIndex}>
                    <input
                      aria-label={`Row ${index + 1}, ${activeSheet.columns[columnIndex]}`}
                      value={value}
                      onChange={(event) => updateCell(index, columnIndex, event.target.value)}
                    />
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <th className="spreadsheet-row-number spreadsheet-add-row-cell">
                <button type="button" onClick={addRow} aria-label="Add row">
                  <AppIcon name="plus" />
                </button>
              </th>
              {activeSheet.columns.map((column, index) => (
                <td className="spreadsheet-grid-extra-cell" key={`${column}-${index}`} />
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      {isColumnPromptOpen && createPortal(
        <form
          ref={columnPromptDialog}
          className="column-prompt-dialog"
          role="dialog"
          aria-modal="false"
          aria-labelledby="column-prompt-title"
          style={{ top: columnPromptPosition.top, left: columnPromptPosition.left }}
          onSubmit={(event) => {
            event.preventDefault()
            addColumn({
              context: columnContext.trim(),
              model: columnModel,
              autoRun: isColumnAutoRunEnabled,
              focusMode: isColumnFocusMode,
              attachmentName: columnAttachmentName,
              prompt: columnPrompt.trim(),
            })
          }}
        >
          <header className="column-prompt-header">
            <h2 id="column-prompt-title">Configure column prompt</h2>
            <button
              className="column-prompt-close"
              type="button"
              aria-label="Close column prompt"
              onClick={() => setIsColumnPromptOpen(false)}
            >
              <AppIcon name="close" />
            </button>
          </header>
          <label className="column-prompt-field">
            <span>Column Title</span>
            <input
              autoFocus
              required
              value={columnTitle}
              placeholder="Add column title"
              onChange={(event) => setColumnTitle(event.target.value)}
            />
          </label>
          <label className="column-prompt-field">
            <span>Context (Optional)</span>
            <span className="column-prompt-textarea-wrap">
              <textarea
                value={columnContext}
                placeholder="Add context for the column"
                onChange={(event) => setColumnContext(event.target.value)}
              />
              <button
                type="button"
                aria-label="Clear column context"
                onClick={() => setColumnContext('')}
              >
                <AppIcon name="refresh" />
              </button>
            </span>
          </label>
          <label className="column-prompt-field">
            <span>Model</span>
            <select value={columnModel} onChange={(event) => setColumnModel(event.target.value)}>
              <option>GPT - 4o mini</option>
              <option>GPT 3.5</option>
              <option>GPT 4</option>
            </select>
          </label>
          <button
            className="column-prompt-auto-run"
            type="button"
            aria-pressed={isColumnAutoRunEnabled}
            onClick={() => setIsColumnAutoRunEnabled((enabled) => !enabled)}
          >
            <span>Auto run prompt</span>
            <span className={`column-prompt-toggle${isColumnAutoRunEnabled ? ' is-on' : ''}`} aria-hidden="true">
              <span />
            </span>
          </button>
          <div className="column-prompt-tools">
            <button
              type="button"
              onClick={() => columnAttachmentInput.current?.click()}
            >
              Add attachments <AppIcon name="chevron" />
            </button>
            <input
              ref={columnAttachmentInput}
              className="visually-hidden"
              type="file"
              aria-label="Add a column prompt attachment"
              onChange={(event) => {
                setColumnAttachmentName(event.target.files?.[0]?.name ?? '')
                event.target.value = ''
              }}
            />
            <button
              type="button"
              aria-pressed={isColumnFocusMode}
              onClick={() => setIsColumnFocusMode((enabled) => !enabled)}
            >
              Add Focus <AppIcon name="chevron" />
            </button>
          </div>
          {columnAttachmentName && (
            <span className="column-prompt-attachment">{columnAttachmentName}</span>
          )}
          <label className="column-prompt-field column-prompt-main-field">
            <span>Prompt</span>
            <span className="column-prompt-textarea-wrap">
              <textarea
                value={columnPrompt}
                placeholder="Enter your prompt here."
                onChange={(event) => setColumnPrompt(event.target.value)}
              />
              <button
                className="column-prompt-submit"
                type="submit"
                aria-label="Add configured column"
                disabled={!columnTitle.trim()}
              >
                <AppIcon name="corner-down-left" />
              </button>
            </span>
          </label>
        </form>,
        document.body,
      )}
    </div>
  )
}
