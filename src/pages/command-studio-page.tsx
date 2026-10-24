import { useCallback, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { AppIcon } from '../components/app-icon'
import { CommandEditorModal } from '../components/overlays/command-editor-modal'
import type { CommandDraft } from '../components/overlays/command-editor-modal'
import { SortDropdown, type SortOption } from '../components/overlays/sort-dropdown'
import { WorkroomLayout } from '../components/workroom-layout'
import '../styles/command-studio.css'

type Command = {
  id: string
  model: string
  title: string
  description: string
  prompt: string
  attachmentName: string
  lastUsed: string
  favorite: boolean
}

const startingCommands: Command[] = [
  { id: 'all', model: 'GPT-4o mini', title: 'All', description: 'Organise key points into clear sections', prompt: '', attachmentName: '', lastUsed: '17-09-2024', favorite: true },
  { id: 'analyze-data', model: 'GPT-4', title: 'Analyze data', description: 'Organise key points into clear sections', prompt: '', attachmentName: '', lastUsed: '17-09-2024', favorite: false },
  { id: 'format-mode', model: 'GPT-4o mini', title: 'Format mode', description: 'Organise key points into clear sections', prompt: '', attachmentName: '', lastUsed: '17-09-2024', favorite: false },
  { id: 'search-web', model: 'GPT-4o mini', title: 'Search Web', description: 'Organise key points into clear sections', prompt: '', attachmentName: '', lastUsed: '17-09-2024', favorite: false },
  { id: 'search-attachments', model: 'GPT-5', title: 'Search attachments', description: 'Organise key points into clear sections', prompt: '', attachmentName: '', lastUsed: '17-09-2024', favorite: false },
  { id: 'search-links', model: 'GPT-4o mini', title: 'Search Links', description: 'Organise key points into clear sections', prompt: '', attachmentName: '', lastUsed: '17-09-2024', favorite: false },
  { id: 'search-integration', model: 'GPT-4', title: 'Search integration', description: 'Organise key points into clear sections', prompt: '', attachmentName: '', lastUsed: '17-09-2024', favorite: true },
]

const emptyDraft: CommandDraft = {
  title: '',
  description: '',
  model: 'GPT 3.5',
  prompt: '',
  attachmentName: '',
}

export function CommandStudioPage() {
  const [commands, setCommands] = useState(startingCommands)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('recent')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [draft, setDraft] = useState<CommandDraft>(emptyDraft)
  const searchInput = useRef<HTMLInputElement>(null)

  const closeDialog = useCallback(() => {
    setIsDialogOpen(false)
    setEditingId(null)
  }, [])

  const visibleCommands = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    const matchingCommands = commands.filter((command) =>
      `${command.title} ${command.description} ${command.model}`
        .toLocaleLowerCase()
        .includes(normalizedQuery),
    )

    return matchingCommands.sort((first, second) => {
      if (sortBy === 'favorites') return Number(second.favorite) - Number(first.favorite)
      const firstDate = Date.parse(first.lastUsed.split('-').reverse().join('-')) || 0
      const secondDate = Date.parse(second.lastUsed.split('-').reverse().join('-')) || 0
      if (sortBy === 'oldest') return firstDate - secondDate
      return secondDate - firstDate
    })
  }, [commands, query, sortBy])

  const openCreateDialog = () => {
    setEditingId(null)
    setDraft(emptyDraft)
    setIsDialogOpen(true)
  }

  const openEditDialog = (command: Command) => {
    setEditingId(command.id)
    setDraft({
      title: command.title,
      description: command.description,
      model: command.model,
      prompt: command.prompt,
      attachmentName: command.attachmentName,
    })
    setOpenMenuId(null)
    setIsDialogOpen(true)
  }

  const saveCommand = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const title = draft.title.trim()
    const description = draft.description.trim()
    if (!title) return

    if (editingId) {
      setCommands((current) => current.map((command) =>
        command.id === editingId ? { ...command, ...draft, title, description } : command,
      ))
    } else {
      setCommands((current) => [
        {
          id: crypto.randomUUID(),
          ...draft,
          title,
          description,
          lastUsed: 'Never used',
          favorite: false,
        },
        ...current,
      ])
    }
    closeDialog()
  }

  const toggleFavorite = (id: string) => {
    setCommands((current) => current.map((command) =>
      command.id === id ? { ...command, favorite: !command.favorite } : command,
    ))
  }

  const deleteEditingCommand = () => {
    if (!editingId) return
    setCommands((current) => current.filter((command) => command.id !== editingId))
    closeDialog()
  }

  return (
    <WorkroomLayout>
      <section className="command-studio-page" aria-labelledby="command-studio-title">
        <div className="command-studio-toolbar">
          <div className="command-studio-heading">
            <h1 id="command-studio-title">All Commands</h1>
            <p>Create custom commands</p>
          </div>

          <div className="command-studio-actions">
            {searchOpen && (
              <label className="command-search-field">
                <AppIcon name="search" />
                <input
                  ref={searchInput}
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search commands"
                  aria-label="Search commands"
                />
                <button
                  type="button"
                  aria-label="Close command search"
                  onClick={() => {
                    setQuery('')
                    setSearchOpen(false)
                  }}
                >
                  <AppIcon name="close" />
                </button>
              </label>
            )}
            <button
              className="command-toolbar-search"
              type="button"
              aria-label={searchOpen ? 'Focus command search' : 'Search commands'}
              onClick={() => {
                setSearchOpen(true)
                window.requestAnimationFrame(() => searchInput.current?.focus())
              }}
            >
              <AppIcon name="search" />
            </button>
            <SortDropdown
              value={sortBy}
              onChange={setSortBy}
              label="Sort commands"
            />
            <button
              className="new-command-button"
              type="button"
              onClick={openCreateDialog}
            >
              <AppIcon name="plus" />
              <span>New command</span>
            </button>
          </div>
        </div>

        {visibleCommands.length > 0 ? (
          <div className="command-cards-grid">
            {visibleCommands.map((command) => (
              <article className="command-card" key={command.id}>
                <div className="command-card-top">
                  <span className="command-model-badge">
                    {command.model}
                    <AppIcon name="chevron" />
                  </span>
                  <div className="command-card-actions">
                    <button
                      className={`command-card-icon${command.favorite ? ' is-favorite' : ''}`}
                      type="button"
                      aria-label={`${command.favorite ? 'Remove' : 'Add'} ${command.title} ${command.favorite ? 'from' : 'to'} favorites`}
                      aria-pressed={command.favorite}
                      onClick={() => toggleFavorite(command.id)}
                    >
                      <AppIcon name="star" />
                    </button>
                    <div className="command-menu-wrap">
                      <button
                        className="command-card-icon"
                        type="button"
                        aria-label={`More options for ${command.title}`}
                        aria-expanded={openMenuId === command.id}
                        onClick={() => setOpenMenuId((current) => current === command.id ? null : command.id)}
                      >
                        <AppIcon name="more" />
                      </button>
                      {openMenuId === command.id && (
                        <div className="command-card-menu">
                          <button type="button" onClick={() => openEditDialog(command)}>Edit command</button>
                          <button
                            type="button"
                            onClick={() => {
                              setCommands((current) => current.filter((item) => item.id !== command.id))
                              setOpenMenuId(null)
                            }}
                          >
                            Delete command
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <h2>{command.title}</h2>
                {command.description && (
                  <p className="command-card-description">{command.description}</p>
                )}
                <p className="command-last-used">
                  {command.lastUsed === 'Never used' ? 'Never used' : `Last used on ${command.lastUsed}`}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="command-empty-state" role="status">No commands match your search.</p>
        )}
      </section>

      {isDialogOpen && (
        <CommandEditorModal
          isEditing={editingId !== null}
          draft={draft}
          onDraftChange={setDraft}
          onSave={saveCommand}
          onClose={closeDialog}
          onDelete={deleteEditingCommand}
        />
      )}
    </WorkroomLayout>
  )
}
