import { supabase, getTemporaryUserId } from "./supabase"
import { v4 as uuidv4 } from "uuid"

// Types for our seed data
type PlatformSeed = {
  name: string
  icon: string
  icon_color: string
  rotation_policy: string
  auto_discovery: string
}

type ApiKeySeed = {
  name: string
  description: string
  age_days: number
  risk_level: "Low" | "Medium" | "High"
  status: "Healthy" | "Rotate Now" | "In Progress"
}

type WorkflowSeed = {
  name: string
  subtitle: string
  current_step: number
  total_steps: number
  status: "pending" | "in_progress" | "completed" | "failed"
  days_ago: number
}

// Sample data for seeding
const platformsData: PlatformSeed[] = [
  {
    name: "AWS",
    icon: "A",
    icon_color: "bg-orange-500",
    rotation_policy: "90 days",
    auto_discovery: "Enabled",
  },
  {
    name: "GitHub",
    icon: "G",
    icon_color: "bg-gray-800",
    rotation_policy: "180 days",
    auto_discovery: "Enabled",
  },
  {
    name: "Datadog",
    icon: "D",
    icon_color: "bg-purple-600",
    rotation_policy: "60 days",
    auto_discovery: "Enabled",
  },
  {
    name: "Stripe",
    icon: "S",
    icon_color: "bg-blue-500",
    rotation_policy: "90 days",
    auto_discovery: "Disabled",
  },
  {
    name: "Cloudflare",
    icon: "C",
    icon_color: "bg-amber-500",
    rotation_policy: "30 days",
    auto_discovery: "Enabled",
  },
]

// Function to generate API keys for a platform
function generateApiKeys(platformId: string, userId: string): any[] {
  const keysPerPlatform = Math.floor(Math.random() * 3) + 2 // 2-4 keys per platform
  const keys = []

  const apiKeySeeds: ApiKeySeed[] = [
    {
      name: "Production API Key",
      description: "Used for production environment access",
      age_days: 120,
      risk_level: "Medium",
      status: "Healthy",
    },
    {
      name: "Development API Key",
      description: "Used for development and testing",
      age_days: 45,
      risk_level: "Low",
      status: "Healthy",
    },
    {
      name: "Legacy API Key",
      description: "Deprecated key for legacy systems",
      age_days: 210,
      risk_level: "High",
      status: "Rotate Now",
    },
    {
      name: "Admin API Key",
      description: "Administrative access key",
      age_days: 180,
      risk_level: "High",
      status: "Rotate Now",
    },
    {
      name: "Read-only API Key",
      description: "Limited read-only access",
      age_days: 30,
      risk_level: "Low",
      status: "Healthy",
    },
  ]

  for (let i = 0; i < keysPerPlatform; i++) {
    const seedKey = apiKeySeeds[i % apiKeySeeds.length]

    // Add some randomness to the age
    const ageVariation = Math.floor(Math.random() * 30) - 15 // -15 to +15 days
    const age = Math.max(1, seedKey.age_days + ageVariation)

    // Determine risk level based on age
    let riskLevel: "Low" | "Medium" | "High" = "Low"
    if (age > 150) riskLevel = "High"
    else if (age > 90) riskLevel = "Medium"

    // Determine status based on risk
    let status: "Healthy" | "Rotate Now" | "In Progress" = "Healthy"
    if (riskLevel === "High") status = "Rotate Now"

    keys.push({
      id: uuidv4(),
      name: `${seedKey.name} ${i + 1}`,
      description: seedKey.description,
      platform_id: platformId,
      created_at: new Date(Date.now() - age * 24 * 60 * 60 * 1000).toISOString(),
      last_used: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000).toISOString(),
      key_hash: `hash_${platformId}_${i}`,
      age_days: age,
      risk_level: riskLevel,
      status: status,
      user_id: userId,
    })
  }

  return keys
}

// Function to generate workflows for API keys
function generateWorkflows(apiKeys: any[], userId: string): any[] {
  const workflows = []
  const workflowSeeds: WorkflowSeed[] = [
    {
      name: "Standard Key Rotation",
      subtitle: "Regular scheduled rotation",
      current_step: 3,
      total_steps: 5,
      status: "in_progress",
      days_ago: 2,
    },
    {
      name: "Emergency Key Rotation",
      subtitle: "Security incident response",
      current_step: 5,
      total_steps: 5,
      status: "completed",
      days_ago: 5,
    },
    {
      name: "New Service Integration",
      subtitle: "Setting up initial keys",
      current_step: 1,
      total_steps: 3,
      status: "pending",
      days_ago: 0,
    },
  ]

  // Create workflows for some of the keys (not all)
  for (let i = 0; i < apiKeys.length; i++) {
    if (i % 3 === 0) {
      // Create workflow for every third key
      const key = apiKeys[i]
      const seedWorkflow = workflowSeeds[i % workflowSeeds.length]

      workflows.push({
        id: uuidv4(),
        name: seedWorkflow.name,
        subtitle: seedWorkflow.subtitle,
        api_key_id: key.id,
        current_step: seedWorkflow.current_step,
        total_steps: seedWorkflow.total_steps,
        started_at: new Date(Date.now() - seedWorkflow.days_ago * 24 * 60 * 60 * 1000).toISOString(),
        estimated_completion: new Date(
          Date.now() + (seedWorkflow.status !== "completed" ? 3 : 0) * 24 * 60 * 60 * 1000,
        ).toISOString(),
        status: seedWorkflow.status,
        user_id: userId,
        created_at: new Date(Date.now() - seedWorkflow.days_ago * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      })
    }
  }

  return workflows
}

// Function to generate workflow steps
function generateWorkflowSteps(workflows: any[]): any[] {
  const steps = []

  for (const workflow of workflows) {
    for (let i = 1; i <= workflow.total_steps; i++) {
      let status = "pending"
      if (i < workflow.current_step) status = "completed"
      else if (i === workflow.current_step) status = "current"

      steps.push({
        id: uuidv4(),
        workflow_id: workflow.id,
        step_number: i,
        name: getStepName(i, workflow.total_steps),
        status: status,
        completed_at:
          status === "completed"
            ? new Date(Date.now() - (workflow.current_step - i) * 24 * 60 * 60 * 1000).toISOString()
            : null,
        created_at: new Date().toISOString(),
      })
    }
  }

  return steps
}

// Helper to get step names
function getStepName(stepNumber: number, totalSteps: number): string {
  const commonSteps = [
    "Generate new key",
    "Update services",
    "Verify functionality",
    "Deactivate old key",
    "Archive and document",
  ]

  if (totalSteps <= commonSteps.length) {
    return commonSteps[stepNumber - 1]
  } else {
    // For workflows with more steps than we have names for
    return `Step ${stepNumber}`
  }
}

// Function to generate activities
function generateActivities(platforms: any[], apiKeys: any[], workflows: any[], userId: string): any[] {
  const activities = []
  const now = Date.now()
  const dayInMs = 24 * 60 * 60 * 1000

  // Platform added activities
  for (const platform of platforms) {
    const daysAgo = Math.floor(Math.random() * 30)
    const date = new Date(now - daysAgo * dayInMs)

    activities.push({
      id: uuidv4(),
      type: "platform_added",
      platform_id: platform.id,
      platform_name: platform.name,
      platform_icon: platform.icon,
      platform_color: platform.icon_color,
      status: "completed",
      timestamp: date.toISOString(),
      date: formatDate(date),
      user_id: userId,
    })
  }

  // Key rotated activities
  for (const key of apiKeys) {
    if (Math.random() > 0.7) {
      // Only create rotation activities for some keys
      const daysAgo = Math.floor(Math.random() * 20)
      const date = new Date(now - daysAgo * dayInMs)

      // Find the platform for this key
      const platform = platforms.find((p) => p.id === key.platform_id)

      activities.push({
        id: uuidv4(),
        type: "key_rotated",
        platform_id: platform.id,
        platform_name: platform.name,
        platform_icon: platform.icon,
        platform_color: platform.icon_color,
        key_name: key.name,
        status: "completed",
        timestamp: date.toISOString(),
        date: formatDate(date),
        user_id: userId,
      })
    }
  }

  // Workflow activities
  for (const workflow of workflows) {
    const key = apiKeys.find((k) => k.id === workflow.api_key_id)
    const platform = platforms.find((p) => p.id === key.platform_id)

    activities.push({
      id: uuidv4(),
      type: "workflow_created",
      platform_id: platform.id,
      platform_name: platform.name,
      platform_icon: platform.icon,
      platform_color: platform.icon_color,
      key_name: key.name,
      workflow_name: workflow.name,
      status: workflow.status,
      timestamp: workflow.created_at,
      date: formatDate(new Date(workflow.created_at)),
      user_id: userId,
    })

    if (workflow.status === "completed") {
      const completionDate = new Date(workflow.updated_at)

      activities.push({
        id: uuidv4(),
        type: "workflow_completed",
        platform_id: platform.id,
        platform_name: platform.name,
        platform_icon: platform.icon,
        platform_color: platform.icon_color,
        key_name: key.name,
        workflow_name: workflow.name,
        status: "completed",
        timestamp: completionDate.toISOString(),
        date: formatDate(completionDate),
        user_id: userId,
      })
    }
  }

  return activities
}

// Helper function to format dates
function formatDate(date: Date): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const month = months[date.getMonth()]
  const day = date.getDate()
  const year = date.getFullYear()
  return `${month} ${day}, ${year}`
}

// Function to generate security policies
function generateSecurityPolicies(userId: string): any[] {
  return [
    {
      id: uuidv4(),
      name: "90-Day Rotation Policy",
      description: "All API keys must be rotated every 90 days",
      is_active: true,
      user_id: userId,
      created_at: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      name: "Immediate Rotation on Compromise",
      description: "Keys must be rotated immediately if compromise is suspected",
      is_active: true,
      user_id: userId,
      created_at: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      name: "Least Privilege Access",
      description: "API keys should have the minimum permissions necessary",
      is_active: true,
      user_id: userId,
      created_at: new Date().toISOString(),
    },
  ]
}

// Main seeding function
export async function seedKeystrokDatabase(): Promise<{ success: boolean; message: string }> {
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

    // 1. Insert platforms
    const platforms = platformsData.map((platform) => ({
      id: uuidv4(),
      name: platform.name,
      icon: platform.icon,
      icon_color: platform.icon_color,
      status: "Connected",
      api_keys_count: 0,
      admin_permissions: "Full Access",
      last_sync: new Date().toISOString(),
      rotation_policy: platform.rotation_policy,
      auto_discovery: platform.auto_discovery,
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))

    const { error: platformError } = await supabase.from("platforms").insert(platforms)
    if (platformError) throw platformError

    // 2. Insert API keys
    let allApiKeys: any[] = []
    for (const platform of platforms) {
      const platformKeys = generateApiKeys(platform.id, userId)
      allApiKeys = [...allApiKeys, ...platformKeys]

      // Update platform API key count
      await supabase.from("platforms").update({ api_keys_count: platformKeys.length }).eq("id", platform.id)
    }

    const { error: keysError } = await supabase.from("api_keys").insert(allApiKeys)
    if (keysError) throw keysError

    // 3. Insert workflows
    const workflows = generateWorkflows(allApiKeys, userId)
    const { error: workflowsError } = await supabase.from("rotation_workflows").insert(workflows)
    if (workflowsError) throw workflowsError

    // 4. Insert workflow steps
    const steps = generateWorkflowSteps(workflows)
    const { error: stepsError } = await supabase.from("workflow_steps").insert(steps)
    if (stepsError) throw stepsError

    // 5. Insert activities
    const activities = generateActivities(platforms, allApiKeys, workflows, userId)
    const { error: activitiesError } = await supabase.from("activities").insert(activities)
    if (activitiesError) throw activitiesError

    // 6. Insert security policies
    const policies = generateSecurityPolicies(userId)
    const { error: policiesError } = await supabase.from("security_policies").insert(policies)
    if (policiesError) throw policiesError

    return {
      success: true,
      message: `Database seeded successfully with ${platforms.length} platforms, ${allApiKeys.length} API keys, ${workflows.length} workflows, and ${activities.length} activities`,
    }
  } catch (error) {
    console.error("Error seeding database:", error)
    return {
      success: false,
      message: `Failed to seed database: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}
