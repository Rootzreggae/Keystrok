"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

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

interface BreadcrumbNavigationProps {
  className?: string
  homeLabel?: string
  separator?: React.ReactNode
  showHomeIcon?: boolean
  maxItems?: number
}

export function BreadcrumbNavigation({
  className,
  homeLabel = "Dashboard",
  separator = <ChevronRight className="h-4 w-4 text-gray-400" />,
  showHomeIcon = true,
  maxItems = 4,
}: BreadcrumbNavigationProps) {
  const pathname = usePathname()

  // Skip rendering breadcrumbs on the home page
  if (pathname === "/") {
    return null
  }

  // Split the pathname into segments and remove empty segments
  const segments = pathname.split("/").filter(Boolean)

  // Handle case when there are too many segments
  const shouldTruncate = segments.length > maxItems
  const visibleSegments = shouldTruncate ? [...segments.slice(0, 1), "...", ...segments.slice(-2)] : segments

  // Build the breadcrumb items
  const breadcrumbItems = [
    // Home item
    {
      href: "/",
      label: homeLabel,
      isHome: true,
    },
    // Path segments
    ...visibleSegments.map((segment, index) => {
      // For the truncated item
      if (segment === "...") {
        return {
          href: "",
          label: "...",
          isTruncated: true,
        }
      }

      // Build the href for this segment
      const href = `/${segments.slice(0, shouldTruncate ? (index === 0 ? 1 : segments.length - 2 + index) : index + 1).join("/")}`

      return {
        href,
        label: getRouteSegmentName(segment),
        isCurrent: index === visibleSegments.length - 1,
      }
    }),
  ]

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center text-sm", className)}>
      <ol className="flex items-center flex-wrap gap-1">
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <span className="mx-1">{separator}</span>}

            {item.isTruncated ? (
              <span className="text-gray-400">...</span>
            ) : item.isCurrent ? (
              <span className="text-white font-medium" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className={cn("text-gray-400 hover:text-white transition-colors", "flex items-center")}
              >
                {item.isHome && showHomeIcon && <Home className="h-3.5 w-3.5 mr-1" />}
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
