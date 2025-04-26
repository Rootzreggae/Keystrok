"use server"

import { supabase, getTemporaryUserId } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export type ApiKey = {
  id: string
  name: string
  description: string
  platform: string
  platformId: string
  platformColor: string
  created: string
  lastUsed: string
  age: string
  risk: "Low" | "Medium" | "High"
  status: "Healthy" | "Rotate Now" | "In Progress"
}

export async function getApiKeys() {
  try {
    const userId = await getTemporaryUserId()

    // Join api_keys with platforms to get platform details
    const { data, error } = await supabase
      .from("api_keys")
      .select(`
        *,
        platforms:platform_id (
          name,
          icon_color
        )
      `)
      .eq("user_id", userId)

    if (error) {
      throw error
    }

    // Transform the data to match the ApiKey type
    return data.map((key) => ({
      id: key.id,
      name: key.name,
      description: key.description || "",
      platform: key.platforms.name,
      platformId: key.platform_id,
      platformColor: key.platforms.icon_color,
      created: new Date(key.created_at).toLocaleDateString(),
      lastUsed: key.last_used ? new Date(key.last_used).toLocaleDateString() : "Never",
      age: `${key.age_days || 0}d`,
      risk: key.risk_level || "Low",
      status: key.status || "Healthy",
    }))
  } catch (error) {
    console.error("Error fetching API keys:", error)
    return []
  }
}

// Get API keys for a specific platform
export async function getApiKeysForPlatform(platformId: string): Promise<ApiKey[]> {
  try {
    const userId = await getTemporaryUserId()

    const { data, error } = await supabase
      .from("api_keys")
      .select(`
        *,
        platforms (
          name
        )
      `)
      .eq("platform_id", platformId)
      .eq("user_id", userId)

    if (error) {
      throw error
    }

    return data.map((key) => ({
      id: key.id,
      name: key.name,
      description: key.description || "",
      platformId: key.platform_id,
      platformName: key.platforms?.name || "Unknown Platform",
      createdAt: key.created_at,
      lastUsed: key.last_used,
      ageDays: key.age_days || 0,
      riskLevel: key.risk_level || "Low",
      status: key.status || "Healthy",
    }))
  } catch (error) {
    console.error("Error fetching API keys for platform:", error)
    throw new Error("Failed to fetch API keys for platform")
  }
}

export async function addApiKey(key: {
  name: string
  description?: string
  platformId: string
  riskLevel?: "Low" | "Medium" | "High"
  status?: "Healthy" | "Rotate Now" | "In Progress"
}) {
  try {
    const userId = await getTemporaryUserId()

    // Calculate age in days (random for demo purposes)
    const ageDays = Math.floor(Math.random() * 200)

    // Determine risk level based on age if not provided
    let riskLevel = key.riskLevel
    if (!riskLevel) {
      if (ageDays > 180) {
        riskLevel = "High"
      } else if (ageDays > 90) {
        riskLevel = "Medium"
      } else {
        riskLevel = "Low"
      }
    }

    // Determine status based on risk level if not provided
    let status = key.status
    if (!status) {
      if (riskLevel === "High") {
        status = "Rotate Now"
      } else if (riskLevel === "Medium") {
        status = "In Progress"
      } else {
        status = "Healthy"
      }
    }

    // Insert the new API key
    const { data, error } = await supabase
      .from("api_keys")
      .insert({
        name: key.name,
        description: key.description || null,
        platform_id: key.platformId,
        user_id: userId,
        age_days: ageDays,
        risk_level: riskLevel,
        status: status,
        created_at: new Date().toISOString(),
      })
      .select()

    if (error) {
      throw error
    }

    // Update the platform's API key count
    await supabase.rpc("increment_api_key_count", { platform_id: key.platformId })

    // Revalidate the key inventory page
    revalidatePath("/key-inventory")

    return data[0].id
  } catch (error) {
    console.error("Error adding API key:", error)
    throw error
  }
}

export async function updateApiKey(
  keyId: string,
  updates: {
    name?: string
    description?: string
    riskLevel?: "Low" | "Medium" | "High"
    status?: "Healthy" | "Rotate Now" | "In Progress"
  },
) {
  try {
    // Prepare the update object
    const updateData: Record<string, any> = {}

    if (updates.name) updateData.name = updates.name
    if (updates.description !== undefined) updateData.description = updates.description
    if (updates.riskLevel) updateData.risk_level = updates.riskLevel
    if (updates.status) updateData.status = updates.status

    // Update the API key
    const { error } = await supabase.from("api_keys").update(updateData).eq("id", keyId)

    if (error) {
      throw error
    }

    // Revalidate the key inventory page
    revalidatePath("/key-inventory")

    return true
  } catch (error) {
    console.error("Error updating API key:", error)
    throw error
  }
}

export async function deleteApiKey(keyId: string, platformId: string) {
  try {
    // Delete the API key
    const { error } = await supabase.from("api_keys").delete().eq("id", keyId)

    if (error) {
      throw error
    }

    // Decrement the platform's API key count
    await supabase.rpc("decrement_api_key_count", { platform_id: platformId })

    // Revalidate the key inventory page
    revalidatePath("/key-inventory")

    return true
  } catch (error) {
    console.error("Error deleting API key:", error)
    throw error
  }
}

// Create a stored procedure in Supabase to increment API key count
// This would be executed in the Supabase SQL editor:
/*
CREATE OR REPLACE FUNCTION increment_api_key_count(platform_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE platforms
  SET api_keys_count = api_keys_count + 1
  WHERE id = platform_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_api_key_count(platform_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE platforms
  SET api_keys_count = GREATEST(0, api_keys_count - 1)
  WHERE id = platform_id;
END;
$$ LANGUAGE plpgsql;
*/
