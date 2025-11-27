import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Envelope, Check, X } from '@phosphor-icons/react'
import type { Group, Invitation } from '@/types'

type InvitationsSectionProps = {
  currentUser: string
  invitations: Invitation[]
  groups: Group[]
  onInvitationsChange: (invitations: Invitation[]) => void
  onGroupsChange: (groups: Group[]) => void
}

export function InvitationsSection({ 
  currentUser,
  invitations, 
  groups,
  onInvitationsChange,
  onGroupsChange
}: InvitationsSectionProps) {
  const userInvitations = invitations.filter(
    inv => inv.invitedUser === currentUser && inv.status === 'pending'
  )

  const acceptInvitation = (invitation: Invitation) => {
    const group = groups.find(g => g.id === invitation.groupId)
    if (group && !(group.members || []).includes(currentUser)) {
      onGroupsChange(groups.map(g => 
        g.id === invitation.groupId 
          ? { ...g, members: [...(g.members || []), currentUser] }
          : g
      ))
    }

    onInvitationsChange(invitations.map(inv =>
      inv.id === invitation.id
        ? { ...inv, status: 'accepted' }
        : inv
    ))
  }

  const declineInvitation = (invitationId: string) => {
    onInvitationsChange(invitations.map(inv =>
      inv.id === invitationId
        ? { ...inv, status: 'declined' }
        : inv
    ))
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
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Uitnodigingen</h2>
        <Badge variant="outline">
          {userInvitations.length} {userInvitations.length === 1 ? 'uitnodiging' : 'uitnodigingen'}
        </Badge>
      </div>

      {userInvitations.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Envelope className="h-12 w-12 opacity-50" />
            <p>Geen nieuwe uitnodigingen</p>
            <p className="text-sm">Je ontvangt hier uitnodigingen om lid te worden van groepen</p>
          </div>
        </Card>
      ) : (
        <ScrollArea className="h-[400px]">
          <div className="space-y-3 pr-4">
            {userInvitations.map((invitation) => (
              <Card key={invitation.id} className="p-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h3 className="font-medium text-lg">{invitation.groupName}</h3>
                    <p className="text-sm text-muted-foreground">
                      Uitgenodigd door <span className="font-medium">{invitation.invitedBy}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatTimestamp(invitation.timestamp)}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => acceptInvitation(invitation)}
                      className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Accepteren
                    </Button>
                    <Button
                      onClick={() => declineInvitation(invitation.id)}
                      variant="outline"
                      className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Weigeren
                    </Button>
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
