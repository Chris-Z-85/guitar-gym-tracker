import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { FC } from "react"

import { Button } from "@/components/ui/button"

export const ThemeToggle: FC = () => {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative"
    >{
        theme === "dark" ? (
            <Sun className="absolute h-[1.2rem] w-[1.2rem] transition-opacity" />
        ) : (
            <Moon className="h-[1.2rem] w-[1.2rem] transition-opacity" />
        )
    }
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
} 