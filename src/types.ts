export type Group = {
  id: string
  name: string
  participants: string[]
  owner: string
  members: string[]
}

export type Invitation = {
  id: string
  groupId: string
  groupName: string
  invitedBy: string
  invitedUser: string
  status: 'pending' | 'accepted' | 'declined'
  timestamp: number
}
