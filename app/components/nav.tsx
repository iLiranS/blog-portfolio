"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Moon, Sun, Monitor, Home, FolderGit2, BookOpen, Check } from "lucide-react"
import { useEffect, useRef, useState } from "react"

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

const themeOptions = [
  { value: "light", icon: Sun, label: "Light" },
  { value: "dark", icon: Moon, label: "Dark" },
  { value: "system", icon: Monitor, label: "System" },
] as const

export function Navbar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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
        setIsOpen(false)
      } else {
        setIsVisible(true)
      }

      lastScrollY = currentScrollY
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("touchstart", handleClickOutside)
      document.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  const CurrentThemeIcon =
    mounted && theme === "dark"
      ? Moon
      : mounted && theme === "system"
        ? Monitor
        : Sun

  return (
    <header
      className={`sticky w-full top-3 z-40 transition-all duration-300 ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-16 opacity-0 pointer-events-none"
        } ${isScrolled
          ? "backdrop-blur-md bg-background/80 border border-border/50 dark:border-border/40 shadow-lg shadow-black/5 dark:shadow-black/20 px-3 sm:px-4 py-2 rounded-xl"
          : "bg-transparent border border-transparent px-0 py-2.5"
        }`}
    >
      <nav className="flex flex-row items-center justify-between w-full" id="nav">
        <div className="flex flex-row space-x-1 sm:space-x-1.5">
          {navItems.map(({ path, name, icon: Icon }) => {
            const isActive = pathname === path || (path !== "/" && pathname.startsWith(path))
            return (
              <Link
                key={path}
                href={path}
                className={`relative inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-sm font-medium hover:text-foreground transition-colors ${isActive
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

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Select theme"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            className={`relative p-2 rounded-lg cursor-pointer transition-all duration-200 active:scale-95 flex items-center justify-center ${isOpen
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
          >
            <CurrentThemeIcon className="h-4 w-4" />
          </button>

          {isOpen && (
            <div
              role="listbox"
              aria-label="Theme options"
              className="absolute right-0 top-full mt-2 w-32 rounded-xl border border-border/60 bg-background/95 p-1 backdrop-blur-md shadow-lg shadow-black/5 dark:shadow-black/20 z-50 animate-fade-in"
            >
              {themeOptions.map(({ value, icon: Icon, label }) => {
                const isSelected = mounted && theme === value
                return (
                  <button
                    key={value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      setTheme(value)
                      setIsOpen(false)
                    }}
                    className={`flex w-full items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${isSelected
                      ? "bg-primary/10 text-primary dark:bg-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5" />
                      <span>{label}</span>
                    </div>
                    {isSelected && <Check className="h-3.5 w-3.5" />}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
