"use client"

import { useEffect, useState } from "react"
import { MoonStarIcon, SunIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/hooks/use-theme"

function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const currentTheme = resolvedTheme || theme
  const isDark = currentTheme === "dark"

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle color theme"
      title="Toggle color theme"
    >
      {!mounted ? (
        <span className="size-4 inline-block" aria-hidden="true" />
      ) : isDark ? (
        <SunIcon className="size-4" aria-hidden="true" />
      ) : (
        <MoonStarIcon className="size-4" aria-hidden="true" />
      )}
    </Button>
  )
}

export { ThemeToggle }

