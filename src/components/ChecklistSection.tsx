import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, Trash } from '@phosphor-icons/react'

type ChecklistItem = {
  id: string
  text: string
  completed: boolean
}

type ChecklistSectionProps = {
  items: ChecklistItem[]
  onItemsChange: (items: ChecklistItem[]) => void
}

export function ChecklistSection({ items, onItemsChange }: ChecklistSectionProps) {
  const [newItemText, setNewItemText] = useState('')

  const addItem = () => {
    if (newItemText.trim()) {
      onItemsChange([...items, { id: Date.now().toString(), text: newItemText.trim(), completed: false }])
      setNewItemText('')
    }
  }

  const toggleItem = (id: string) => {
    onItemsChange(items.map(item => item.id === id ? { ...item, completed: !item.completed } : item))
  }

  const deleteItem = (id: string) => {
    onItemsChange(items.filter(item => item.id !== id))
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
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteItem(item.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
