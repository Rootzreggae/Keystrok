"use client"

import { useState, useEffect } from "react"

// Mock data for the workflow
const mockWorkflowData = {
  id: "workflow-123",
  name: "Production API Key",
  subtitle: "Rotating Key",
  currentStep: 1,
  totalSteps: 5,
  steps: [
    { id: 1, name: "Preparation", status: "current" },
    { id: 2, name: "Create Key", status: "pending" },
    { id: 3, name: "Update Systems", status: "pending" },
    { id: 4, name: "Verify", status: "pending" },
    { id: 5, name: "Revoke", status: "pending" },
  ],
  startedAt: "April 20, 2025 10:30 AM",
  elapsedTime: "2 minutes",
  estimatedCompletion: "April 27, 2025",
  keyInfo: {
    platform: "Datadog",
    keyType: "API Key",
    keyId: "a1b2c3d4*********",
    created: "Jan 15, 2022",
    age: "395 days",
    lastUsed: "Today, 10:42 AM",
    usage: {
      last30Days: "1,283,405 calls",
      highestDay: "67,493 calls (Apr 18)",
    },
    permissions: "Admin (Full Access)",
  },
  systems: [
    { name: "Production Kubernetes Cluster", color: "#6B5EFF" },
    { name: "CI/CD Pipeline (Jenkins)", color: "#6B5EFF" },
    { name: "Monitoring Dashboard", color: "#6B5EFF" },
  ],
  usageData: [
    { date: "Apr 1", value: 35000 },
    { date: "Apr 5", value: 38000 },
    { date: "Apr 10", value: 42000 },
    { date: "Apr 15", value: 40000 },
    { date: "Apr 20", value: 45000 },
    { date: "Apr 25", value: 48000 },
    { date: "Apr 30", value: 52000 },
  ],
}

export function useWorkflowData(workflowId: string) {
  const [isLoading, setIsLoading] = useState(true)
  const [workflowData, setWorkflowData] = useState(mockWorkflowData)

  useEffect(() => {
    // Simulate API call to fetch workflow data
    const timer = setTimeout(() => {
      setWorkflowData({
        ...mockWorkflowData,
        id: workflowId,
      })
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [workflowId])

  return {
    isLoading,
    workflowData,
  }
}
