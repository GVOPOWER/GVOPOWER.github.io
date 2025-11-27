import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash, ClipboardText, Paperclip, File, X } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { Note, NoteAttachment } from '@/types'

type NotesSectionProps = {
  notes: Note[]
  onNotesChange: (notes: Note[]) => void
  groupId: string
}

export function NotesSection({ notes, onNotesChange, groupId }: NotesSectionProps) {
  const [newNoteText, setNewNoteText] = useState('')
  const [attachments, setAttachments] = useState<NoteAttachment[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newAttachments: NoteAttachment[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is te groot (max 5MB)`)
        continue
      }

      const reader = new FileReader()
      await new Promise<void>((resolve) => {
        reader.onload = (event) => {
          newAttachments.push({
            id: Date.now().toString() + i,
            name: file.name,
            size: file.size,
            type: file.type,
            dataUrl: event.target?.result as string
          })
          resolve()
        }
        reader.readAsDataURL(file)
      })
    }

    setAttachments([...attachments, ...newAttachments])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeAttachment = (id: string) => {
    setAttachments(attachments.filter(a => a.id !== id))
  }

  const addNote = () => {
    if (newNoteText.trim() || attachments.length > 0) {
      onNotesChange([
        {
          id: Date.now().toString(),
          text: newNoteText.trim(),
          timestamp: Date.now(),
          groupId,
          attachments: attachments.length > 0 ? attachments : undefined
        },
        ...notes
      ])
      setNewNoteText('')
      setAttachments([])
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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const downloadAttachment = (attachment: NoteAttachment) => {
    const link = document.createElement('a')
    link.href = attachment.dataUrl
    link.download = attachment.name
    link.click()
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
        
        {attachments.length > 0 && (
          <div className="space-y-2">
            {attachments.map((attachment) => (
              <div key={attachment.id} className="flex items-center gap-2 p-2 border rounded-md">
                <File className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1 text-sm">{attachment.name}</span>
                <span className="text-xs text-muted-foreground">{formatFileSize(attachment.size)}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => removeAttachment(attachment.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1"
          >
            <Paperclip className="h-4 w-4 mr-2" />
            Bestand Toevoegen
          </Button>
          <Button 
            onClick={addNote} 
            className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
            disabled={!newNoteText.trim() && attachments.length === 0}
          >
            <Plus className="h-4 w-4 mr-2" />
            Notitie Toevoegen
          </Button>
        </div>
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
                  {note.text && <p className="whitespace-pre-wrap">{note.text}</p>}
                  
                  {note.attachments && note.attachments.length > 0 && (
                    <div className="space-y-2 pt-2 border-t">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Paperclip className="h-4 w-4" />
                        <span>Bijlagen ({note.attachments.length})</span>
                      </div>
                      {note.attachments.map((attachment) => (
                        <Button
                          key={attachment.id}
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => downloadAttachment(attachment)}
                        >
                          <File className="h-4 w-4 mr-2" />
                          <span className="flex-1 text-left truncate">{attachment.name}</span>
                          <Badge variant="secondary" className="ml-2">
                            {formatFileSize(attachment.size)}
                          </Badge>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
