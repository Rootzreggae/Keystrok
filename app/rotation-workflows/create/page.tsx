"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { ArrowLeft, AlertCircle, Info, Check, Server, ShieldCheck, Key } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

// Add this import at the top
import { useActivities } from "@/context/activity-context"
import { usePlatforms } from "@/context/platform-context"

export default function CreateWorkflow() {
  const router = useRouter()
  const { addActivity } = useActivities()
  const { getPlatform, platforms } = usePlatforms()
  const [currentStep, setCurrentStep] = useState(1)
  const [workflowName, setWorkflowName] = useState("")
  const [selectedPlatform, setSelectedPlatform] = useState("")
  const [selectedKey, setSelectedKey] = useState("")
  const [rotationSchedule, setRotationSchedule] = useState("90")
  const [notifyUsers, setNotifyUsers] = useState(true)
  const [transitionPeriod, setTransitionPeriod] = useState("7")
  const [isCreating, setIsCreating] = useState(false)

  // State for custom platform specific settings
  const [customEndpoint, setCustomEndpoint] = useState("")
  const [customAuthMethod, setCustomAuthMethod] = useState("api_key")
  const [customKeyLocation, setCustomKeyLocation] = useState("header")

  // New state variables for additional steps
  const [systemsToUpdate, setSystemsToUpdate] = useState([
    { id: 1, name: "Production Kubernetes Cluster", selected: true },
    { id: 2, name: "CI/CD Pipeline (Jenkins)", selected: true },
    { id: 3, name: "Monitoring Dashboard", selected: true },
    { id: 4, name: "Development Environment", selected: false },
  ])
  const [verificationMethod, setVerificationMethod] = useState("automatic")
  const [verificationPeriod, setVerificationPeriod] = useState("24")
  const [revokeImmediately, setRevokeImmediately] = useState(false)
  const [emergencyContact, setEmergencyContact] = useState("")
  const [confirmRevoke, setConfirmRevoke] = useState(false)

  // State variables for Step 2: Create Key
  const [keyName, setKeyName] = useState("Production API Key Replacement")
  const [keyDescription, setKeyDescription] = useState("Replacement key for Production environment monitoring")
  const [matchExistingPermissions, setMatchExistingPermissions] = useState(true)

  // New state variables for custom permissions
  const [readAccess, setReadAccess] = useState(true)
  const [writeAccess, setWriteAccess] = useState(true)
  const [adminAccess, setAdminAccess] = useState(false)

  // Define the steps for the workflow
  const steps = [
    { id: 1, name: "Preparation", status: currentStep === 1 ? "current" : currentStep > 1 ? "completed" : "pending" },
    { id: 2, name: "Create Key", status: currentStep === 2 ? "current" : currentStep > 2 ? "completed" : "pending" },
    {
      id: 3,
      name: "Update Systems",
      status: currentStep === 3 ? "current" : currentStep > 3 ? "completed" : "pending",
    },
    { id: 4, name: "Verify", status: currentStep === 4 ? "current" : currentStep > 4 ? "completed" : "pending" },
    { id: 5, name: "Revoke", status: currentStep === 5 ? "current" : currentStep > 5 ? "completed" : "pending" },
  ]

  // Effect to update workflow name based on platform selection
  useEffect(() => {
    if (selectedPlatform) {
      const platformName =
        selectedPlatform === "datadog"
          ? "Datadog"
          : selectedPlatform === "grafana"
            ? "Grafana"
            : selectedPlatform === "newrelic"
              ? "New Relic"
              : selectedPlatform === "custom"
                ? "Custom Platform"
                : getPlatform(selectedPlatform)?.name || "Unknown Platform"

      setWorkflowName(`${platformName} API Key Rotation`)
    }
  }, [selectedPlatform, getPlatform])

  const handleCreateWorkflow = () => {
    setIsCreating(true)

    // Get platform details
    const platform = getPlatform(selectedPlatform) || {
      name:
        selectedPlatform === "datadog"
          ? "Datadog"
          : selectedPlatform === "grafana"
            ? "Grafana"
            : selectedPlatform === "newrelic"
              ? "New Relic"
              : selectedPlatform === "custom"
                ? "Custom Platform"
                : "Unknown Platform",
      icon: selectedPlatform.charAt(0).toUpperCase(),
      iconColor:
        selectedPlatform === "datadog"
          ? "bg-[#7C3AED]"
          : selectedPlatform === "grafana"
            ? "bg-[#F46800]"
            : selectedPlatform === "newrelic"
              ? "bg-[#1CE783]"
              : selectedPlatform === "custom"
                ? "bg-[#6B5EFF]"
                : "bg-[#6B5EFF]",
    }

    // Log the activity
    addActivity({
      type: "workflow_created",
      platformId: selectedPlatform,
      platformName: platform.name,
      platformIcon: platform.icon.charAt(0),
      platformColor: platform.iconColor,
      workflowName: workflowName,
      keyName: keyName,
      status: "in_progress",
    })

    // Simulate API call
    setTimeout(() => {
      // Save to local storage that we have workflows
      localStorage.setItem("keystrok-has-workflows", "true")

      setIsCreating(false)
      router.push("/rotation-workflows")
    }, 1500)
  }

  // Toggle system selection
  const toggleSystem = (id: number) => {
    setSystemsToUpdate((systems) =>
      systems.map((system) => (system.id === id ? { ...system, selected: !system.selected } : system)),
    )
  }

  // Get selected systems count
  const selectedSystemsCount = systemsToUpdate.filter((system) => system.selected).length

  // Check if the selected platform is a custom platform
  const isCustomPlatform = selectedPlatform === "custom"

  return (
    <DashboardLayout>
      <div className="w-full space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/rotation-workflows">
            <Button variant="ghost" className="p-2 text-gray-400 hover:bg-[#1E1E2D] hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold text-white">Create Rotation Workflow</h1>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center">
          <div className="w-full">
            {/* Use our updated WorkflowProgressTracker component */}
            <WorkflowProgressTracker steps={steps} currentStep={currentStep} />
          </div>
        </div>

        {/* Step Content */}
        <div className="rounded-lg bg-[#171723] p-6">
          {/* Step 1: Preparation */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2B3B64]">
                  <Info className="h-5 w-5 text-[#6B5EFF]" />
                </div>
                <h2 className="text-xl font-medium text-white">Preparation</h2>
              </div>

              <div className="rounded-lg bg-[#1E1E2D] p-4 mb-6">
                <p className="text-gray-300">
                  Before starting the key rotation process, you need to identify the key to rotate and understand its
                  usage. This helps ensure a smooth transition with zero downtime.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="workflow-name" className="mb-2 block text-sm text-white">
                    Workflow Name
                  </label>
                  <input
                    id="workflow-name"
                    type="text"
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                    placeholder="e.g., Datadog API Key Rotation"
                    className="w-full rounded-md border border-[#343B4F] bg-[#0D0D14] px-3 py-2 text-white placeholder-gray-500 focus:border-[#6B5EFF] focus:outline-none focus:ring-1 focus:ring-[#6B5EFF]"
                  />
                </div>

                <div>
                  <label htmlFor="platform" className="mb-2 block text-sm text-white">
                    Platform
                  </label>
                  <select
                    id="platform"
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                    className="w-full rounded-md border border-[#343B4F] bg-[#0D0D14] px-3 py-2 text-white focus:border-[#6B5EFF] focus:outline-none focus:ring-1 focus:ring-[#6B5EFF]"
                  >
                    <option value="">Select a platform</option>
                    <option value="datadog">Datadog</option>
                    <option value="grafana">Grafana</option>
                    <option value="newrelic">New Relic</option>
                    <option value="custom">Custom Platform</option>
                    {platforms.map((platform) => (
                      <option key={platform.id} value={platform.id}>
                        {platform.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Custom Platform Settings - only show when Custom Platform is selected */}
                {isCustomPlatform && (
                  <div className="space-y-4 rounded-lg bg-[#1E1E2D] p-4 mt-4">
                    <h3 className="text-sm font-medium text-white">Custom Platform Settings</h3>

                    <div className="space-y-2">
                      <label htmlFor="custom-endpoint" className="block text-sm text-white">
                        API Endpoint
                      </label>
                      <input
                        id="custom-endpoint"
                        type="text"
                        value={customEndpoint}
                        onChange={(e) => setCustomEndpoint(e.target.value)}
                        placeholder="https://api.example.com/v1"
                        className="w-full rounded-md border border-[#343B4F] bg-[#0D0D14] px-3 py-2 text-white placeholder-gray-500 focus:border-[#6B5EFF] focus:outline-none focus:ring-1 focus:ring-[#6B5EFF]"
                      />
                      <p className="text-xs text-gray-400">The base URL for API requests</p>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm text-white">Authentication Method</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          className={`flex items-center gap-2 rounded-md border p-2 ${
                            customAuthMethod === "api_key"
                              ? "border-[#6B5EFF] bg-[#2D2D44]"
                              : "border-[#4B4B58] bg-[#1E1E2D]"
                          }`}
                          onClick={() => setCustomAuthMethod("api_key")}
                        >
                          <div className="text-sm font-medium text-white">API Key</div>
                        </button>
                        <button
                          type="button"
                          className={`flex items-center gap-2 rounded-md border p-2 ${
                            customAuthMethod === "oauth"
                              ? "border-[#6B5EFF] bg-[#2D2D44]"
                              : "border-[#4B4B58] bg-[#1E1E2D]"
                          }`}
                          onClick={() => setCustomAuthMethod("oauth")}
                        >
                          <div className="text-sm font-medium text-white">OAuth</div>
                        </button>
                      </div>
                    </div>

                    {customAuthMethod === "api_key" && (
                      <div className="space-y-2">
                        <label className="block text-sm text-white">API Key Location</label>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            type="button"
                            className={`flex items-center gap-2 rounded-md border p-2 ${
                              customKeyLocation === "header"
                                ? "border-[#6B5EFF] bg-[#2D2D44]"
                                : "border-[#4B4B58] bg-[#1E1E2D]"
                            }`}
                            onClick={() => setCustomKeyLocation("header")}
                          >
                            <div className="text-sm font-medium text-white">Header</div>
                          </button>
                          <button
                            type="button"
                            className={`flex items-center gap-2 rounded-md border p-2 ${
                              customKeyLocation === "query"
                                ? "border-[#6B5EFF] bg-[#2D2D44]"
                                : "border-[#4B4B58] bg-[#1E1E2D]"
                            }`}
                            onClick={() => setCustomKeyLocation("query")}
                          >
                            <div className="text-sm font-medium text-white">Query</div>
                          </button>
                          <button
                            type="button"
                            className={`flex items-center gap-2 rounded-md border p-2 ${
                              customKeyLocation === "body"
                                ? "border-[#6B5EFF] bg-[#2D2D44]"
                                : "border-[#4B4B58] bg-[#1E1E2D]"
                            }`}
                            onClick={() => setCustomKeyLocation("body")}
                          >
                            <div className="text-sm font-medium text-white">Body</div>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label htmlFor="api-key" className="mb-2 block text-sm text-white">
                    API Key
                  </label>
                  <select
                    id="api-key"
                    value={selectedKey}
                    onChange={(e) => setSelectedKey(e.target.value)}
                    className="w-full rounded-md border border-[#343B4F] bg-[#0D0D14] px-3 py-2 text-white focus:border-[#6B5EFF] focus:outline-none focus:ring-1 focus:ring-[#6B5EFF]"
                    disabled={!selectedPlatform}
                  >
                    <option value="">Select an API key</option>
                    <option value="key1">Production API Key</option>
                    <option value="key2">Development API Key</option>
                    <option value="key3">Monitoring API Key</option>
                    {isCustomPlatform && <option value="custom-key">Custom Platform API Key</option>}
                  </select>
                </div>
              </div>

              <div className="rounded-lg bg-[#2B3B64] p-4 flex items-start gap-3 mt-6">
                <AlertCircle className="h-5 w-5 text-[#7B9CFF] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#7B9CFF]">
                    <span className="font-medium">Important:</span> Make sure you have identified all systems using this
                    key before proceeding. This will help ensure a smooth transition with zero downtime.
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  className="bg-[#6B5EFF] px-4 py-2 text-white hover:bg-[#5A4FD9]"
                  onClick={() => setCurrentStep(2)}
                  disabled={!workflowName || !selectedPlatform || !selectedKey || (isCustomPlatform && !customEndpoint)}
                >
                  Next Step
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Create Key */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2B3B64]">
                  <Key className="h-5 w-5 text-[#6B5EFF]" />
                </div>
                <h2 className="text-xl font-medium text-white">Create New Key</h2>
              </div>

              <div className="rounded-lg bg-[#1E1E2D] p-4 mb-6">
                <p className="text-gray-300">
                  In this step, you'll create a new key that will eventually replace the old one. The new key should
                  have the same or modified permissions as needed.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="key-name" className="mb-2 block text-sm text-white">
                    Key Name
                  </label>
                  <input
                    id="key-name"
                    type="text"
                    value={keyName}
                    onChange={(e) => setKeyName(e.target.value)}
                    placeholder="Production API Key Replacement"
                    className="w-full rounded-md border border-[#343B4F] bg-[#0D0D14] px-3 py-2 text-white placeholder-gray-500 focus:border-[#6B5EFF] focus:outline-none focus:ring-1 focus:ring-[#6B5EFF]"
                  />
                </div>

                <div>
                  <label htmlFor="key-description" className="mb-2 block text-sm text-white">
                    Description (Optional)
                  </label>
                  <textarea
                    id="key-description"
                    value={keyDescription}
                    onChange={(e) => setKeyDescription(e.target.value)}
                    placeholder="Replacement key for Production environment monitoring"
                    className="w-full rounded-md border border-[#343B4F] bg-[#0D0D14] px-3 py-2 text-white placeholder-gray-500 focus:border-[#6B5EFF] focus:outline-none focus:ring-1 focus:ring-[#6B5EFF] min-h-[100px]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white">Permissions</label>
                  <div className="rounded-lg bg-[#1E1E2D] p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-5 w-5 items-center justify-center">
                        <input
                          type="radio"
                          id="match-permissions"
                          name="permissions"
                          checked={matchExistingPermissions}
                          onChange={() => setMatchExistingPermissions(true)}
                          className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-[#343B4F] bg-[#0D0D14] checked:border-[#6B5EFF] checked:bg-[#0D0D14] focus:outline-none focus:ring-1 focus:ring-[#6B5EFF]"
                        />
                        <div className="pointer-events-none absolute h-2.5 w-2.5 rounded-full bg-[#6B5EFF] opacity-0 transition-opacity peer-checked:opacity-100"></div>
                      </div>
                      <label htmlFor="match-permissions" className="text-white">
                        Match existing permissions (recommended)
                      </label>
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      <div className="relative flex h-5 w-5 items-center justify-center">
                        <input
                          type="radio"
                          id="custom-permissions"
                          name="permissions"
                          checked={!matchExistingPermissions}
                          onChange={() => setMatchExistingPermissions(false)}
                          className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-[#343B4F] bg-[#0D0D14] checked:border-[#6B5EFF] checked:bg-[#0D0D14] focus:outline-none focus:ring-1 focus:ring-[#6B5EFF]"
                        />
                        <div className="pointer-events-none absolute h-2.5 w-2.5 rounded-full bg-[#6B5EFF] opacity-0 transition-opacity peer-checked:opacity-100"></div>
                      </div>
                      <label htmlFor="custom-permissions" className="text-white">
                        Custom permissions
                      </label>
                    </div>
                  </div>
                </div>

                {!matchExistingPermissions && (
                  <div className="rounded-lg bg-[#1E1E2D] p-4">
                    <h3 className="mb-3 text-sm font-medium text-white">Custom Permission Settings</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Read Access</span>
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input
                            type="checkbox"
                            checked={readAccess}
                            onChange={() => setReadAccess(!readAccess)}
                            className="peer sr-only"
                          />
                          <div className="peer h-6 w-11 rounded-full bg-[#343B4F] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#6B5EFF] peer-checked:after:translate-x-full peer-focus:outline-none"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Write Access</span>
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input
                            type="checkbox"
                            checked={writeAccess}
                            onChange={() => setWriteAccess(!writeAccess)}
                            className="peer sr-only"
                          />
                          <div className="peer h-6 w-11 rounded-full bg-[#343B4F] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#6B5EFF] peer-checked:after:translate-x-full peer-focus:outline-none"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Admin Access</span>
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input
                            type="checkbox"
                            checked={adminAccess}
                            onChange={() => setAdminAccess(!adminAccess)}
                            className="peer sr-only"
                          />
                          <div className="peer h-6 w-11 rounded-full bg-[#343B4F] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#6B5EFF] peer-checked:after:translate-x-full peer-focus:outline-none"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Custom Platform specific key generation settings */}
                {isCustomPlatform && (
                  <div className="rounded-lg bg-[#1E1E2D] p-4">
                    <h3 className="mb-3 text-sm font-medium text-white">Custom Platform Key Generation</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Generate Key via API</span>
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input type="checkbox" checked={true} className="peer sr-only" />
                          <div className="peer h-6 w-11 rounded-full bg-[#343B4F] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#6B5EFF] peer-checked:after:translate-x-full peer-focus:outline-none"></div>
                        </label>
                      </div>
                      <p className="text-xs text-gray-400">
                        When enabled, the system will attempt to generate a new key via the platform's API. If disabled,
                        you'll need to manually create the key and enter it in the next step.
                      </p>
                    </div>
                  </div>
                )}

                <div className="rounded-lg bg-[#2B3B64] p-4 flex items-start gap-3 mt-4">
                  <Info className="h-5 w-5 text-[#7B9CFF] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[#7B9CFF]">
                      <span className="font-medium">Note:</span> The new key will be created with the specified
                      permissions but won't be activated until the verification step is complete.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  className="border-[#343B4F] bg-[#1E1E2D] text-white hover:bg-[#2B3B64]"
                  onClick={() => setCurrentStep(1)}
                >
                  Previous Step
                </Button>
                <Button
                  className="bg-[#6B5EFF] px-4 py-2 text-white hover:bg-[#5A4FD9]"
                  onClick={() => setCurrentStep(3)}
                  disabled={!keyName}
                >
                  Next Step
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Update Systems */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2B3B64]">
                  <Server className="h-5 w-5 text-[#6B5EFF]" />
                </div>
                <h2 className="text-xl font-medium text-white">Update Systems</h2>
              </div>

              <div className="rounded-lg bg-[#1E1E2D] p-4 mb-6">
                <p className="text-gray-300">
                  Select which systems need to be updated with the new API key. All selected systems will be updated
                  during the rotation process.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Systems Using This Key</h3>
                <div className="rounded-lg bg-[#1E1E2D] p-4">
                  <div className="space-y-3">
                    {systemsToUpdate.map((system) => (
                      <div key={system.id} className="flex items-center justify-between p-3 rounded-md bg-[#171723]">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id={`system-${system.id}`}
                            checked={system.selected}
                            onChange={() => toggleSystem(system.id)}
                            className="h-4 w-4 rounded border-[#343B4F] bg-[#0D0D14] text-[#6B5EFF] focus:ring-[#6B5EFF]"
                          />
                          <label htmlFor={`system-${system.id}`} className="text-white">
                            {system.name}
                          </label>
                        </div>
                        <div className="text-sm text-gray-400">{system.id <= 2 ? "Critical" : "Non-critical"}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 text-sm text-gray-400">
                    {selectedSystemsCount} of {systemsToUpdate.length} systems selected
                  </div>
                </div>

                {/* Custom Platform specific system update settings */}
                {isCustomPlatform && (
                  <div className="rounded-lg bg-[#1E1E2D] p-4">
                    <h3 className="mb-3 text-sm font-medium text-white">Custom Platform Update Method</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          id="api-update"
                          name="update-method"
                          checked={true}
                          className="h-4 w-4 border-[#343B4F] bg-[#0D0D14] text-[#6B5EFF] focus:ring-[#6B5EFF]"
                        />
                        <div>
                          <label htmlFor="api-update" className="text-white">
                            API-Based Update
                          </label>
                          <p className="text-sm text-gray-400">System will update keys via API calls</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          id="manual-update"
                          name="update-method"
                          className="h-4 w-4 border-[#343B4F] bg-[#0D0D14] text-[#6B5EFF] focus:ring-[#6B5EFF]"
                        />
                        <div>
                          <label htmlFor="manual-update" className="text-white">
                            Manual Update
                          </label>
                          <p className="text-sm text-gray-400">You'll be guided through manual key updates</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="rounded-lg bg-[#2B3B64] p-4 flex items-start gap-3 mt-4">
                  <Info className="h-5 w-5 text-[#7B9CFF] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[#7B9CFF]">
                      <span className="font-medium">Note:</span> Systems will be updated in order of criticality.
                      Critical systems will be updated first, followed by non-critical systems.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  className="border-[#343B4F] bg-[#1E1E2D] text-white hover:bg-[#2B3B64]"
                  onClick={() => setCurrentStep(2)}
                >
                  Previous Step
                </Button>
                <Button
                  className="bg-[#6B5EFF] px-4 py-2 text-white hover:bg-[#5A4FD9]"
                  onClick={() => setCurrentStep(4)}
                  disabled={selectedSystemsCount === 0}
                >
                  Next Step
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Verify */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2B3B64]">
                  <Check className="h-5 w-5 text-[#6B5EFF]" />
                </div>
                <h2 className="text-xl font-medium text-white">Verify</h2>
              </div>

              <div className="rounded-lg bg-[#1E1E2D] p-4 mb-6">
                <p className="text-gray-300">
                  Configure how the system will verify that all services are successfully using the new key before the
                  old key is revoked.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="mb-3 text-lg font-medium text-white">Verification Method</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        id="automatic"
                        name="verification"
                        value="automatic"
                        checked={verificationMethod === "automatic"}
                        onChange={() => setVerificationMethod("automatic")}
                        className="h-4 w-4 border-[#343B4F] bg-[#0D0D14] text-[#6B5EFF] focus:ring-[#6B5EFF]"
                      />
                      <div>
                        <label htmlFor="automatic" className="text-white">
                          Automatic Verification
                        </label>
                        <p className="text-sm text-gray-400">System will automatically verify key usage</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        id="manual"
                        name="verification"
                        value="manual"
                        checked={verificationMethod === "manual"}
                        onChange={() => setVerificationMethod("manual")}
                        className="h-4 w-4 border-[#343B4F] bg-[#0D0D14] text-[#6B5EFF] focus:ring-[#6B5EFF]"
                      />
                      <div>
                        <label htmlFor="manual" className="text-white">
                          Manual Verification
                        </label>
                        <p className="text-sm text-gray-400">You'll manually verify and confirm key usage</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Custom Platform specific verification settings */}
                {isCustomPlatform && (
                  <div className="rounded-lg bg-[#1E1E2D] p-4">
                    <h3 className="mb-3 text-sm font-medium text-white">Custom Platform Verification</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">API Usage Tracking</span>
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input type="checkbox" checked={true} className="peer sr-only" />
                          <div className="peer h-6 w-11 rounded-full bg-[#343B4F] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#6B5EFF] peer-checked:after:translate-x-full peer-focus:outline-none"></div>
                        </label>
                      </div>
                      <p className="text-xs text-gray-400">
                        When enabled, the system will track API calls to verify the new key is being used.
                      </p>
                    </div>
                  </div>
                )}

                <div className="rounded-lg bg-[#1E1E2D] p-4">
                  <h3 className="mb-2 font-medium text-white">Verification Period</h3>
                  <p className="mb-4 text-sm text-gray-400">
                    How long to monitor usage before confirming successful transition
                  </p>
                  <div className="flex">
                    <input
                      type="text"
                      value={verificationPeriod}
                      onChange={(e) => setVerificationPeriod(e.target.value)}
                      className="w-32 rounded-l-md border border-[#343B4F] bg-[#0D0D14] px-3 py-2 text-white placeholder-gray-500 focus:border-[#6B5EFF] focus:outline-none focus:ring-1 focus:ring-[#6B5EFF]"
                    />
                    <div className="flex items-center rounded-r-md border border-l-0 border-[#343B4F] bg-[#0D0D14] px-3 py-2 text-sm text-gray-400">
                      Hours
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-[#2B3B64] p-4 flex items-start gap-3 mt-4">
                  <AlertCircle className="h-5 w-5 text-[#7B9CFF] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[#7B9CFF]">
                      <span className="font-medium">Important:</span> Verification ensures all systems are successfully
                      using the new key before the old key is revoked. This helps prevent unexpected downtime.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  className="border-[#343B4F] bg-[#1E1E2D] text-white hover:bg-[#2B3B64]"
                  onClick={() => setCurrentStep(3)}
                >
                  Previous Step
                </Button>
                <Button
                  className="bg-[#6B5EFF] px-4 py-2 text-white hover:bg-[#5A4FD9]"
                  onClick={() => setCurrentStep(5)}
                >
                  Next Step
                </Button>
              </div>
            </div>
          )}

          {/* Step 5: Revoke */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2B3B64]">
                  <ShieldCheck className="h-5 w-5 text-[#6B5EFF]" />
                </div>
                <h2 className="text-xl font-medium text-white">Revoke</h2>
              </div>

              <div className="rounded-lg bg-[#1E1E2D] p-4 mb-6">
                <p className="text-gray-300">
                  Configure how the old key will be revoked after the transition period. This is the final step in the
                  rotation process.
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg bg-[#1E1E2D] p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-white">Revoke Immediately After Verification</h3>
                      <p className="text-sm text-gray-400">
                        If disabled, key will be revoked after the full transition period
                      </p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={revokeImmediately}
                        onChange={() => setRevokeImmediately(!revokeImmediately)}
                        className="peer sr-only"
                      />
                      <div className="peer h-6 w-11 rounded-full bg-[#343B4F] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#6B5EFF] peer-checked:after:translate-x-full peer-focus:outline-none"></div>
                    </label>
                  </div>
                </div>

                {/* Custom Platform specific revocation settings */}
                {isCustomPlatform && (
                  <div className="rounded-lg bg-[#1E1E2D] p-4">
                    <h3 className="mb-3 text-sm font-medium text-white">Custom Platform Revocation</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          id="api-revoke"
                          name="revoke-method"
                          checked={true}
                          className="h-4 w-4 border-[#343B4F] bg-[#0D0D14] text-[#6B5EFF] focus:ring-[#6B5EFF]"
                        />
                        <div>
                          <label htmlFor="api-revoke" className="text-white">
                            API-Based Revocation
                          </label>
                          <p className="text-sm text-gray-400">System will revoke the key via API</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          id="manual-revoke"
                          name="revoke-method"
                          className="h-4 w-4 border-[#343B4F] bg-[#0D0D14] text-[#6B5EFF] focus:ring-[#6B5EFF]"
                        />
                        <div>
                          <label htmlFor="manual-revoke" className="text-white">
                            Manual Revocation
                          </label>
                          <p className="text-sm text-gray-400">You'll be guided through manual key revocation</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="emergency-contact" className="mb-2 block text-sm text-white">
                    Emergency Contact (Optional)
                  </label>
                  <input
                    id="emergency-contact"
                    type="email"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    placeholder="e.g., security@company.com"
                    className="w-full rounded-md border border-[#343B4F] bg-[#0D0D14] px-3 py-2 text-white placeholder-gray-500 focus:border-[#6B5EFF] focus:outline-none focus:ring-1 focus:ring-[#6B5EFF]"
                  />
                  <p className="mt-1 text-xs text-gray-400">
                    Contact to notify in case of issues during key revocation
                  </p>
                </div>

                <div className="rounded-lg bg-[#9A2D3F]/20 p-4 border border-[#FF4473]/30">
                  <h3 className="mb-3 font-medium text-[#FF4473]">Confirmation</h3>
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="confirm-revoke"
                      checked={confirmRevoke}
                      onChange={() => setConfirmRevoke(!confirmRevoke)}
                      className="mt-1 h-4 w-4 rounded border-[#343B4F] bg-[#0D0D14] text-[#6B5EFF] focus:ring-[#6B5EFF]"
                    />
                    <label htmlFor="confirm-revoke" className="text-sm text-[#FF4473]">
                      I understand that revoking the old key will permanently disable it and any systems still using it
                      will experience disruption.
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  className="border-[#343B4F] bg-[#1E1E2D] text-white hover:bg-[#2B3B64]"
                  onClick={() => setCurrentStep(4)}
                >
                  Previous Step
                </Button>
                <Button
                  className="bg-[#6B5EFF] px-4 py-2 text-white hover:bg-[#5A4FD9]"
                  onClick={handleCreateWorkflow}
                  disabled={isCreating || !confirmRevoke}
                >
                  {isCreating ? "Creating..." : "Create Workflow"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

// Import the WorkflowProgressTracker component
import { WorkflowProgressTracker } from "@/components/workflow-progress-tracker"
