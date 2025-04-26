"use client"

import { usePathname } from "next/navigation"
import { useMemo } from "react"

// Type for breadcrumb items
export interface BreadcrumbItem {
  href: string
  label: string
  isCurrent?: boolean
}

// Map of route segments to human-readable names
const routeNameMap: Record<string, string> = {
  "platform-settings": "Platform Settings",
  "key-inventory": "Key Inventory",
  "rotation-workflows": "Rotation Workflows",
  "discovery-scanner": "Discovery Scanner",
  reports: "Reports",
  create: "Create",
  add: "Add",
  edit: "Edit",
}

// Function to get a human-readable name for a route segment
const getRouteSegmentName = (segment: string): string => {
  // Check if it's a dynamic segment (starts with [)
  if (segment.startsWith("[") && segment.endsWith("]")) {
    // Remove the brackets and format
    return segment.slice(1, -1).replace(/[-_]/g, " ")
  }

  // Check if we have a predefined name for this segment
  if (routeNameMap[segment]) {
    return routeNameMap[segment]
  }

  // Otherwise, capitalize the first letter of each word
  return segment
    .replace(/[-_]/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

interface UseBreadcrumbDataOptions {
  homeLabel?: string
  maxItems?: number
  dynamicSegmentLabels?: Record<string, string>
}

export function useBreadcrumbData({
  homeLabel = "Dashboard",
  maxItems = 4,
  dynamicSegmentLabels = {},
}: UseBreadcrumbDataOptions = {}): BreadcrumbItem[] {
  const pathname = usePathname()

  return useMemo(() => {
    // Skip on home page
    if (pathname === "/") {
      return []
    }

    // Split the pathname into segments and remove empty segments
    const segments = pathname.split("/").filter(Boolean)

    // Handle case when there are too many segments
    const shouldTruncate = segments.length > maxItems
    const visibleSegments = shouldTruncate ? [...segments.slice(0, 1), "...", ...segments.slice(-2)] : segments

    // Build the breadcrumb items
    const breadcrumbItems: BreadcrumbItem[] = [
      // Home item
      {
        href: "/",
        label: homeLabel,
      },
    ]

    // Add path segments
    visibleSegments.forEach((segment, index) => {
      // For the truncated item
      if (segment === "...") {
        breadcrumbItems.push({
          href: "",
          label: "...",
        })
        return
      }

      // Build the href for this segment
      const segmentIndex =
        shouldTruncate && index > 0 && index < visibleSegments.length - 1
          ? segments.length - visibleSegments.length + index + 1
          : index

      const href = `/${segments.slice(0, shouldTruncate ? (index === 0 ? 1 : segments.length - 2 + index) : index + 1).join("/")}`

      // Check if we have a custom label for this segment
      const segmentPath = segments.slice(0, segmentIndex + 1).join("/")
      const customLabel = dynamicSegmentLabels[segmentPath]

      breadcrumbItems.push({
        href,
        label: customLabel || getRouteSegmentName(segment),
        isCurrent: index === visibleSegments.length - 1,
      })
    })

    return breadcrumbItems
  }, [pathname, homeLabel, maxItems, dynamicSegmentLabels])
}
