"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Moon, Sun, Monitor } from "lucide-react"
import { useEffect, useState } from "react"

const navItems = {
  "/": {
    name: "Home",
  },
  "/projects": {
    name: "Projects",
  },
  "/blog": {
    name: "Blog",
  },
}

export function Navbar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky  top-0 z-40 -mx-4 px-4 sm:-mx-6 sm:px-6 py-3 backdrop-blur-md bg-background/80 border-b border-border/40">
      <nav className="flex flex-row items-center justify-between max-w-3xl mx-auto" id="nav">
        <div className="flex flex-row space-x-1">
          {Object.entries(navItems).map(([path, { name }]) => {
            const isActive = pathname === path || (path !== "/" && pathname.startsWith(path))
            return (
              <Link
                key={path}
                href={path}
                className={`relative px-3 py-1.5 rounded-lg text-sm font-medium hover:text-foreground ${isActive
                  ? "text-primary bg-primary/10 dark:bg-primary/20"
                  : "text-muted-foreground hover:bg-muted/50"
                  }`}
              >
                {name}
              </Link>
            )
          })}
        </div>
        <div className="flex items-center gap-0.5 p-0.5 rounded-full border border-border/60 bg-card-background shadow-sm">
          {([
            { value: "light", icon: Sun, label: "Light" },
            { value: "dark", icon: Moon, label: "Dark" },
            { value: "system", icon: Monitor, label: "System" },
          ] as const).map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              aria-label={`${label} theme`}
              className={`relative p-1.5 rounded-full cursor-pointer transition-all duration-200 active:scale-90 ${
                mounted && theme === value
                  ? "bg-foreground/10 text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>
      </nav>
    </header>
  )
}
