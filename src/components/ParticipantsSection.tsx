import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash, Users as UsersIcon, Crown, Star, User } from '@phosphor-icons/react'
import type { Group, Participant } from '@/types'

type ParticipantsSectionProps = {
  group: Group
  onGroupUpdate: (group: Group) => void
}

export function ParticipantsSection({ group, onGroupUpdate }: ParticipantsSectionProps) {
  const [newParticipantName, setNewParticipantName] = useState('')

  const addParticipant = () => {
    if (newParticipantName.trim()) {
      const newParticipant: Participant = {
        id: Date.now().toString(),
        name: newParticipantName.trim(),
        role: 'participant'
      }
      onGroupUpdate({
        ...group,
        participants: [...(group.participants || []), newParticipant]
      })
      setNewParticipantName('')
    }
  }

  const deleteParticipant = (participantId: string) => {
    onGroupUpdate({
      ...group,
      participants: (group.participants || []).filter(p => p.id !== participantId)
    })
  }

  const updateParticipantRole = (participantId: string, role: Participant['role']) => {
    onGroupUpdate({
      ...group,
      participants: (group.participants || []).map(p => 
        p.id === participantId ? { ...p, role } : p
      )
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addParticipant()
    }
  }

  const getRoleIcon = (role: Participant['role']) => {
    switch (role) {
      case 'organizer':
        return <Crown className="h-4 w-4 text-amber-500" />
      case 'leader':
        return <Star className="h-4 w-4 text-blue-500" />
      default:
        return <User className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getRoleLabel = (role: Participant['role']) => {
    switch (role) {
      case 'organizer':
        return 'Organisator'
      case 'leader':
        return 'Leider'
      default:
        return 'Deelnemer'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Deelnemers</h2>
        <Badge variant="outline">
          {(group.participants || []).length} {(group.participants || []).length === 1 ? 'deelnemer' : 'deelnemers'}
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

      {(group.participants || []).length === 0 ? (
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
            {(group.participants || []).map((participant) => (
              <Card key={participant.id} className="p-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    {getRoleIcon(participant.role)}
                    <span className="font-medium">{participant.name}</span>
                  </div>
                  
                  <Select
                    value={participant.role}
                    onValueChange={(value) => updateParticipantRole(participant.id, value as Participant['role'])}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="participant">Deelnemer</SelectItem>
                      <SelectItem value="leader">Leider</SelectItem>
                      <SelectItem value="organizer">Organisator</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteParticipant(participant.id)}
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
