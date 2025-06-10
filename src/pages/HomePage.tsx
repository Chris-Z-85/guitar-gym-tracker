import SessionForm from "@/components/ui/SessionForm"

export default function HomePage() {
  return (
    <div>
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">Welcome to Guitar Gym</h1>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Guitar Practice Tracker Dashboard 
          </p>
          <p className="font-bold">
            Track your daily guitar practice sessions, add exercises, and monitor your progress over time.
          </p>
        </div>
        <SessionForm />
      </div>
    </div>
  )
} 