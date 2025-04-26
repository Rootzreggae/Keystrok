"use client"

import { useState, useEffect } from "react"

type ScreenSize = "sm" | "md" | "lg" | "xl" | "2xl"

export function useScreenSize(): ScreenSize {
  const [screenSize, setScreenSize] = useState<ScreenSize>("lg")

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null

    const handleResize = () => {
      // Clear previous timeout
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      // Set a new timeout to debounce the resize event
      timeoutId = setTimeout(() => {
        const width = window.innerWidth
        if (width < 640) {
          setScreenSize("sm")
        } else if (width < 768) {
          setScreenSize("md")
        } else if (width < 1024) {
          setScreenSize("lg")
        } else if (width < 1280) {
          setScreenSize("xl")
        } else {
          setScreenSize("2xl")
        }
      }, 100) // 100ms debounce
    }

    // Set initial size
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize)
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [])

  return screenSize
}
