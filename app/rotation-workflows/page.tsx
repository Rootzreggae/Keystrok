"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { RotationWorkflowsEmptyState } from "@/components/rotation-workflows-empty-state"
import { RotationWorkflowsDashboard } from "@/components/rotation-workflows-dashboard"
import { RotationWorkflowsNoPlatforms } from "@/components/rotation-workflows-no-platforms"
import { usePlatforms } from "@/context/platform-context"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function RotationWorkflows() {
  const { hasPlatforms } = usePlatforms()
  const router = useRouter()
  const [hasWorkflows, setHasWorkflows] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Force a re-render on client side to ensure we have the correct state
  useEffect(() => {
    router.refresh()

    // Check local storage for existing workflows
    const hasExistingWorkflows = localStorage.getItem("keystrok-has-workflows") === "true"
    setHasWorkflows(hasExistingWorkflows)

    // Check if we're coming from key inventory with auto-start
    const autoStartRotation = localStorage.getItem("auto-start-rotation") === "true"
    const selectedKey = localStorage.getItem("selected-key")

    if (autoStartRotation && selectedKey && hasPlatforms) {
      // If we should auto-start a rotation, redirect to create workflow
      router.push("/rotation-workflows/create")
    }

    setIsLoading(false)
  }, [router, hasPlatforms])

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent border-[#6B5EFF]"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      {!hasPlatforms ? (
        <RotationWorkflowsNoPlatforms />
      ) : hasWorkflows ? (
        <RotationWorkflowsDashboard />
      ) : (
        <RotationWorkflowsEmptyState />
      )}
    </DashboardLayout>
  )
}
