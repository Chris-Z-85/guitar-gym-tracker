import { PracticeGoalForm, PracticeGoal } from "@/components/PracticeGoal"
import { useState } from "react"
import PracticeTimer from "@/components/PracticeTimer"

export default function HomePage() {
  const [currentGoal, setCurrentGoal] = useState<PracticeGoal | null>(null);

  const handleGoalSet = (goal: PracticeGoal) => {
    setCurrentGoal(goal);
  };

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">Guitar Gym</h1>
          <p className="mt-4 font-bold text-muted-foreground sm:text-lg">
            Welcome to the Guitar Practice Tracker 
          </p>
          <p className="text-base">
            Track your daily guitar practice sessions, add exercises, and monitor your progress over time.
          </p>
        </div>
        {currentGoal ? (
          <>
            <h2 className="text-xl font-semibold">Practice Session</h2>
            <PracticeTimer initialGoal={currentGoal} />
          </>
        ) : (
          <PracticeGoalForm onGoalSet={handleGoalSet}/>
        )}
      </div>
    </div>
  )
} 