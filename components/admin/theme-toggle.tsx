"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const isDark = theme === "dark"

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "w-full justify-start text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900",
        compact ? "h-8 justify-center px-0" : "",
      )}
    >
      {isDark ? (
        <Sun className={cn("h-4 w-4", !compact && "mr-2")} />
      ) : (
        <Moon className={cn("h-4 w-4", !compact && "mr-2")} />
      )}
      {!compact && (isDark ? "Light Mode" : "Dark Mode")}
    </Button>
  )
}
