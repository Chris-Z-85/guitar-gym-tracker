import { PracticeGoalForm, PracticeGoal } from '@/components/PracticeGoal';
import { useState } from 'react';
import PracticeTimer from '@/components/PracticeTimer';
import GG_logo from '@/components/GG_logo';

export default function HomePage() {
  const [currentGoal, setCurrentGoal] = useState<PracticeGoal | null>(null);

  const handleGoalSet = (goal: PracticeGoal) => {
    setCurrentGoal(goal);
  };

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-5xl font-bold">
            <h1>GUITAR</h1>
            <GG_logo />
            <h1>GYM</h1>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl lg:text-2xl">
              Practice Tracker
            </h1>
            <p className="text-base">
              Track your daily guitar practice sessions, add exercises, and
              monitor your progress over time.
            </p>
          </div>
        </div>
        {currentGoal ? (
          <>
            <h2 className="text-xl font-semibold">Practice Session</h2>
            <PracticeTimer initialGoal={currentGoal} />
          </>
        ) : (
          <PracticeGoalForm onGoalSet={handleGoalSet} />
        )}
      </div>
    </div>
  );
}
