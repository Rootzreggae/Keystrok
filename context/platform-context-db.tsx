"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { supabase, type DbPlatform, getTemporaryUserId } from "@/lib/supabase"

export type Platform = {
  id: string
  name: string
  icon: string
  iconColor: string
  status: "Connected" | "Disconnected"
  apiKeys: number
  adminPermissions: string
  lastSync: string
  rotationPolicy: string
  autoDiscovery: string
}

type PlatformContextType = {
  platforms: Platform[]
  addPlatform: (platform: Omit<Platform, "id">) => Promise<string | undefined>
  removePlatform: (id: string) => Promise<void>
  hasPlatforms: boolean
  getPlatform: (id: string) => Platform | undefined
  lastUpdated: number
  isLoading: boolean
  error: string | null
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined)

// Helper function to convert database platform to app platform
function dbPlatformToAppPlatform(dbPlatform: DbPlatform): Platform {
  return {
    id: dbPlatform.id,
    name: dbPlatform.name,
    icon: dbPlatform.icon,
    iconColor: dbPlatform.icon_color,
    status: dbPlatform.status,
    apiKeys: dbPlatform.api_keys_count,
    adminPermissions: dbPlatform.admin_permissions,
    lastSync: dbPlatform.last_sync,
    rotationPolicy: dbPlatform.rotation_policy,
    autoDiscovery: dbPlatform.auto_discovery,
  }
}

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load platforms from Supabase on initial render
  useEffect(() => {
    async function loadPlatforms() {
      try {
        setIsLoading(true)
        setError(null)

        // Get user ID (temporary or authenticated)
        const userId = await getTemporaryUserId()

        // Fetch platforms from Supabase
        const { data, error } = await supabase.from("platforms").select("*").eq("user_id", userId)

        if (error) {
          throw error
        }

        // Convert database platforms to app platforms
        const appPlatforms = data.map(dbPlatformToAppPlatform)
        setPlatforms(appPlatforms)
      } catch (err) {
        console.error("Error loading platforms:", err)
        setError("Failed to load platforms")

        // Fallback to localStorage if available
        try {
          const storedPlatforms = localStorage.getItem("keystrok-platforms")
          if (storedPlatforms) {
            setPlatforms(JSON.parse(storedPlatforms))
          }
        } catch (localErr) {
          console.error("Error loading from localStorage:", localErr)
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadPlatforms()
  }, [])

  // Add a platform to Supabase
  const addPlatform = async (platform: Omit<Platform, "id">): Promise<string | undefined> => {
    try {
      setError(null)

      // Get user ID (temporary or authenticated)
      const userId = await getTemporaryUserId()

      // Convert app platform to database platform
      const dbPlatform = {
        name: platform.name,
        icon: platform.icon,
        icon_color: platform.iconColor,
        status: platform.status,
        api_keys_count: platform.apiKeys,
        admin_permissions: platform.adminPermissions,
        last_sync: platform.lastSync,
        rotation_policy: platform.rotationPolicy,
        auto_discovery: platform.autoDiscovery,
        user_id: userId,
      }

      // Insert platform into Supabase
      const { data, error } = await supabase.from("platforms").insert(dbPlatform).select()

      if (error) {
        throw error
      }

      // Convert the returned database platform to app platform
      const newPlatform = dbPlatformToAppPlatform(data[0])

      // Update state
      setPlatforms((prevPlatforms) => [...prevPlatforms, newPlatform])
      setLastUpdated(Date.now())

      return newPlatform.id
    } catch (err) {
      console.error("Error adding platform:", err)
      setError("Failed to add platform")

      // Fallback to localStorage approach
      const newPlatform = {
        ...platform,
        id: crypto.randomUUID(),
      }

      setPlatforms((prevPlatforms) => {
        const updatedPlatforms = [...prevPlatforms, newPlatform]
        try {
          localStorage.setItem("keystrok-platforms", JSON.stringify(updatedPlatforms))
        } catch (localErr) {
          console.error("Error saving to localStorage:", localErr)
        }
        return updatedPlatforms
      })

      setLastUpdated(Date.now())
      return newPlatform.id
    }
  }

  // Remove a platform from Supabase
  const removePlatform = async (id: string) => {
    try {
      setError(null)

      // Delete platform from Supabase
      const { error } = await supabase.from("platforms").delete().eq("id", id)

      if (error) {
        throw error
      }

      // Update state
      setPlatforms((prev) => prev.filter((platform) => platform.id !== id))
      setLastUpdated(Date.now())
    } catch (err) {
      console.error("Error removing platform:", err)
      setError("Failed to remove platform")

      // Fallback to localStorage approach
      setPlatforms((prev) => {
        const updatedPlatforms = prev.filter((platform) => platform.id !== id)
        try {
          localStorage.setItem("keystrok-platforms", JSON.stringify(updatedPlatforms))
        } catch (localErr) {
          console.error("Error saving to localStorage:", localErr)
        }
        return updatedPlatforms
      })
    }
  }

  const getPlatform = (id: string) => {
    return platforms.find((platform) => platform.id === id)
  }

  return (
    <PlatformContext.Provider
      value={{
        platforms,
        addPlatform,
        removePlatform,
        hasPlatforms: platforms.length > 0,
        getPlatform,
        lastUpdated,
        isLoading,
        error,
      }}
    >
      {children}
    </PlatformContext.Provider>
  )
}

export function usePlatforms() {
  const context = useContext(PlatformContext)
  if (context === undefined) {
    throw new Error("usePlatforms must be used within a PlatformProvider")
  }
  return context
}
