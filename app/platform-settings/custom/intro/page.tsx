import { DashboardLayout } from "@/components/dashboard-layout"
import { CustomPlatformIntroduction } from "@/components/custom-platform-introduction"

export default function CustomPlatformIntroPage() {
  return (
    <DashboardLayout>
      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-white">Custom Platform Integration</h1>
          <p className="text-gray-400">Connect your own observability platforms and custom tools to Keystrok</p>
        </div>

        <CustomPlatformIntroduction />
      </div>
    </DashboardLayout>
  )
}
