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
    <nav className="flex flex-col gap-2.5 py-4 items-end pr-2" aria-label="Table of contents">
      {headings.map((heading) => {
        const isActive = activeId === heading.id

        let barWidth = "w-8"
        let activeWidth = "w-12"
        if (heading.level === 3) {
          barWidth = "w-5"
          activeWidth = "w-8"
        } else if (heading.level === 4) {
          barWidth = "w-3"
          activeWidth = "w-5"
        }

        return (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            onClick={(e) => handleScrollTo(e, heading.id)}
            className="group relative flex h-3.5 items-center focus:outline-none"
          >
            {/* Visual line representation */}
            <div
              className={cn(
                "h-[3px] rounded-full transition-all duration-300",
                isActive
                  ? `bg-primary ${activeWidth}`
                  : `bg-muted-foreground/30 group-hover:bg-muted-foreground/75 ${barWidth}`
              )}
            />

            {/* Title on the right of the bar */}
            <span
              className={cn(
                "absolute right-full mr-3 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ease-out pointer-events-none select-none block truncate text-right",
                isActive
                  ? "text-primary opacity-100 translate-x-0 max-w-[150px]"
                  : "text-muted-foreground/70 opacity-0 translate-x-2 max-w-0 group-hover:opacity-100 group-hover:translate-x-0 group-hover:max-w-[150px]"
              )}
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
