import { FC } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Toaster } from "sonner"
import { Sidebar } from "@/components/Sidebar"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "@/pages/HomePage"
import TimerPage from "@/pages/TimerPage"
import HistoryPage from "@/pages/HistoryPage"

const App: FC = () => {
  return (
    <Router>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="py-4 sm:py-6 lg:py-8">
            <div className="flex justify-end mb-8">
              <ThemeToggle />
            </div>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/timer" element={<TimerPage />} />
              <Route path="/history" element={<HistoryPage />} />
            </Routes>
          </div>
        </div>
        <Toaster />
      </div>
    </Router>
  )
}

export default App
