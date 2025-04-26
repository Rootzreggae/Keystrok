"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useViewportHeight } from "@/hooks/use-viewport-height"

interface WelcomeSectionProps {
  className?: string
}

export function WelcomeSection({ className }: WelcomeSectionProps) {
  // Use the hook to handle viewport height changes
  useViewportHeight()

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center rounded-lg bg-[#171723] p-8 md:p-16 text-white welcome-section",
        className,
      )}
      style={{
        height: "83vh",
        minHeight: "500px",
        // Use the CSS variable for better mobile support
        height: "calc(var(--vh, 1vh) * 83)",
      }}
    >
      <div className="mb-6 flex h-24 w-24 md:h-32 md:w-32 items-center justify-center rounded-full bg-gray-700/50">
        <Shield className="h-12 w-12 md:h-16 md:w-16 text-gray-400" />
      </div>
      <h2 className="mb-2 text-xl md:text-2xl font-semibold">Welcome to Keystrok</h2>
      <p className="mb-1 text-sm md:text-base text-gray-400">You haven't connected any platforms yet</p>
      <p className="mb-6 text-sm md:text-base text-gray-400">Connect your first platform to get started</p>
      <Link href="/platform-settings/add">
        <Button className="mb-4 bg-indigo-600 hover:bg-indigo-700">
          <PlusIcon className="mr-2 h-4 w-4" /> Connect platform
        </Button>
      </Link>
      <div className="flex items-center gap-2 text-gray-400">
        <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></div>
        <span className="text-sm">No platforms connected</span>
      </div>
      <Link href="#" className="mt-4 text-indigo-400 hover:underline">
        Learn how to use API Key Manager
      </Link>
    </div>
  )
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}
