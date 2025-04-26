"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { usePlatforms } from "@/context/platform-context"
import { useActivities } from "@/context/activity-context"

// Update the Platform type to include 'custom'
type Platform = "datadog" | "grafana" | "newrelic" | "custom"

interface AddPlatformFormProps {
  onSuccess?: () => void
}

export function AddPlatformForm({ onSuccess }: AddPlatformFormProps) {
  const { addPlatform } = usePlatforms()
  const { addActivity } = useActivities()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData(e.currentTarget)
      const name = formData.get("name") as string
      const icon = formData.get("icon") as string
      const iconColor = formData.get("iconColor") as string

      // Create a new platform
      const platformId = await addPlatform({
        name,
        icon,
        iconColor,
        status: "Connected",
        apiKeys: 0,
        adminPermissions: "Full Access",
        lastSync: new Date().toISOString(),
        rotationPolicy: "90 Days",
        autoDiscovery: "Enabled",
      })

      // Add an activity for the new platform
      await addActivity({
        type: "platform_added",
        platformId,
        platformName: name,
        platformIcon: icon,
        platformColor: iconColor,
        status: "completed",
      })

      // Navigate or call onSuccess
      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/platform-settings")
      }
    } catch (err) {
      console.error("Error adding platform:", err)
      setError("Failed to add platform. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-white">
            Platform Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="mt-1 block w-full rounded-md border border-[#343B4F] bg-[#0D0D14] px-3 py-2 text-white placeholder-gray-500 focus:border-[#6B5EFF] focus:outline-none focus:ring-1 focus:ring-[#6B5EFF]"
            placeholder="e.g., Datadog"
          />
        </div>

        <div>
          <label htmlFor="icon" className="block text-sm font-medium text-white">
            Icon (emoji or text)
          </label>
          <input
            type="text"
            id="icon"
            name="icon"
            required
            maxLength={2}
            className="mt-1 block w-full rounded-md border border-[#343B4F] bg-[#0D0D14] px-3 py-2 text-white placeholder-gray-500 focus:border-[#6B5EFF] focus:outline-none focus:ring-1 focus:ring-[#6B5EFF]"
            placeholder="e.g., 🐶 or DD"
          />
        </div>

        <div>
          <label htmlFor="iconColor" className="block text-sm font-medium text-white">
            Icon Background Color
          </label>
          <select
            id="iconColor"
            name="iconColor"
            required
            className="mt-1 block w-full rounded-md border border-[#343B4F] bg-[#0D0D14] px-3 py-2 text-white focus:border-[#6B5EFF] focus:outline-none focus:ring-1 focus:ring-[#6B5EFF]"
          >
            <option value="bg-blue-500">Blue</option>
            <option value="bg-purple-500">Purple</option>
            <option value="bg-green-500">Green</option>
            <option value="bg-red-500">Red</option>
            <option value="bg-orange-500">Orange</option>
            <option value="bg-pink-500">Pink</option>
          </select>
        </div>
      </div>

      {error && <div className="text-sm text-red-500">{error}</div>}

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="border-[#343B4F] bg-transparent text-white hover:bg-[#343B4F]/30"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding Platform..." : "Add Platform"}
        </Button>
      </div>
    </form>
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
      className={`flex items-center gap-4 rounded-lg border ${
        selected ? "border-[#6B5EFF] bg-[#171723]" : "border-[#4B4B58] bg-transparent"
      } p-4 transition-all hover:border-[#6B5EFF]`}
    >
      <div className={`flex h-10 w-10 items-center justify-center rounded-full text-white ${iconColor}`}>
        <span className="text-lg font-medium">{icon}</span>
      </div>
      <span className="text-lg font-medium text-white">{name}</span>
      <div className="ml-auto">
        <div
          className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
            selected ? "border-[#6B5EFF] bg-transparent" : "border-[#4B4B58] bg-transparent"
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
        enabled ? "bg-[#4B7BEC]" : "bg-[#4B4B58]"
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
