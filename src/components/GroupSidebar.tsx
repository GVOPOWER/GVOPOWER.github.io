import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  SignOut, 
  Users, 
  UserPlus, 
  Trash,
  Crown
} from '@phosphor-icons/react'
import type { Group, Invitation } from '@/types'

type GroupSidebarProps = {
  currentUser: string
  groups: Group[]
  selectedGroupId: string | null
  onSelectGroup: (groupId: string) => void
  onGroupsChange: (groups: Group[]) => void
  onInvitationsChange: (updater: (invitations: Invitation[]) => Invitation[]) => void
  onLogout: () => void
}

export function GroupSidebar({
  currentUser,
  groups,
  selectedGroupId,
  onSelectGroup,
  onGroupsChange,
  onInvitationsChange,
  onLogout
}: GroupSidebarProps) {
  const [newGroupName, setNewGroupName] = useState('')
  const [showInviteInput, setShowInviteInput] = useState<string | null>(null)
  const [inviteEmail, setInviteEmail] = useState('')

  const userGroups = groups.filter(g => 
    g.owner === currentUser || (g.members || []).includes(currentUser)
  )

  const createGroup = () => {
    if (newGroupName.trim()) {
      const newGroup: Group = {
        id: Date.now().toString(),
        name: newGroupName.trim(),
        participants: [],
        owner: currentUser,
        members: [currentUser]
      }
      onGroupsChange([...groups, newGroup])
      setNewGroupName('')
      onSelectGroup(newGroup.id)
    }
  }

  const deleteGroup = (groupId: string) => {
    onGroupsChange(groups.filter(g => g.id !== groupId))
    if (selectedGroupId === groupId) {
      onSelectGroup(userGroups[0]?.id || '')
    }
  }

  const inviteUser = (groupId: string) => {
    const email = inviteEmail.trim().toLowerCase()
    if (email && email !== currentUser) {
      const group = groups.find(g => g.id === groupId)
      if (group) {
        onInvitationsChange((currentInvitations) => [
          ...(currentInvitations || []),
          {
            id: Date.now().toString(),
            groupId: group.id,
            groupName: group.name,
            invitedBy: currentUser,
            invitedUser: email,
            status: 'pending',
            timestamp: Date.now()
          }
        ])
        setInviteEmail('')
        setShowInviteInput(null)
      }
    }
  }

  const handleGroupKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      createGroup()
    }
  }

  const handleInviteKeyPress = (e: React.KeyboardEvent, groupId: string) => {
    if (e.key === 'Enter') {
      inviteUser(groupId)
    }
  }

  const isOwner = (group: Group) => group.owner === currentUser

  return (
    <div className="w-80 border-r border-border bg-card flex flex-col h-screen">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-primary">
                {currentUser.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="font-medium truncate text-sm">{currentUser}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            className="h-8 w-8 text-muted-foreground hover:text-destructive flex-shrink-0"
          >
            <SignOut className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <Input
            id="new-group-name"
            placeholder="Nieuwe groep maken..."
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            onKeyPress={handleGroupKeyPress}
          />
          <Button 
            onClick={createGroup} 
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            disabled={!newGroupName.trim()}
          >
            <Plus className="h-4 w-4 mr-2" />
            Groep Maken
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {userGroups.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Nog geen groepen</p>
            </div>
          ) : (
            userGroups.map((group) => (
              <Card
                key={group.id}
                className={`p-3 cursor-pointer transition-colors ${
                  selectedGroupId === group.id
                    ? 'bg-accent/20 border-accent'
                    : 'hover:bg-muted'
                }`}
                onClick={() => onSelectGroup(group.id)}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="font-medium truncate">{group.name}</span>
                      {isOwner(group) && (
                        <Crown className="h-3 w-3 text-accent flex-shrink-0" />
                      )}
                    </div>
                    {isOwner(group) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteGroup(group.id)
                        }}
                        className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="text-xs">
                      {(group.participants || []).length} deelnemers
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {(group.members || []).length} {(group.members || []).length === 1 ? 'lid' : 'leden'}
                    </Badge>
                  </div>

                  {showInviteInput === group.id ? (
                    <div className="flex gap-1 mt-2" onClick={(e) => e.stopPropagation()}>
                      <Input
                        id={`invite-${group.id}`}
                        type="email"
                        placeholder="Email adres..."
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        onKeyPress={(e) => handleInviteKeyPress(e, group.id)}
                        className="h-7 text-xs"
                        autoFocus
                      />
                      <Button
                        size="icon"
                        onClick={() => inviteUser(group.id)}
                        className="h-7 w-7"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    isOwner(group) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowInviteInput(group.id)
                        }}
                        className="w-full h-7 text-xs"
                      >
                        <UserPlus className="h-3 w-3 mr-1" />
                        Uitnodigen
                      </Button>
                    )
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
