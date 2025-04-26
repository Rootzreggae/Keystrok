import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(
          // Base styles
          "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D0D14]",
          "disabled:pointer-events-none disabled:opacity-50",

          // Size variations
          size === "default" && "h-10 px-4 py-2 text-sm",
          size === "sm" && "h-8 px-3 py-1 text-xs",
          size === "lg" && "h-12 px-6 py-3 text-base",
          size === "icon" && "h-10 w-10 p-0",

          // Variant styles
          variant === "default" &&
            "bg-[#6B5EFF] text-white hover:bg-[#5A4FD9] active:bg-[#4A3FC9] focus-visible:ring-[#6B5EFF]",
          variant === "outline" &&
            "border border-[#343B4F] bg-transparent text-white hover:bg-[#1E1E2D] hover:text-white focus-visible:ring-[#6B5EFF]",
          variant === "secondary" && "bg-[#2B3B64] text-white hover:bg-[#23395D] focus-visible:ring-[#2B3B64]",
          variant === "ghost" && "bg-transparent text-white hover:bg-[#1E1E2D] focus-visible:ring-[#6B5EFF]",
          variant === "destructive" && "bg-[#FF4473] text-white hover:bg-[#E03A68] focus-visible:ring-[#FF4473]",
          variant === "link" &&
            "bg-transparent text-[#6B5EFF] underline-offset-4 hover:underline focus-visible:ring-[#6B5EFF] p-0 h-auto",

          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button }
