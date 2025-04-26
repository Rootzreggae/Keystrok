"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  Code,
  Database,
  Globe,
  Settings,
  TestTube,
  Key,
  CheckCircle,
  XCircle,
  AlertCircle,
  Check,
  Lock,
  RotateCw,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { usePlatforms } from "@/context/platform-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

const steps = [
  { id: "basics", name: "Basic Information", icon: Settings },
  { id: "features", name: "Platform Features", icon: Database },
  { id: "api", name: "API Configuration", icon: Code },
  { id: "rotation", name: "Key Rotation", icon: RotateCw },
  { id: "test", name: "Test Integration", icon: TestTube },
  { id: "review", name: "Review & Save", icon: ChevronRight },
]

interface KeyType {
  id: string
  name: string
  description: string
  selected: boolean
}

interface RotationOption {
  id: string
  name: string
  description: string
  selected: boolean
}

export function CustomPlatformWizard() {
  // Update the platformData state to include validation fields
  const [platformData, setPlatformData] = useState({
    name: "",
    description: "",
    icon: "C",
    iconColor: "#6B5EFF",
    website: "",
    features: {
      apiKeys: true,
      secretKeys: true,
      accessTokens: false,
      oauth: false,
      webhooks: false,
      metrics: false,
      logs: false,
      traces: false,
    },
    apiConfig: {
      baseUrl: "",
      authMethod: "api_key",
      headers: "",
      apiKeyLocation: "header",
      apiKeyName: "X-API-Key",
    },
    endpoints: {
      metrics: "",
      logs: "",
      traces: "",
    },
    rotation: {
      supportsRotation: true,
      rotationMethod: "api",
      rotationPeriod: "90",
      autoRevoke: true,
    },
    testStatus: null as null | "success" | "error",
    testMessage: "",
    validation: {
      nameError: "",
      baseUrlError: "",
    },
  })

  const router = useRouter()
  const { addPlatform } = usePlatforms()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(0)

  const [keyTypes, setKeyTypes] = useState<KeyType[]>([
    {
      id: "api-key",
      name: "API Key",
      description: "Standard API authentication key",
      selected: true,
    },
    {
      id: "access-token",
      name: "Access Token",
      description: "OAuth or temporary token",
      selected: false,
    },
    {
      id: "service-account",
      name: "Service Account",
      description: "Account-based authentication",
      selected: false,
    },
  ])

  const [rotationOptions, setRotationOptions] = useState<RotationOption[]>([
    {
      id: "api-rotation",
      name: "Yes, through API",
      description: "Platform has API for key management",
      selected: true,
    },
    {
      id: "no-rotation",
      name: "No, rotation not supported",
      description: "We'll just track expiration dates",
      selected: false,
    },
    {
      id: "manual-rotation",
      name: "Yes, manual process required",
      description: "Our system will guide the user",
      selected: false,
    },
  ])

  const handleChange = (field: string, value: any) => {
    setPlatformData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleFeatureChange = (feature: string, value: boolean) => {
    setPlatformData((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: value,
      },
    }))
  }

  const handleApiConfigChange = (field: string, value: any) => {
    setPlatformData((prev) => ({
      ...prev,
      apiConfig: {
        ...prev.apiConfig,
        [field]: value,
      },
    }))
  }

  const handleRotationConfigChange = (field: string, value: any) => {
    setPlatformData((prev) => ({
      ...prev,
      rotation: {
        ...prev.rotation,
        [field]: value,
      },
    }))
  }

  const handleColorChange = (color: string) => {
    setPlatformData((prev) => ({
      ...prev,
      iconColor: color,
    }))
  }

  // Add validation function before handleNext
  const validateCurrentStep = () => {
    let isValid = true
    const validation = { ...platformData.validation }

    if (currentStep === 0) {
      // Validate name
      if (!platformData.name.trim()) {
        validation.nameError = "Platform name is required"
        isValid = false
      } else {
        validation.nameError = ""
      }
    } else if (currentStep === 2) {
      // Validate API Config
      if (platformData.apiConfig.baseUrl && !isValidUrl(platformData.apiConfig.baseUrl)) {
        validation.baseUrlError = "Please enter a valid URL"
        isValid = false
      } else {
        validation.baseUrlError = ""
      }
    }

    setPlatformData((prev) => ({ ...prev, validation }))
    return isValid
  }

  // Add URL validation helper
  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  // Update handleNext to include validation
  const handleNext = () => {
    if (currentStep === 1 || currentStep === 0 || currentStep === 2 || currentStep === 3) {
      if (validateCurrentStep() && currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
      }
    } else {
      console.log(
        "Selected key types:",
        keyTypes.filter((kt) => kt.selected),
      )
      console.log(
        "Selected rotation option:",
        rotationOptions.find((ro) => ro.selected),
      )
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleCancel = () => {
    router.push("/platform-settings")
  }

  const handleTestIntegration = () => {
    // Simulate API test
    setTimeout(() => {
      const success = Math.random() > 0.3 // 70% chance of success for demo
      setPlatformData((prev) => ({
        ...prev,
        testStatus: success ? "success" : "error",
        testMessage: success
          ? "Connection successful! API endpoints are accessible."
          : "Connection failed. Please check your API configuration and try again.",
      }))
    }, 1500)
  }

  const handleSave = () => {
    // Create the new platform
    const newPlatform = {
      name: platformData.name,
      icon: platformData.icon,
      iconColor: platformData.iconColor,
      status: "Connected" as const,
      apiKeys: 0,
      adminPermissions: "Full Access",
      lastSync: "Just now",
      rotationPolicy: `${platformData.rotation.rotationPeriod} days`,
      autoDiscovery: "Enabled",
    }

    // Add the platform
    addPlatform(newPlatform)

    // Show success toast
    toast({
      title: "Custom Platform Added",
      description: `${platformData.name} has been successfully added to your platforms.`,
    })

    // Navigate back to platform settings
    router.push("/key-inventory?showDashboard=true")
  }

  const handleKeyTypeSelect = (id: string) => {
    setKeyTypes(
      keyTypes.map((keyType) => ({
        ...keyType,
        selected: keyType.id === id ? !keyType.selected : keyType.selected,
      })),
    )
  }

  const handleRotationOptionSelect = (id: string) => {
    const newRotationOptions = rotationOptions.map((option) => ({
      ...option,
      selected: option.id === id,
    }))

    setRotationOptions(newRotationOptions)

    // Update the rotation config based on selection
    const selectedOption = newRotationOptions.find((option) => option.selected)
    if (selectedOption) {
      setPlatformData((prev) => ({
        ...prev,
        rotation: {
          ...prev.rotation,
          supportsRotation: selectedOption.id !== "no-rotation",
          rotationMethod: selectedOption.id === "api-rotation" ? "api" : "manual",
        },
      }))
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Basic Information
        return (
          <div className="space-y-6">
            {/* In the Basic Information step, display validation errors: */}
            <div className="space-y-2">
              <label htmlFor="platform-name" className="block text-sm text-white">
                Platform Name*
              </label>
              <Input
                id="platform-name"
                value={platformData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={`border-${platformData.validation.nameError ? "red-500" : "[#4B4B58]"} bg-[#0D0D14] text-white focus:border-[#6B5EFF] focus:ring-[#6B5EFF]`}
                placeholder="e.g., Custom API Platform"
                required
              />
              {platformData.validation.nameError && (
                <p className="text-xs text-red-500">{platformData.validation.nameError}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="platform-description" className="block text-sm text-white">
                Description
              </label>
              <Textarea
                id="platform-description"
                value={platformData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="min-h-[100px] border-[#4B4B58] bg-[#0D0D14] text-white focus:border-[#6B5EFF] focus:ring-[#6B5EFF]"
                placeholder="Describe the purpose and use of this platform"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="platform-website" className="block text-sm text-white">
                Website URL
              </label>
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-l-md border border-r-0 border-[#4B4B58] bg-[#1E1E2D]">
                  <Globe className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="platform-website"
                  value={platformData.website}
                  onChange={(e) => handleChange("website", e.target.value)}
                  className="rounded-l-none border-[#4B4B58] bg-[#0D0D14] text-white focus:border-[#6B5EFF] focus:ring-[#6B5EFF]"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-white">Platform Icon</label>
              <div className="flex items-center gap-4">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-md text-xl font-bold text-white"
                  style={{ backgroundColor: platformData.iconColor }}
                >
                  {platformData.icon}
                </div>
                <Input
                  value={platformData.icon}
                  onChange={(e) => handleChange("icon", e.target.value.charAt(0).toUpperCase())}
                  className="w-16 border-[#4B4B58] bg-[#0D0D14] text-center text-white focus:border-[#6B5EFF] focus:ring-[#6B5EFF]"
                  maxLength={1}
                  placeholder="C"
                />
                <div className="flex flex-wrap gap-2">
                  {["#6B5EFF", "#FF5E5E", "#5EFF8F", "#5E8FFF", "#FF8F5E", "#8F5EFF"].map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`h-8 w-8 rounded-full border-2 ${
                        platformData.iconColor === color ? "border-white" : "border-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorChange(color)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 1: // Platform Features
        return (
          <div className="space-y-6">
            <p className="text-sm text-gray-400">
              Select the features supported by this platform. This helps us optimize the key management experience.
            </p>

            {/* In the Platform Features step, add monitoring capabilities: */}
            <div className="space-y-4 rounded-lg bg-[#1E1E2D] p-4">
              <h3 className="mb-2 text-sm font-medium text-white">Authentication</h3>
              <FeatureToggle
                title="API Keys"
                description="Platform uses API keys for authentication"
                enabled={platformData.features.apiKeys}
                onChange={(value) => handleFeatureChange("apiKeys", value)}
              />
              <FeatureToggle
                title="Secret Keys"
                description="Platform uses secret keys for secure operations"
                enabled={platformData.features.secretKeys}
                onChange={(value) => handleFeatureChange("secretKeys", value)}
              />
              <FeatureToggle
                title="Access Tokens"
                description="Platform supports temporary access tokens"
                enabled={platformData.features.accessTokens}
                onChange={(value) => handleFeatureChange("accessTokens", value)}
              />
              <FeatureToggle
                title="OAuth Integration"
                description="Platform supports OAuth 2.0 authentication flow"
                enabled={platformData.features.oauth}
                onChange={(value) => handleFeatureChange("oauth", value)}
              />
              <FeatureToggle
                title="Webhooks"
                description="Platform supports webhook notifications"
                enabled={platformData.features.webhooks}
                onChange={(value) => handleFeatureChange("webhooks", value)}
              />

              <h3 className="mt-6 mb-2 text-sm font-medium text-white">Monitoring Capabilities</h3>
              <FeatureToggle
                title="Metrics"
                description="Platform provides metrics monitoring capabilities"
                enabled={platformData.features.metrics}
                onChange={(value) => handleFeatureChange("metrics", value)}
              />
              <FeatureToggle
                title="Logs"
                description="Platform provides logging capabilities"
                enabled={platformData.features.logs}
                onChange={(value) => handleFeatureChange("logs", value)}
              />
              <FeatureToggle
                title="Traces"
                description="Platform provides distributed tracing capabilities"
                enabled={platformData.features.traces}
                onChange={(value) => handleFeatureChange("traces", value)}
              />
            </div>
          </div>
        )

      case 2: // API Configuration
        return (
          <div className="space-y-6">
            <p className="text-sm text-gray-400">
              Configure the API settings for this platform. This information will be used to connect to the platform's
              API.
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="api-base-url" className="block text-sm text-white">
                  API Base URL*
                </label>
                <Input
                  id="api-base-url"
                  value={platformData.apiConfig.baseUrl}
                  onChange={(e) => handleApiConfigChange("baseUrl", e.target.value)}
                  className="border-[#4B4B58] bg-[#0D0D14] text-white focus:border-[#6B5EFF] focus:ring-[#6B5EFF]"
                  placeholder="https://api.example.com/v1"
                  required
                />
                <p className="text-xs text-gray-400">The base URL for all API requests</p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-white">Authentication Method</label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    className={`flex items-center gap-2 rounded-md border p-3 ${
                      platformData.apiConfig.authMethod === "api_key"
                        ? "border-[#6B5EFF] bg-[#2D2D44]"
                        : "border-[#4B4B58] bg-[#1E1E2D]"
                    }`}
                    onClick={() => handleApiConfigChange("authMethod", "api_key")}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#6B5EFF]/20">
                      <Key className="h-4 w-4 text-[#6B5EFF]" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-white">API Key</div>
                      <div className="text-xs text-gray-400">Use an API key for authentication</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`flex items-center gap-2 rounded-md border p-3 ${
                      platformData.apiConfig.authMethod === "oauth"
                        ? "border-[#6B5EFF] bg-[#2D2D44]"
                        : "border-[#4B4B58] bg-[#1E1E2D]"
                    }`}
                    onClick={() => handleApiConfigChange("authMethod", "oauth")}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#6B5EFF]/20">
                      <Lock className="h-4 w-4 text-[#6B5EFF]" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-white">OAuth 2.0</div>
                      <div className="text-xs text-gray-400">Use OAuth for authentication</div>
                    </div>
                  </button>
                </div>
              </div>

              {platformData.apiConfig.authMethod === "api_key" && (
                <>
                  <div className="space-y-2">
                    <label className="block text-sm text-white">API Key Location</label>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      <button
                        type="button"
                        className={`flex items-center gap-2 rounded-md border p-2 ${
                          platformData.apiConfig.apiKeyLocation === "header"
                            ? "border-[#6B5EFF] bg-[#2D2D44]"
                            : "border-[#4B4B58] bg-[#1E1E2D]"
                        }`}
                        onClick={() => handleApiConfigChange("apiKeyLocation", "header")}
                      >
                        <div className="text-sm font-medium text-white">Header</div>
                      </button>
                      <button
                        type="button"
                        className={`flex items-center gap-2 rounded-md border p-2 ${
                          platformData.apiConfig.apiKeyLocation === "query"
                            ? "border-[#6B5EFF] bg-[#2D2D44]"
                            : "border-[#4B4B58] bg-[#1E1E2D]"
                        }`}
                        onClick={() => handleApiConfigChange("apiKeyLocation", "query")}
                      >
                        <div className="text-sm font-medium text-white">Query Parameter</div>
                      </button>
                      <button
                        type="button"
                        className={`flex items-center gap-2 rounded-md border p-2 ${
                          platformData.apiConfig.apiKeyLocation === "body"
                            ? "border-[#6B5EFF] bg-[#2D2D44]"
                            : "border-[#4B4B58] bg-[#1E1E2D]"
                        }`}
                        onClick={() => handleApiConfigChange("apiKeyLocation", "body")}
                      >
                        <div className="text-sm font-medium text-white">Request Body</div>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="api-key-name" className="block text-sm text-white">
                      API Key Name
                    </label>
                    <Input
                      id="api-key-name"
                      value={platformData.apiConfig.apiKeyName}
                      onChange={(e) => handleApiConfigChange("apiKeyName", e.target.value)}
                      className="border-[#4B4B58] bg-[#0D0D14] text-white focus:border-[#6B5EFF] focus:ring-[#6B5EFF]"
                      placeholder="X-API-Key"
                    />
                    <p className="text-xs text-gray-400">
                      The name of the header, query parameter, or body field for the API key
                    </p>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <label htmlFor="custom-headers" className="block text-sm text-white">
                  Custom Headers (Optional)
                </label>
                <Textarea
                  id="custom-headers"
                  value={platformData.apiConfig.headers}
                  onChange={(e) => handleApiConfigChange("headers", e.target.value)}
                  className="min-h-[100px] border-[#4B4B58] bg-[#0D0D14] text-white focus:border-[#6B5EFF] focus:ring-[#6B5EFF]"
                  placeholder={`Content-Type: application/json\nAccept: application/json`}
                />
                <p className="text-xs text-gray-400">Enter each header on a new line in the format "Key: Value"</p>
              </div>
            </div>

            {/* Add conditional monitoring endpoints in the API Configuration step */}
            {(platformData.features.metrics || platformData.features.logs || platformData.features.traces) && (
              <div className="space-y-4 mt-6">
                <h3 className="text-sm font-medium text-white">Monitoring Endpoints</h3>
                <p className="text-xs text-gray-400">
                  Configure endpoints for each monitoring capability you've enabled
                </p>

                {platformData.features.metrics && (
                  <div className="space-y-2">
                    <label htmlFor="metrics-endpoint" className="block text-sm text-white">
                      Metrics Endpoint
                    </label>
                    <Input
                      id="metrics-endpoint"
                      value={platformData.endpoints.metrics}
                      onChange={(e) =>
                        setPlatformData((prev) => ({
                          ...prev,
                          endpoints: { ...prev.endpoints, metrics: e.target.value },
                        }))
                      }
                      className="border-[#4B4B58] bg-[#0D0D14] text-white focus:border-[#6B5EFF] focus:ring-[#6B5EFF]"
                      placeholder="/api/metrics"
                    />
                  </div>
                )}

                {platformData.features.logs && (
                  <div className="space-y-2">
                    <label htmlFor="logs-endpoint" className="block text-sm text-white">
                      Logs Endpoint
                    </label>
                    <Input
                      id="logs-endpoint"
                      value={platformData.endpoints.logs}
                      onChange={(e) =>
                        setPlatformData((prev) => ({
                          ...prev,
                          endpoints: { ...prev.endpoints, logs: e.target.value },
                        }))
                      }
                      className="border-[#4B4B58] bg-[#0D0D14] text-white focus:border-[#6B5EFF] focus:ring-[#6B5EFF]"
                      placeholder="/api/logs"
                    />
                  </div>
                )}

                {platformData.features.traces && (
                  <div className="space-y-2">
                    <label htmlFor="traces-endpoint" className="block text-sm text-white">
                      Traces Endpoint
                    </label>
                    <Input
                      id="traces-endpoint"
                      value={platformData.endpoints.traces}
                      onChange={(e) =>
                        setPlatformData((prev) => ({
                          ...prev,
                          endpoints: { ...prev.endpoints, traces: e.target.value },
                        }))
                      }
                      className="border-[#4B4B58] bg-[#0D0D14] text-white focus:border-[#6B5EFF] focus:ring-[#6B5EFF]"
                      placeholder="/api/traces"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )

      case 3: // Key Rotation
        return (
          <div className="space-y-6">
            <p className="text-sm text-gray-400">
              Configure how key rotation works for this platform. This information will be used when setting up rotation
              workflows.
            </p>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Key Rotation Support</h3>
              <div className="rounded-lg bg-[#1E1E2D] p-4">
                <p className="mb-4 text-sm text-gray-300">Does this platform support automatic key rotation?</p>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {rotationOptions.map((option) => (
                    <RotationOption
                      key={option.id}
                      name={option.name}
                      description={option.description}
                      selected={option.selected}
                      onClick={() => handleRotationOptionSelect(option.id)}
                    />
                  ))}
                </div>
              </div>

              {platformData.rotation.supportsRotation && (
                <>
                  <div className="space-y-2">
                    <label htmlFor="rotation-period" className="block text-sm text-white">
                      Default Rotation Period
                    </label>
                    <div className="flex">
                      <Input
                        id="rotation-period"
                        type="number"
                        value={platformData.rotation.rotationPeriod}
                        onChange={(e) => handleRotationConfigChange("rotationPeriod", e.target.value)}
                        className="w-32 rounded-l-md border border-[#4B4B58] bg-[#0D0D14] px-3 py-2 text-white focus:border-[#6B5EFF] focus:ring-[#6B5EFF]"
                      />
                      <div className="flex items-center rounded-r-md border border-l-0 border-[#4B4B58] bg-[#0D0D14] px-3 py-2 text-sm text-gray-400">
                        Days
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">Recommended period for rotating keys on this platform</p>
                  </div>

                  {platformData.rotation.rotationMethod === "api" && (
                    <div className="rounded-lg bg-[#1E1E2D] p-4">
                      <h3 className="mb-3 text-sm font-medium text-white">API Rotation Settings</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">Auto-Revoke Old Keys</span>
                          <label className="relative inline-flex cursor-pointer items-center">
                            <input
                              type="checkbox"
                              checked={platformData.rotation.autoRevoke}
                              onChange={() =>
                                handleRotationConfigChange("autoRevoke", !platformData.rotation.autoRevoke)
                              }
                              className="peer sr-only"
                            />
                            <div className="peer h-6 w-11 rounded-full bg-[#343B4F] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#6B5EFF] peer-checked:after:translate-x-full peer-focus:outline-none"></div>
                          </label>
                        </div>
                        <p className="text-xs text-gray-400">
                          When enabled, old keys will be automatically revoked after the new key is verified.
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="rounded-lg bg-[#2B3B64] p-4 flex items-start gap-3 mt-4">
                <Info className="h-5 w-5 text-[#7B9CFF] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#7B9CFF]">
                    <span className="font-medium">Note:</span> These settings will be used as defaults when creating
                    rotation workflows for this platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 4: // Test Integration
        return (
          <div className="space-y-6">
            <p className="text-sm text-gray-400">
              Test the connection to your platform's API to ensure everything is configured correctly.
            </p>

            <div className="rounded-lg bg-[#1E1E2D] p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white">Connection Test</h3>
                  <p className="text-sm text-gray-400">Verify that we can connect to your platform's API</p>
                </div>
                <Button
                  onClick={handleTestIntegration}
                  className="bg-[#6B5EFF] hover:bg-[#5A4FD9]"
                  disabled={platformData.testStatus === "success"}
                >
                  {platformData.testStatus === null
                    ? "Test Connection"
                    : platformData.testStatus === "success"
                      ? "Connection Verified"
                      : "Retry Connection"}
                </Button>
              </div>

              {platformData.testStatus !== null && (
                <div
                  className={`mt-4 rounded-md p-4 ${
                    platformData.testStatus === "success" ? "bg-green-900/20" : "bg-red-900/20"
                  }`}
                >
                  <div className="flex">
                    <div
                      className={`mr-3 flex-shrink-0 ${
                        platformData.testStatus === "success" ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {platformData.testStatus === "success" ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <XCircle className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <h3
                        className={`text-sm font-medium ${
                          platformData.testStatus === "success" ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {platformData.testStatus === "success" ? "Success" : "Error"}
                      </h3>
                      <div className="mt-2 text-sm text-gray-300">{platformData.testMessage}</div>
                      {platformData.testStatus === "error" && (
                        <div className="mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-[#4B4B58] bg-[#23395D] text-white hover:bg-[#2B3B64]"
                            onClick={() => setCurrentStep(2)}
                          >
                            Edit API Configuration
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 space-y-4">
                <div className="rounded-md bg-[#0D0D14] p-4">
                  <h4 className="mb-2 text-sm font-medium text-white">Request Details</h4>
                  <div className="space-y-2 text-xs text-gray-400">
                    <div className="flex">
                      <span className="mr-2 font-medium">URL:</span>
                      <span>{platformData.apiConfig.baseUrl || "https://api.example.com/v1"}/status</span>
                    </div>
                    <div className="flex">
                      <span className="mr-2 font-medium">Method:</span>
                      <span>GET</span>
                    </div>
                    <div className="flex">
                      <span className="mr-2 font-medium">Headers:</span>
                      <span>
                        {platformData.apiConfig.authMethod === "api_key" &&
                          platformData.apiConfig.apiKeyLocation === "header" &&
                          `${platformData.apiConfig.apiKeyName}: [API_KEY]`}
                        {platformData.apiConfig.headers && ", " + platformData.apiConfig.headers}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 5: // Review & Save
        return (
          <div className="space-y-6">
            <p className="text-sm text-gray-400">Review your custom platform configuration before saving.</p>

            <div className="rounded-lg bg-[#1E1E2D] p-6">
              <div className="mb-6 flex items-start gap-4">
                <div
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md text-xl font-bold text-white"
                  style={{ backgroundColor: platformData.iconColor }}
                >
                  {platformData.icon}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">{platformData.name || "Custom Platform"}</h3>
                  <p className="text-sm text-gray-400">{platformData.description || "No description provided"}</p>
                  {platformData.website && (
                    <a
                      href={platformData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center text-xs text-[#6B5EFF] hover:underline"
                    >
                      <Globe className="mr-1 h-3 w-3" />
                      {platformData.website}
                    </a>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 text-sm font-medium text-white">Supported Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(platformData.features)
                      .filter(([_, enabled]) => enabled)
                      .map(([feature]) => (
                        <span
                          key={feature}
                          className="inline-flex items-center rounded-full bg-[#2D2D44] px-2.5 py-0.5 text-xs font-medium text-[#6B5EFF]"
                        >
                          {feature
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())
                            .replace("Api", "API")}
                        </span>
                      ))}
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-medium text-white">API Configuration</h4>
                  <div className="rounded-md bg-[#0D0D14] p-3 text-xs text-gray-400">
                    <div className="mb-1">
                      <span className="font-medium">Base URL:</span> {platformData.apiConfig.baseUrl}
                    </div>
                    <div className="mb-1">
                      <span className="font-medium">Auth Method:</span>{" "}
                      {platformData.apiConfig.authMethod === "api_key" ? "API Key" : "OAuth 2.0"}
                    </div>
                    {platformData.apiConfig.authMethod === "api_key" && (
                      <div className="mb-1">
                        <span className="font-medium">API Key Location:</span>{" "}
                        {platformData.apiConfig.apiKeyLocation.charAt(0).toUpperCase() +
                          platformData.apiConfig.apiKeyLocation.slice(1)}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-medium text-white">Key Rotation</h4>
                  <div className="rounded-md bg-[#0D0D14] p-3 text-xs text-gray-400">
                    <div className="mb-1">
                      <span className="font-medium">Supports Rotation:</span>{" "}
                      {platformData.rotation.supportsRotation ? "Yes" : "No"}
                    </div>
                    {platformData.rotation.supportsRotation && (
                      <>
                        <div className="mb-1">
                          <span className="font-medium">Rotation Method:</span>{" "}
                          {platformData.rotation.rotationMethod === "api" ? "API-Based" : "Manual Process"}
                        </div>
                        <div className="mb-1">
                          <span className="font-medium">Default Period:</span> {platformData.rotation.rotationPeriod}{" "}
                          days
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-medium text-white">Connection Status</h4>
                  <div
                    className={`flex items-center gap-2 rounded-md ${
                      platformData.testStatus === "success"
                        ? "bg-green-900/20 text-green-400"
                        : platformData.testStatus === "error"
                          ? "bg-red-900/20 text-red-400"
                          : "bg-yellow-900/20 text-yellow-400"
                    } px-3 py-2 text-sm`}
                  >
                    {platformData.testStatus === "success" ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span>Connection verified successfully</span>
                      </>
                    ) : platformData.testStatus === "error" ? (
                      <>
                        <XCircle className="h-4 w-4" />
                        <span>Connection test failed</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4" />
                        <span>Connection not tested</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="w-full space-y-8">
      {/* Progress Steps */}
      <nav aria-label="Progress">
        <ol className="flex items-center">
          {steps.map((step, index) => (
            <li
              key={step.id}
              className={`relative flex flex-1 items-center ${index === steps.length - 1 ? "justify-end" : ""}`}
            >
              <span className="flex items-center" aria-current={currentStep === index ? "step" : undefined}>
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                    currentStep === index
                      ? "border-[#6B5EFF] bg-[#6B5EFF] text-white"
                      : index < currentStep
                        ? "border-[#6B5EFF] bg-[#6B5EFF] text-white"
                        : "border-[#4B4B58] bg-transparent text-gray-400"
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <step.icon className="h-4 w-4" aria-hidden="true" />
                  )}
                </span>
                <span
                  className={`ml-2 text-sm font-medium ${
                    currentStep === index ? "text-white" : "text-gray-400"
                  } hidden sm:block`}
                >
                  {step.name}
                </span>
              </span>
              {index < steps.length - 1 && (
                <div
                  className={`ml-2 h-0.5 w-full ${
                    index < currentStep ? "bg-[#6B5EFF]" : "bg-[#4B4B58]"
                  } hidden sm:block`}
                />
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Step Content */}
      <div className="rounded-lg bg-[#171723] p-6">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderStepContent()}
        </motion.div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          className="border-[#4B4B58] bg-[#23395D] text-white hover:bg-[#2B3B64]"
        >
          Cancel
        </Button>
        <div className="flex-1"></div>
        {currentStep > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            className="border-[#4B4B58] bg-[#23395D] text-white hover:bg-[#2B3B64]"
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> Back
          </Button>
        )}
        {currentStep < steps.length - 1 ? (
          <Button type="button" onClick={handleNext} className="bg-[#6B5EFF] hover:bg-[#5A4FD9]">
            Continue <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSave}
            className="bg-[#6B5EFF] hover:bg-[#5A4FD9]"
            disabled={!platformData.name || platformData.testStatus === "error"}
          >
            Save Custom Platform
          </Button>
        )}
      </div>
    </div>
  )
}

interface FeatureToggleProps {
  title: string
  description: string
  enabled: boolean
  onChange: (enabled: boolean) => void
}

function FeatureToggle({ title, description, enabled, onChange }: FeatureToggleProps) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h3 className="text-sm font-medium text-white">{title}</h3>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
      <Switch checked={enabled} onCheckedChange={onChange} />
    </div>
  )
}

interface KeyTypeOptionProps {
  name: string
  description: string
  selected: boolean
  onClick: () => void
}

function KeyTypeOption({ name, description, selected, onClick }: KeyTypeOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-4 rounded-lg border p-4 transition-all ${
        selected ? "border-[#6B5EFF] bg-[#21222D]" : "border-[#343B4F] bg-[#21222D]"
      }`}
    >
      <div className="flex h-6 w-6 items-center justify-center">
        <div
          className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
            selected ? "border-[#6B5EFF]" : "border-[#343B4F]"
          }`}
        >
          {selected && <div className="h-3 w-3 rounded-full bg-[#6B5EFF]"></div>}
        </div>
      </div>
      <div className="flex flex-col text-left">
        <span className="text-base font-medium text-white">{name}</span>
        <span className="text-xs text-gray-400">{description}</span>
      </div>
    </button>
  )
}

interface RotationOptionProps {
  name: string
  description: string
  selected: boolean
  onClick: () => void
}

function RotationOption({ name, description, selected, onClick }: RotationOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-4 rounded-lg border p-4 transition-all ${
        selected ? "border-[#6B5EFF] bg-[#21222D]" : "border-[#343B4F] bg-[#21222D]"
      }`}
    >
      <div className="flex h-6 w-6 items-center justify-center">
        <div
          className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
            selected ? "border-[#6B5EFF]" : "border-[#343B4F]"
          }`}
        >
          {selected && <div className="h-3 w-3 rounded-full bg-[#6B5EFF]"></div>}
        </div>
      </div>
      <div className="flex flex-col text-left">
        <span className="text-base font-medium text-white">{name}</span>
        <span className="text-xs text-gray-400">{description}</span>
      </div>
    </button>
  )
}
