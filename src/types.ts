export type UserAccount = {
  email: string
  password: string
  createdAt: number
}

export type Group = {
  id: string
  name: string
  participants: Participant[]
  owner: string
  members: string[]
}

export type Participant = {
  id: string
  name: string
  role: 'participant' | 'leader' | 'organizer'
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

export type Note = {
  id: string
  text: string
  timestamp: number
  groupId: string
  attachments?: NoteAttachment[]
}

export type NoteAttachment = {
  id: string
  name: string
  size: number
  type: string
  dataUrl: string
}

export type AttendanceDate = {
  id: string
  date: string
  participants: {
    [participantId: string]: boolean
  }
  groupId: string
}
