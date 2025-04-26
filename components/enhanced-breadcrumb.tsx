"use client"

import React from "react"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb"

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

interface EnhancedBreadcrumbProps {
  homeLabel?: string
  showHomeIcon?: boolean
  maxItems?: number
}

export function EnhancedBreadcrumb({
  homeLabel = "Dashboard",
  showHomeIcon = true,
  maxItems = 4,
}: EnhancedBreadcrumbProps) {
  const pathname = usePathname()

  // Skip rendering breadcrumbs on the home page
  if (pathname === "/") {
    return null
  }

  // Split the pathname into segments and remove empty segments
  const segments = pathname.split("/").filter(Boolean)

  // Handle case when there are too many segments
  const shouldTruncate = segments.length > maxItems
  const visibleSegments = shouldTruncate ? [...segments.slice(0, 1), ...segments.slice(-2)] : segments

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        {/* Home item */}
        <BreadcrumbItem>
          {/* Fix: Use Link component directly without nesting */}
          <Link
            href="/"
            className="transition-colors hover:text-foreground text-gray-400 hover:text-white flex items-center"
          >
            {showHomeIcon && <Home className="h-3.5 w-3.5 mr-1" />}
            {homeLabel}
          </Link>
        </BreadcrumbItem>

        <BreadcrumbSeparator />

        {/* Truncation ellipsis if needed */}
        {shouldTruncate && (
          <>
            <BreadcrumbItem>
              <BreadcrumbEllipsis className="text-gray-400" />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}

        {/* Path segments */}
        {visibleSegments.map((segment, index) => {
          const isLastItem = index === visibleSegments.length - 1
          const segmentIndex = shouldTruncate && index > 0 ? segments.length - visibleSegments.length + index : index

          const href = `/${segments.slice(0, segmentIndex + 1).join("/")}`
          const label = getRouteSegmentName(segment)

          return (
            <React.Fragment key={segment + index}>
              <BreadcrumbItem>
                {isLastItem ? (
                  <BreadcrumbPage className="text-white">{label}</BreadcrumbPage>
                ) : (
                  // Fix: Use Link component directly without nesting
                  <Link href={href} className="transition-colors hover:text-foreground text-gray-400 hover:text-white">
                    {label}
                  </Link>
                )}
              </BreadcrumbItem>

              {!isLastItem && <BreadcrumbSeparator />}
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
