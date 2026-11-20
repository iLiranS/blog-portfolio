"use client"

import { useEffect, useState, useRef, useMemo, useCallback } from "react"
import { Link2, Check, ChevronDown, List } from "lucide-react"

export interface TocItem {
  text: string
  id: string
  level: number
  snippet?: string
}

interface TableOfContentsProps {
  headings: TocItem[]
  title?: string
  className?: string
}

const cn = (...classes: (string | boolean | undefined | null)[]) => classes.filter(Boolean).join(" ")

export function TableOfContents({ headings, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(headings[0]?.id || "")
  const [isExpanded, setIsExpanded] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [popoverPlacement, setPopoverPlacement] = useState<"right" | "left">("left")

  const isClickScrolling = useRef(false)
  const containerRef = useRef<HTMLElement>(null)
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const minLevel = useMemo(() => {
    if (headings.length === 0) return 2
    return Math.min(...headings.map((h) => h.level))
  }, [headings])

  const activeIndex = useMemo(() => {
    const idx = headings.findIndex((h) => h.id === activeId)
    return idx >= 0 ? idx : 0
  }, [headings, activeId])

  const progressPercent = headings.length > 1 ? (activeIndex / (headings.length - 1)) * 100 : 100

  // Active section tracking via IntersectionObserver & scroll fallback
  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return

        const visibleEntries = entries.filter((entry) => entry.isIntersecting)
        if (visibleEntries.length > 0) {
          const closest = visibleEntries.reduce((prev, curr) =>
            Math.abs(curr.boundingClientRect.top - 100) < Math.abs(prev.boundingClientRect.top - 100)
              ? curr
              : prev
          )
          setActiveId(closest.target.id)
        }
      },
      {
        rootMargin: "-90px 0px -65% 0px",
        threshold: [0, 1],
      }
    )

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id)
      if (el) observer.observe(el)
    })

    const handleScroll = () => {
      if (isClickScrolling.current) return

      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      if (scrollPosition + windowHeight >= documentHeight - 100) {
        setActiveId(headings[headings.length - 1].id)
        return
      }

      const headerOffset = 110
      let currentId = headings[0].id
      for (const heading of headings) {
        const el = document.getElementById(heading.id)
        if (el) {
          if (el.getBoundingClientRect().top <= headerOffset) {
            currentId = heading.id
          } else {
            break
          }
        }
      }
      setActiveId(currentId)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      headings.forEach((heading) => {
        const el = document.getElementById(heading.id)
        if (el) observer.unobserve(el)
      })
      window.removeEventListener("scroll", handleScroll)
    }
  }, [headings])

  const updatePlacement = useCallback(() => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setPopoverPlacement(window.innerWidth - rect.right < 300 ? "left" : "right")
  }, [])

  useEffect(() => {
    updatePlacement()
    window.addEventListener("resize", updatePlacement, { passive: true })
    return () => window.removeEventListener("resize", updatePlacement)
  }, [updatePlacement])

  const handleMouseEnter = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current)
      leaveTimerRef.current = null
    }
    updatePlacement()
    setIsExpanded(true)
  }

  const handleMouseLeave = () => {
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current)
    leaveTimerRef.current = setTimeout(() => {
      setIsExpanded(false)
    }, 140)
  }

  const handleScrollTo = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    const el = document.getElementById(id)
    if (!el) return

    isClickScrolling.current = true
    setActiveId(id)
    setIsExpanded(false)

    const headerOffset = 90
    const offsetPosition = el.getBoundingClientRect().top + window.scrollY - headerOffset

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    })

    if (window.history.pushState) {
      window.history.pushState(null, "", `#${id}`)
    }

    setTimeout(() => {
      isClickScrolling.current = false
    }, 700)
  }

  const handleCopyLink = async (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    const url = `${window.location.origin}${window.location.pathname}#${id}`
    try {
      await navigator.clipboard.writeText(url)
      setCopiedId(id)
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
      copyTimerRef.current = setTimeout(() => {
        setCopiedId(null)
      }, 2000)
    } catch (err) {
      console.error("Failed to copy link:", err)
    }
  }

  if (headings.length === 0) return null

  return (
    <nav
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn("relative flex flex-col items-center select-none pointer-events-auto py-2", className)}
      aria-label="Table of contents"
    >
      {/* Connected Dots + Progress Line Track */}
      <div className="relative flex flex-col items-center">
        {headings.length > 1 && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-[10px] bottom-[10px] left-1/2 -translate-x-1/2 w-[1.5px] rounded-full bg-black/10 dark:bg-white/12 overflow-hidden"
          >
            <div
              className="w-full bg-primary rounded-full shadow-[0_0_8px_var(--primary)] transition-[height] duration-300 ease-out"
              style={{ height: `${progressPercent}%` }}
            />
          </div>
        )}

        {headings.map((heading, index) => {
          const isActive = index === activeIndex
          const isPassed = index <= activeIndex
          const depth = Math.max(0, heading.level - minLevel)

          return (
            <button
              key={heading.id}
              type="button"
              onClick={(e) => handleScrollTo(e, heading.id)}
              aria-label={`Jump to section: ${heading.text}`}
              className="relative z-10 flex items-center justify-center w-8 h-5 group cursor-pointer"
            >
              <span
                className={cn(
                  "rounded-full transition-all duration-200 ease-out block",
                  isActive
                    ? "w-2.5 h-2.5 bg-primary shadow-[0_0_8px_var(--primary)] ring-2 ring-background"
                    : isPassed
                      ? "w-1.5 h-1.5 bg-primary/80 group-hover:scale-125"
                      : depth === 0
                        ? "w-1.5 h-1.5 bg-neutral-400/60 dark:bg-white/25 group-hover:bg-foreground/70 group-hover:scale-125"
                        : "w-1 h-1 bg-neutral-400/45 dark:bg-white/18 group-hover:bg-foreground/70 group-hover:scale-125"
                )}
              />
            </button>
          )
        })}
      </div>

      {/* Expanded Liquid Glass Outline Panel */}
      {isExpanded && (
        <div
          className={cn(
            "absolute top-2 z-50",
            popoverPlacement === "right" ? "left-full pl-2" : "right-full pr-2"
          )}
        >
          <div className="liquid-glass-menu w-72 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-2xl p-2 animate-fade-in">
            <div className="flex items-center justify-between px-2.5 py-1.5 mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                On this page
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">
                {activeIndex + 1}/{headings.length}
              </span>
            </div>

            <ul className="flex flex-col gap-0.5">
              {headings.map((heading, index) => {
                const isActive = index === activeIndex
                const depth = Math.max(0, heading.level - minLevel)
                const isCopied = copiedId === heading.id

                return (
                  <li key={heading.id} className="group/row relative flex items-center">
                    <button
                      type="button"
                      onClick={(e) => handleScrollTo(e, heading.id)}
                      style={{ paddingLeft: `${10 + depth * 12}px` }}
                      className={cn(
                        "flex-1 text-left pr-8 py-1.5 rounded-xl text-xs leading-snug transition-colors cursor-pointer flex items-center gap-2 border",
                        isActive
                          ? "liquid-glass-pill text-primary font-semibold"
                          : "border-transparent text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/8"
                      )}
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full shrink-0 transition-colors",
                          isActive
                            ? "bg-primary shadow-[0_0_6px_var(--primary)]"
                            : "bg-neutral-400/40 dark:bg-white/20"
                        )}
                      />
                      <span className="line-clamp-2">{heading.text}</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleCopyLink(e, heading.id)}
                      title={isCopied ? "Link copied!" : "Copy link to section"}
                      aria-label={`Copy link to ${heading.text}`}
                      className={cn(
                        "absolute right-1.5 p-1 rounded-lg transition-opacity cursor-pointer text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10",
                        isCopied ? "opacity-100" : "opacity-0 group-hover/row:opacity-100 focus:opacity-100"
                      )}
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Link2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}
    </nav>
  )
}

export function MobileTableOfContents({ headings, className }: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(true)

  const minLevel = useMemo(() => {
    if (headings.length === 0) return 2
    return Math.min(...headings.map((h) => h.level))
  }, [headings])

  const handleSelect = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id)
    setIsOpen(false)
    if (!el) return

    const headerOffset = 90
    const offsetPosition = el.getBoundingClientRect().top + window.scrollY - headerOffset

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    })

    if (window.history.pushState) {
      window.history.pushState(null, "", `#${id}`)
    }
  }

  if (headings.length === 0) return null

  return (
    <div className={cn("min-[1080px]:hidden mb-6", className)}>
      <div className="liquid-glass-card rounded-2xl overflow-hidden">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          className="flex w-full items-center justify-between px-4 py-2.5 text-left cursor-pointer"
        >
          <span className="flex items-center gap-2 text-xs font-semibold tracking-wide text-foreground">
            <List className="w-3.5 h-3.5 text-primary" />
            <span>On this page</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-black/5 dark:bg-white/8 text-muted-foreground">
              {headings.length}
            </span>
          </span>
          <ChevronDown
            className={cn(
              "w-4 h-4 text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </button>

        {isOpen && (
          <nav aria-label="Table of contents" className="border-t border-black/5 dark:border-white/10 px-2 py-2">
            <ul className="flex flex-col gap-0.5 max-h-64 overflow-y-auto">
              {headings.map((heading) => {
                const depth = Math.max(0, heading.level - minLevel)
                return (
                  <li key={heading.id}>
                    <button
                      type="button"
                      onClick={(e) => handleSelect(e, heading.id)}
                      style={{ paddingLeft: `${10 + depth * 12}px` }}
                      className="flex w-full items-center gap-2 pr-3 py-1.5 rounded-xl text-left text-xs text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/8 transition-colors cursor-pointer"
                    >
                      <span className="h-1 w-1 rounded-full bg-primary/60 shrink-0" />
                      <span className="line-clamp-1">{heading.text}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>
        )}
      </div>
    </div>
  )
}
