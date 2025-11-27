import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { User, Envelope, Check, X, Calendar } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { Invitation, Group } from '@/types'

type ProfileSectionProps = {
  currentUser: string
  invitations: Invitation[]
  groups: Group[]
  onInvitationsChange: (updater: (invitations: Invitation[]) => Invitation[]) => void
  onGroupsChange: (updater: (groups: Group[]) => Group[]) => void
}

export function ProfileSection({
  currentUser,
  invitations,
  groups,
  onInvitationsChange,
  onGroupsChange
}: ProfileSectionProps) {
  const userInvitations = invitations.filter(
    inv => inv.invitedUser === currentUser && inv.status === 'pending'
  )

  const acceptedInvitations = invitations.filter(
    inv => inv.invitedUser === currentUser && inv.status === 'accepted'
  )

  const userOwnedGroups = groups.filter(g => g.owner === currentUser)
  const userMemberGroups = groups.filter(g => 
    g.owner !== currentUser && (g.members || []).includes(currentUser)
  )

  const handleAccept = (invitation: Invitation) => {
    onInvitationsChange((current) =>
      current.map(inv =>
        inv.id === invitation.id ? { ...inv, status: 'accepted' as const } : inv
      )
    )

    onGroupsChange((current) =>
      current.map(group =>
        group.id === invitation.groupId
          ? { ...group, members: [...(group.members || []), currentUser] }
          : group
      )
    )

    toast.success(`Je bent nu lid van ${invitation.groupName}`)
  }

  const handleDecline = (invitation: Invitation) => {
    onInvitationsChange((current) =>
      current.map(inv =>
        inv.id === invitation.id ? { ...inv, status: 'declined' as const } : inv
      )
    )

    toast.success('Uitnodiging geweigerd')
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold">{currentUser}</h2>
            <p className="text-sm text-muted-foreground">Je profiel en uitnodigingen</p>
          </div>
        </div>
      </Card>

      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Envelope className="h-5 w-5" />
          Uitnodigingen
          {userInvitations.length > 0 && (
            <Badge variant="destructive">{userInvitations.length}</Badge>
          )}
        </h3>

        {userInvitations.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Envelope className="h-12 w-12 opacity-50" />
              <p>Geen openstaande uitnodigingen</p>
              <p className="text-sm">Je ontvangt hier uitnodigingen voor groepen</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {userInvitations.map((invitation) => (
              <Card key={invitation.id} className="p-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-medium">{invitation.groupName}</h4>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(invitation.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Uitgenodigd door {invitation.invitedBy}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAccept(invitation)}
                      className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Accepteren
                    </Button>
                    <Button
                      onClick={() => handleDecline(invitation)}
                      variant="outline"
                      className="flex-1"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Weigeren
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-3">Jouw Groepen</h3>
        
        <div className="space-y-4">
          {userOwnedGroups.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Eigenaar</h4>
              <div className="space-y-2">
                {userOwnedGroups.map((group) => (
                  <Card key={group.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{group.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {group.participants.length} deelnemers · {group.members.length} leden
                        </p>
                      </div>
                      <Badge variant="secondary">Eigenaar</Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {userMemberGroups.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Lid van</h4>
              <div className="space-y-2">
                {userMemberGroups.map((group) => (
                  <Card key={group.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{group.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {group.participants.length} deelnemers · Eigenaar: {group.owner}
                        </p>
                      </div>
                      <Badge variant="outline">Lid</Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {userOwnedGroups.length === 0 && userMemberGroups.length === 0 && (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <User className="h-12 w-12 opacity-50" />
                <p>Je bent nog geen lid van groepen</p>
                <p className="text-sm">Maak een groep of accepteer een uitnodiging</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
