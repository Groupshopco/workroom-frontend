// Manages spreadsheet tabs, cells, rows, columns, search, and filters.
import { useState } from 'react'
import { AppIcon } from './app-icon'
import type { WorkroomSheet } from '../lib/workrooms'

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
  const activeSheet = sheets.find(({ id }) => id === activeSheetId) ?? sheets[0]

  if (!activeSheet) return null

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

  const addColumn = () => {
    updateSheet({
      ...activeSheet,
      columns: [...activeSheet.columns, `Column ${activeSheet.columns.length + 1}`],
      rows: activeSheet.rows.map((row) => [...row, '']),
    })
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
              ×
            </button>
          </div>
        ))}
        <button
          className="spreadsheet-add-sheet"
          type="button"
          onClick={addSheet}
          aria-label="Add spreadsheet"
        >
          +
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
            <button type="button" aria-label="Close search" onClick={toggleSearch}>×</button>
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
              ×
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
                <button type="button" onClick={addColumn} aria-label="Add column">+</button>
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
                <td className="spreadsheet-grid-extra-cell" />
              </tr>
            ))}
            <tr>
              <th className="spreadsheet-row-number spreadsheet-add-row-cell">
                <button type="button" onClick={addRow} aria-label="Add row">+</button>
              </th>
              {activeSheet.columns.map((column, index) => (
                <td className="spreadsheet-grid-extra-cell" key={`${column}-${index}`} />
              ))}
              <td className="spreadsheet-grid-extra-cell" />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
