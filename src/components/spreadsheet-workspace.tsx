// Manages spreadsheet tabs, cells, rows, columns, search, and filters.
import { useRef, useState } from 'react'
import { AppIcon } from './app-icon'
import { FilterDropdown, type FilterDropdownAction } from './overlays/filter-dropdown'
import { ColumnPrompt } from './overlays/column-prompt'
import type { WorkroomColumnPromptConfig, WorkroomSheet } from '../lib/workrooms'

type PinSide = 'left' | 'right'
type ColumnNumberRecord<T> = Record<number, T>

function shiftColumnRecord<T>(
  record: ColumnNumberRecord<T>,
  fromIndex: number,
  delta: 1 | -1,
): ColumnNumberRecord<T> {
  const next: ColumnNumberRecord<T> = {}
  for (const [key, value] of Object.entries(record)) {
    const index = Number(key)
    if (delta === -1 && index === fromIndex) continue
    if (delta === 1 && index >= fromIndex) next[index + 1] = value
    else if (delta === -1 && index > fromIndex) next[index - 1] = value
    else next[index] = value
  }
  return next
}

function shiftColumnIndex(index: number | null, fromIndex: number, delta: 1 | -1) {
  if (index === null) return null
  if (delta === -1 && index === fromIndex) return null
  if (delta === 1 && index >= fromIndex) return index + 1
  if (delta === -1 && index > fromIndex) return index - 1
  return index
}

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
  const [sortColumn, setSortColumn] = useState<number | null>(null)
  const [pinnedColumns, setPinnedColumns] = useState<ColumnNumberRecord<PinSide>>({})
  const [columnWidths, setColumnWidths] = useState<ColumnNumberRecord<number>>({})
  const [isColumnPromptOpen, setIsColumnPromptOpen] = useState(false)
  const [columnPromptAnchor, setColumnPromptAnchor] = useState<HTMLButtonElement | null>(null)
  const [promptColumnIndex, setPromptColumnIndex] = useState<number | null>(null)
  const addColumnButton = useRef<HTMLButtonElement>(null)
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

  if (!activeSheet) return null

  const saveColumn = (title: string, config: WorkroomColumnPromptConfig) => {
    if (promptColumnIndex === null) {
      updateSheet({
        ...activeSheet,
        columns: [...activeSheet.columns, title],
        rows: activeSheet.rows.map((row) => [...row, '']),
        columnPrompts: [
          ...activeSheet.columns.map((_, index) => activeSheet.columnPrompts?.[index] ?? null),
          config,
        ],
      })
    } else if (promptColumnIndex < activeSheet.columns.length) {
      const prompts = activeSheet.columns.map((_, index) => (
        index === promptColumnIndex
          ? config
          : activeSheet.columnPrompts?.[index] ?? null
      ))
      updateSheet({
        ...activeSheet,
        columns: activeSheet.columns.map((column, index) => (
          index === promptColumnIndex ? title : column
        )),
        columnPrompts: prompts,
      })
    }
    setIsColumnPromptOpen(false)
  }

  const addRow = () => {
    updateSheet({
      ...activeSheet,
      rows: [...activeSheet.rows, emptyRow(activeSheet.columns.length)],
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

  const columnPrompts = () => (
    activeSheet.columns.map((_, index) => activeSheet.columnPrompts?.[index] ?? null)
  )

  const measureColumnWidth = (columnIndex: number) => {
    const header = activeSheet.columns[columnIndex] ?? ''
    const longest = activeSheet.rows.reduce((max, row) => {
      const cell = row[columnIndex] ?? ''
      return cell.length > max.length ? cell : max
    }, header)
    return Math.max(160, Math.min(480, 48 + longest.length * 8))
  }

  const applyColumnShift = (fromIndex: number, delta: 1 | -1) => {
    setColumnWidths((current) => shiftColumnRecord(current, fromIndex, delta))
    setPinnedColumns((current) => shiftColumnRecord(current, fromIndex, delta))
    setFilterColumn((current) => shiftColumnIndex(current, fromIndex, delta))
    setSortColumn((current) => shiftColumnIndex(current, fromIndex, delta))
  }

  const pinnedOffset = (columnIndex: number, side: PinSide) => {
    const rowNumberWidth = 74
    return activeSheet.columns.reduce((offset, _, index) => {
      if (pinnedColumns[index] !== side) return offset
      if (side === 'left' && index >= columnIndex) return offset
      if (side === 'right' && index <= columnIndex) return offset
      return offset + (columnWidths[index] ?? 280)
    }, side === 'left' ? rowNumberWidth : 0)
  }

  const handleFilterAction = (columnIndex: number, action: FilterDropdownAction) => {
    if (action === 'sort-ascending' || action === 'sort-descending') {
      const direction = action === 'sort-ascending' ? 'asc' : 'desc'
      const rows = [...activeSheet.rows].sort((first, second) => {
        const comparison = (first[columnIndex] ?? '').localeCompare(
          second[columnIndex] ?? '',
          undefined,
          { numeric: true, sensitivity: 'base' },
        )
        return direction === 'asc' ? comparison : -comparison
      })
      updateSheet({ ...activeSheet, rows })
      setSortColumn(columnIndex)
      return
    }

    if (action === 'add-left' || action === 'add-right') {
      const insertAt = action === 'add-left' ? columnIndex : columnIndex + 1
      const name = `Column ${activeSheet.columns.length + 1}`
      const prompts = columnPrompts()
      prompts.splice(insertAt, 0, null)
      updateSheet({
        ...activeSheet,
        columns: [
          ...activeSheet.columns.slice(0, insertAt),
          name,
          ...activeSheet.columns.slice(insertAt),
        ],
        rows: activeSheet.rows.map((row) => [
          ...row.slice(0, insertAt),
          '',
          ...row.slice(insertAt),
        ]),
        columnPrompts: prompts,
      })
      applyColumnShift(insertAt, 1)
      return
    }

    if (action === 'pin-left' || action === 'pin-right') {
      setPinnedColumns((current) => ({
        ...current,
        [columnIndex]: action === 'pin-left' ? 'left' : 'right',
      }))
      return
    }

    if (action === 'unpin') {
      setPinnedColumns((current) => {
        const next = { ...current }
        delete next[columnIndex]
        return next
      })
      return
    }

    if (action === 'autosize') {
      setColumnWidths((current) => ({
        ...current,
        [columnIndex]: measureColumnWidth(columnIndex),
      }))
      return
    }

    if (action === 'autosize-all') {
      setColumnWidths(
        Object.fromEntries(
          activeSheet.columns.map((_, index) => [index, measureColumnWidth(index)]),
        ),
      )
      return
    }

    if (action === 'reset') {
      setColumnWidths({})
      setPinnedColumns({})
      setSortColumn(null)
      return
    }

    if (action === 'delete' && activeSheet.columns.length > 1) {
      const prompts = columnPrompts()
      prompts.splice(columnIndex, 1)
      updateSheet({
        ...activeSheet,
        columns: activeSheet.columns.filter((_, index) => index !== columnIndex),
        rows: activeSheet.rows.map((row) => row.filter((_, index) => index !== columnIndex)),
        columnPrompts: prompts,
      })
      applyColumnShift(columnIndex, -1)
    }
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
              {activeSheet.columns.map((column, columnIndex) => {
                const pinSide = pinnedColumns[columnIndex]
                const width = columnWidths[columnIndex]
                return (
                  <th
                    key={`${columnIndex}-${column}`}
                    className={pinSide ? `is-pinned-${pinSide}` : undefined}
                    style={{
                      width,
                      minWidth: width,
                      [pinSide === 'left' ? 'left' : 'right']: pinSide
                        ? pinnedOffset(columnIndex, pinSide)
                        : undefined,
                    }}
                  >
                    <span className="spreadsheet-column-name">{column}</span>
                    <span className="spreadsheet-column-actions">
                      <FilterDropdown
                        columnName={column}
                        isActive={
                          filterColumn === columnIndex
                          || sortColumn === columnIndex
                          || Boolean(pinSide)
                        }
                        isPinned={Boolean(pinSide)}
                        canDelete={activeSheet.columns.length > 1}
                        onAction={(action) => handleFilterAction(columnIndex, action)}
                      />
                      <button
                        type="button"
                        aria-label={`Configure prompt for ${column}`}
                        aria-expanded={isColumnPromptOpen && promptColumnIndex === columnIndex}
                        onClick={(event) => {
                          setColumnPromptAnchor(event.currentTarget)
                          setPromptColumnIndex(columnIndex)
                          setIsColumnPromptOpen(true)
                        }}
                      >
                        <AppIcon name="more" />
                      </button>
                    </span>
                  </th>
                )
              })}
              <th className="spreadsheet-add-column-cell">
                <button
                  ref={addColumnButton}
                  type="button"
                  aria-expanded={isColumnPromptOpen && promptColumnIndex === null}
                  onClick={(event) => {
                    setColumnPromptAnchor(event.currentTarget)
                    setPromptColumnIndex(null)
                    setIsColumnPromptOpen(true)
                  }}
                  aria-label="Configure and add column"
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
                {row.map((value, columnIndex) => {
                  const pinSide = pinnedColumns[columnIndex]
                  const width = columnWidths[columnIndex]
                  return (
                    <td
                      key={columnIndex}
                      className={pinSide ? `is-pinned-${pinSide}` : undefined}
                      style={{
                        width,
                        minWidth: width,
                        [pinSide === 'left' ? 'left' : 'right']: pinSide
                          ? pinnedOffset(columnIndex, pinSide)
                          : undefined,
                      }}
                    >
                      <input
                        aria-label={`Row ${index + 1}, ${activeSheet.columns[columnIndex]}`}
                        value={value}
                        onChange={(event) => updateCell(index, columnIndex, event.target.value)}
                      />
                    </td>
                  )
                })}
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
      <ColumnPrompt
        key={`${activeSheet.id}-${promptColumnIndex ?? 'new'}-${isColumnPromptOpen}`}
        isOpen={isColumnPromptOpen}
        anchorElement={columnPromptAnchor}
        initialTitle={promptColumnIndex === null ? '' : activeSheet.columns[promptColumnIndex] ?? ''}
        initialConfig={
          promptColumnIndex === null
            ? null
            : activeSheet.columnPrompts?.[promptColumnIndex] ?? null
        }
        onClose={() => setIsColumnPromptOpen(false)}
        onSaveColumn={saveColumn}
      />
    </div>
  )
}
