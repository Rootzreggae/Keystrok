import { DashboardLayout } from "@/components/dashboard-layout"
import { AddPlatformIntegration } from "@/components/add-platform-integration"

export default function AddPlatformPage() {
  return (
    <DashboardLayout>
      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-white">Add platform integration</h1>
          <p className="text-gray-400">Brief description</p>
        </div>

        <AddPlatformIntegration />
      </div>
    </DashboardLayout>
  )
}
