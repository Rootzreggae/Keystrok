"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { supabase, getTemporaryUserId } from "@/lib/supabase"

export function DatabaseSeeder() {
  const [isSeeding, setIsSeeding] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const seedDatabase = async () => {
    setIsSeeding(true)
    setResult(null)

    try {
      const userId = await getTemporaryUserId()

      // 1. Create platforms
      const platforms = [
        {
          name: "Datadog",
          icon: "🐶",
          icon_color: "bg-purple-500",
          status: "Connected",
          api_keys_count: 0,
          admin_permissions: "Full Access",
          last_sync: new Date().toISOString(),
          rotation_policy: "90 Days",
          auto_discovery: "Enabled",
          user_id: userId,
        },
        {
          name: "GitHub",
          icon: "GH",
          icon_color: "bg-gray-700",
          status: "Connected",
          api_keys_count: 0,
          admin_permissions: "Full Access",
          last_sync: new Date().toISOString(),
          rotation_policy: "180 Days",
          auto_discovery: "Disabled",
          user_id: userId,
        },
        {
          name: "AWS",
          icon: "☁️",
          icon_color: "bg-orange-500",
          status: "Connected",
          api_keys_count: 0,
          admin_permissions: "Limited Access",
          last_sync: new Date().toISOString(),
          rotation_policy: "60 Days",
          auto_discovery: "Enabled",
          user_id: userId,
        },
      ]

      const { data: platformsData, error: platformsError } = await supabase.from("platforms").insert(platforms).select()

      if (platformsError) {
        throw platformsError
      }

      // 2. Create API keys for each platform
      const apiKeys = []
      for (const platform of platformsData) {
        // Create 3 keys per platform with different risk levels
        const keyTypes = [
          { risk: "Low", age: 30, status: "Healthy" },
          { risk: "Medium", age: 120, status: "In Progress" },
          { risk: "High", age: 200, status: "Rotate Now" },
        ]

        for (const keyType of keyTypes) {
          apiKeys.push({
            name: `${platform.name} ${keyType.risk} Risk Key`,
            description: `${keyType.risk} risk API key for ${platform.name}`,
            platform_id: platform.id,
            created_at: new Date(Date.now() - keyType.age * 24 * 60 * 60 * 1000).toISOString(),
            last_used: new Date().toISOString(),
            key_hash: `hash_${crypto.randomUUID()}`,
            age_days: keyType.age,
            risk_level: keyType.risk,
            status: keyType.status,
            user_id: userId,
          })
        }

        // Update platform API key count
        await supabase.from("platforms").update({ api_keys_count: 3 }).eq("id", platform.id)
      }

      const { data: keysData, error: keysError } = await supabase.from("api_keys").insert(apiKeys).select()

      if (keysError) {
        throw keysError
      }

      // 3. Create rotation workflows for some keys
      const workflows = []
      const workflowSteps = []

      // Create a workflow for one key from each platform
      for (let i = 0; i < platformsData.length; i++) {
        const key = keysData[i * 3 + 1] // Use the medium risk key

        const workflow = {
          name: `${platformsData[i].name} Key Rotation`,
          subtitle: `Rotating ${key.name}`,
          api_key_id: key.id,
          current_step: Math.floor(Math.random() * 3) + 1, // Random step between 1-3
          total_steps: 5,
          started_at: new Date(Date.now() - Math.floor(Math.random() * 5) * 24 * 60 * 60 * 1000).toISOString(),
          estimated_completion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: "in_progress",
          user_id: userId,
        }

        workflows.push(workflow)
      }

      const { data: workflowsData, error: workflowsError } = await supabase
        .from("rotation_workflows")
        .insert(workflows)
        .select()

      if (workflowsError) {
        throw workflowsError
      }

      // 4. Create workflow steps
      for (const workflow of workflowsData) {
        const steps = [
          { name: "Generate new API key" },
          { name: "Update applications" },
          { name: "Test new key" },
          { name: "Disable old key" },
          { name: "Verify and complete" },
        ]

        for (let i = 0; i < steps.length; i++) {
          const stepNumber = i + 1
          let status = "pending"
          let completedAt = null

          if (stepNumber < workflow.current_step) {
            status = "completed"
            completedAt = new Date(
              Date.now() - (workflow.current_step - stepNumber) * 24 * 60 * 60 * 1000,
            ).toISOString()
          } else if (stepNumber === workflow.current_step) {
            status = "current"
          }

          workflowSteps.push({
            workflow_id: workflow.id,
            step_number: stepNumber,
            name: steps[i].name,
            status,
            completed_at: completedAt,
            created_at: workflow.started_at,
          })
        }
      }

      const { error: stepsError } = await supabase.from("workflow_steps").insert(workflowSteps)

      if (stepsError) {
        throw stepsError
      }

      // 5. Create activities
      const activities = []

      // Platform added activities
      for (const platform of platformsData) {
        activities.push({
          type: "platform_added",
          platform_id: platform.id,
          platform_name: platform.name,
          platform_icon: platform.icon,
          platform_color: platform.icon_color,
          status: "completed",
          timestamp: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
          date: new Date().toLocaleDateString(),
          user_id: userId,
        })
      }

      // Workflow created activities
      for (let i = 0; i < workflowsData.length; i++) {
        const workflow = workflowsData[i]
        const key = keysData[i * 3 + 1] // The key used for the workflow
        const platform = platformsData[i]

        activities.push({
          type: "workflow_created",
          platform_id: platform.id,
          platform_name: platform.name,
          platform_icon: platform.icon,
          platform_color: platform.icon_color,
          key_name: key.name,
          workflow_name: workflow.name,
          status: "in_progress",
          timestamp: workflow.started_at,
          date: new Date(workflow.started_at).toLocaleDateString(),
          user_id: userId,
        })
      }

      // Add some completed key rotations
      for (let i = 0; i < platformsData.length; i++) {
        const platform = platformsData[i]

        activities.push({
          type: "key_rotated",
          platform_id: platform.id,
          platform_name: platform.name,
          platform_icon: platform.icon,
          platform_color: platform.icon_color,
          key_name: `Old ${platform.name} Key`,
          status: "completed",
          timestamp: new Date(Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000).toISOString(),
          date: new Date().toLocaleDateString(),
          user_id: userId,
        })
      }

      const { error: activitiesError } = await supabase.from("activities").insert(activities)

      if (activitiesError) {
        throw activitiesError
      }

      setResult({
        success: true,
        message: `Database seeded successfully with ${platforms.length} platforms, ${apiKeys.length} API keys, ${workflows.length} workflows, and ${activities.length} activities.`,
      })
    } catch (error) {
      console.error("Error seeding database:", error)
      setResult({
        success: false,
        message: `Failed to seed database: ${error instanceof Error ? error.message : String(error)}`,
      })
    } finally {
      setIsSeeding(false)
    }
  }

  return (
    <div className="space-y-4 rounded-lg bg-gray-800 p-6">
      <h2 className="text-xl font-semibold text-white">Database Seeder</h2>
      <p className="text-gray-400">
        This will populate your database with sample platforms, API keys, workflows, and activities.
      </p>

      <Button onClick={seedDatabase} disabled={isSeeding}>
        {isSeeding ? "Seeding Database..." : "Seed Keystrok Database"}
      </Button>

      {result && (
        <div
          className={`mt-4 rounded-md p-4 ${
            result.success ? "bg-green-900/20 text-green-500" : "bg-red-900/20 text-red-500"
          }`}
        >
          {result.message}
        </div>
      )}
    </div>
  )
}
