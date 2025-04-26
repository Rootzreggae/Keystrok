"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { usePlatforms } from "@/context/platform-context"
import { KeyInventoryDashboard } from "@/components/key-inventory-dashboard"

export function KeyInventoryTest() {
  const { platforms, addPlatform } = usePlatforms()
  const [testResults, setTestResults] = useState<string[]>([])

  // Function to add a test platform
  const addTestPlatform = () => {
    const platformNumber = platforms.length + 1
    addPlatform({
      name: `Test Platform ${platformNumber}`,
      icon: "database",
      iconColor: "bg-blue-500",
      status: "Connected",
      apiKeys: 1,
      adminPermissions: "Full",
      lastSync: "Just now",
      rotationPolicy: "90 days",
      autoDiscovery: "Enabled",
    })

    // Add test result
    setTestResults((prev) => [...prev, `Added Test Platform ${platformNumber}. Expected row count: ${platformNumber}`])
  }

  // Function to add multiple platforms at once
  const addMultiplePlatforms = (count: number) => {
    for (let i = 0; i < count; i++) {
      const platformNumber = platforms.length + i + 1
      addPlatform({
        name: `Batch Platform ${platformNumber}`,
        icon: "database",
        iconColor: "bg-green-500",
        status: "Connected",
        apiKeys: 1,
        adminPermissions: "Full",
        lastSync: "Just now",
        rotationPolicy: "90 days",
        autoDiscovery: "Enabled",
      })
    }

    // Add test result
    setTestResults((prev) => [
      ...prev,
      `Added ${count} platforms at once. Expected row count: ${platforms.length + count}`,
    ])
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-[#171723] p-4">
        <h2 className="text-xl font-semibold text-white mb-4">Key Inventory Table Test</h2>

        <div className="flex flex-wrap gap-4 mb-6">
          <Button onClick={addTestPlatform}>Add Single Platform</Button>
          <Button onClick={() => addMultiplePlatforms(3)}>Add 3 Platforms</Button>
        </div>

        <div className="bg-[#1E1E2D] rounded-md p-4 max-h-40 overflow-y-auto">
          <h3 className="text-white font-medium mb-2">Test Results:</h3>
          <ul className="space-y-1">
            {testResults.map((result, index) => (
              <li key={index} className="text-sm text-gray-400">
                {result}
              </li>
            ))}
            <li className="text-sm font-medium text-white">Current platform count: {platforms.length}</li>
          </ul>
        </div>
      </div>

      <KeyInventoryDashboard />
    </div>
  )
}
