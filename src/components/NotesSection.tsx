import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, Trash, ClipboardText } from '@phosphor-icons/react'

type Note = {
  id: string
  text: string
  timestamp: number
}

type NotesSectionProps = {
  notes: Note[]
  onNotesChange: (notes: Note[]) => void
}

export function NotesSection({ notes, onNotesChange }: NotesSectionProps) {
  const [newNoteText, setNewNoteText] = useState('')

  const addNote = () => {
    if (newNoteText.trim()) {
      onNotesChange([{ id: Date.now().toString(), text: newNoteText.trim(), timestamp: Date.now() }, ...notes])
      setNewNoteText('')
    }
  }

  const deleteNote = (id: string) => {
    onNotesChange(notes.filter(note => note.id !== id))
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Textarea
          id="new-note"
          placeholder="Nieuwe notitie of observatie..."
          value={newNoteText}
          onChange={(e) => setNewNoteText(e.target.value)}
          className="min-h-[100px]"
        />
        <Button onClick={addNote} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="h-4 w-4 mr-2" />
          Notitie Toevoegen
        </Button>
      </div>

      {notes.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <ClipboardText className="h-12 w-12 opacity-50" />
            <p>Nog geen notities</p>
            <p className="text-sm">Voeg observaties en verslagen toe tijdens de game ochtend</p>
          </div>
        </Card>
      ) : (
        <ScrollArea className="h-[400px]">
          <div className="space-y-3 pr-4">
            {notes.map((note) => (
              <Card key={note.id} className="p-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-muted-foreground">{formatTimestamp(note.timestamp)}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteNote(note.id)}
                      className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="whitespace-pre-wrap">{note.text}</p>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
