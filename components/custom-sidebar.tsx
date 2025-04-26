"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"
import {
  Sidebar as OriginalSidebar,
  SidebarContent as OriginalSidebarContent,
  SidebarHeader as OriginalSidebarHeader,
} from "@/components/ui/sidebar"

export function CustomSidebar({ className, ...props }: React.ComponentProps<typeof OriginalSidebar>) {
  return <OriginalSidebar className={cn("bg-[#171723] transition-all duration-300", className)} {...props} />
}

export function CustomSidebarContent({ className, ...props }: React.ComponentProps<typeof OriginalSidebarContent>) {
  return (
    <OriginalSidebarContent
      className={cn("bg-[#171723] transition-all duration-300", className)}
      style={{ backgroundColor: "#171723" }}
      {...props}
    />
  )
}

export function CustomSidebarHeader({ className, ...props }: React.ComponentProps<typeof OriginalSidebarHeader>) {
  return (
    <OriginalSidebarHeader
      className={cn("bg-[#171723] transition-all duration-300", className)}
      style={{
        backgroundColor: "#171723",
      }}
      {...props}
    />
  )
}

export function CustomSidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("bg-[#171723]", className)} {...props} />
}
