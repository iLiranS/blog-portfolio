"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const totalScrollable = documentHeight - windowHeight

      if (totalScrollable <= 0) {
        setProgress(0)
        return
      }

      const percentage = (scrollPosition / totalScrollable) * 100
      setProgress(percentage)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!mounted) return null

  return createPortal(
    <div
      className="fixed top-0 left-0 w-full h-[3px] bg-primary brightness-110 transition-transform duration-75 z-50 ease-out"
      style={{
        transform: `scaleX(${progress / 100})`,
        transformOrigin: "left",
      }}
    />,
    document.body
  )
}

