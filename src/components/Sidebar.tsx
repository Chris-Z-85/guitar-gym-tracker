import { Home, Timer, History, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Link, useLocation } from "react-router-dom"

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
    title: "History",
    icon: <History className="w-4 h-4" />,
    href: "/history",
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

      <nav className="space-y-2">
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
    </div>
  )
} 