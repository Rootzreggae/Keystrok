"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { InfoIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePlatforms } from "@/context/platform-context"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

type PlatformType = "datadog" | "grafana" | "newrelic" | "custom"

interface AddPlatformIntegrationProps {
  isInitialSetup?: boolean
}

export function AddPlatformIntegration({ isInitialSetup = false }: AddPlatformIntegrationProps) {
  const router = useRouter()
  const { addPlatform } = usePlatforms()
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>("datadog")
  const [instanceUrl, setInstanceUrl] = useState("https://app.datadoghq.com")
  const [apiKey, setApiKey] = useState("")
  const [applicationKey, setApplicationKey] = useState("")
  const [rotationPolicy, setRotationPolicy] = useState("180")
  const [autoDiscoveryEnabled, setAutoDiscoveryEnabled] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [customPlatformName, setCustomPlatformName] = useState("")
  const [customPlatformDescription, setCustomPlatformDescription] = useState("")

  const handleCancel = () => {
    router.push("/platform-settings")
  }

  const handleTestConnection = () => {
    if (!apiKey || !applicationKey) {
      toast({
        title: "Missing credentials",
        description: "Please provide both API Key and Application Key to test the connection.",
        variant: "destructive",
      })
      return
    }

    setIsTesting(true)

    // Simulate API call
    setTimeout(() => {
      setIsTesting(false)
      toast({
        title: "Connection successful",
        description: "Successfully connected to the platform.",
      })
    }, 1500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedPlatform === "custom") {
      // Don't submit the form, just navigate to the next step
      return
    }

    if (!apiKey || !applicationKey) {
      toast({
        title: "Missing credentials",
        description: "Please provide both API Key and Application Key.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Get platform details based on selection
    const platformDetails = {
      datadog: {
        name: "Datadog",
        icon: "D",
        iconColor: "bg-[#7C3AED]",
      },
      grafana: {
        name: "Grafana",
        icon: "G",
        iconColor: "bg-[#F46800]",
      },
      newrelic: {
        name: "New Relic",
        icon: "N",
        iconColor: "bg-[#4B7BEC]",
      },
    }[selectedPlatform]

    // Simulate API call
    setTimeout(() => {
      // Add the platform to our context
      addPlatform({
        ...platformDetails,
        status: "Connected",
        apiKeys: Math.floor(Math.random() * 10) + 1, // Random number of API keys
        adminPermissions: "Yes",
        lastSync: "Just now",
        rotationPolicy: `${rotationPolicy} days`,
        autoDiscovery: autoDiscoveryEnabled ? "Enabled" : "Disabled",
      })

      setIsSubmitting(false)

      toast({
        title: "Platform added",
        description: `${platformDetails.name} has been successfully added. Refreshing inventory...`,
      })

      // Set a flag in localStorage to indicate we've added a platform
      localStorage.setItem("key-inventory-show-dashboard", "true")

      // Mark the intro as seen to prevent future redirects
      localStorage.setItem("key-inventory-intro-seen", "true")

      // Navigate directly to key inventory page, bypassing the intro
      router.push("/key-inventory?fromPlatformAddition=true&showDashboard=true")
    }, 1500)
  }

  const handleNextForCustomPlatform = () => {
    if (!customPlatformName.trim()) {
      toast({
        title: "Platform name required",
        description: "Please provide a name for your custom platform.",
        variant: "destructive",
      })
      return
    }

    // Store the platform name and description in localStorage or sessionStorage
    // This allows us to access this data in the next step
    sessionStorage.setItem("customPlatformName", customPlatformName)
    sessionStorage.setItem("customPlatformDescription", customPlatformDescription)

    // Navigate to the custom platform page
    router.push("/platform-settings/custom?skipIntro=true")
  }

  return (
    <div className="w-full">
      {isInitialSetup && (
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-white">Add platform integration</h1>
          <p className="text-gray-400">Brief description</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-lg bg-[#171723] p-6">
        {/* Step 1: Select Platform */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-medium text-white">1. Select Platform</h2>
          <div className="rounded-lg bg-[#1E1E2D] p-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              <PlatformOption
                name="Datadog"
                icon="D"
                iconColor="bg-[#7C3AED]"
                selected={selectedPlatform === "datadog"}
                onClick={() => setSelectedPlatform("datadog")}
              />
              <PlatformOption
                name="Grafana"
                icon="G"
                iconColor="bg-[#F46800]"
                selected={selectedPlatform === "grafana"}
                onClick={() => setSelectedPlatform("grafana")}
              />
              <PlatformOption
                name="New Relic"
                icon="N"
                iconColor="bg-[#4B7BEC]"
                selected={selectedPlatform === "newrelic"}
                onClick={() => setSelectedPlatform("newrelic")}
              />
              <PlatformOption
                name="Custom Platform"
                icon="C"
                iconColor="bg-[#10B981]"
                selected={selectedPlatform === "custom"}
                onClick={() => setSelectedPlatform("custom")}
              />
            </div>
          </div>
        </div>

        {/* Step 2: Connection Details or Custom Platform */}
        <div className="mb-8">
          {selectedPlatform === "custom" ? (
            <>
              <h2 className="mb-4 text-lg font-medium text-white">2. Add Custom Platform</h2>
              <div className="rounded-lg bg-[#1E1E2D] p-4">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="platform-name" className="block text-sm text-white">
                      Platform Name
                    </label>
                    <input
                      id="platform-name"
                      type="text"
                      value={customPlatformName}
                      onChange={(e) => setCustomPlatformName(e.target.value)}
                      placeholder="My custom Platform"
                      className="w-full rounded-md border border-[#343B4F] bg-[#0D0D14] px-3 py-2 text-white placeholder-gray-500 focus:border-[#6B5EFF] focus:outline-none focus:ring-1 focus:ring-[#6B5EFF]"
                    />
                    <p className="text-xs text-gray-400">This will be displayed throughout the application</p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="platform-description" className="block text-sm text-white">
                      Description (Optional)
                    </label>
                    <textarea
                      id="platform-description"
                      value={customPlatformDescription}
                      onChange={(e) => setCustomPlatformDescription(e.target.value)}
                      placeholder="Enter a description of this platform..."
                      rows={4}
                      className="w-full rounded-md border border-[#343B4F] bg-[#0D0D14] px-3 py-2 text-white placeholder-gray-500 focus:border-[#6B5EFF] focus:outline-none focus:ring-1 focus:ring-[#6B5EFF]"
                    />
                    <p className="text-xs text-gray-400">Helps your team understand what this platform is used for</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <h2 className="mb-4 text-lg font-medium text-white">2. Connection Details</h2>
              <div className="rounded-lg bg-[#1E1E2D] p-4">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="instance-url" className="block text-sm text-white">
                      Instance URL
                    </label>
                    <input
                      id="instance-url"
                      type="text"
                      value={instanceUrl}
                      onChange={(e) => setInstanceUrl(e.target.value)}
                      className="w-full rounded-md border border-[#343B4F] bg-[#0D0D14] px-3 py-2 text-white placeholder-gray-500 focus:border-[#6B5EFF] focus:outline-none focus:ring-1 focus:ring-[#6B5EFF]"
                    />
                    <p className="text-xs text-gray-400">The URL of your Datadog instance</p>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="api-key" className="block text-sm text-white">
                        API Key
                      </label>
                      <input
                        id="api-key"
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your DataDog API key"
                        className="w-full rounded-md border border-[#343B4F] bg-[#0D0D14] px-3 py-2 text-white placeholder-gray-500 focus:border-[#6B5EFF] focus:outline-none focus:ring-1 focus:ring-[#6B5EFF]"
                      />
                      <p className="text-xs text-gray-400">Admin API key with/read write permissions</p>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="application-key" className="block text-sm text-white">
                        Application Key
                      </label>
                      <input
                        id="application-key"
                        type="password"
                        value={applicationKey}
                        onChange={(e) => setApplicationKey(e.target.value)}
                        placeholder="Enter your DataDog Application key"
                        className="w-full rounded-md border border-[#343B4F] bg-[#0D0D14] px-3 py-2 text-white placeholder-gray-500 focus:border-[#6B5EFF] focus:outline-none focus:ring-1 focus:ring-[#6B5EFF]"
                      />
                      <p className="text-xs text-gray-400">Required for key management operations</p>
                    </div>
                  </div>

                  <div className="rounded-md bg-[#2B3B64] p-4 text-sm text-[#7B9CFF]">
                    <div className="flex items-start gap-2">
                      <InfoIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      <p>
                        You can find your API and Application keys in Datadog under Organization Settings → API Keys
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Step 3: Platform settings - Only show for non-custom platforms */}
        {selectedPlatform !== "custom" && (
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-medium text-white">3. Platform settings</h2>
            <div className="rounded-lg bg-[#1E1E2D] p-4">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="rotation-policy" className="block text-sm text-white">
                    Rotation Policy
                  </label>
                  <div className="flex">
                    <input
                      id="rotation-policy"
                      type="text"
                      value={rotationPolicy}
                      onChange={(e) => setRotationPolicy(e.target.value)}
                      className="w-32 rounded-l-md border border-[#343B4F] bg-[#0D0D14] px-3 py-2 text-white placeholder-gray-500 focus:border-[#6B5EFF] focus:outline-none focus:ring-1 focus:ring-[#6B5EFF]"
                    />
                    <div className="flex items-center rounded-r-md border border-l-0 border-[#343B4F] bg-[#0D0D14] px-3 py-2 text-sm text-gray-400">
                      Days
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">Keys older than this will be flagged for rotation</p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="auto-discovery" className="block text-sm text-white">
                    Auto-Discovery
                  </label>
                  <div className="flex items-center gap-2">
                    <ToggleSwitch enabled={autoDiscoveryEnabled} onChange={setAutoDiscoveryEnabled} />
                    <span className="text-sm text-white">{autoDiscoveryEnabled ? "Enabled" : "Disabled"}</span>
                  </div>
                  <p className="text-xs text-gray-400">Automatically scan for keys using this platform</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
          {selectedPlatform !== "custom" ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handleTestConnection}
                disabled={isTesting || !apiKey || !applicationKey}
              >
                {isTesting ? "Testing..." : "Test Connection"}
              </Button>
              <div className="flex-1"></div>
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Platform"}
              </Button>
            </>
          ) : (
            <>
              <div className="flex-1"></div>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Back
              </Button>
              <Button type="button" onClick={handleNextForCustomPlatform} disabled={!customPlatformName.trim()}>
                Next
              </Button>
            </>
          )}
        </div>
      </form>
      <Toaster />
    </div>
  )
}

interface PlatformOptionProps {
  name: string
  icon: string
  iconColor: string
  selected: boolean
  onClick: () => void
}

function PlatformOption({ name, icon, iconColor, selected, onClick }: PlatformOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-4 rounded-lg border p-4 transition-all ${
        selected ? "border-[#6B5EFF] bg-[#171723]" : "border-[#343B4F] bg-transparent"
      }`}
    >
      <div className={`flex h-10 w-10 items-center justify-center rounded-full text-white ${iconColor}`}>
        <span className="text-lg font-medium">{icon}</span>
      </div>
      <span className="text-lg font-medium text-white">{name}</span>
      <div className="ml-auto">
        <div
          className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
            selected ? "border-[#6B5EFF]" : "border-[#343B4F]"
          }`}
        >
          {selected && <div className="h-3 w-3 rounded-full bg-[#6B5EFF]"></div>}
        </div>
      </div>
    </button>
  )
}

interface ToggleSwitchProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
}

function ToggleSwitch({ enabled, onChange }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        enabled ? "bg-[#4B7BEC]" : "bg-[#343B4F]"
      }`}
    >
      <span
        className={`pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          enabled ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  )
}
