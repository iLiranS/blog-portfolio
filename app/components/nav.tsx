"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Moon, Sun, Monitor, Home, FolderGit2, BookOpen } from "lucide-react"
import { useEffect, useState } from "react"

const navItems = [
  {
    path: "/",
    name: "Home",
    icon: Home,
  },
  {
    path: "/projects",
    name: "Projects",
    icon: FolderGit2,
  },
  {
    path: "/blog",
    name: "Blog",
    icon: BookOpen,
  },
]

export function Navbar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    setMounted(true)
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }

      // Hide when scrolling down past 50px, show when scrolling up
      if (currentScrollY > 50 && currentScrollY > lastScrollY) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }

      lastScrollY = currentScrollY
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky w-[95%] mx-auto top-3 z-40 px-4 py-2.5 rounded-xl transition-all duration-300 ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-16 opacity-0 pointer-events-none"
        } ${isScrolled
          ? "backdrop-blur-md bg-background/80 border border-border/50 dark:border-border/40 shadow-lg shadow-black/5 dark:shadow-black/20"
          : "bg-transparent border border-transparent"
        }`}
    >
      <nav className="flex flex-row items-center justify-between max-w-3xl mx-auto" id="nav">
        <div className="flex flex-row space-x-1">
          {navItems.map(({ path, name, icon: Icon }) => {
            const isActive = pathname === path || (path !== "/" && pathname.startsWith(path))
            return (
              <Link
                key={path}
                href={path}
                className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium hover:text-foreground ${isActive
                  ? "text-primary bg-primary/10 dark:bg-primary/20"
                  : "text-muted-foreground hover:bg-muted/50"
                  }`}
              >
                <Icon className="h-4 w-4" />
                <span>{name}</span>
              </Link>
            )
          })}
        </div>
        <div className="flex items-center gap-0.5 p-0.5 ">
          {([
            { value: "light", icon: Sun, label: "Light" },
            { value: "dark", icon: Moon, label: "Dark" },
            { value: "system", icon: Monitor, label: "System" },
          ] as const).map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              aria-label={`${label} theme`}
              className={`relative p-1.5 rounded-lg cursor-pointer transition-all duration-200 active:scale-90 ${mounted && theme === value
                ? "bg-background text-foreground shadow-xs dark:bg-accent"
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
