"use client"

import { useEffect } from "react"

export function useViewportHeight() {
  useEffect(() => {
    // Function to update CSS variable with the viewport height
    const updateHeight = () => {
      // First we get the viewport height and multiply it by 1% to get a value for a vh unit
      const vh = window.innerHeight * 0.01
      // Then we set the value in the --vh custom property to the root of the document
      document.documentElement.style.setProperty("--vh", `${vh}px`)
    }

    // Add event listener
    window.addEventListener("resize", updateHeight)
    window.addEventListener("orientationchange", updateHeight)

    // Call the function to set the height initially
    updateHeight()

    // Clean up
    return () => {
      window.removeEventListener("resize", updateHeight)
      window.removeEventListener("orientationchange", updateHeight)
    }
  }, [])
}
