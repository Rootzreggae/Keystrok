"use client"

import { useEffect } from "react"

export function EnsureSidebarStyling() {
  useEffect(() => {
    // Function to set the styling of sidebar elements
    const setSidebarStyling = () => {
      const sidebarContent = document.querySelector('[data-sidebar="content"]')
      const sidebarHeader = document.querySelector('[data-sidebar="header"]')
      const sidebar = document.querySelector('[data-sidebar="sidebar"]')
      const brandText = document.querySelector(".sidebar-brand")
      const logoContainer = document.querySelector('[data-sidebar="header"] > div:first-child')
      const highlightedItems = document.querySelectorAll(".menu-item.is-highlighted")
      const sidebarMenu = document.querySelector('[data-sidebar="menu"]')
      const sidebarTrigger = document.querySelector('[data-sidebar="trigger"]')

      if (sidebarContent) {
        ;(sidebarContent as HTMLElement).style.backgroundColor = "#171723"
      }

      if (sidebarHeader) {
        const headerElement = sidebarHeader as HTMLElement
        headerElement.style.backgroundColor = "#171723"
        headerElement.style.display = "flex"
        headerElement.style.flexDirection = "row"
        headerElement.style.alignItems = "center"
        headerElement.style.transition = "all 0.3s ease"
      }

      // Apply styling based on sidebar state
      if (sidebar && brandText && logoContainer) {
        const isCollapsed = sidebar.getAttribute("data-state") === "collapsed"

        if (isCollapsed) {
          // Collapsed state
          ;(brandText as HTMLElement).style.opacity = "0"
          ;(brandText as HTMLElement).style.position = "absolute"
          ;(brandText as HTMLElement).style.width = "0"
          ;(brandText as HTMLElement).style.overflow = "hidden"

          if (sidebarHeader) {
            ;(sidebarHeader as HTMLElement).style.justifyContent = "center"
          }

          if (logoContainer) {
            ;(logoContainer as HTMLElement).style.flexDirection = "column"
            ;(logoContainer as HTMLElement).style.gap = "0.5rem"
            const logo = logoContainer.querySelector("div:first-child")
            if (logo) {
              ;(logo as HTMLElement).style.width = "4rem"
              ;(logo as HTMLElement).style.height = "4rem"
            }
          }

          // Add margin-top to menu in collapsed state
          if (sidebarMenu) {
            ;(sidebarMenu as HTMLElement).style.marginTop = "2rem"
          }

          // Style the trigger button in collapsed state
          if (sidebarTrigger) {
            ;(sidebarTrigger as HTMLElement).style.position = "absolute"
            ;(sidebarTrigger as HTMLElement).style.bottom = "20px"
            ;(sidebarTrigger as HTMLElement).style.marginTop = "0"
            ;(sidebarTrigger as HTMLElement).style.border = "2px solid #4b4b58"
            ;(sidebarTrigger as HTMLElement).style.borderRadius = "0.5rem"
            ;(sidebarTrigger as HTMLElement).style.padding = "0.5rem"
            ;(sidebarTrigger as HTMLElement).style.width = "3rem"
            ;(sidebarTrigger as HTMLElement).style.height = "3rem"
            ;(sidebarTrigger as HTMLElement).style.display = "flex"
            ;(sidebarTrigger as HTMLElement).style.alignItems = "center"
            ;(sidebarTrigger as HTMLElement).style.justifyContent = "center"
          }
        } else {
          // Expanded state
          ;(brandText as HTMLElement).style.opacity = "1"
          ;(brandText as HTMLElement).style.position = "relative"
          ;(brandText as HTMLElement).style.width = "auto"
          ;(brandText as HTMLElement).style.overflow = "visible"

          if (sidebarHeader) {
            ;(sidebarHeader as HTMLElement).style.justifyContent = "space-between"
            ;(sidebarHeader as HTMLElement).style.paddingLeft = "1rem"
            ;(sidebarHeader as HTMLElement).style.paddingRight = "1rem"
          }

          if (logoContainer) {
            ;(logoContainer as HTMLElement).style.flexDirection = "row"
            ;(logoContainer as HTMLElement).style.gap = "0.75rem"
            const logo = logoContainer.querySelector("div:first-child")
            if (logo) {
              ;(logo as HTMLElement).style.width = "2.5rem"
              ;(logo as HTMLElement).style.height = "2.5rem"
            }
          }

          // Remove margin-top from menu in expanded state
          if (sidebarMenu) {
            ;(sidebarMenu as HTMLElement).style.marginTop = "0"
          }

          // Reset trigger button styling in expanded state
          if (sidebarTrigger) {
            ;(sidebarTrigger as HTMLElement).style.position = "relative"
            ;(sidebarTrigger as HTMLElement).style.bottom = "auto"
            ;(sidebarTrigger as HTMLElement).style.marginTop = "0"
            ;(sidebarTrigger as HTMLElement).style.border = "none"
            ;(sidebarTrigger as HTMLElement).style.borderRadius = "0.25rem"
            ;(sidebarTrigger as HTMLElement).style.padding = "0"
            ;(sidebarTrigger as HTMLElement).style.width = "1.75rem"
            ;(sidebarTrigger as HTMLElement).style.height = "1.75rem"
          }
        }
      }

      // Apply styling to highlighted menu items
      highlightedItems.forEach((item) => {
        const element = item as HTMLElement
        element.style.borderRadius = "var(--Corner-Extra-small, 0.25rem)"
        element.style.borderLeft = "5px solid #6B5EFF"
        element.style.backgroundColor = "rgba(43, 59, 100, 0.60)"
        element.style.overflow = "hidden"

        // Adjust the button inside the highlighted item
        const button = element.querySelector('[data-sidebar="menu-button"]')
        if (button) {
          ;(button as HTMLElement).style.paddingLeft = "calc(0.5rem - 5px)"
        }
      })
    }

    // Set styling initially
    setSidebarStyling()

    // Set up a mutation observer to watch for changes to the DOM
    const observer = new MutationObserver(setSidebarStyling)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-state", "class"],
    })

    // Clean up
    return () => observer.disconnect()
  }, [])

  return null
}
