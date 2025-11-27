import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChecklistSection } from '@/components/ChecklistSection'
import { AttendanceSection } from '@/components/AttendanceSection'
import { NotesSection } from '@/components/NotesSection'
import { InvitationsSection } from '@/components/InvitationsSection'
import { ParticipantsSection } from '@/components/ParticipantsSection'
import { GroupSidebar } from '@/components/GroupSidebar'
import { LoginSection } from '@/components/LoginSection'
import { ProfileSection } from '@/components/ProfileSection'
import { ListChecks, UserCheck, ClipboardText, Envelope, Users, User } from '@phosphor-icons/react'
import type { Group, Invitation, Note, AttendanceDate, ChecklistItem } from '@/types'

function App() {
  const [currentUser, setCurrentUser] = useKV<string | null>('current-user', null)
  const [groups, setGroups] = useKV<Group[]>('groups', [])
  const [invitations, setInvitations] = useKV<Invitation[]>('invitations', [])
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('participants')

  const selectedGroup = groups?.find(g => g.id === selectedGroupId) || null

  const [checklistItems, setChecklistItems] = useKV<ChecklistItem[]>('checklist-items', [])
  const [attendanceDates, setAttendanceDates] = useKV<AttendanceDate[]>('attendance-dates', [])
  const [notes, setNotes] = useKV<Note[]>('notes', [])

  const filteredChecklistItems = selectedGroupId && checklistItems
    ? checklistItems.filter(item => item.groupId === selectedGroupId)
    : []

  const filteredNotes = selectedGroupId && notes
    ? notes.filter(note => note.groupId === selectedGroupId)
    : []

  const filteredAttendanceDates = selectedGroupId && attendanceDates
    ? attendanceDates.filter(date => date.groupId === selectedGroupId)
    : []

  const userInvitations = currentUser && invitations
    ? invitations.filter(inv => inv.invitedUser === currentUser && inv.status === 'pending')
    : []

  if (!currentUser) {
    return <LoginSection onLogin={setCurrentUser} />
  }

  return (
    <div className="min-h-screen bg-background flex">
      <GroupSidebar
        currentUser={currentUser}
        groups={groups || []}
        selectedGroupId={selectedGroupId}
        onSelectGroup={setSelectedGroupId}
        onGroupsChange={setGroups}
        onInvitationsChange={setInvitations}
        onLogout={() => {
          setCurrentUser(null)
          setSelectedGroupId(null)
        }}
        onProfileClick={() => {
          setActiveTab('profile')
          if (selectedGroupId) {
            setSelectedGroupId(selectedGroupId)
          }
        }}
      />

      <div className="flex-1 overflow-auto">
        <div className="container max-w-4xl mx-auto py-8 px-4">
          {!selectedGroupId ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold mb-2">Welkom, {currentUser}!</h2>
              <p className="text-muted-foreground">Selecteer of maak een groep in het zijmenu om te beginnen</p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-semibold mb-2">{selectedGroup?.name || 'Game Ochtend'}</h1>
                <p className="text-muted-foreground">Beheer je game ochtend met checklists, presentie en notities</p>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-6 mb-6">
                  <TabsTrigger value="profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Profiel</span>
                  </TabsTrigger>
                  <TabsTrigger value="participants" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="hidden sm:inline">Deelnemers</span>
                  </TabsTrigger>
                  <TabsTrigger value="checklist" className="flex items-center gap-2">
                    <ListChecks className="h-4 w-4" />
                    <span className="hidden sm:inline">Checklist</span>
                  </TabsTrigger>
                  <TabsTrigger value="attendance" className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4" />
                    <span className="hidden sm:inline">Presentie</span>
                  </TabsTrigger>
                  <TabsTrigger value="notes" className="flex items-center gap-2">
                    <ClipboardText className="h-4 w-4" />
                    <span className="hidden sm:inline">Notities</span>
                  </TabsTrigger>
                  <TabsTrigger value="invitations" className="flex items-center gap-2 relative">
                    <Envelope className="h-4 w-4" />
                    <span className="hidden sm:inline">Uitnodigingen</span>
                    {userInvitations.length > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                        {userInvitations.length}
                      </span>
                    )}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="mt-0">
                  <ProfileSection
                    currentUser={currentUser}
                    invitations={invitations || []}
                    groups={groups || []}
                    onInvitationsChange={setInvitations}
                    onGroupsChange={setGroups}
                  />
                </TabsContent>

                <TabsContent value="participants" className="mt-0">
                  {selectedGroup && (
                    <ParticipantsSection 
                      group={selectedGroup} 
                      onGroupUpdate={(updatedGroup) => {
                        setGroups((currentGroups) => 
                          (currentGroups || []).map(g => 
                            g.id === updatedGroup.id ? updatedGroup : g
                          )
                        )
                      }}
                    />
                  )}
                </TabsContent>

                <TabsContent value="checklist" className="mt-0">
                  <ChecklistSection 
                    items={filteredChecklistItems} 
                    onItemsChange={(items) => {
                      const otherItems = (checklistItems || []).filter(item => item.groupId !== selectedGroupId)
                      setChecklistItems([...otherItems, ...items])
                    }}
                    groupId={selectedGroupId}
                    group={selectedGroup}
                  />
                </TabsContent>

                <TabsContent value="attendance" className="mt-0">
                  <AttendanceSection 
                    groups={selectedGroup ? [selectedGroup] : []}
                    attendanceDates={filteredAttendanceDates}
                    onAttendanceDatesChange={(dates) => {
                      const otherDates = (attendanceDates || []).filter(date => date.groupId !== selectedGroupId)
                      setAttendanceDates([...otherDates, ...dates])
                    }}
                  />
                </TabsContent>

                <TabsContent value="notes" className="mt-0">
                  <NotesSection 
                    notes={filteredNotes} 
                    onNotesChange={(items) => {
                      const otherNotes = (notes || []).filter(note => note.groupId !== selectedGroupId)
                      setNotes([...otherNotes, ...items])
                    }}
                    groupId={selectedGroupId}
                  />
                </TabsContent>

                <TabsContent value="invitations" className="mt-0">
                  <InvitationsSection 
                    currentUser={currentUser}
                    invitations={invitations || []}
                    groups={groups || []}
                    onInvitationsChange={setInvitations}
                    onGroupsChange={setGroups}
                  />
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default App