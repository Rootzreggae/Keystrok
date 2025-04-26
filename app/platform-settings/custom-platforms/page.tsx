import { DashboardLayout } from "@/components/dashboard-layout"
import { CustomPlatformManager } from "@/components/custom-platform-manager"

export default function CustomPlatformsPage() {
  return (
    <DashboardLayout>
      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-white">Custom Platforms</h1>
          <p className="text-gray-400">Manage your custom platform integrations</p>
        </div>

        <CustomPlatformManager />
      </div>
    </DashboardLayout>
  )
}
