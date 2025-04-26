"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"
import { SidebarInset as OriginalSidebarInset } from "@/components/ui/sidebar"
import { useScreenSize } from "@/hooks/use-screen-size"

export function CustomSidebarInset({ className, ...props }: React.ComponentProps<typeof OriginalSidebarInset>) {
  const screenSize = useScreenSize()
  const isMobile = screenSize === "sm" || screenSize === "md"

  return (
    <OriginalSidebarInset
      className={cn(
        "bg-[#0D0D14] transition-all duration-300",
        isMobile ? "ml-0 content-with-mobile-header" : "",
        className,
      )}
      style={{ backgroundColor: "#0D0D14" }}
      {...props}
    />
  )
}
