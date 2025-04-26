"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"

export function RotationWorkflowsEmptyState() {
  const router = useRouter()
  const [isFromKeyInventory, setIsFromKeyInventory] = useState(false)
  const [selectedKey, setSelectedKey] = useState<any>(null)
  const [autoStartRotation, setAutoStartRotation] = useState(false)

  useEffect(() => {
    // Check if we're coming from key inventory
    const fromKeyInventory = localStorage.getItem("from-key-inventory") === "true"
    setIsFromKeyInventory(fromKeyInventory)

    // Check if we should auto-start rotation
    const shouldAutoStart = localStorage.getItem("auto-start-rotation") === "true"
    setAutoStartRotation(shouldAutoStart)

    // Get the selected key if available
    const keyData = localStorage.getItem("selected-key")
    if (keyData) {
      try {
        setSelectedKey(JSON.parse(keyData))
      } catch (e) {
        console.error("Error parsing key data:", e)
      }
    }

    // Clear the flags after reading them
    if (fromKeyInventory) {
      localStorage.removeItem("from-key-inventory")
    }
    if (shouldAutoStart) {
      localStorage.removeItem("auto-start-rotation")
    }
  }, [])

  // If auto-start is enabled, redirect to create workflow page
  useEffect(() => {
    if (autoStartRotation && selectedKey) {
      // Set a small delay to ensure the UI renders first
      const timer = setTimeout(() => {
        router.push("/rotation-workflows/create")
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [autoStartRotation, selectedKey, router])

  return (
    <div className="flex h-full w-full flex-col items-center justify-center rounded-lg bg-[#171723] p-8 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#2B3B64]">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-[#6B5EFF]"
        >
          <path
            d="M21 7V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V7C3 4 4.5 2 8 2H16C19.5 2 21 4 21 7Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14.5 4.5V6.5C14.5 7.6 15.4 8.5 16.5 8.5H18.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 13H12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 17H16"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2 className="mb-2 text-2xl font-semibold text-white">No Rotation Workflows</h2>
      <p className="mb-8 max-w-md text-gray-400">
        {isFromKeyInventory && selectedKey
          ? `You don't have any rotation workflows for ${selectedKey.name} yet. Create your first workflow to start rotating your keys securely.`
          : "You don't have any rotation workflows yet. Create your first workflow to start rotating your keys securely."}
      </p>
      <Button onClick={() => router.push("/rotation-workflows/create")} className="flex items-center gap-2">
        Create Workflow <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
