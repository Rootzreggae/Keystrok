"use client"

import { Button } from "@/components/ui/button"
import { Database, ArrowRight } from "lucide-react"
import Link from "next/link"

export function KeyInventoryEmptyState() {
  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col items-center justify-center rounded-lg bg-[#171723] p-8 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#2B3B64]">
        <Database className="h-8 w-8 text-[#6B5EFF]" />
      </div>
      <h2 className="mb-3 text-2xl font-semibold text-white">No platforms connected</h2>
      <p className="mb-6 max-w-md text-gray-400">
        Connect your first platform to start managing your API keys. You'll be able to track key age, risk level, and
        rotation status.
      </p>
      <Link href="/platform-settings">
        <Button className="flex items-center gap-2">
          Connect Platform
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  )
}
