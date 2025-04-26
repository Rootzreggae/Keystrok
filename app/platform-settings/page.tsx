"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PlatformSettings } from "@/components/platform-settings"
import { usePlatforms } from "@/context/platform-context"
import { AddPlatformIntegration } from "@/components/add-platform-integration"

export default function PlatformSettingsPage() {
  const { hasPlatforms } = usePlatforms()
  const router = useRouter()

  // Force a re-render on client side to ensure we have the correct state
  useEffect(() => {
    router.refresh()
  }, [router])

  return (
    <DashboardLayout>
      {hasPlatforms ? <PlatformSettings /> : <AddPlatformIntegration isInitialSetup={true} />}
    </DashboardLayout>
  )
}
