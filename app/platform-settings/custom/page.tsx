"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { CustomPlatformWizard } from "@/components/custom-platform-wizard"
import { FirstTimeCustomPlatform } from "@/components/first-time-custom-platform"
import { usePlatforms } from "@/context/platform-context"

export default function CustomPlatformPage() {
  const { platforms } = usePlatforms()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isFirstTime, setIsFirstTime] = useState(true)
  const [platformName, setPlatformName] = useState("")
  const [platformDescription, setPlatformDescription] = useState("")

  useEffect(() => {
    // Check if this is a first-time user - no custom platforms yet
    const customPlatforms = platforms.filter(
      (p) => p.icon.length === 1 && p.name !== "Datadog" && p.name !== "Grafana" && p.name !== "New Relic",
    )
    setIsFirstTime(customPlatforms.length === 0)

    // If there's a skipIntro param, show the wizard directly
    if (searchParams.get("skipIntro") === "true") {
      setIsFirstTime(false)
    }

    // Get platform name and description from sessionStorage
    const storedName = sessionStorage.getItem("customPlatformName")
    const storedDescription = sessionStorage.getItem("customPlatformDescription")

    if (storedName) {
      setPlatformName(storedName)
    }

    if (storedDescription) {
      setPlatformDescription(storedDescription)
    }
  }, [platforms, searchParams])

  return (
    <DashboardLayout>
      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-white">Add Custom Platform</h1>
          <p className="text-gray-400">Configure a custom platform integration for your specific needs</p>
        </div>

        {isFirstTime ? <FirstTimeCustomPlatform /> : <CustomPlatformWizard />}
      </div>
    </DashboardLayout>
  )
}
