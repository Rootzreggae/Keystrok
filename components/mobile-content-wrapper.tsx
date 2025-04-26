import type React from "react"
import { cn } from "@/lib/utils"

interface MobileContentWrapperProps {
  children: React.ReactNode
  className?: string
}

export function MobileContentWrapper({ children, className }: MobileContentWrapperProps) {
  return <div className={cn("mobile-content-wrapper", className)}>{children}</div>
}
