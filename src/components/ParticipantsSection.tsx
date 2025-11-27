import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash, Users as UsersIcon } from '@phosphor-icons/react'
import type { Group } from '@/types'

type ParticipantsSectionProps = {
  group: Group
  onGroupUpdate: (group: Group) => void
}

export function ParticipantsSection({ group, onGroupUpdate }: ParticipantsSectionProps) {
  const [newParticipantName, setNewParticipantName] = useState('')

  const addParticipant = () => {
    if (newParticipantName.trim() && !group.participants.includes(newParticipantName.trim())) {
      onGroupUpdate({
        ...group,
        participants: [...group.participants, newParticipantName.trim()]
      })
      setNewParticipantName('')
    }
  }

  const deleteParticipant = (participantName: string) => {
    onGroupUpdate({
      ...group,
      participants: group.participants.filter(p => p !== participantName)
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addParticipant()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Deelnemers</h2>
        <Badge variant="outline">
          {group.participants.length} {group.participants.length === 1 ? 'deelnemer' : 'deelnemers'}
        </Badge>
      </div>

      <div className="flex gap-2">
        <Input
          id="new-participant"
          placeholder="Deelnemer toevoegen..."
          value={newParticipantName}
          onChange={(e) => setNewParticipantName(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button 
          onClick={addParticipant} 
          size="icon" 
          className="bg-accent text-accent-foreground hover:bg-accent/90"
          disabled={!newParticipantName.trim()}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {group.participants.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <UsersIcon className="h-12 w-12 opacity-50" />
            <p>Nog geen deelnemers</p>
            <p className="text-sm">Voeg deelnemers toe voor de game ochtend</p>
          </div>
        </Card>
      ) : (
        <ScrollArea className="h-[400px]">
          <div className="space-y-2 pr-4">
            {group.participants.map((participant) => (
              <Card key={participant} className="p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex-1">{participant}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteParticipant(participant)}
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
