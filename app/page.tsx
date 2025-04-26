"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardRedesign } from "@/components/dashboard-redesign"
import { FirstTimeDashboard } from "@/components/first-time-dashboard"
import { usePlatforms } from "@/context/platform-context"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

// Function to fetch user-specific rules based on context
function getUserRules(userId: string) {
  // This would typically be an API call or context-based logic
  // For now, we'll return mock data
  return {
    platformRules: [
      { id: 1, name: "API Key Rotation", description: "Rotate API keys every 90 days", isActive: true },
      { id: 2, name: "Access Control", description: "Limit access to production keys", isActive: true },
      { id: 3, name: "Key Monitoring", description: "Monitor key usage patterns", isActive: false },
    ],
    securityPolicies: [
      { id: 1, name: "Encryption", description: "All keys must be encrypted at rest", isActive: true },
      { id: 2, name: "Audit Logging", description: "Log all key access events", isActive: true },
    ],
  }
}

export default function Dashboard() {
  const { hasPlatforms } = usePlatforms()
  const router = useRouter()

  // Force a re-render on client side to ensure we have the correct state
  useEffect(() => {
    router.refresh()
  }, [router])

  const userId = "user-123" // In a real app, this would come from authentication
  const userRules = getUserRules(userId)

  return (
    <DashboardLayout>
      {hasPlatforms ? (
        <DashboardRedesign userRules={userRules} />
      ) : (
        <FirstTimeDashboard hasPlatforms={hasPlatforms} userRules={userRules} />
      )}
    </DashboardLayout>
  )
}
