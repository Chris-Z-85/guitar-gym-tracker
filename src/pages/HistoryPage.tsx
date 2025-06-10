import SessionHistory from "@/components/ui/SessionHistory"

export default function HistoryPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl mb-8">Practice History</h1>
      <SessionHistory />
    </div>
  )
} 