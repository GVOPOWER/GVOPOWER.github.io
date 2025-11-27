import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Plus, Trash, Users } from '@phosphor-icons/react'
import type { Group, Participant } from '@/types'

type GroupsSectionProps = {
  groups: Group[]
  onGroupsChange: (groups: Group[]) => void
}

export function GroupsSection({ groups, onGroupsChange }: GroupsSectionProps) {
  const [newGroupName, setNewGroupName] = useState('')
  const [newParticipantName, setNewParticipantName] = useState<{ [key: string]: string }>({})

  const addGroup = () => {
    if (newGroupName.trim()) {
      onGroupsChange([...groups, { 
        id: Date.now().toString(), 
        name: newGroupName.trim(), 
        participants: [],
        owner: 'legacy',
        members: ['legacy']
      }])
      setNewGroupName('')
    }
  }

  const deleteGroup = (id: string) => {
    onGroupsChange(groups.filter(group => group.id !== id))
  }

  const addParticipant = (groupId: string) => {
    const name = newParticipantName[groupId]?.trim()
    if (name) {
      const newParticipant: Participant = {
        id: Date.now().toString(),
        name,
        role: 'participant'
      }
      onGroupsChange(groups.map(group =>
        group.id === groupId
          ? { ...group, participants: [...group.participants, newParticipant] }
          : group
      ))
      setNewParticipantName({ ...newParticipantName, [groupId]: '' })
    }
  }

  const deleteParticipant = (groupId: string, participantId: string) => {
    onGroupsChange(groups.map(group =>
      group.id === groupId
        ? { ...group, participants: group.participants.filter(p => p.id !== participantId) }
        : group
    ))
  }

  const handleGroupKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addGroup()
    }
  }

  const handleParticipantKeyPress = (e: React.KeyboardEvent, groupId: string) => {
    if (e.key === 'Enter') {
      addParticipant(groupId)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          id="new-group-name"
          placeholder="Nieuwe groep naam..."
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          onKeyPress={handleGroupKeyPress}
          className="flex-1"
        />
        <Button onClick={addGroup} size="icon" className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {groups.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Users className="h-12 w-12 opacity-50" />
            <p>Nog geen groepen aangemaakt</p>
            <p className="text-sm">Maak teams aan voor de game ochtend</p>
          </div>
        </Card>
      ) : (
        <ScrollArea className="h-[400px]">
          <div className="space-y-4 pr-4">
            {groups.map((group) => (
              <Card key={group.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-lg">{group.name}</h3>
                      <Badge variant="secondary" className="bg-secondary/20">
                        {group.participants.length} {group.participants.length === 1 ? 'deelnemer' : 'deelnemers'}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteGroup(group.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        id={`participant-${group.id}`}
                        placeholder="Deelnemer toevoegen..."
                        value={newParticipantName[group.id] || ''}
                        onChange={(e) => setNewParticipantName({ ...newParticipantName, [group.id]: e.target.value })}
                        onKeyPress={(e) => handleParticipantKeyPress(e, group.id)}
                        className="flex-1"
                      />
                      <Button
                        onClick={() => addParticipant(group.id)}
                        size="icon"
                        variant="outline"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {group.participants.length > 0 && (
                      <div className="space-y-1">
                        {group.participants.map((participant) => (
                          <div key={participant.id} className="flex items-center justify-between py-1 px-2 rounded hover:bg-muted">
                            <span className="text-sm">{participant.name}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteParticipant(group.id, participant.id)}
                              className="h-6 w-6 text-muted-foreground hover:text-destructive"
                            >
                              <Trash className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
