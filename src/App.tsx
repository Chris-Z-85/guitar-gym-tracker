import { FC } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import SessionForm from "./components/ui/SessionForm"
import SessionHistory from "./components/ui/SessionHistory";

const App: FC = () => {
  
  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="py-4 sm:py-6 lg:py-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center sm:gap-6">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">The Guitar Gym</h1>
            <ThemeToggle />
          </div>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Guitar Practice Tracker Dashboard 
          </p>
          <p className="font-bold">
        Track your daily guitar practice sessions, add exercises, and monitor your progress over time.
      </p>
          <SessionForm />
          <SessionHistory />
        </div>
      </div>
    </div>
  )
}

export default App
