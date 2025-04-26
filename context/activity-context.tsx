"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { supabase, type DbActivity, getTemporaryUserId } from "@/lib/supabase"

export type ActivityType = "platform_added" | "workflow_created" | "key_rotated" | "workflow_completed"

export interface Activity {
  id: string
  type: ActivityType
  platformId?: string
  platformName: string
  platformIcon: string
  platformColor: string
  keyName?: string
  workflowName?: string
  status: "completed" | "in_progress" | "pending"
  timestamp: number
  date: string
}

type ActivityContextType = {
  activities: Activity[]
  addActivity: (activity: Omit<Activity, "id" | "timestamp" | "date">) => Promise<void>
  getRecentActivities: (limit?: number) => Activity[]
  isLoading: boolean
  error: string | null
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined)

// Helper function to convert database activity to app activity
function dbActivityToAppActivity(dbActivity: DbActivity): Activity {
  return {
    id: dbActivity.id,
    type: dbActivity.type,
    platformId: dbActivity.platform_id || undefined,
    platformName: dbActivity.platform_name,
    platformIcon: dbActivity.platform_icon || "",
    platformColor: dbActivity.platform_color || "",
    keyName: dbActivity.key_name || undefined,
    workflowName: dbActivity.workflow_name || undefined,
    status: dbActivity.status,
    timestamp: new Date(dbActivity.timestamp).getTime(),
    date: dbActivity.date,
  }
}

export function ActivityProvider({ children }: { children: React.ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [initialized, setInitialized] = useState(false)

  // Load activities from Supabase on initial render
  useEffect(() => {
    async function loadActivities() {
      try {
        setIsLoading(true)
        setError(null)

        // Get user ID (temporary or authenticated)
        const userId = await getTemporaryUserId()

        // Fetch activities from Supabase
        const { data, error } = await supabase
          .from("activities")
          .select("*")
          .eq("user_id", userId)
          .order("timestamp", { ascending: false })

        if (error) {
          throw error
        }

        // Convert database activities to app activities
        const appActivities = data.map(dbActivityToAppActivity)
        setActivities(appActivities)
      } catch (err) {
        console.error("Error loading activities:", err)
        setError("Failed to load activities")

        // Fallback to localStorage if available
        try {
          const storedActivities = localStorage.getItem("keystrok-activities")
          if (storedActivities) {
            setActivities(JSON.parse(storedActivities))
          }
        } catch (localErr) {
          console.error("Error loading from localStorage:", localErr)
        }
      } finally {
        setIsLoading(false)
        setInitialized(true)
      }
    }

    loadActivities()
  }, [])

  // Add an activity to Supabase
  const addActivity = async (activity: Omit<Activity, "id" | "timestamp" | "date">) => {
    try {
      setError(null)

      // Get user ID (temporary or authenticated)
      const userId = await getTemporaryUserId()

      // Format date
      const now = new Date()
      const formattedDate = formatDate(now)

      // Convert app activity to database activity
      const dbActivity = {
        type: activity.type,
        platform_id: activity.platformId || null,
        platform_name: activity.platformName,
        platform_icon: activity.platformIcon,
        platform_color: activity.platformColor,
        key_name: activity.keyName || null,
        workflow_name: activity.workflowName || null,
        status: activity.status,
        timestamp: now.toISOString(),
        date: formattedDate,
        user_id: userId,
      }

      // Insert activity into Supabase
      const { data, error } = await supabase.from("activities").insert(dbActivity).select()

      if (error) {
        throw error
      }

      // Convert the returned database activity to app activity
      const newActivity = dbActivityToAppActivity(data[0])

      // Update state
      setActivities((prev) => [newActivity, ...prev])
    } catch (err) {
      console.error("Error adding activity:", err)
      setError("Failed to add activity")

      // Fallback to localStorage approach
      const now = new Date()
      const newActivity = {
        ...activity,
        id: crypto.randomUUID(),
        timestamp: now.getTime(),
        date: formatDate(now),
      }

      setActivities((prev) => {
        const updatedActivities = [newActivity, ...prev]
        try {
          localStorage.setItem("keystrok-activities", JSON.stringify(updatedActivities))
        } catch (localErr) {
          console.error("Error saving to localStorage:", localErr)
        }
        return updatedActivities
      })
    }
  }

  const getRecentActivities = (limit = 5) => {
    return activities.slice(0, limit)
  }

  // Save activities to localStorage as a backup when they change
  useEffect(() => {
    if (initialized) {
      try {
        localStorage.setItem("keystrok-activities", JSON.stringify(activities))
      } catch (error) {
        console.error("Error saving activities to localStorage:", error)
      }
    }
  }, [activities, initialized])

  return (
    <ActivityContext.Provider
      value={{
        activities,
        addActivity,
        getRecentActivities,
        isLoading,
        error,
      }}
    >
      {children}
    </ActivityContext.Provider>
  )
}

export function useActivities() {
  const context = useContext(ActivityContext)
  if (context === undefined) {
    throw new Error("useActivities must be used within an ActivityProvider")
  }
  return context
}

// Helper function to format dates
function formatDate(date: Date): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const month = months[date.getMonth()]
  const day = date.getDate()
  const year = date.getFullYear()
  return `${month} ${day}, ${year}`
}
