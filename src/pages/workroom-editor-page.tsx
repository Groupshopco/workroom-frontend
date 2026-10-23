// Loads a workroom and coordinates its spreadsheet editor.
import { Link, useParams } from '@tanstack/react-router'
import { CommandCenter } from '../components/command-center'
import { SpreadsheetWorkspace } from '../components/spreadsheet-workspace'
import { WorkroomEditorToolbar } from '../components/workroom-editor-toolbar'
import { WorkroomLayout } from '../components/workroom-layout'
import { getWorkroom, saveWorkroom, type WorkroomRecord, type WorkroomSheet } from '../lib/workrooms'
import { useState } from 'react'

function parseCsv(text: string, fallbackName: string): WorkroomSheet {
  const records = text
    .split(/\r?\n/)
    .filter((line) => line.length > 0)
    .map((line) => line.split(','))
  const columns = records[0]?.map((name, index) => name.trim() || `Column ${index + 1}`)
    ?? ['Column 1', 'Column 2', 'Column 3']
  const rows = records.slice(1).map((row) => (
    columns.map((_, index) => row[index]?.trim() ?? '')
  ))

  return {
    id: crypto.randomUUID(),
    name: fallbackName,
    columns,
    rows: rows.length ? rows : [columns.map(() => '')],
  }
}

export function WorkroomEditorPage() {
  const { workroomId } = useParams({ from: '/workroom/$workroomId' })
  const [workroom, setWorkroom] = useState(() => getWorkroom(workroomId))
  const [isCommandCenterOpen, setIsCommandCenterOpen] = useState(true)

  const updateWorkroom = (changes: Partial<WorkroomRecord>) => {
    if (!workroom) return
    const updatedWorkroom = { ...workroom, ...changes }
    saveWorkroom(updatedWorkroom)
    setWorkroom(updatedWorkroom)
  }

  const importCsv = async (file: File) => {
    const sheet = parseCsv(await file.text(), file.name.replace(/\.csv$/i, '') || 'Imported sheet')
    updateWorkroom({
      lastEdited: 'just now',
      sheets: [...(workroom?.sheets ?? []), sheet],
    })
  }

  if (!workroom) {
    return (
      <WorkroomLayout>
        <section className="spreadsheet-editor spreadsheet-not-found">
          <p>This workroom could not be found.</p>
          <Link to="/dashboard">Back to dashboard</Link>
        </section>
      </WorkroomLayout>
    )
  }

  return (
    <WorkroomLayout
      isCommandCenterOpen={isCommandCenterOpen}
      onCommandCenterOpenChange={setIsCommandCenterOpen}
    >
      <section className={`spreadsheet-editor${isCommandCenterOpen ? ' has-command-center' : ''}`}>
        <div className="spreadsheet-editor-content">
          <WorkroomEditorToolbar
            title={workroom.title}
            isCommandCenterOpen={isCommandCenterOpen}
            onTitleChange={(title) => updateWorkroom({ title })}
            onImport={(file) => void importCsv(file)}
            onToggleCommandCenter={() => setIsCommandCenterOpen(true)}
          />
          <SpreadsheetWorkspace
            sheets={workroom.sheets}
            onChange={(sheets) => updateWorkroom({ sheets, lastEdited: 'just now' })}
          />
        </div>
        {isCommandCenterOpen && (
          <CommandCenter onClose={() => setIsCommandCenterOpen(false)} />
        )}
      </section>
    </WorkroomLayout>
  )
}
