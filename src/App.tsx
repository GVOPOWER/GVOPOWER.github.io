import { useKV } from '@github/spark/hooks'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChecklistSection } from '@/components/ChecklistSection'
import { GroupsSection, type Group } from '@/components/GroupsSection'
import { AttendanceSection } from '@/components/AttendanceSection'
import { NotesSection } from '@/components/NotesSection'
import { ListChecks, Users, UserCheck, ClipboardText } from '@phosphor-icons/react'

type ChecklistItem = {
  id: string
  text: string
  completed: boolean
}

type Note = {
  id: string
  text: string
  timestamp: number
}

type AttendanceRecord = {
  [participantName: string]: boolean
}

function App() {
  const [checklistItems, setChecklistItems] = useKV<ChecklistItem[]>('checklist-items', [])
  const [groups, setGroups] = useKV<Group[]>('groups', [])
  const [attendance, setAttendance] = useKV<AttendanceRecord>('attendance', {})
  const [notes, setNotes] = useKV<Note[]>('notes', [])

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">Game Ochtend Manager</h1>
          <p className="text-muted-foreground">Beheer je game ochtend met checklists, groepen, presentie en notities</p>
        </div>

        <Tabs defaultValue="checklist" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="checklist" className="flex items-center gap-2">
              <ListChecks className="h-4 w-4" />
              <span className="hidden sm:inline">Checklist</span>
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Groepen</span>
            </TabsTrigger>
            <TabsTrigger value="attendance" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Presentie</span>
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <ClipboardText className="h-4 w-4" />
              <span className="hidden sm:inline">Notities</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="checklist" className="mt-0">
            <ChecklistSection 
              items={checklistItems || []} 
              onItemsChange={setChecklistItems} 
            />
          </TabsContent>

          <TabsContent value="groups" className="mt-0">
            <GroupsSection 
              groups={groups || []} 
              onGroupsChange={setGroups} 
            />
          </TabsContent>

          <TabsContent value="attendance" className="mt-0">
            <AttendanceSection 
              groups={groups || []} 
              attendance={attendance || {}} 
              onAttendanceChange={setAttendance} 
            />
          </TabsContent>

          <TabsContent value="notes" className="mt-0">
            <NotesSection 
              notes={notes || []} 
              onNotesChange={setNotes} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App