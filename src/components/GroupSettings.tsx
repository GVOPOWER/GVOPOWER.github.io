import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Plus, Trash, UserPlus, X } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { Group, CustomRole, Invitation } from '@/types'

type GroupSettingsProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  group: Group
  currentUser: string
  onGroupUpdate: (group: Group) => void
  onInvitationsChange: (updater: (invitations: Invitation[]) => Invitation[]) => void
}

export function GroupSettings({
  open,
  onOpenChange,
  group,
  currentUser,
  onGroupUpdate,
  onInvitationsChange
}: GroupSettingsProps) {
  const [newRoleName, setNewRoleName] = useState('')
  const [newRoleColor, setNewRoleColor] = useState('#6366f1')
  const [inviteEmail, setInviteEmail] = useState('')

  const customRoles = group.customRoles || []

  const addCustomRole = () => {
    if (!newRoleName.trim()) {
      toast.error('Voer een rolnaam in')
      return
    }

    const newRole: CustomRole = {
      id: Date.now().toString(),
      name: newRoleName.trim(),
      color: newRoleColor
    }

    onGroupUpdate({
      ...group,
      customRoles: [...customRoles, newRole]
    })

    setNewRoleName('')
    setNewRoleColor('#6366f1')
    toast.success('Rol toegevoegd')
  }

  const deleteCustomRole = (roleId: string) => {
    onGroupUpdate({
      ...group,
      customRoles: customRoles.filter(r => r.id !== roleId),
      participants: group.participants.map(p =>
        p.customRoleId === roleId ? { ...p, customRoleId: undefined } : p
      )
    })
    toast.success('Rol verwijderd')
  }

  const inviteUser = () => {
    const email = inviteEmail.trim().toLowerCase()
    if (!email) {
      toast.error('Voer een email adres in')
      return
    }

    if (email === currentUser) {
      toast.error('Je kunt jezelf niet uitnodigen')
      return
    }

    if (group.members.includes(email)) {
      toast.error('Deze gebruiker is al lid van de groep')
      return
    }

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
    toast.success('Uitnodiging verstuurd')
  }

  const removeMember = (memberEmail: string) => {
    if (memberEmail === group.owner) {
      toast.error('Je kunt de eigenaar niet verwijderen')
      return
    }

    onGroupUpdate({
      ...group,
      members: group.members.filter(m => m !== memberEmail)
    })
    toast.success('Lid verwijderd')
  }

  const handleRoleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addCustomRole()
    }
  }

  const handleInviteKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      inviteUser()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Groep Instellingen</DialogTitle>
          <DialogDescription>
            Beheer leden, rollen en instellingen voor {group.name}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Leden</h3>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    id="invite-email"
                    type="email"
                    placeholder="Email adres om uit te nodigen..."
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    onKeyPress={handleInviteKeyPress}
                  />
                  <Button onClick={inviteUser} size="icon">
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {group.members.map((member) => (
                    <Card key={member} className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {member.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm">{member}</span>
                          {member === group.owner && (
                            <Badge variant="secondary" className="text-xs">Eigenaar</Badge>
                          )}
                        </div>
                        {member !== group.owner && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeMember(member)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3">Aangepaste Rollen</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Maak aangepaste rollen die je kunt toewijzen aan deelnemers
              </p>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    id="new-role-name"
                    placeholder="Rolnaam..."
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    onKeyPress={handleRoleKeyPress}
                    className="flex-1"
                  />
                  <Input
                    id="new-role-color"
                    type="color"
                    value={newRoleColor}
                    onChange={(e) => setNewRoleColor(e.target.value)}
                    className="w-20"
                  />
                  <Button onClick={addCustomRole} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {customRoles.length === 0 ? (
                  <Card className="p-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      Nog geen aangepaste rollen
                    </p>
                  </Card>
                ) : (
                  <div className="space-y-2">
                    {customRoles.map((role) => (
                      <Card key={role.id} className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className="h-4 w-4 rounded-full"
                              style={{ backgroundColor: role.color }}
                            />
                            <span className="text-sm font-medium">{role.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteCustomRole(role.id)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
