import { FC } from "react"
import { Toaster } from "sonner"
import { Sidebar } from "@/components/Sidebar"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "@/pages/HomePage"
import HistoryPage from "@/pages/HistoryPage"
import { Timer } from "./components/Timer"
import SessionLogger from "./components/SessionLogger"
import { Settings } from "./components/Settings"

const App: FC = () => {
  return (
    <Router>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="py-4 sm:py-6 lg:py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/timer" element={<Timer />} />
              <Route path="/logger" element={<SessionLogger />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
        <Toaster />
      </div>
    </Router>
  )
}

export default App
