"use client"

import { useEffect, useState, useRef } from "react"

export interface TocItem {
  text: string
  id: string
  level: number
}

interface TableOfContentsProps {
  headings: TocItem[]
}

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(" ")

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(headings[0]?.id || "")
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const isClickScrolling = useRef(false)

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
        } else {
          const scrollPosition = window.scrollY
          let currentHeading = headings[0].id
          for (const heading of headings) {
            const el = document.getElementById(heading.id)
            if (el && el.offsetTop - 140 <= scrollPosition) {
              currentHeading = heading.id
            } else {
              break
            }
          }
          setActiveId(currentHeading)
        }
      },
      {
        rootMargin: "-100px 0px -65% 0px",
        threshold: 0,
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

      if (scrollPosition + windowHeight >= documentHeight - 120) {
        setActiveId(headings[headings.length - 1].id)
        return
      }

      const firstEl = document.getElementById(headings[0].id)
      if (firstEl && scrollPosition < firstEl.offsetTop - 140) {
        setActiveId(headings[0].id)
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      headings.forEach((heading) => {
        const el = document.getElementById(heading.id)
        if (el) observer.unobserve(el)
      })
      window.removeEventListener("scroll", handleScroll)
    }
  }, [headings])

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) {
      isClickScrolling.current = true
      setActiveId(id)

      const headerOffset = 100
      const elementPosition = el.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })

      setTimeout(() => {
        isClickScrolling.current = false
      }, 850)
    }
  }

  if (headings.length === 0) return null

  return (
    <nav
      className="flex flex-col gap-0.5 pb-2 items-end pr-2"
      aria-label="Table of contents"
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {headings.map((heading, index) => {
        const isActive = activeId === heading.id

        // Tree depth determines bar width and height strictly by level
        let basePx = 36
        let barWidthClass = "w-9"
        let barHeightClass = "h-[3px]"
        let textSizeClass = "text-xs"

        if (heading.level === 3) {
          basePx = 20
          barWidthClass = "w-5"
          barHeightClass = "h-[2px]"
          textSizeClass = "text-[11px]"
        } else if (heading.level >= 4) {
          basePx = 12
          barWidthClass = "w-3"
          barHeightClass = "h-[1.5px]"
          textSizeClass = "text-[10px]"
        }

        // Dock effect calculation (hovered item and up to 2 items away)
        let scale = 1
        let distance: number | null = null
        if (hoveredIndex !== null) {
          distance = Math.abs(hoveredIndex - index)
          if (distance === 0) {
            scale = 1.35
          } else if (distance === 1) {
            scale = 1.15
          } else if (distance === 2) {
            scale = 1.05
          }
        }

        const effectiveLineWidth = basePx * scale

        const isHovered = distance === 0
        const isNeighbor = distance === 1

        return (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            onClick={(e) => handleScrollTo(e, heading.id)}
            onMouseEnter={() => setHoveredIndex(index)}
            className="group relative flex h-3.5 items-center focus:outline-none"
          >
            {/* Visual line representation */}
            <div
              className={cn(
                "rounded-full origin-right transition-all duration-200 ease-out",
                barHeightClass,
                barWidthClass,
                isActive
                  ? "bg-primary"
                  : "bg-muted-foreground/25 group-hover:bg-muted-foreground/50"
              )}
              style={{
                transform: `scaleX(${scale})`,
              }}
            />

            {/* Title on the left (positioned from the right anchor) */}
            <span
              className={cn(
                "absolute right-0 top-1/2 -translate-y-1/2 tracking-wide transition-all duration-200 ease-out pointer-events-none select-none block truncate text-right",
                textSizeClass,
                isHovered
                  ? "opacity-90 translate-x-0 max-w-55 font-medium text-foreground/90"
                  : isNeighbor
                    ? "opacity-45 translate-x-0 max-w-55 font-normal text-muted-foreground"
                    : "opacity-0 translate-x-2 max-w-0",
                isActive && "text-primary font-medium"
              )}
              style={{
                marginRight: `${effectiveLineWidth + 10}px`,
              }}
              title={heading.text}
            >
              {heading.text}
            </span>
          </a>
        )
      })}
    </nav>
  )
}

