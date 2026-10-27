export type WorkroomSheet = {
  id: string
  name: string
  columns: string[]
  rows: string[][]
  columnPrompts?: Array<WorkroomColumnPromptConfig | null>
}

export type WorkroomColumnPromptConfig = {
  context: string
  model: string
  autoRun: boolean
  focusMode: boolean
  attachmentName: string
  attachmentImageName?: string
  attachmentUrl?: string
  prompt: string
}

export type WorkroomRecord = {
  id: string
  title: string
  lastEdited: string
  sheets: WorkroomSheet[]
}

export type WorkroomSummary = {
  id: string
  title: string
  spreadsheetCount: number
  lastEdited: string
  isNew?: boolean
}

const storageKey = 'workroom-created'

export const sampleWorkrooms: WorkroomSummary[] = Array.from({ length: 5 }, (_, index) => ({
  id: `workroom-${index + 1}`,
  title: 'Inventory Management',
  spreadsheetCount: 2,
  lastEdited: '10 minutes ago',
}))

export function getCreatedWorkrooms(): WorkroomRecord[] {
  const savedWorkrooms = localStorage.getItem(storageKey)
  return savedWorkrooms ? JSON.parse(savedWorkrooms) as WorkroomRecord[] : []
}

export function getWorkroom(id: string): WorkroomRecord | undefined {
  return getCreatedWorkrooms().find((workroom) => workroom.id === id)
}

export function saveWorkroom(workroom: WorkroomRecord) {
  const workrooms = getCreatedWorkrooms()
  const existingIndex = workrooms.findIndex(({ id }) => id === workroom.id)

  if (existingIndex === -1) {
    workrooms.push(workroom)
  } else {
    workrooms[existingIndex] = workroom
  }

  localStorage.setItem(storageKey, JSON.stringify(workrooms))
}

export function createWorkroom(): WorkroomRecord {
  const createSheet = (index: number): WorkroomSheet => ({
    id: crypto.randomUUID(),
    name: `Sheet ${index}`,
    columns: ['Column 1', 'Column 2', 'Column 3'],
    rows: [['', '', '']],
  })

  const workroom: WorkroomRecord = {
    id: crypto.randomUUID(),
    title: 'Untitled workroom',
    lastEdited: 'just now',
    sheets: [createSheet(1)],
  }

  saveWorkroom(workroom)
  return workroom
}

export function getWorkroomSummaries(): WorkroomSummary[] {
  return [
    ...sampleWorkrooms,
    ...getCreatedWorkrooms().map(({ id, title, lastEdited, sheets }) => ({
      id,
      title,
      spreadsheetCount: sheets.length,
      lastEdited,
      isNew: true,
    })),
  ]
}
