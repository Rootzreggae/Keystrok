"use server"

import { supabase, getTemporaryUserId } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function seedDatabase(): Promise<{ success: boolean; message: string }> {
  try {
    const userId = await getTemporaryUserId()

    // Check if we already have data for this user
    const { data: existingPlatforms, error: checkError } = await supabase
      .from("platforms")
      .select("id")
      .eq("user_id", userId)

    if (checkError) {
      throw checkError
    }

    if (existingPlatforms && existingPlatforms.length > 0) {
      return {
        success: true,
        message: "Database already seeded for this user",
      }
    }

    // Create sample platforms
    const platforms = [
      {
        name: "Datadog",
        icon: "D",
        icon_color: "bg-purple-600",
        status: "Connected",
        api_keys_count: 0,
        admin_permissions: "Full Access",
        last_sync: new Date().toISOString(),
        rotation_policy: "180 days",
        auto_discovery: "Enabled",
        user_id: userId,
      },
      {
        name: "Grafana",
        icon: "G",
        icon_color: "bg-orange-500",
        status: "Connected",
        api_keys_count: 0,
        admin_permissions: "Full Access",
        last_sync: new Date().toISOString(),
        rotation_policy: "90 days",
        auto_discovery: "Enabled",
        user_id: userId,
      },
      {
        name: "Custom Platform",
        icon: "C",
        icon_color: "bg-emerald-500",
        status: "Connected",
        api_keys_count: 0,
        admin_permissions: "Full Access",
        last_sync: new Date().toISOString(),
        rotation_policy: "60 days",
        auto_discovery: "Disabled",
        user_id: userId,
      },
    ]

    // Insert platforms
    const { data: platformData, error: platformError } = await supabase.from("platforms").insert(platforms).select()

    if (platformError) {
      throw platformError
    }

    // Create sample API keys for each platform
    const apiKeys = []

    for (const platform of platformData) {
      // Create 3 keys for each platform
      for (let i = 1; i <= 3; i++) {
        const ageDays = Math.floor(Math.random() * 200)
        const riskLevel = ageDays > 150 ? "High" : ageDays > 90 ? "Medium" : "Low"
        const status = ageDays > 150 ? "Rotate Now" : "Healthy"

        apiKeys.push({
          name: `${platform.name} Key ${i}`,
          description: `Sample API key for ${platform.name}`,
          platform_id: platform.id,
          key_hash: `sample_hash_${platform.id}_${i}`,
          age_days: ageDays,
          risk_level: riskLevel,
          status: status,
          user_id: userId,
        })
      }

      // Update the platform's API key count
      await supabase.from("platforms").update({ api_keys_count: 3 }).eq("id", platform.id)
    }

    // Insert API keys
    const { error: keysError } = await supabase.from("api_keys").insert(apiKeys)

    if (keysError) {
      throw keysError
    }

    // Create sample activities
    const activities = [
      {
        type: "platform_added",
        platform_id: platformData[0].id,
        platform_name: platformData[0].name,
        platform_icon: platformData[0].icon,
        platform_color: platformData[0].icon_color,
        status: "completed",
        timestamp: new Date().toISOString(),
        date: formatDate(new Date()),
        user_id: userId,
      },
      {
        type: "platform_added",
        platform_id: platformData[1].id,
        platform_name: platformData[1].name,
        platform_icon: platformData[1].icon,
        platform_color: platformData[1].icon_color,
        status: "completed",
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        date: formatDate(new Date(Date.now() - 86400000)),
        user_id: userId,
      },
      {
        type: "key_rotated",
        platform_id: platformData[0].id,
        platform_name: platformData[0].name,
        platform_icon: platformData[0].icon,
        platform_color: platformData[0].icon_color,
        key_name: `${platformData[0].name} Key 1`,
        status: "completed",
        timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        date: formatDate(new Date(Date.now() - 172800000)),
        user_id: userId,
      },
    ]

    // Insert activities
    const { error: activitiesError } = await supabase.from("activities").insert(activities)

    if (activitiesError) {
      throw activitiesError
    }

    revalidatePath("/key-inventory/database")

    return {
      success: true,
      message: "Database seeded successfully",
    }
  } catch (error) {
    console.error("Error seeding database:", error)
    return {
      success: false,
      message: `Failed to seed database: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}

// Helper function to format dates
function formatDate(date: Date): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const month = months[date.getMonth()]
  const day = date.getDate()
  const year = date.getFullYear()
  return `${month} ${day}, ${year}`
}
