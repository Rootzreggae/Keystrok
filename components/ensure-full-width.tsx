"use client"

import { useEffect } from "react"

export function EnsureFullWidth() {
  useEffect(() => {
    // Function to set the width of SidebarInset to 100vw
    const setSidebarInsetWidth = () => {
      const sidebarInset = document.querySelector('[data-sidebar="sidebar-inset"]')
      if (sidebarInset) {
        ;(sidebarInset as HTMLElement).style.width = "100vw"
        ;(sidebarInset as HTMLElement).style.maxWidth = "100vw"
        ;(sidebarInset as HTMLElement).style.marginLeft = "0"
        ;(sidebarInset as HTMLElement).style.marginRight = "0"
        ;(sidebarInset as HTMLElement).style.borderRadius = "0"
        ;(sidebarInset as HTMLElement).style.boxShadow = "none"
      }
    }

    // Set width initially
    setSidebarInsetWidth()

    // Set up a mutation observer to watch for changes to the DOM
    const observer = new MutationObserver(setSidebarInsetWidth)
    observer.observe(document.body, { childList: true, subtree: true })

    // Clean up
    return () => observer.disconnect()
  }, [])

  return null
}
