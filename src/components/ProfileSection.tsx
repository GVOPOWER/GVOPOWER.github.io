import { useState, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { User, Envelope, Check, X, Calendar, Camera, Pencil } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { Invitation, Group, UserProfile } from '@/types'

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
  const [profiles, setProfiles] = useKV<Record<string, UserProfile>>('user-profiles', {})
  const [isEditingName, setIsEditingName] = useState(false)
  const [newDisplayName, setNewDisplayName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const userProfile = (profiles || {})[currentUser] || {
    email: currentUser,
    displayName: currentUser
  }

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

  const handleDisplayNameChange = () => {
    if (!newDisplayName.trim()) {
      toast.error('Vul een naam in')
      return
    }

    setProfiles((current) => ({
      ...(current || {}),
      [currentUser]: {
        ...userProfile,
        displayName: newDisplayName.trim()
      }
    }))

    setIsEditingName(false)
    setNewDisplayName('')
    toast.success('Naam bijgewerkt')
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Selecteer een afbeelding')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Afbeelding moet kleiner dan 5MB zijn')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      setProfiles((current) => ({
        ...(current || {}),
        [currentUser]: {
          ...userProfile,
          profilePhoto: dataUrl
        }
      }))
      toast.success('Profielfoto bijgewerkt')
    }
    reader.readAsDataURL(file)
  }

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
          <div className="relative group">
            {userProfile.profilePhoto ? (
              <img
                src={userProfile.profilePhoto}
                alt="Profile"
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <Camera className="h-6 w-6 text-white" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>
          <div className="flex-1">
            {isEditingName ? (
              <div className="flex gap-2 items-center">
                <Input
                  id="display-name"
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleDisplayNameChange()}
                  placeholder="Nieuwe naam"
                  className="max-w-xs"
                  autoFocus
                />
                <Button onClick={handleDisplayNameChange} size="sm">
                  <Check className="h-4 w-4" />
                </Button>
                <Button onClick={() => setIsEditingName(false)} variant="ghost" size="sm">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold">{userProfile.displayName}</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setNewDisplayName(userProfile.displayName)
                    setIsEditingName(true)
                  }}
                  className="h-6 w-6"
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              </div>
            )}
            <p className="text-sm text-muted-foreground">{currentUser}</p>
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
