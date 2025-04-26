"use client"

import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { RotationWorkflowDetail } from "@/components/rotation-workflow-detail"
import { usePlatforms } from "@/context/platform-context"
import { useWorkflowData } from "@/hooks/use-workflow-data"

export default function RotationWorkflowPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { hasPlatforms } = usePlatforms()
  const { isLoading, workflowData } = useWorkflowData(params.id)

  // Redirect if no platforms are connected
  if (!hasPlatforms) {
    router.push("/rotation-workflows")
    return null
  }

  return (
    <DashboardLayout>
      {isLoading ? (
        <div className="flex h-64 w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent border-[#6B5EFF]"></div>
        </div>
      ) : (
        <RotationWorkflowDetail workflow={workflowData} />
      )}
    </DashboardLayout>
  )
}
