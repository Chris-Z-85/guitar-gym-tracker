import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "./ui/textarea"
import { useAuth } from "@/lib/context/AuthProvider"
import { fetchPracticeItems } from "@/lib/practice-items"
import type { PracticeItem } from "@/types/firestore"
import { toast } from "sonner"
import { useNavigate, useLocation } from "react-router-dom"
import { Sparkles, StickyNote } from "lucide-react"
import { BpmSelector } from "./BpmSelector"

export interface PracticeGoal {
  name: string
  targetBpm: number
  notes?: string
}

interface PracticeGoalFormProps {
  onGoalSet: (goal: PracticeGoal) => void
}

export function PracticeGoalForm({ onGoalSet }: PracticeGoalFormProps) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [goal, setGoal] = useState<PracticeGoal>({
    name: "",
    targetBpm: 120,
    notes: "",
  })
  const [practiceItems, setPracticeItems] = useState<PracticeItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  console.log('PracticeGoal: Component rendered, goal:', goal)

  useEffect(() => {
    // Only fetch practice items if user is logged in
    if (!user) return

    const loadPracticeItems = async () => {
      setIsLoading(true)
      try {
        const items = await fetchPracticeItems(user.uid)
        setPracticeItems(items)
      } catch (error) {
        toast.error("Failed to load practice items")
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPracticeItems()
  }, [user])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('PracticeGoal: Form submitted with goal:', goal)
    if (!goal.name) return

    if (!user) {
      // Save the current goal in session storage before redirecting
      sessionStorage.setItem('pendingGoal', JSON.stringify(goal))
      // Redirect to auth with current location as return destination
      navigate('/auth', { state: { from: location } })
      return
    }

    console.log('PracticeGoal: Calling onGoalSet with goal:', goal)
    onGoalSet(goal)
  }

  const handlePracticeItemClick = (itemName: string) => {
    console.log('PracticeGoal: Practice item clicked:', itemName)
    setGoal(prev => ({ ...prev, name: itemName }))
  }

  // Try to restore pending goal when user returns after authentication
  useEffect(() => {
    if (user) {
      const pendingGoal = sessionStorage.getItem('pendingGoal')
      if (pendingGoal) {
        const savedGoal = JSON.parse(pendingGoal)
        setGoal(savedGoal)
        sessionStorage.removeItem('pendingGoal')
        // Don't automatically submit - let user adjust BPM first
        // onGoalSet(savedGoal) // ❌ Removed automatic submission
      }
    }
  }, [user]) // Removed onGoalSet dependency

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <h2 className="flex items-center gap-2 mb-2 text-lg font-semibold text-white">
              <Sparkles size={18} />Practice Details
            </h2>
            {user && practiceItems.length > 0 && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {practiceItems.map(item => (
                    <Button 
                      key={item.id}
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => handlePracticeItemClick(item.name)}
                      disabled={isLoading}
                    >
                      {item.name}
                    </Button>
                  ))}
                </div>
                {goal.name && (
                  <p className="text-sm text-muted-foreground">
                    💡 You can now adjust the BPM and add notes before starting your practice session
                  </p>
                )}
              </div>
            )}
            <Input
              id="name"
              value={goal.name}
              onChange={(e) => setGoal({ ...goal, name: e.target.value })}
              placeholder="e.g., Scale practice, Song name, Exercise..."
              required
            />
          </div>
          
          <BpmSelector
            value={goal.targetBpm}
            onChange={(value) => setGoal(prev => ({ ...prev, targetBpm: value }))}
          />

          <div>
            <h2 className="flex items-center gap-2 mb-2 text-lg font-semibold text-white">
              <StickyNote size={18} />Notes (optional)
            </h2>
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