import { Home, Timer, ScrollText, History, Menu, Settings as SettingsIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Link, useLocation } from "react-router-dom"
import { ThemeToggle } from "@/components/theme-toggle"

const menuItems = [
  {
    title: "Home",
    icon: <Home className="w-4 h-4" />,
    href: "/",
  },
  {
    title: "Timer",
    icon: <Timer className="w-4 h-4" />,
    href: "/timer",
  },
  {
    title: "Logger",
    icon: <ScrollText className="w-4 h-4" />,
    href: "/logger",
  },
  {
    title: "History",
    icon: <History className="w-4 h-4" />,
    href: "/history",
  },
  {
    title: "Settings",
    icon: <SettingsIcon className="w-4 h-4" />,
    href: "/settings",
  },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  return (
    <div
      className={cn(
        "flex flex-col h-screen p-3 bg-background border-r transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between mb-6">
        {!collapsed && <h2 className="text-xl font-bold">Menu</h2>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="hover:bg-accent"
        >
          <Menu className="w-4 h-4" />
        </Button>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-accent",
              location.pathname === item.href && "bg-accent"
            )}
          >
            {item.icon}
            {!collapsed && <span>{item.title}</span>}
          </Link>
        ))}
      </nav>

      <div className={cn(
        "flex items-center pt-4 border-t",
        collapsed ? "justify-center" : "justify-start px-3"
      )}>
        <ThemeToggle />
      </div>
    </div>
  )
} 