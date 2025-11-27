import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { UserCheck, Check, Plus, CalendarBlank, Trash } from '@phosphor-icons/react'
import type { Group, AttendanceDate } from '@/types'

type AttendanceSectionProps = {
  groups: Group[]
  attendanceDates: AttendanceDate[]
  onAttendanceDatesChange: (dates: AttendanceDate[]) => void
}

export function AttendanceSection({ groups, attendanceDates, onAttendanceDatesChange }: AttendanceSectionProps) {
  const [newDate, setNewDate] = useState('')
  const [selectedDateId, setSelectedDateId] = useState<string | null>(
    attendanceDates.length > 0 ? attendanceDates[0].id : null
  )

  const allParticipants = groups.flatMap(group =>
    group.participants.map(participant => ({
      ...participant,
      groupName: group.name,
      groupId: group.id
    }))
  )

  const addDate = () => {
    if (!newDate || !groups[0]) return

    const newAttendanceDate: AttendanceDate = {
      id: Date.now().toString(),
      date: newDate,
      participants: {},
      groupId: groups[0].id
    }

    onAttendanceDatesChange([newAttendanceDate, ...attendanceDates])
    setSelectedDateId(newAttendanceDate.id)
    setNewDate('')
  }

  const deleteDate = (dateId: string) => {
    onAttendanceDatesChange(attendanceDates.filter(d => d.id !== dateId))
    if (selectedDateId === dateId) {
      setSelectedDateId(attendanceDates.length > 1 ? attendanceDates[0].id : null)
    }
  }

  const toggleAttendance = (participantId: string) => {
    if (!selectedDateId) return

    onAttendanceDatesChange(
      attendanceDates.map(date => {
        if (date.id === selectedDateId) {
          return {
            ...date,
            participants: {
              ...date.participants,
              [participantId]: !date.participants[participantId]
            }
          }
        }
        return date
      })
    )
  }

  const selectedDate = attendanceDates.find(d => d.id === selectedDateId)
  const presentCount = selectedDate 
    ? Object.values(selectedDate.participants).filter(Boolean).length 
    : 0
  const totalCount = allParticipants.length

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addDate()
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Presentie</h2>
        {selectedDate && (
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Check className="h-3 w-3 mr-1" />
              Aanwezig: {presentCount}
            </Badge>
            <Badge variant="outline" className="bg-muted">
              Totaal: {totalCount}
            </Badge>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Input
          id="new-date"
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button 
          onClick={addDate} 
          className="bg-accent text-accent-foreground hover:bg-accent/90"
          disabled={!newDate}
        >
          <Plus className="h-4 w-4 mr-2" />
          Datum Toevoegen
        </Button>
      </div>

      {attendanceDates.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <CalendarBlank className="h-12 w-12 opacity-50" />
            <p>Nog geen presentie datums</p>
            <p className="text-sm">Voeg een datum toe om presentie bij te houden</p>
          </div>
        </Card>
      ) : (
        <>
          <ScrollArea className="h-[100px] border rounded-md p-2">
            <div className="space-y-2">
              {attendanceDates.map((date) => (
                <div key={date.id} className="flex items-center gap-2">
                  <Button
                    variant={selectedDateId === date.id ? 'default' : 'outline'}
                    onClick={() => setSelectedDateId(date.id)}
                    className="flex-1 justify-start"
                  >
                    <CalendarBlank className="h-4 w-4 mr-2" />
                    {formatDate(date.date)}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteDate(date.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>

          {selectedDate && allParticipants.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <UserCheck className="h-12 w-12 opacity-50" />
                <p>Nog geen deelnemers</p>
                <p className="text-sm">Voeg eerst groepen en deelnemers toe</p>
              </div>
            </Card>
          ) : selectedDate ? (
            <ScrollArea className="h-[400px]">
              <div className="space-y-3 pr-4">
                {groups.map((group) => (
                  group.participants.length > 0 && (
                    <div key={group.id}>
                      <h3 className="font-medium text-sm text-muted-foreground mb-2">{group.name}</h3>
                      <div className="space-y-2 mb-4">
                        {group.participants.map((participant) => (
                          <Card key={participant.id} className="p-3">
                            <div className="flex items-center gap-3">
                              <Checkbox
                                id={`attendance-${participant.id}`}
                                checked={selectedDate.participants[participant.id] || false}
                                onCheckedChange={() => toggleAttendance(participant.id)}
                              />
                              <label
                                htmlFor={`attendance-${participant.id}`}
                                className="flex-1 cursor-pointer flex items-center gap-2"
                              >
                                <span>{participant.name}</span>
                                {selectedDate.participants[participant.id] && (
                                  <div className="flex items-center gap-1 text-xs text-green-600">
                                    <div className="h-2 w-2 rounded-full bg-green-500" />
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
          ) : null}
        </>
      )}
    </div>
  )
}
