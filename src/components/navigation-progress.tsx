"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export function NavigationProgress() {
  const pathname = usePathname()
  const [isNavigating, setIsNavigating] = useState(false)

  useEffect(() => {
    // When pathname changes, the navigation is complete
    setIsNavigating(false)
  }, [pathname])

  useEffect(() => {
    // Intercept link clicks to detect navigation start
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest("a")
      if (
        anchor &&
        anchor.href &&
        anchor.href.startsWith(window.location.origin) &&
        !anchor.target &&
        !e.ctrlKey &&
        !e.metaKey
      ) {
        setIsNavigating(true)
      }
    }

    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])

  if (!isNavigating) return null

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-0.5">
      <div className="h-full w-full animate-progress bg-gradient-to-r from-blue-500 via-violet-500 to-blue-500" />
    </div>
  )
}
