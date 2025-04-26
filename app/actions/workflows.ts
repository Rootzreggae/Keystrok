"use server"

import { supabase, getTemporaryUserId } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export type Workflow = {
  id: string
  name: string
  subtitle?: string
  apiKeyId: string
  apiKeyName: string
  platformName: string
  platformColor: string
  currentStep: number
  totalSteps: number
  startedAt: string
  estimatedCompletion?: string
  status: "pending" | "in_progress" | "completed" | "failed"
}

export async function getWorkflows() {
  try {
    const userId = await getTemporaryUserId()

    // Join workflows with api_keys and platforms
    const { data, error } = await supabase
      .from("rotation_workflows")
      .select(`
        *,
        api_keys:api_key_id (
          name,
          platform_id,
          platforms:platform_id (
            name,
            icon_color
          )
        )
      `)
      .eq("user_id", userId)

    if (error) {
      throw error
    }

    // Transform the data to match the Workflow type
    return data.map((workflow) => ({
      id: workflow.id,
      name: workflow.name,
      subtitle: workflow.subtitle || undefined,
      apiKeyId: workflow.api_key_id,
      apiKeyName: workflow.api_keys.name,
      platformName: workflow.api_keys.platforms.name,
      platformColor: workflow.api_keys.platforms.icon_color,
      currentStep: workflow.current_step,
      totalSteps: workflow.total_steps,
      startedAt: new Date(workflow.started_at).toLocaleDateString(),
      estimatedCompletion: workflow.estimated_completion
        ? new Date(workflow.estimated_completion).toLocaleDateString()
        : undefined,
      status: workflow.status,
    }))
  } catch (error) {
    console.error("Error fetching workflows:", error)
    return []
  }
}

export async function getWorkflowById(id: string) {
  try {
    // Get the workflow with related data
    const { data, error } = await supabase
      .from("rotation_workflows")
      .select(`
        *,
        api_keys:api_key_id (
          name,
          platform_id,
          platforms:platform_id (
            name,
            icon_color
          )
        ),
        workflow_steps:workflow_steps (*)
      `)
      .eq("id", id)
      .single()

    if (error) {
      throw error
    }

    // Transform the workflow data
    return {
      id: data.id,
      name: data.name,
      subtitle: data.subtitle || undefined,
      apiKeyId: data.api_key_id,
      apiKeyName: data.api_keys.name,
      platformName: data.api_keys.platforms.name,
      platformColor: data.api_keys.platforms.icon_color,
      currentStep: data.current_step,
      totalSteps: data.total_steps,
      startedAt: new Date(data.started_at).toLocaleDateString(),
      estimatedCompletion: data.estimated_completion
        ? new Date(data.estimated_completion).toLocaleDateString()
        : undefined,
      status: data.status,
      steps: data.workflow_steps.map((step) => ({
        id: step.id,
        stepNumber: step.step_number,
        name: step.name,
        status: step.status,
        completedAt: step.completed_at ? new Date(step.completed_at).toLocaleDateString() : undefined,
      })),
    }
  } catch (error) {
    console.error("Error fetching workflow:", error)
    return null
  }
}

export async function createWorkflow(workflow: {
  name: string
  subtitle?: string
  apiKeyId: string
  totalSteps?: number
  steps?: { name: string }[]
}) {
  try {
    const userId = await getTemporaryUserId()

    // Calculate estimated completion (7 days from now for demo)
    const estimatedCompletion = new Date()
    estimatedCompletion.setDate(estimatedCompletion.getDate() + 7)

    // Create the workflow
    const { data, error } = await supabase
      .from("rotation_workflows")
      .insert({
        name: workflow.name,
        subtitle: workflow.subtitle || null,
        api_key_id: workflow.apiKeyId,
        total_steps: workflow.totalSteps || 5,
        current_step: 1,
        started_at: new Date().toISOString(),
        estimated_completion: estimatedCompletion.toISOString(),
        status: "in_progress",
        user_id: userId,
      })
      .select()

    if (error) {
      throw error
    }

    const workflowId = data[0].id

    // Create the workflow steps
    const steps = workflow.steps || [
      { name: "Generate new API key" },
      { name: "Update applications" },
      { name: "Test new key" },
      { name: "Disable old key" },
      { name: "Verify and complete" },
    ]

    const stepsData = steps.map((step, index) => ({
      workflow_id: workflowId,
      step_number: index + 1,
      name: step.name,
      status: index === 0 ? "current" : "pending",
    }))

    const { error: stepsError } = await supabase.from("workflow_steps").insert(stepsData)

    if (stepsError) {
      throw stepsError
    }

    // Update the API key status
    await supabase.from("api_keys").update({ status: "In Progress" }).eq("id", workflow.apiKeyId)

    // Revalidate the workflows page
    revalidatePath("/rotation-workflows")

    return workflowId
  } catch (error) {
    console.error("Error creating workflow:", error)
    throw error
  }
}

export async function updateWorkflowStep(workflowId: string, stepNumber: number, completed: boolean) {
  try {
    // Get the workflow
    const { data: workflow, error: workflowError } = await supabase
      .from("rotation_workflows")
      .select("*")
      .eq("id", workflowId)
      .single()

    if (workflowError) {
      throw workflowError
    }

    // Update the current step
    const { error: stepError } = await supabase
      .from("workflow_steps")
      .update({
        status: completed ? "completed" : "current",
        completed_at: completed ? new Date().toISOString() : null,
      })
      .eq("workflow_id", workflowId)
      .eq("step_number", stepNumber)

    if (stepError) {
      throw stepError
    }

    // If completed, update the next step to current
    if (completed && stepNumber < workflow.total_steps) {
      await supabase
        .from("workflow_steps")
        .update({ status: "current" })
        .eq("workflow_id", workflowId)
        .eq("step_number", stepNumber + 1)

      // Update the workflow's current step
      await supabase
        .from("rotation_workflows")
        .update({ current_step: stepNumber + 1 })
        .eq("id", workflowId)
    }

    // If this was the last step and it's completed, mark the workflow as completed
    if (completed && stepNumber === workflow.total_steps) {
      await supabase.from("rotation_workflows").update({ status: "completed" }).eq("id", workflowId)

      // Update the API key status
      const { data: apiKey } = await supabase
        .from("rotation_workflows")
        .select("api_key_id")
        .eq("id", workflowId)
        .single()

      if (apiKey) {
        await supabase.from("api_keys").update({ status: "Healthy", risk_level: "Low" }).eq("id", apiKey.api_key_id)
      }
    }

    // Revalidate the workflow page
    revalidatePath(`/rotation-workflows/${workflowId}`)

    return true
  } catch (error) {
    console.error("Error updating workflow step:", error)
    throw error
  }
}
