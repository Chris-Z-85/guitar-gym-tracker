import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"
import { Textarea } from "./ui/textarea"
import { PracticeItem } from "./Settings"

export interface PracticeGoal {
  name: string
  targetBpm: number
  notes?: string
}

interface PracticeGoalFormProps {
  onGoalSet: (goal: PracticeGoal) => void
}

export function PracticeGoalForm({ onGoalSet }: PracticeGoalFormProps) {
  const [goal, setGoal] = useState<PracticeGoal>({
    name: "",
    targetBpm: 120,
    notes: "",
  })
  const [practiceItems, setPracticeItems] = useState<PracticeItem[]>([])

  useEffect(() => {
    const savedItems = localStorage.getItem('guitar-gym-practice-items')
    if (savedItems) {
      setPracticeItems(JSON.parse(savedItems))
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!goal.name) return
    onGoalSet(goal)
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">What are you practicing?</Label>
            <div className="flex flex-wrap gap-2">
              {practiceItems.map(item => (
                <Button 
                  key={item.id}
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setGoal(prev => ({ ...prev, name: item.name }))}
                >
                  {item.name}
                </Button>
              ))}
            </div>
            <Input
              id="name"
              value={goal.name}
              onChange={(e) => setGoal({ ...goal, name: e.target.value })}
              placeholder="e.g., Scale practice, Song name, Exercise..."
              required
            />
          </div>
          
          <div>
            <Label htmlFor="targetBpm">Target BPM</Label>
            <Input
              id="targetBpm"
              type="number"
              value={goal.targetBpm}
              onChange={(e) => setGoal({ ...goal, targetBpm: Number(e.target.value) })}
              min={1}
              required
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={goal.notes}
              onChange={(e) => setGoal({ ...goal, notes: e.target.value })}
              placeholder="Any specific focus areas or reminders..."
            />
          </div>

          <Button type="submit" className="w-full">
            Start Practice Session
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 