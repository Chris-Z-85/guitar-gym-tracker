import { FC } from "react"
import { Toaster } from "sonner"
import { Sidebar } from "@/components/Sidebar"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "@/pages/HomePage"
import HistoryPage from "@/pages/HistoryPage"
import { Timer } from "./components/Timer"
import SessionLogger from "./components/SessionLogger"
import { Settings } from "./components/Settings"
import { Auth } from "./components/Auth"
import { AuthProvider } from "./lib/context/AuthProvider"
import { ProtectedRoute } from "./components/ProtectedRoute"

const App: FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex min-h-screen bg-background">
          <Sidebar />
          <div className="flex-1 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="py-4 sm:py-6 lg:py-8">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/auth" element={<Auth />} />
                <Route
                  path="/timer"
                  element={
                    <ProtectedRoute>
                      <Timer />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/logger"
                  element={
                    <ProtectedRoute>
                      <SessionLogger />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/history"
                  element={
                    <ProtectedRoute>
                      <HistoryPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </div>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
