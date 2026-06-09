"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
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
  const { resolvedTheme, setTheme } = useTheme()
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
                className={`relative px-3 py-1.5 rounded-full text-sm font-medium hover:text-foreground ${isActive
                  ? "text-primary bg-primary/10 dark:bg-primary/20"
                  : "text-muted-foreground hover:bg-muted/50"
                  }`}
              >
                {name}
              </Link>
            )
          })}
        </div>
        <button
          onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
          className="flex text-xl cursor-pointer p-2 rounded-full border border-border/60 bg-card-background hover:bg-muted transition-[transform,box-shadow] duration-200 shadow-sm text-foreground active:scale-95"
          aria-label="Toggle theme"
        >
          {mounted ? (
            resolvedTheme === "light" ? (
              <Sun className="h-5 w-5 animate-spin-once" />
            ) : (
              <Moon className="h-5 w-5 animate-pulse-once" />
            )
          ) : (
            <div className="h-5 w-5" />
          )}
        </button>
      </nav>
    </header>
  )
}
