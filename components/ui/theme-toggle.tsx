"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  const { theme, setTheme } = useTheme()

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-theme-toggle]')) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen])

  if (!mounted) {
    return (
      <div className="relative inline-block">
        <button
          className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] bg-transparent transition-colors hover:bg-[var(--accent)]"
          disabled
        >
          <Sun className="h-4 w-4" />
        </button>
      </div>
    )
  }

  const currentIcon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor

  return (
    <div className="relative inline-block" data-theme-toggle>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] bg-transparent transition-colors hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
        aria-label="Toggle theme"
      >
        {React.createElement(currentIcon, { className: "h-4 w-4" })}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-36 overflow-hidden rounded-lg border border-[var(--border)] backdrop-blur-md bg-white/90 dark:bg-zinc-900/90 shadow-lg animate-in slide-in-from-top-2 z-50">
          <div className="p-1">
            <button
              onClick={() => {
                setTheme("light")
                setIsOpen(false)
              }}
              className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] ${
                theme === "light" ? "bg-[var(--accent)] text-[var(--accent-foreground)]" : ""
              }`}
            >
              <Sun className="h-4 w-4" />
              <span>Light</span>
              {theme === "light" && <span className="ml-auto">✓</span>}
            </button>
            
            <button
              onClick={() => {
                setTheme("dark")
                setIsOpen(false)
              }}
              className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] ${
                theme === "dark" ? "bg-[var(--accent)] text-[var(--accent-foreground)]" : ""
              }`}
            >
              <Moon className="h-4 w-4" />
              <span>Dark</span>
              {theme === "dark" && <span className="ml-auto">✓</span>}
            </button>
            
            <button
              onClick={() => {
                setTheme("system")
                setIsOpen(false)
              }}
              className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] ${
                theme === "system" ? "bg-[var(--accent)] text-[var(--accent-foreground)]" : ""
              }`}
            >
              <Monitor className="h-4 w-4" />
              <span>System</span>
              {theme === "system" && <span className="ml-auto">✓</span>}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
