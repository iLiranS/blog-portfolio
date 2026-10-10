"use client"

import { useEffect, useState, useRef } from "react"
import { createPortal } from "react-dom"
import { ArrowUp } from "lucide-react"

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const totalScrollable = documentHeight - windowHeight

      if (totalScrollable <= 0) {
        setProgress(0)
        setIsVisible(false)
        return
      }

      const percentage = Math.min(100, Math.max(0, (currentScrollY / totalScrollable) * 100))
      setProgress(percentage)

      const isMobile = window.innerWidth < 1080
      const isPastThreshold = currentScrollY > 60
      const isScrollingUp = currentScrollY <= lastScrollY.current

      if (isMobile) {
        // On mobile: show only when scrolling up (with navbar) so it doesn't interrupt reading
        setIsVisible(isPastThreshold && isScrollingUp)
      } else {
        // On desktop: aligned with TOC, show whenever past initial top
        setIsVisible(isPastThreshold)
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [])

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  if (!mounted) return null

  // Symmetrical arcs calculation:
  // Center: (22, 22), Radius: 19
  // Half-circle arc circumference = π * 19 ≈ 59.69
  const arcLength = 59.69
  const strokeOffset = arcLength * (1 - progress / 100)

  return createPortal(
    <div
      className={`fixed bottom-6 z-50 transition-all duration-300 ease-out ${isVisible
        ? "translate-y-0 opacity-100 pointer-events-auto"
        : "translate-y-10 opacity-0 pointer-events-none"
        } right-4 sm:right-6 min-[1080px]:right-auto min-[1080px]:left-[calc(50vw+384px+0.5rem)] min-[1200px]:left-[calc(50vw+384px+1rem)] xl:left-[calc(50vw+384px+1.5rem)] min-[1080px]:w-16 min-[1080px]:flex min-[1080px]:justify-center`}
    >
      <button
        type="button"
        onClick={handleScrollToTop}
        title={`${Math.round(progress)}% read · Back to top`}
        aria-label="Back to top"
        className="group relative w-11 h-11 rounded-full flex items-center justify-center cursor-pointer bg-background/95 dark:bg-neutral-900/95 border border-border/80 dark:border-neutral-700/80 shadow-xl shadow-black/15 dark:shadow-black/50 backdrop-blur-md focus:outline-none transition-all duration-200 hover:scale-105 active:scale-95"
      >
        {/* Progress SVG Border */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none p-px"
          viewBox="0 0 44 44"
          fill="none"
        >
          {/* Visible track circle border (crisp in both light and dark modes) */}
          <circle
            cx="22"
            cy="22"
            r="19"
            stroke="currentColor"
            strokeWidth="2.5"
            className="text-neutral-300/80 dark:text-neutral-700"
          />

          {/* Symmetrical Left Arc: from bottom (22, 41) to top (22, 3) */}
          <path
            d="M 22 41 A 19 19 0 0 1 22 3"
            stroke="var(--primary)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={arcLength}
            strokeDashoffset={strokeOffset}
            className="transition-[stroke-dashoffset] duration-100 ease-out"
          />

          {/* Symmetrical Right Arc: from bottom (22, 41) to top (22, 3) */}
          <path
            d="M 22 41 A 19 19 0 0 0 22 3"
            stroke="var(--primary)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={arcLength}
            strokeDashoffset={strokeOffset}
            className="transition-[stroke-dashoffset] duration-100 ease-out"
          />
        </svg>

        {/* Crisp Center Arrow Icon */}
        <ArrowUp className="w-4 h-4 text-neutral-600 dark:text-neutral-300 group-hover:text-primary transition-all duration-200 group-hover:-translate-y-0.5" />
      </button>
    </div>,
    document.body
  )
}
