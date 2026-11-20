"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Moon, Sun, Monitor, Home, ChessQueen, Newspaper, Check, Mail } from "lucide-react"
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"

const navItems = [
  {
    path: "/",
    name: "Home",
    icon: Home,
  },
  {
    path: "/projects",
    name: "Projects",
    icon: ChessQueen,
  },
  {
    path: "/blog",
    name: "Blog",
    icon: Newspaper,
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
  const navListRef = useRef<HTMLDivElement>(null)
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const [pillStyle, setPillStyle] = useState<{
    left: number
    width: number
    ready: boolean
    animate: boolean
  }>({ left: 0, width: 0, ready: false, animate: false })

  const activeIndex = navItems.findIndex(
    ({ path }) => pathname === path || (path !== "/" && pathname.startsWith(path))
  )

  const updatePill = useCallback(
    (animate: boolean) => {
      const activeLink = activeIndex >= 0 ? linkRefs.current[activeIndex] : null
      if (!activeLink) {
        setPillStyle((prev) => ({ ...prev, ready: false }))
        return
      }
      setPillStyle({
        left: activeLink.offsetLeft,
        width: activeLink.offsetWidth,
        ready: true,
        animate,
      })
    },
    [activeIndex]
  )

  useLayoutEffect(() => {
    // Snap on first measurement, then animate smoothly on route changes
    updatePill(pillStyle.ready)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, updatePill])

  useEffect(() => {
    const container = navListRef.current
    if (!container) return
    const observer = new ResizeObserver(() => updatePill(false))
    observer.observe(container)
    return () => observer.disconnect()
  }, [updatePill])

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
          ? "liquid-glass px-3 sm:px-4 py-2 rounded-2xl"
          : "bg-transparent border border-transparent px-0 py-2.5"
        }`}
    >
      <nav className="flex flex-row items-center justify-between w-full" id="nav">
        <div ref={navListRef} className="relative flex flex-row items-center space-x-1 sm:space-x-1.5">
          <span
            aria-hidden="true"
            style={{
              width: pillStyle.width,
              transform: `translate3d(${pillStyle.left}px, 0, 0)`,
            }}
            className={`liquid-glass-pill pointer-events-none absolute top-0 bottom-0 left-0 rounded-xl ${
              pillStyle.ready ? "opacity-100" : "opacity-0"
            } ${
              pillStyle.animate
                ? "transition-[transform,width,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                : ""
            }`}
          />
          {navItems.map(({ path, name, icon: Icon }, index) => {
            const isActive = index === activeIndex
            return (
              <Link
                key={path}
                ref={(el) => {
                  linkRefs.current[index] = el
                }}
                href={path}
                className={`relative z-10 inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-sm font-medium border border-transparent transition-colors duration-200 ${isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/8"
                  }`}
              >
                <Icon className="h-4 w-4" />
                <span>{name}</span>
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-0.5 sm:gap-1">
          <a
            href="https://github.com/iLiranS"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            title="GitHub"
            className="p-1.5 sm:p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/8 transition-all duration-200 active:scale-95 flex items-center justify-center"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/in/lirans/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            title="LinkedIn"
            className="p-1.5 sm:p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/8 transition-all duration-200 active:scale-95 flex items-center justify-center"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
            </svg>
          </a>
          <a
            href="mailto:liransdev@gmail.com"
            aria-label="Contact via email"
            title="Contact"
            className="p-1.5 sm:p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/8 transition-all duration-200 active:scale-95 flex items-center justify-center"
          >
            <Mail className="h-4 w-4" />
          </a>

          <span aria-hidden="true" className="mx-1 h-4 w-px bg-black/10 dark:bg-white/12" />

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label="Select theme"
              aria-haspopup="listbox"
              aria-expanded={isOpen}
              className={`relative p-1.5 sm:p-2 rounded-xl cursor-pointer transition-all duration-200 active:scale-95 flex items-center justify-center ${isOpen
                ? "liquid-glass-pill text-foreground"
                : "border border-transparent text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/8"
                }`}
            >
              <CurrentThemeIcon className="h-4 w-4" />
            </button>

            {isOpen && (
              <div
                role="listbox"
                aria-label="Theme options"
                className="liquid-glass-menu absolute right-0 top-full mt-2 w-32 rounded-2xl p-1.5 z-50 animate-fade-in"
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
                      className={`flex w-full items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-colors ${isSelected
                        ? "liquid-glass-pill text-primary"
                        : "border border-transparent text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/8"
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
        </div>
      </nav>
    </header>
  )
}
