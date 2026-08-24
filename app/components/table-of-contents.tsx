"use client"

import { useEffect, useState, useRef, useMemo } from "react"
import { AlignLeft, ArrowUp } from "lucide-react"

export interface TocItem {
  text: string
  id: string
  level: number
}

interface TableOfContentsProps {
  headings: TocItem[]
  title?: string
  className?: string
}

const cn = (...classes: (string | boolean | undefined | null)[]) => classes.filter(Boolean).join(" ")

export function TableOfContents({ headings, title = "On this page", className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(headings[0]?.id || "")
  const isClickScrolling = useRef(false)
  const tocListRef = useRef<HTMLDivElement>(null)

  // Find minimum heading level to normalize indentation (e.g. if a post starts with h3)
  const minLevel = useMemo(() => {
    if (headings.length === 0) return 2
    return Math.min(...headings.map((h) => h.level))
  }, [headings])

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return

        const visibleEntries = entries.filter((entry) => entry.isIntersecting)
        if (visibleEntries.length > 0) {
          // Find the heading that is closest to top offset ~100px
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

      // When reaching near the bottom of the page, highlight the last heading
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

  // Scroll active link into view inside TOC container if it overflows
  useEffect(() => {
    if (!activeId || !tocListRef.current) return
    const activeEl = tocListRef.current.querySelector<HTMLElement>(`[data-toc-id="${activeId}"]`)
    if (activeEl) {
      const container = tocListRef.current
      const containerRect = container.getBoundingClientRect()
      const activeRect = activeEl.getBoundingClientRect()

      if (activeRect.top < containerRect.top || activeRect.bottom > containerRect.bottom) {
        activeEl.scrollIntoView({ block: "nearest", behavior: "smooth" })
      }
    }
  }, [activeId])

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) {
      isClickScrolling.current = true
      setActiveId(id)

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

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
    if (headings[0]) {
      setActiveId(headings[0].id)
    }
  }

  if (headings.length === 0) return null

  return (
    <nav
      className={cn("flex flex-col gap-2.5 select-none", className)}
      aria-label="Table of contents"
    >
      {/* Header */}
      <div className="flex items-center gap-1.5 px-1 text-xs font-mono font-medium uppercase tracking-wider text-muted-foreground/70 mb-1">
        <AlignLeft className="w-3.5 h-3.5 text-primary/85 shrink-0" />
        <span>{title}</span>
      </div>

      {/* Headings tree */}
      <div
        ref={tocListRef}
        className="relative flex flex-col gap-0.5 max-h-[calc(100vh-14rem)] overflow-y-auto pr-1 -mr-1"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* Continuous vertical guide line */}
        <div className="absolute left-[3px] top-1.5 bottom-1.5 w-px bg-border/40" />

        {headings.map((heading) => {
          const isActive = activeId === heading.id
          const depth = Math.max(0, heading.level - minLevel)

          return (
            <a
              key={heading.id}
              data-toc-id={heading.id}
              href={`#${heading.id}`}
              onClick={(e) => handleScrollTo(e, heading.id)}
              className={cn(
                "group relative flex items-start py-1.5 px-2 rounded-md text-left transition-all duration-150 leading-snug",
                depth === 0 && "ml-0 text-[13px]",
                depth === 1 && "ml-3 pl-3.5 text-xs",
                depth >= 2 && "ml-5 pl-3.5 text-[11px]",
                isActive
                  ? "text-primary bg-primary/[0.08] dark:bg-primary/[0.14]"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              )}
            >
              {/* Active left indicator bar - aligned with the element's indented depth */}
              {isActive && (
                <span
                  className="absolute left-0 top-1 bottom-1 w-[2px] rounded-full bg-primary"
                  aria-hidden
                />
              )}

              {/* Nested dot indicator for sub-headings, vertically centered with text */}
              {depth > 0 && !isActive && (
                <span
                  className="absolute left-1 top-[13.5px] -translate-y-1/2 w-1 h-1 rounded-full bg-border/90 group-hover:bg-muted-foreground transition-colors"
                  aria-hidden
                />
              )}

              <span className="line-clamp-2 break-words" title={heading.text}>
                {heading.text}
              </span>
            </a>
          )
        })}
      </div>

      {/* Back to top shortcut */}
      <div className="pt-2 border-t border-border/40 px-1">
        <button
          onClick={handleScrollToTop}
          className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground/60 hover:text-foreground transition-colors cursor-pointer group"
        >
          <ArrowUp className="w-3 h-3 group-hover:-translate-y-0.5 transition-transform" />
          <span>Back to top</span>
        </button>
      </div>
    </nav>
  )
}


