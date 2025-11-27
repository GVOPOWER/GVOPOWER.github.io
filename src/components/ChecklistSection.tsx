import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Plus, Trash, UserCheck } from '@phosphor-icons/react'
import type { ChecklistItem, Group } from '@/types'

type ChecklistSectionProps = {
  items: ChecklistItem[]
  onItemsChange: (items: ChecklistItem[]) => void
  groupId: string
  group: Group | null
}

export function ChecklistSection({ items, onItemsChange, groupId, group }: ChecklistSectionProps) {
  const [newItemText, setNewItemText] = useState('')

  const addItem = () => {
    if (newItemText.trim()) {
      onItemsChange([...items, { 
        id: Date.now().toString(), 
        text: newItemText.trim(), 
        completed: false, 
        groupId,
        executedBy: []
      }])
      setNewItemText('')
    }
  }

  const toggleItem = (id: string) => {
    onItemsChange(items.map(item => item.id === id ? { ...item, completed: !item.completed } : item))
  }

  const deleteItem = (id: string) => {
    onItemsChange(items.filter(item => item.id !== id))
  }

  const toggleExecutor = (itemId: string, memberEmail: string) => {
    onItemsChange(items.map(item => {
      if (item.id !== itemId) return item
      
      const executedBy = item.executedBy || []
      const isExecutor = executedBy.includes(memberEmail)
      
      return {
        ...item,
        executedBy: isExecutor
          ? executedBy.filter(e => e !== memberEmail)
          : [...executedBy, memberEmail]
      }
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addItem()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          id="new-checklist-item"
          placeholder="Nieuwe taak toevoegen..."
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button onClick={addItem} size="icon" className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {items.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Plus className="h-12 w-12 opacity-50" />
            <p>Nog geen taken toegevoegd</p>
            <p className="text-sm">Voeg je voorbereidingstaken toe voor de game ochtend</p>
          </div>
        </Card>
      ) : (
        <ScrollArea className="h-[400px]">
          <div className="space-y-2 pr-4">
            {items.map((item) => (
              <Card key={item.id} className="p-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={`checklist-${item.id}`}
                      checked={item.completed}
                      onCheckedChange={() => toggleItem(item.id)}
                    />
                    <label
                      htmlFor={`checklist-${item.id}`}
                      className={`flex-1 cursor-pointer ${item.completed ? 'line-through text-muted-foreground' : ''}`}
                    >
                      {item.text}
                    </label>
                    {group && group.members && group.members.length > 0 && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <UserCheck className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64" align="end">
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm">Uitgevoerd door</h4>
                            <div className="space-y-1">
                              {group.members.map((member) => (
                                <div key={member} className="flex items-center gap-2">
                                  <Checkbox
                                    id={`executor-${item.id}-${member}`}
                                    checked={(item.executedBy || []).includes(member)}
                                    onCheckedChange={() => toggleExecutor(item.id, member)}
                                  />
                                  <label
                                    htmlFor={`executor-${item.id}-${member}`}
                                    className="text-sm cursor-pointer flex-1"
                                  >
                                    {member}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteItem(item.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  {item.executedBy && item.executedBy.length > 0 && (
                    <div className="flex flex-wrap gap-1 ml-9">
                      {item.executedBy.map((executor) => (
                        <Badge key={executor} variant="secondary" className="text-xs">
                          {executor}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
