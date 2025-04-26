import { supabase, getTemporaryUserId } from "./supabase"

export async function checkDatabaseSeeded(): Promise<{
  isSeeded: boolean
  counts: {
    platforms: number
    apiKeys: number
    workflows: number
    activities: number
  }
}> {
  try {
    const userId = await getTemporaryUserId()

    // Get counts from each table
    const [platformsResult, keysResult, workflowsResult, activitiesResult] = await Promise.all([
      supabase.from("platforms").select("id", { count: "exact" }).eq("user_id", userId),
      supabase.from("api_keys").select("id", { count: "exact" }).eq("user_id", userId),
      supabase.from("rotation_workflows").select("id", { count: "exact" }).eq("user_id", userId),
      supabase.from("activities").select("id", { count: "exact" }).eq("user_id", userId),
    ])

    const counts = {
      platforms: platformsResult.count || 0,
      apiKeys: keysResult.count || 0,
      workflows: workflowsResult.count || 0,
      activities: activitiesResult.count || 0,
    }

    // Consider the database seeded if we have at least some platforms and keys
    const isSeeded = counts.platforms > 0 && counts.apiKeys > 0

    return {
      isSeeded,
      counts,
    }
  } catch (error) {
    console.error("Error checking database:", error)
    return {
      isSeeded: false,
      counts: {
        platforms: 0,
        apiKeys: 0,
        workflows: 0,
        activities: 0,
      },
    }
  }
}
