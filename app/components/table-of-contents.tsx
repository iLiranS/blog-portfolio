"use client"

import { useEffect, useState, useRef, useMemo, useCallback } from "react"
import { Link2, Check } from "lucide-react"

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
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [popoverPlacement, setPopoverPlacement] = useState<"right" | "left">("right")
  const [domSnippets, setDomSnippets] = useState<Record<string, string>>({})

  const isClickScrolling = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const copyTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Find minimum heading level to normalize indicator widths
  const minLevel = useMemo(() => {
    if (headings.length === 0) return 2
    return Math.min(...headings.map((h) => h.level))
  }, [headings])

  // Extract snippet fallback from DOM if not provided
  useEffect(() => {
    if (headings.length === 0) return

    const extracted: Record<string, string> = {}
    headings.forEach((heading) => {
      if (heading.snippet) {
        extracted[heading.id] = heading.snippet
        return
      }

      const el = document.getElementById(heading.id)
      if (el) {
        let sibling = el.nextElementSibling
        while (sibling) {
          if (/^H[1-6]$/i.test(sibling.tagName)) break
          const text = sibling.textContent?.trim()
          if (text && text.length > 10) {
            extracted[heading.id] = text.length > 160 ? text.slice(0, 157) + "..." : text
            break
          }
          sibling = sibling.nextElementSibling
        }
      }
    })

    setDomSnippets(extracted)
  }, [headings])

  // Active section tracking via IntersectionObserver & scroll fallback
  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return

        const visibleEntries = entries.filter((entry) => entry.isIntersecting)
        if (visibleEntries.length > 0) {
          const closest = visibleEntries.reduce((prev, curr) => {
            return Math.abs(curr.boundingClientRect.top - 100) < Math.abs(prev.boundingClientRect.top - 100)
              ? curr
              : prev
          })
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

      // Bottom reached
      if (scrollPosition + windowHeight >= documentHeight - 100) {
        setActiveId(headings[headings.length - 1].id)
        return
      }

      // Fast-scroll fallback
      const headerOffset = 110
      let currentId = headings[0].id
      for (const heading of headings) {
        const el = document.getElementById(heading.id)
        if (el) {
          const top = el.getBoundingClientRect().top
          if (top <= headerOffset) {
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

  // Update popover placement based on viewport space
  const updatePlacement = useCallback(() => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    // Need at least 320px on the right for the card
    if (window.innerWidth - rect.right < 320) {
      setPopoverPlacement("left")
    } else {
      setPopoverPlacement("right")
    }
  }, [])

  useEffect(() => {
    updatePlacement()
    window.addEventListener("resize", updatePlacement, { passive: true })
    return () => window.removeEventListener("resize", updatePlacement)
  }, [updatePlacement])

  const handleMouseEnterItem = (id: string) => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current)
      leaveTimerRef.current = null
    }
    updatePlacement()
    setHoveredId(id)
  }

  const handleMouseLeaveItem = () => {
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current)
    leaveTimerRef.current = setTimeout(() => {
      setHoveredId(null)
    }, 150)
  }

  const handleScrollTo = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    const el = document.getElementById(id)
    if (el) {
      isClickScrolling.current = true
      setActiveId(id)
      setHoveredId(null)

      const headerOffset = 90
      const elementPosition = el.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - headerOffset

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
      className={cn("relative flex flex-col items-center select-none pointer-events-auto py-2", className)}
      aria-label="Table of contents outline"
    >
      {/* Scrubber Lines Track */}
      <div className="flex flex-col items-center relative">
        {headings.map((heading) => {
          const isActive = activeId === heading.id
          const isHovered = hoveredId === heading.id
          const depth = Math.max(0, heading.level - minLevel)

          // Line width variations (wider & thicker lines)
          const baseWidth = depth === 0 ? "w-[26px]" : depth === 1 ? "w-[18px]" : "w-[12px]"
          const activeWidth = depth === 0 ? "w-[36px]" : depth === 1 ? "w-[28px]" : "w-[22px]"
          const hoveredWidth = depth === 0 ? "w-[34px]" : depth === 1 ? "w-[26px]" : "w-[20px]"

          const snippet = domSnippets[heading.id] || heading.snippet || ""

          return (
            <div
              key={heading.id}
              /* Generous hover container: w-14 sm:w-16 h-7 gives plenty of horizontal and vertical hit area */
              className="relative flex items-center justify-center w-14 sm:w-16 h-7 group cursor-pointer"
              onMouseEnter={() => handleMouseEnterItem(heading.id)}
              onMouseLeave={handleMouseLeaveItem}
              onClick={(e) => handleScrollTo(e, heading.id)}
              role="button"
              tabIndex={0}
              aria-label={`Jump to section: ${heading.text}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleScrollTo(e as unknown as React.MouseEvent, heading.id)
                }
              }}
            >
              {/* Horizontal tick line */}
              <span
                className={cn(
                  "rounded-full transition-all duration-200 ease-out block pointer-events-none",
                  isActive
                    ? cn("bg-primary shadow-[0_0_10px_var(--primary)] h-[3.5px]", activeWidth)
                    : isHovered
                      ? cn("bg-foreground/85 dark:bg-neutral-200 h-0.75", hoveredWidth)
                      : cn("bg-neutral-600/40 dark:bg-neutral-500/40 group-hover:bg-neutral-400 h-[2.5px]", baseWidth)
                )}
              />

              {/* Hover Popover Card (ChatGPT Codex style) */}
              {isHovered && (
                <div
                  onMouseEnter={() => handleMouseEnterItem(heading.id)}
                  onMouseLeave={handleMouseLeaveItem}
                  onClick={(e) => handleScrollTo(e, heading.id)}
                  className={cn(
                    "absolute z-50 top-1/2 -translate-y-1/2 w-72 sm:w-80 p-3.5 sm:p-4 rounded-2xl cursor-pointer text-left",
                    "bg-neutral-900/95 dark:bg-neutral-900/95 border border-white/10 dark:border-white/10 shadow-2xl backdrop-blur-md text-white",
                    "transition-all duration-150 animate-in fade-in-0 zoom-in-95",
                    popoverPlacement === "right" ? "left-full ml-3" : "right-full mr-3"
                  )}
                  style={{
                    boxShadow: "0 20px 35px -5px rgba(0, 0, 0, 0.4), 0 0 1px 1px rgba(255, 255, 255, 0.08)",
                  }}
                >
                  {/* Subtle directional caret arrow */}
                  <div
                    className={cn(
                      "absolute top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-neutral-900 border-white/10",
                      popoverPlacement === "right"
                        ? "-left-1 border-b border-l"
                        : "-right-1 border-t border-r"
                    )}
                  />

                  {/* Header: Title + Copy Link button */}
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-semibold text-[13px] sm:text-sm tracking-tight text-neutral-100 leading-snug line-clamp-2">
                      {heading.text}
                    </h4>
                    <button
                      type="button"
                      onClick={(e) => handleCopyLink(e, heading.id)}
                      title={copiedId === heading.id ? "Link copied!" : "Copy link to section"}
                      aria-label="Copy link to section"
                      className="p-1.5 -mr-1 -mt-1 text-neutral-400 hover:text-white hover:bg-white/10 rounded-md transition-colors shrink-0 flex items-center justify-center cursor-pointer"
                    >
                      {copiedId === heading.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Link2 className="w-3.5 h-3.5 hover:text-primary transition-colors" />
                      )}
                    </button>
                  </div>

                  {/* Content snippet preview */}
                  {snippet ? (
                    <p className="mt-1.5 text-xs text-neutral-400 leading-relaxed line-clamp-3">
                      {snippet}
                    </p>
                  ) : null}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </nav>
  )
}
