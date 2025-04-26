"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { getApiKeys, addApiKey, updateApiKey, deleteApiKey, type ApiKey } from "@/app/actions/api-keys"
import { usePlatforms } from "@/context/platform-context"
import { useActivities } from "@/context/activity-context-db"

export function KeyInventoryWithDb() {
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedKeyId, setSelectedKeyId] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const { platforms } = usePlatforms()
  const { addActivity } = useActivities()

  // Load API keys on initial render
  useEffect(() => {
    async function loadKeys() {
      try {
        setIsLoading(true)
        setError(null)
        const apiKeys = await getApiKeys()
        setKeys(apiKeys)
      } catch (err) {
        console.error("Error loading API keys:", err)
        setError("Failed to load API keys")
      } finally {
        setIsLoading(false)
      }
    }

    loadKeys()
  }, [])

  // Add a test API key
  const handleAddTestKey = async () => {
    if (platforms.length === 0) {
      setError("No platforms available. Please add a platform first.")
      return
    }

    try {
      setError(null)
      const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)]

      const keyId = await addApiKey({
        name: `Test Key ${Math.floor(Math.random() * 1000)}`,
        description: "Created for testing",
        platformId: randomPlatform.id,
      })

      // Refresh the keys list
      const updatedKeys = await getApiKeys()
      setKeys(updatedKeys)
    } catch (err) {
      console.error("Error adding test key:", err)
      setError("Failed to add test key")
    }
  }

  // Toggle risk level for a key
  const handleToggleRisk = async (key: ApiKey) => {
    try {
      setError(null)
      const riskLevels: ("Low" | "Medium" | "High")[] = ["Low", "Medium", "High"]
      const currentIndex = riskLevels.indexOf(key.risk)
      const newRisk = riskLevels[(currentIndex + 1) % riskLevels.length]

      await updateApiKey(key.id, { riskLevel: newRisk })

      // Update the local state
      setKeys(keys.map((k) => (k.id === key.id ? { ...k, risk: newRisk } : k)))
    } catch (err) {
      console.error("Error updating key risk:", err)
      setError("Failed to update key risk")
    }
  }

  // Delete a key
  const handleDeleteKey = async (key: ApiKey) => {
    try {
      setError(null)
      await deleteApiKey(key.id, key.platformId)

      // Update the local state
      setKeys(keys.filter((k) => k.id !== key.id))
    } catch (err) {
      console.error("Error deleting key:", err)
      setError("Failed to delete key")
    }
  }

  if (isLoading) {
    return <div className="p-4 text-white">Loading API keys...</div>
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">API Keys from Database</h2>
        <Button onClick={handleAddTestKey}>Add Test Key</Button>
      </div>

      {error && <div className="rounded-md bg-red-900/20 p-3 text-red-500">{error}</div>}

      {keys.length === 0 ? (
        <div className="rounded-md bg-gray-800 p-4 text-center text-gray-400">
          No API keys found. Add a test key to get started.
        </div>
      ) : (
        <div className="space-y-2">
          {keys.map((key) => (
            <div key={key.id} className="flex items-center justify-between rounded-md bg-gray-800 p-4">
              <div>
                <div className="font-medium text-white">{key.name}</div>
                <div className="text-sm text-gray-400">
                  Platform: {key.platform} | Risk: {key.risk} | Age: {key.age}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={() => handleToggleRisk(key)}>
                  Toggle Risk
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDeleteKey(key)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
