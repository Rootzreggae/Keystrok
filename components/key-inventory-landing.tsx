"use client"

import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"
import { usePlatforms } from "@/context/platform-context"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function KeyInventoryLanding() {
  const router = useRouter()
  const { platforms } = usePlatforms()
  const hasPlatforms = platforms.length > 0
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Determine button properties based on whether platforms exist
  const buttonProps = {
    href: hasPlatforms ? "/key-inventory/dashboard" : "/platform-settings",
    label: hasPlatforms ? "Access Key Inventory" : "Connect Platform",
  }

  const handleButtonClick = async () => {
    setIsSubmitting(true)
    try {
      router.push(buttonProps.href)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] text-center px-4">
      <h1 className="text-5xl font-bold text-white mb-6">Key Inventory</h1>
      <p className="text-xl text-gray-400 max-w-3xl mb-12">
        Monitor, manage, and rotate your API keys across all platforms from a single dashboard
      </p>

      <div className="w-full max-w-md">
        <Button
          onClick={handleButtonClick}
          disabled={isSubmitting}
          className="w-full py-6 text-lg bg-[#6B5EFF] hover:bg-[#5A4FD9] flex items-center justify-center gap-2"
        >
          <Shield className="h-5 w-5" />
          {buttonProps.label}
          {isSubmitting && (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          )}
        </Button>
      </div>
    </div>
  )
}
