"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { KeyInventoryDashboard } from "@/components/key-inventory-dashboard"
import { KeyInventoryEmptyState } from "@/components/key-inventory-empty-state"
import { KeyInventoryLanding } from "@/components/key-inventory-landing"
import { usePlatforms } from "@/context/platform-context"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function KeyInventory() {
  const { hasPlatforms, platforms, lastUpdated } = usePlatforms()
  const [key, setKey] = useState(0)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [hasSeenIntro, setHasSeenIntro] = useState(false)
  const [forceShowDashboard, setForceShowDashboard] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showLanding, setShowLanding] = useState(true)

  // Check for direct navigation from platform addition
  const fromPlatformAddition = searchParams.get("fromPlatformAddition") === "true"

  // Check if we should skip the landing page
  const skipLanding = searchParams.get("skipLanding") === "true"

  // Check if user has seen the intro page - but skip this check if coming from platform addition
  useEffect(() => {
    // If coming directly from platform addition, mark intro as seen and show dashboard
    if (fromPlatformAddition) {
      localStorage.setItem("key-inventory-intro-seen", "true")
      localStorage.setItem("key-inventory-show-dashboard", "true")
      setHasSeenIntro(true)
      setForceShowDashboard(true)
      setShowLanding(false)

      // Clean up URL by removing query parameters
      const url = new URL(window.location.href)
      url.searchParams.delete("fromPlatformAddition")
      url.searchParams.delete("showDashboard")
      window.history.replaceState({}, "", url.toString())

      setLoading(false)
    } else {
      // Check if we should skip the landing page
      if (skipLanding) {
        setShowLanding(false)

        // Clean up URL
        const url = new URL(window.location.href)
        url.searchParams.delete("skipLanding")
        window.history.replaceState({}, "", url.toString())
      } else {
        // Check if they've previously chosen to skip the landing
        const skipLandingStored = localStorage.getItem("key-inventory-skip-landing")
        if (skipLandingStored === "true") {
          setShowLanding(false)
        }
      }

      // Normal flow - check if they've seen the intro
      const introSeen = localStorage.getItem("key-inventory-intro-seen")
      if (introSeen) {
        setHasSeenIntro(true)

        // Check for showDashboard parameter
        const showDashboard = searchParams.get("showDashboard")
        if (showDashboard === "true") {
          localStorage.setItem("key-inventory-show-dashboard", "true")
          setForceShowDashboard(true)
          setShowLanding(false)

          // Clean up URL
          const url = new URL(window.location.href)
          url.searchParams.delete("showDashboard")
          window.history.replaceState({}, "", url.toString())
        } else {
          // Check stored preference
          const storedPreference = localStorage.getItem("key-inventory-show-dashboard")
          if (storedPreference === "true") {
            setForceShowDashboard(true)
            setShowLanding(false)
          }
        }

        setLoading(false)
      } else {
        // Redirect to intro page
        router.push("/key-inventory/intro")
      }
    }
  }, [router, searchParams, fromPlatformAddition, skipLanding])

  // Function to handle skipping the landing page
  const handleSkipLanding = () => {
    localStorage.setItem("key-inventory-skip-landing", "true")
    setShowLanding(false)
  }

  // Force a re-render when platforms change or when lastUpdated changes
  useEffect(() => {
    setKey((prevKey) => prevKey + 1)
  }, [platforms, lastUpdated])

  // Show loading state while determining what to display
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[50vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#6B5EFF] border-t-transparent"></div>
        </div>
      </DashboardLayout>
    )
  }

  // If they haven't seen the intro and aren't coming from platform addition, don't render anything (will redirect)
  if (!hasSeenIntro && !fromPlatformAddition) {
    return null
  }

  // If we should show the landing page
  if (showLanding) {
    return (
      <DashboardLayout>
        <KeyInventoryLanding />
      </DashboardLayout>
    )
  }

  // Determine what to show - either force dashboard or check if platforms exist
  const shouldShowDashboard = forceShowDashboard || hasPlatforms

  return (
    <DashboardLayout>
      {shouldShowDashboard ? <KeyInventoryDashboard key={key} /> : <KeyInventoryEmptyState />}
    </DashboardLayout>
  )
}
