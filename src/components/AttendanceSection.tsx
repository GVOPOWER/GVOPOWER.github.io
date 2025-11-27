import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { UserCheck, Check, X } from '@phosphor-icons/react'
import type { Group } from './GroupsSection'

type AttendanceRecord = {
  [participantName: string]: boolean
}

type AttendanceSectionProps = {
  groups: Group[]
  attendance: AttendanceRecord
  onAttendanceChange: (attendance: AttendanceRecord) => void
}

export function AttendanceSection({ groups, attendance, onAttendanceChange }: AttendanceSectionProps) {
  const allParticipants = groups.flatMap(group =>
    group.participants.map(participant => ({
      name: participant,
      groupName: group.name
    }))
  )

  const toggleAttendance = (participantName: string) => {
    onAttendanceChange({
      ...attendance,
      [participantName]: !attendance[participantName]
    })
  }

  const presentCount = Object.values(attendance).filter(Boolean).length
  const totalCount = allParticipants.length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Presentie</h2>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Check className="h-3 w-3 mr-1" />
            Aanwezig: {presentCount}
          </Badge>
          <Badge variant="outline" className="bg-muted">
            Totaal: {totalCount}
          </Badge>
        </div>
      </div>

      {allParticipants.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <UserCheck className="h-12 w-12 opacity-50" />
            <p>Nog geen deelnemers</p>
            <p className="text-sm">Voeg eerst groepen en deelnemers toe</p>
          </div>
        </Card>
      ) : (
        <ScrollArea className="h-[400px]">
          <div className="space-y-3 pr-4">
            {groups.map((group) => (
              group.participants.length > 0 && (
                <div key={group.id}>
                  <h3 className="font-medium text-sm text-muted-foreground mb-2">{group.name}</h3>
                  <div className="space-y-2 mb-4">
                    {group.participants.map((participant) => (
                      <Card key={participant} className="p-3">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id={`attendance-${participant}`}
                            checked={attendance[participant] || false}
                            onCheckedChange={() => toggleAttendance(participant)}
                          />
                          <label
                            htmlFor={`attendance-${participant}`}
                            className="flex-1 cursor-pointer flex items-center gap-2"
                          >
                            <span>{participant}</span>
                            {attendance[participant] && (
                              <div className="flex items-center gap-1 text-xs text-green-600">
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                              </div>
                            )}
                            {attendance[participant] === false && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                              </div>
                            )}
                          </label>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
