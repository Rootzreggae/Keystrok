"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export function GlobalSettings() {
  const [warningThreshold, setWarningThreshold] = useState("90")
  const [criticalThreshold, setCriticalThreshold] = useState("90")
  const [transitionPeriod, setTransitionPeriod] = useState("7")
  const [discoverySchedule, setDiscoverySchedule] = useState("Daily at 1:00 AM")

  // Add state for validation errors and saving status
  const [errors, setErrors] = useState({
    warningThreshold: "",
    criticalThreshold: "",
    transitionPeriod: "",
    discoverySchedule: "",
  })
  const [isSaving, setIsSaving] = useState(false)

  // Validation function
  const validateFields = () => {
    const newErrors = {
      warningThreshold: "",
      criticalThreshold: "",
      transitionPeriod: "",
      discoverySchedule: "",
    }

    let isValid = true

    if (!warningThreshold.trim()) {
      newErrors.warningThreshold = "Warning threshold is required"
      isValid = false
    }

    if (!criticalThreshold.trim()) {
      newErrors.criticalThreshold = "Critical threshold is required"
      isValid = false
    }

    if (!transitionPeriod.trim()) {
      newErrors.transitionPeriod = "Transition period is required"
      isValid = false
    }

    if (!discoverySchedule.trim()) {
      newErrors.discoverySchedule = "Discovery schedule is required"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  // Handle save changes
  const handleSaveChanges = () => {
    if (!validateFields()) {
      return
    }

    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Settings saved",
        description: "Your global settings have been updated successfully.",
      })
    }, 1000)
  }

  return (
    <div className="rounded-lg bg-[#171723] p-6">
      <h2 className="mb-6 text-lg font-medium text-white">Global Settings</h2>

      <div className="space-y-6">
        <div>
          <h3 className="mb-4 text-base font-medium text-white">Default Rotations Policies</h3>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="warning-threshold" className="block text-sm text-gray-400">
                Warning Threshold
              </label>
              <div className="flex">
                <input
                  id="warning-threshold"
                  type="text"
                  value={warningThreshold}
                  onChange={(e) => {
                    setWarningThreshold(e.target.value)
                    if (e.target.value.trim()) {
                      setErrors((prev) => ({ ...prev, warningThreshold: "" }))
                    }
                  }}
                  className={`w-32 rounded-l-md border ${errors.warningThreshold ? "border-red-500" : "border-[#343B4F]"} bg-[#1E1E2D] px-3 py-2 text-white placeholder-gray-500 focus:border-[#6B5EFF] focus:outline-none focus:ring-1 focus:ring-[#6B5EFF]`}
                />
                <div className="flex items-center rounded-r-md border border-l-0 border-[#343B4F] bg-[#1E1E2D] px-3 py-2 text-sm text-gray-400">
                  Days
                </div>
              </div>
              {errors.warningThreshold && <p className="text-xs text-red-500 mt-1">{errors.warningThreshold}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="critical-threshold" className="block text-sm text-gray-400">
                Critical Threshold
              </label>
              <div className="flex">
                <input
                  id="critical-threshold"
                  type="text"
                  value={criticalThreshold}
                  onChange={(e) => {
                    setCriticalThreshold(e.target.value)
                    if (e.target.value.trim()) {
                      setErrors((prev) => ({ ...prev, criticalThreshold: "" }))
                    }
                  }}
                  className={`w-32 rounded-l-md border ${errors.criticalThreshold ? "border-red-500" : "border-[#343B4F]"} bg-[#1E1E2D] px-3 py-2 text-white placeholder-gray-500 focus:border-[#6B5EFF] focus:outline-none focus:ring-1 focus:ring-[#6B5EFF]`}
                />
                <div className="flex items-center rounded-r-md border border-l-0 border-[#343B4F] bg-[#1E1E2D] px-3 py-2 text-sm text-gray-400">
                  Days
                </div>
              </div>
              {errors.criticalThreshold && <p className="text-xs text-red-500 mt-1">{errors.criticalThreshold}</p>}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="transition-period" className="block text-sm text-gray-400">
            Default Transition Period
          </label>
          <div className="flex">
            <input
              id="transition-period"
              type="text"
              value={transitionPeriod}
              onChange={(e) => {
                setTransitionPeriod(e.target.value)
                if (e.target.value.trim()) {
                  setErrors((prev) => ({ ...prev, transitionPeriod: "" }))
                }
              }}
              className={`w-32 rounded-l-md border ${errors.transitionPeriod ? "border-red-500" : "border-[#343B4F]"} bg-[#1E1E2D] px-3 py-2 text-white placeholder-gray-500 focus:border-[#6B5EFF] focus:outline-none focus:ring-1 focus:ring-[#6B5EFF]`}
            />
            <div className="flex items-center rounded-r-md border border-l-0 border-[#343B4F] bg-[#1E1E2D] px-3 py-2 text-sm text-gray-400">
              Days
            </div>
          </div>
          {errors.transitionPeriod && <p className="text-xs text-red-500 mt-1">{errors.transitionPeriod}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="discovery-schedule" className="block text-sm text-gray-400">
            Auto-Discovery Schedule
          </label>
          <div className="flex">
            <input
              id="discovery-schedule"
              type="text"
              value={discoverySchedule}
              onChange={(e) => {
                setDiscoverySchedule(e.target.value)
                if (e.target.value.trim()) {
                  setErrors((prev) => ({ ...prev, discoverySchedule: "" }))
                }
                setErrors((prev) => ({ ...prev, discoverySchedule: "" }))
              }}
              className={`w-48 rounded-md border ${errors.discoverySchedule ? "border-red-500" : "border-[#343B4F]"} bg-[#1E1E2D] px-3 py-2 text-white placeholder-gray-500 focus:border-[#6B5EFF] focus:outline-none focus:ring-1 focus:ring-[#6B5EFF]`}
            />
          </div>
          {errors.discoverySchedule && <p className="text-xs text-red-500 mt-1">{errors.discoverySchedule}</p>}
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleSaveChanges}
            disabled={
              isSaving ||
              !warningThreshold.trim() ||
              !criticalThreshold.trim() ||
              !transitionPeriod.trim() ||
              !discoverySchedule.trim()
            }
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
