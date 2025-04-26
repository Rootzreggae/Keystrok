"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"
import { SidebarMenuItem as OriginalSidebarMenuItem, useSidebar } from "@/components/ui/sidebar"

interface CustomSidebarMenuItemProps extends React.ComponentProps<typeof OriginalSidebarMenuItem> {
  isHighlighted?: boolean
  isDisabled?: boolean
}

export function CustomSidebarMenuItem({
  isHighlighted,
  isDisabled,
  className,
  children,
  ...props
}: CustomSidebarMenuItemProps) {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <OriginalSidebarMenuItem
      className={cn(
        "menu-item transition-all duration-200 relative",
        isHighlighted && !isCollapsed && "is-highlighted",
        isDisabled && "is-disabled opacity-60",
        isCollapsed && "justify-center px-0 py-0 h-10",
        isHighlighted &&
          isCollapsed &&
          "before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-purple-600",
        className,
      )}
      {...props}
    >
      {children}
    </OriginalSidebarMenuItem>
  )
}
